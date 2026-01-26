#!/usr/bin/env python3
"""
ActiveMirror Inference Router v3.0
==================================

Multi-tier inference routing with cost optimization:
- Tier 0: Sovereign (Ollama local)
- Tier 1: Fast Free (Groq)
- Tier 2: Budget Cloud (DeepSeek/Mistral)
- Tier 3: Frontier (OpenAI)
- Tier 4: BYO-Key (User provides API key)

Features:
- SQLite response caching
- IP-based rate limiting
- Automatic fallback to Ollama
- Cost tracking per tier
- Metadata logging (no prompt storage)

Part of MirrorDNA Sovereign Stack.
"""

import os
import json
import hashlib
import sqlite3
import asyncio
import logging
import time
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path

import aiohttp
from aiohttp import web

# Add sovereign_memory to path
try:
    from sovereign_memory.memory_cortex import LocalMemoryCortex
except ImportError:
    # If running from apps/activemirror-v3, handle path
    import sys
    sys.path.append(os.path.join(os.path.dirname(__file__), "sovereign_memory"))
    try:
        from sovereign_memory.memory_cortex import LocalMemoryCortex
    except ImportError:
        print("⚠ Sovereign Memory not found. RAG disabled.")
        LocalMemoryCortex = None

# Load environment variables
ENV_FILE = Path.home() / '.env.mirrordna'
if ENV_FILE.exists():
    with open(ENV_FILE) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ[key] = value

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger('inference_router')


# ============================================
# Configuration
# ============================================

class InferenceTier(Enum):
    SOVEREIGN = "sovereign"      # Ollama local
    FAST_FREE = "fast_free"      # Groq
    BUDGET = "budget"            # DeepSeek/Mistral
    FRONTIER = "frontier"        # OpenAI
    BYO_KEY = "byo_key"          # User's own key


@dataclass
class TierConfig:
    name: str
    models: List[str]
    cost_per_1m_input: float
    cost_per_1m_output: float
    max_tokens: int
    enabled: bool = True


@dataclass 
class RouterConfig:
    host: str = '0.0.0.0'
    port: int = 8086
    
    # Ollama settings
    ollama_url: str = 'http://localhost:11434'
    ollama_model: str = 'gpt-oss:20b'
    
    # API Keys (from environment)
    groq_api_key: str = field(default_factory=lambda: os.environ.get('GROQ_API_KEY', ''))
    openai_api_key: str = field(default_factory=lambda: os.environ.get('OPENAI_API_KEY', ''))
    deepseek_api_key: str = field(default_factory=lambda: os.environ.get('DEEPSEEK_API_KEY', ''))
    mistral_api_key: str = field(default_factory=lambda: os.environ.get('MISTRAL_API_KEY', ''))
    
    # Rate limits
    calls_per_hour_per_ip: int = 20
    frontier_per_day_per_ip: int = 3
    
    # Budget
    daily_frontier_budget_usd: float = 5.00
    
    # Cache
    cache_ttl_seconds: int = 3600
    cache_db_path: str = field(default_factory=lambda: str(Path.home() / '.activemirror_cache.db'))
    
    # Logging
    log_db_path: str = field(default_factory=lambda: str(Path.home() / '.activemirror_logs.db'))
    
    # Default tier
    default_tier: InferenceTier = InferenceTier.SOVEREIGN


config = RouterConfig()

TIER_CONFIGS = {
    InferenceTier.SOVEREIGN: TierConfig(
        name="Sovereign (Local)",
        models=["gpt-oss:20b", "qwen3:8b"],
        cost_per_1m_input=0.0,
        cost_per_1m_output=0.0,
        max_tokens=2048,
    ),
    InferenceTier.FAST_FREE: TierConfig(
        name="Fast Free (Groq)",
        models=["llama-3.3-70b-versatile", "mixtral-8x7b-32768"],
        cost_per_1m_input=0.0,  # Free tier
        cost_per_1m_output=0.0,
        max_tokens=4096,
    ),
    InferenceTier.BUDGET: TierConfig(
        name="Budget Cloud",
        models=["deepseek-chat", "mistral-small-latest"],
        cost_per_1m_input=0.14,
        cost_per_1m_output=0.28,
        max_tokens=4096,
    ),
    InferenceTier.FRONTIER: TierConfig(
        name="Frontier (OpenAI)",
        models=["gpt-4o", "gpt-4o-mini"],
        cost_per_1m_input=2.50,
        cost_per_1m_output=10.00,
        max_tokens=4096,
    ),
}

class RAGConfig:
    enabled: bool = True
    min_relevance: float = 0.3
    max_memories: int = 3
    
rag_config = RAGConfig()

SYSTEM_PROMPT = """You are ActiveMirror, a sovereign AI assistant demonstrating the MirrorDNA framework.

Core principles:
- Privacy first: Default to local processing
- Transparent: Show users exactly where their data goes
- Reflective: Help users think, don't just answer
- Sovereign: Respect user autonomy

Current inference tier: {tier_name}
Data location: {data_location}

Be concise, honest about limitations, and acknowledge your current tier's capabilities.

{context_block}"""


# ============================================
# Cache & Rate Limiting
# ============================================

class CacheDB:
    """SQLite-based response cache"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS cache (
                    cache_key TEXT PRIMARY KEY,
                    response TEXT,
                    tier TEXT,
                    created_at REAL,
                    ttl_seconds INTEGER
                )
            ''')
            conn.execute('''
                CREATE TABLE IF NOT EXISTS rate_limits (
                    ip_address TEXT,
                    tier TEXT,
                    window_start REAL,
                    count INTEGER,
                    PRIMARY KEY (ip_address, tier)
                )
            ''')
            conn.commit()
    
    def get_cached(self, prompt: str, tier: str) -> Optional[str]:
        """Get cached response if valid"""
        cache_key = hashlib.sha256(f"{prompt}:{tier}".encode()).hexdigest()
        
        with sqlite3.connect(self.db_path) as conn:
            row = conn.execute(
                'SELECT response, created_at, ttl_seconds FROM cache WHERE cache_key = ?',
                (cache_key,)
            ).fetchone()
            
            if row:
                response, created_at, ttl = row
                if time.time() - created_at < ttl:
                    return response
                # Expired, delete
                conn.execute('DELETE FROM cache WHERE cache_key = ?', (cache_key,))
                conn.commit()
        
        return None
    
    def set_cached(self, prompt: str, tier: str, response: str, ttl: int = None):
        """Cache a response"""
        cache_key = hashlib.sha256(f"{prompt}:{tier}".encode()).hexdigest()
        ttl = ttl or config.cache_ttl_seconds
        
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                INSERT OR REPLACE INTO cache (cache_key, response, tier, created_at, ttl_seconds)
                VALUES (?, ?, ?, ?, ?)
            ''', (cache_key, response, tier, time.time(), ttl))
            conn.commit()
    
    def check_rate_limit(self, ip: str, tier: str, limit: int, window_seconds: int = 3600) -> bool:
        """Check if IP is within rate limit. Returns True if allowed."""
        now = time.time()
        window_start = now - window_seconds
        
        with sqlite3.connect(self.db_path) as conn:
            row = conn.execute(
                'SELECT window_start, count FROM rate_limits WHERE ip_address = ? AND tier = ?',
                (ip, tier)
            ).fetchone()
            
            if row:
                stored_window, count = row
                if stored_window > window_start:
                    # Still in window
                    if count >= limit:
                        return False
                    # Increment
                    conn.execute(
                        'UPDATE rate_limits SET count = count + 1 WHERE ip_address = ? AND tier = ?',
                        (ip, tier)
                    )
                else:
                    # New window
                    conn.execute(
                        'UPDATE rate_limits SET window_start = ?, count = 1 WHERE ip_address = ? AND tier = ?',
                        (now, ip, tier)
                    )
            else:
                # First request
                conn.execute(
                    'INSERT INTO rate_limits (ip_address, tier, window_start, count) VALUES (?, ?, ?, 1)',
                    (ip, tier, now)
                )
            
            conn.commit()
        
        return True


class MetricsLogger:
    """Log request metadata (no prompts)"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS requests (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp REAL,
                    ip_hash TEXT,
                    tier TEXT,
                    model TEXT,
                    input_tokens INTEGER,
                    output_tokens INTEGER,
                    latency_ms INTEGER,
                    cost_usd REAL,
                    cached BOOLEAN,
                    success BOOLEAN
                )
            ''')
            conn.commit()
    
    def log_request(self, ip: str, tier: str, model: str, input_tokens: int,
                    output_tokens: int, latency_ms: int, cost_usd: float,
                    cached: bool, success: bool):
        """Log request metadata"""
        ip_hash = hashlib.sha256(ip.encode()).hexdigest()[:16]
        
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                INSERT INTO requests 
                (timestamp, ip_hash, tier, model, input_tokens, output_tokens, latency_ms, cost_usd, cached, success)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (time.time(), ip_hash, tier, model, input_tokens, output_tokens, latency_ms, cost_usd, cached, success))
            conn.commit()
    
    def get_daily_spend(self) -> float:
        """Get total spend today"""
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0).timestamp()
        
        with sqlite3.connect(self.db_path) as conn:
            row = conn.execute(
                'SELECT SUM(cost_usd) FROM requests WHERE timestamp > ?',
                (today_start,)
            ).fetchone()
            return row[0] or 0.0
    
    def get_stats(self) -> Dict[str, Any]:
        """Get usage statistics"""
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0).timestamp()
        
        with sqlite3.connect(self.db_path) as conn:
            total = conn.execute('SELECT COUNT(*) FROM requests').fetchone()[0]
            today = conn.execute('SELECT COUNT(*) FROM requests WHERE timestamp > ?', (today_start,)).fetchone()[0]
            spend = conn.execute('SELECT SUM(cost_usd) FROM requests WHERE timestamp > ?', (today_start,)).fetchone()[0] or 0
            
            by_tier = {}
            for row in conn.execute('SELECT tier, COUNT(*) FROM requests GROUP BY tier'):
                by_tier[row[0]] = row[1]
        
        return {
            "total_requests": total,
            "today_requests": today,
            "today_spend_usd": round(spend, 4),
            "by_tier": by_tier
        }


# ============================================
# Inference Clients
# ============================================

class OllamaClient:
    """Local Ollama inference"""
    
    def __init__(self, base_url: str = config.ollama_url):
        self.base_url = base_url
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def ensure_session(self):
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession()
    
    async def close(self):
        if self.session and not self.session.closed:
            await self.session.close()
    
    async def generate(self, prompt: str, model: str = None) -> Dict[str, Any]:
        await self.ensure_session()
        model = model or config.ollama_model
        
        try:
            async with self.session.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {"temperature": 0.7, "num_predict": 2048}
                }
            ) as resp:
                if resp.status != 200:
                    raise Exception(f"Ollama error: {resp.status}")
                data = await resp.json()
                return {
                    "response": data.get('response', ''),
                    "model": model,
                    "input_tokens": len(prompt.split()) * 1.3,  # Rough estimate
                    "output_tokens": len(data.get('response', '').split()) * 1.3
                }
        except Exception as e:
            raise Exception(f"Ollama connection failed: {e}")
    
    async def health_check(self) -> bool:
        await self.ensure_session()
        try:
            async with self.session.get(f"{self.base_url}/api/tags") as resp:
                return resp.status == 200
        except:
            return False


class GroqClient:
    """Groq API (free tier)"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or config.groq_api_key
        self.base_url = "https://api.groq.com/openai/v1"
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def ensure_session(self):
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession()
    
    async def close(self):
        if self.session and not self.session.closed:
            await self.session.close()
    
    async def generate(self, prompt: str, system: str = "", model: str = "llama-3.3-70b-versatile") -> Dict[str, Any]:
        await self.ensure_session()
        
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        
        async with self.session.post(
            f"{self.base_url}/chat/completions",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": model,
                "messages": messages,
                "max_tokens": 4096,
                "temperature": 0.7
            }
        ) as resp:
            if resp.status != 200:
                error = await resp.text()
                raise Exception(f"Groq error {resp.status}: {error}")
            
            data = await resp.json()
            return {
                "response": data['choices'][0]['message']['content'],
                "model": model,
                "input_tokens": data.get('usage', {}).get('prompt_tokens', 0),
                "output_tokens": data.get('usage', {}).get('completion_tokens', 0)
            }


class DeepSeekClient:
    """DeepSeek API (budget)"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or config.deepseek_api_key
        self.base_url = "https://api.deepseek.com/v1"
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def ensure_session(self):
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession()
    
    async def close(self):
        if self.session and not self.session.closed:
            await self.session.close()
    
    async def generate(self, prompt: str, system: str = "", model: str = "deepseek-chat") -> Dict[str, Any]:
        await self.ensure_session()
        
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        
        async with self.session.post(
            f"{self.base_url}/chat/completions",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": model,
                "messages": messages,
                "max_tokens": 4096,
                "temperature": 0.7
            }
        ) as resp:
            if resp.status != 200:
                error = await resp.text()
                raise Exception(f"DeepSeek error {resp.status}: {error}")
            
            data = await resp.json()
            return {
                "response": data['choices'][0]['message']['content'],
                "model": model,
                "input_tokens": data.get('usage', {}).get('prompt_tokens', 0),
                "output_tokens": data.get('usage', {}).get('completion_tokens', 0)
            }


class OpenAIClient:
    """OpenAI API (frontier)"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or config.openai_api_key
        self.base_url = "https://api.openai.com/v1"
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def ensure_session(self):
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession()
    
    async def close(self):
        if self.session and not self.session.closed:
            await self.session.close()
    
    async def generate(self, prompt: str, system: str = "", model: str = "gpt-4o-mini") -> Dict[str, Any]:
        await self.ensure_session()
        
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        
        async with self.session.post(
            f"{self.base_url}/chat/completions",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": model,
                "messages": messages,
                "max_tokens": 4096,
                "temperature": 0.7
            }
        ) as resp:
            if resp.status != 200:
                error = await resp.text()
                raise Exception(f"OpenAI error {resp.status}: {error}")
            
            data = await resp.json()
            return {
                "response": data['choices'][0]['message']['content'],
                "model": model,
                "input_tokens": data.get('usage', {}).get('prompt_tokens', 0),
                "output_tokens": data.get('usage', {}).get('completion_tokens', 0)
            }


# ============================================
# Main Router
# ============================================

class InferenceRouter:
    """Multi-tier inference router"""
    
    def __init__(self):
        self.cache = CacheDB(config.cache_db_path)
        self.metrics = MetricsLogger(config.log_db_path)
        
        # Initialize clients
        self.ollama = OllamaClient()
        self.groq = GroqClient()
        self.deepseek = DeepSeekClient()
        self.openai = OpenAIClient()
        
        # Initialize Memory Cortex
        self.cortex = None
        if LocalMemoryCortex:
            try:
                self.cortex = LocalMemoryCortex()
                logger.info("✓ Sovereign Memory Cortex initialized")
            except Exception as e:
                logger.error(f"Failed to init cortex: {e}")
        
        self.start_time = datetime.utcnow()
    
    async def close(self):
        await self.ollama.close()
        await self.groq.close()
        await self.deepseek.close()
        await self.openai.close()
        # Cortex doesn't need explicit close (sqlite handles it)

    
    def _get_system_prompt(self, tier: InferenceTier) -> str:
        tier_config = TIER_CONFIGS[tier]
        data_location = "Local (your device)" if tier == InferenceTier.SOVEREIGN else "Cloud API"
        
        return SYSTEM_PROMPT.format(
            tier_name=tier_config.name,
            data_location=data_location,
            context_block="{context_block}"  # Leave placeholder for per-request injection
        )
    
    def _calculate_cost(self, tier: InferenceTier, input_tokens: int, output_tokens: int) -> float:
        tier_config = TIER_CONFIGS[tier]
        input_cost = (input_tokens / 1_000_000) * tier_config.cost_per_1m_input
        output_cost = (output_tokens / 1_000_000) * tier_config.cost_per_1m_output
        return input_cost + output_cost
    
    async def route(
        self,
        prompt: str,
        tier: InferenceTier = None,
        ip_address: str = "unknown",
        byo_key: str = None,
        ip_address: str = "unknown",
        byo_key: str = None,
        byo_provider: str = None,
        context_memories: List[str] = None
    ) -> Dict[str, Any]:
        """Route inference request to appropriate tier"""
        
        tier = tier or config.default_tier
        start_time = time.time()
        
        # Check cache first
        cached_response = self.cache.get_cached(prompt, tier.value)
        if cached_response:
            self.metrics.log_request(
                ip=ip_address, tier=tier.value, model="cached",
                input_tokens=0, output_tokens=0, latency_ms=0,
                cost_usd=0, cached=True, success=True
            )
            return {
                "success": True,
                "response": cached_response,
                "tier": tier.value,
                "tier_name": TIER_CONFIGS[tier].name,
                "cached": True,
                "cost_usd": 0,
                "latency_ms": int((time.time() - start_time) * 1000)
            }
        
        # Rate limiting
        if tier == InferenceTier.FRONTIER:
            # Daily frontier limit
            if not self.cache.check_rate_limit(ip_address, "frontier_daily", config.frontier_per_day_per_ip, 86400):
                return {"success": False, "error": "Daily frontier limit reached", "fallback_tier": "sovereign"}
            
            # Budget check
            if self.metrics.get_daily_spend() >= config.daily_frontier_budget_usd:
                return {"success": False, "error": "Daily budget exhausted", "fallback_tier": "sovereign"}
        
        # General rate limit
        if not self.cache.check_rate_limit(ip_address, "general", config.calls_per_hour_per_ip):
            return {"success": False, "error": "Rate limit exceeded. Try again later."}
        
        # Route to appropriate client
        try:
            system_prompt = self._get_system_prompt(tier)
            
            # Inject Context
            context_text = ""
            if context_memories:
                memory_text = "\n".join([f"- {m}" for m in context_memories])
                context_text = f"\nRELEVANT MEMORIES (Use these to ground your answer):\n{memory_text}\n"
            
            system_prompt = system_prompt.replace("{context_block}", context_text)
            
            result = None
            
            if tier == InferenceTier.SOVEREIGN:
                result = await self.ollama.generate(f"{system_prompt}\n\nUser: {prompt}\n\nAssistant:")
                
            elif tier == InferenceTier.FAST_FREE:
                if not config.groq_api_key:
                    return await self.route(prompt, InferenceTier.SOVEREIGN, ip_address)
                result = await self.groq.generate(prompt, system_prompt)
                
            elif tier == InferenceTier.BUDGET:
                if config.deepseek_api_key:
                    result = await self.deepseek.generate(prompt, system_prompt)
                elif config.mistral_api_key:
                    # Could add Mistral client similarly
                    return await self.route(prompt, InferenceTier.SOVEREIGN, ip_address)
                else:
                    return await self.route(prompt, InferenceTier.SOVEREIGN, ip_address)
                    
            elif tier == InferenceTier.FRONTIER:
                if not config.openai_api_key:
                    return await self.route(prompt, InferenceTier.BUDGET, ip_address)
                result = await self.openai.generate(prompt, system_prompt, "gpt-4o-mini")
                
            elif tier == InferenceTier.BYO_KEY:
                if not byo_key or not byo_provider:
                    return {"success": False, "error": "BYO key requires api_key and provider"}
                
                if byo_provider == "openai":
                    client = OpenAIClient(byo_key)
                    result = await client.generate(prompt, system_prompt)
                    await client.close()
                elif byo_provider == "groq":
                    client = GroqClient(byo_key)
                    result = await client.generate(prompt, system_prompt)
                    await client.close()
                else:
                    return {"success": False, "error": f"Unknown provider: {byo_provider}"}
            
            if result:
                latency_ms = int((time.time() - start_time) * 1000)
                cost = self._calculate_cost(tier, result['input_tokens'], result['output_tokens'])
                
                # Cache the response
                self.cache.set_cached(prompt, tier.value, result['response'])
                
                # Log metrics
                self.metrics.log_request(
                    ip=ip_address, tier=tier.value, model=result['model'],
                    input_tokens=int(result['input_tokens']),
                    output_tokens=int(result['output_tokens']),
                    latency_ms=latency_ms, cost_usd=cost,
                    cached=False, success=True
                )
                
                return {
                    "success": True,
                    "response": result['response'],
                    "tier": tier.value,
                    "tier_name": TIER_CONFIGS[tier].name,
                    "model": result['model'],
                    "cached": False,
                    "cost_usd": round(cost, 6),
                    "latency_ms": latency_ms,
                    "tokens": {
                        "input": int(result['input_tokens']),
                        "output": int(result['output_tokens'])
                    }
                }
        
        except Exception as e:
            logger.error(f"Tier {tier.value} failed: {e}")
            
            # Fallback chain: frontier -> budget -> fast_free -> sovereign
            fallback_map = {
                InferenceTier.FRONTIER: InferenceTier.BUDGET,
                InferenceTier.BUDGET: InferenceTier.FAST_FREE,
                InferenceTier.FAST_FREE: InferenceTier.SOVEREIGN,
                InferenceTier.BYO_KEY: InferenceTier.SOVEREIGN,
            }
            
            if tier in fallback_map:
                logger.info(f"Falling back to {fallback_map[tier].value}")
                return await self.route(prompt, fallback_map[tier], ip_address)
            
            # Sovereign failed - nothing we can do
            return {
                "success": False,
                "error": f"All tiers failed. Last error: {str(e)}",
                "tier": tier.value
            }
    
    async def get_status(self) -> Dict[str, Any]:
        """Get router status"""
        ollama_healthy = await self.ollama.health_check()
        stats = self.metrics.get_stats()
        uptime = (datetime.utcnow() - self.start_time).total_seconds()
        
        return {
            "status": "running",
            "uptime_seconds": uptime,
            "ollama_available": ollama_healthy,
            "api_keys_configured": {
                "groq": bool(config.groq_api_key),
                "openai": bool(config.openai_api_key),
                "deepseek": bool(config.deepseek_api_key),
                "mistral": bool(config.mistral_api_key)
            },
            "daily_budget": {
                "limit_usd": config.daily_frontier_budget_usd,
                "spent_usd": stats["today_spend_usd"],
                "remaining_usd": round(config.daily_frontier_budget_usd - stats["today_spend_usd"], 4)
            },
            "stats": stats,
            "tiers": {
                tier.value: {
                    "name": cfg.name,
                    "models": cfg.models,
                    "cost_per_1m": f"${cfg.cost_per_1m_input}/${cfg.cost_per_1m_output}"
                }
                for tier, cfg in TIER_CONFIGS.items()
            }
        }


# Global router instance
router = InferenceRouter()


# ============================================
# HTTP Handlers
# ============================================

async def handle_chat(request: web.Request) -> web.Response:
    """Handle chat requests"""
    try:
        data = await request.json()
        message = data.get('message', '')
        tier_str = data.get('tier', 'sovereign')
        byo_key = data.get('api_key')
        byo_provider = data.get('provider')
        
        if not message:
            return web.json_response({"error": "Message required"}, status=400)
        
        # Get client IP
        ip = request.remote or request.headers.get('X-Forwarded-For', 'unknown')
        
        # Parse tier
        try:
            tier = InferenceTier(tier_str)
        except ValueError:
            tier = InferenceTier.SOVEREIGN
        
        result = await router.route(
            prompt=message,
            tier=tier,
            ip_address=ip,
            byo_key=byo_key,
            byo_provider=byo_provider
        )
        
        # RAG Logic
        memories = []
        if router.cortex and rag_config.enabled:
            # Simple recall
            hits = router.cortex.recall(message, k=rag_config.max_memories, min_strength=rag_config.min_relevance)
            if hits:
                memories = [h[0].content_encrypted.decode() for h in hits] # simple decode
                logger.info(f"RAG found {len(memories)} memories")

        # Pass memories to route
        result = await router.route(
            prompt=message,
            tier=tier,
            ip_address=ip,
            byo_key=byo_key,
            byo_provider=byo_provider,
            context_memories=memories
        )
        
        # Inject RAG info into response
        if memories:
            result['rag_context'] = memories
        
        return web.json_response(result)
    
    except json.JSONDecodeError:
        return web.json_response({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return web.json_response({"error": str(e)}, status=500)


async def handle_status(request: web.Request) -> web.Response:
    """Get router status"""
    status = await router.get_status()
    return web.json_response(status)


async def handle_health(request: web.Request) -> web.Response:
    """Simple health check"""
    return web.json_response({"status": "ok", "version": "3.0"})


async def handle_tiers(request: web.Request) -> web.Response:
    """Get available tiers"""
    return web.json_response({
        tier.value: {
            "name": cfg.name,
            "models": cfg.models,
            "cost": "free" if cfg.cost_per_1m_input == 0 else f"~${cfg.cost_per_1m_output}/1M tokens"
        }
        for tier, cfg in TIER_CONFIGS.items()
    })


async def handle_transparency(request: web.Request) -> web.Response:
    """Real-time transparency data for the UI"""
    tier_str = request.query.get('tier', 'sovereign')

    try:
        tier = InferenceTier(tier_str)
    except ValueError:
        tier = InferenceTier.SOVEREIGN

    tier_config = TIER_CONFIGS[tier]
    ollama_healthy = await router.ollama.health_check()
    stats = router.metrics.get_stats()

    is_local = tier == InferenceTier.SOVEREIGN

    # Build transparency response
    response = {
        "tier": {
            "id": tier.value,
            "name": tier_config.name,
            "is_local": is_local,
            "models": tier_config.models,
            "cost_per_1m": {
                "input": tier_config.cost_per_1m_input,
                "output": tier_config.cost_per_1m_output
            }
        },
        "data_flow": {
            "processing": "local" if is_local else "cloud",
            "storage": "local_only" if is_local else "transient",
            "network": "none" if is_local else "api_call",
            "retention": "your_device" if is_local else "no_retention"
        },
        "privacy": {
            "data_leaves_device": not is_local,
            "third_party_access": not is_local,
            "logs_stored": False,  # We only store metadata, not prompts
            "encryption": "at_rest" if is_local else "in_transit"
        },
        "system": {
            "ollama_available": ollama_healthy,
            "ollama_model": config.ollama_model if is_local else None,
            "api_endpoint": None if is_local else f"{tier.value}_api"
        },
        "session": {
            "today_requests": stats["today_requests"],
            "today_spend_usd": stats["today_spend_usd"],
            "cache_available": True
        },
        "providers": {
            "sovereign": {
                "name": "Local (Ollama)",
                "status": "active" if ollama_healthy else "unavailable",
                "data_location": "Your Mac Mini"
            },
            "cloud": {
                "groq": {"configured": bool(config.groq_api_key), "data_retention": "none"},
                "deepseek": {"configured": bool(config.deepseek_api_key), "data_retention": "none"},
                "openai": {"configured": bool(config.openai_api_key), "data_retention": "30_days_api"}
            }
        }
    }

    return web.json_response(response)


async def handle_email_capture(request: web.Request) -> web.Response:
    """Capture email for waitlist (privacy-respecting)"""
    try:
        data = await request.json()
        email = data.get('email', '').strip().lower()

        if not email or '@' not in email:
            return web.json_response({"error": "Invalid email"}, status=400)

        # Store locally in a simple file (not sent anywhere)
        waitlist_file = Path.home() / '.activemirror_waitlist.txt'

        # Check for duplicate
        existing = set()
        if waitlist_file.exists():
            existing = set(waitlist_file.read_text().strip().split('\n'))

        if email in existing:
            return web.json_response({"status": "already_registered", "message": "You're already on the list!"})

        # Append email with timestamp
        with open(waitlist_file, 'a') as f:
            f.write(f"{email},{datetime.now().isoformat()}\n")

        logger.info(f"Waitlist signup: {email[:3]}***")

        return web.json_response({
            "status": "success",
            "message": "You're on the list! We'll notify you when MirrorDNA launches."
        })

    except Exception as e:
        logger.error(f"Email capture error: {e}")
        return web.json_response({"error": "Failed to register"}, status=500)


# ============================================
# App Setup
# ============================================

def create_app() -> web.Application:
    """Create web application"""
    app = web.Application()
    
    # CORS middleware
    @web.middleware
    async def cors_middleware(request, handler):
        if request.method == "OPTIONS":
            response = web.Response()
        else:
            response = await handler(request)
        
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response
    
    app.middlewares.append(cors_middleware)
    
    # Routes
    app.router.add_post('/api/chat', handle_chat)
    app.router.add_get('/api/status', handle_status)
    app.router.add_get('/api/tiers', handle_tiers)
    app.router.add_get('/api/transparency', handle_transparency)
    app.router.add_post('/api/waitlist', handle_email_capture)
    app.router.add_get('/health', handle_health)
    
    # Memory routes
    async def handle_commit(request):
        try:
            data = await request.json()
            content = data.get('content')
            if not content or not router.cortex:
                return web.json_response({"error": "No content or cortex unavailable"}, status=400)
            
            # Commit metadata
            router.cortex.commit(content, router.cortex._generate_default_attention(content), context={"source": "api"})
            return web.json_response({"status": "committed"})
        except Exception as e:
            return web.json_response({"error": str(e)}, status=500)

    app.router.add_post('/api/commit', handle_commit)
    
    # Cleanup
    async def cleanup(app):
        await router.close()
    
    app.on_cleanup.append(cleanup)
    
    return app


def main():
    """Run the inference router"""
    logger.info("=" * 50)
    logger.info("ActiveMirror Inference Router v3.0")
    logger.info("=" * 50)
    logger.info(f"Default tier: {config.default_tier.value}")
    logger.info(f"Ollama: {config.ollama_url}")
    logger.info(f"API Keys: Groq={bool(config.groq_api_key)}, OpenAI={bool(config.openai_api_key)}, DeepSeek={bool(config.deepseek_api_key)}")
    logger.info(f"Daily frontier budget: ${config.daily_frontier_budget_usd}")
    logger.info(f"Listening on port {config.port}")
    logger.info("=" * 50)
    
    app = create_app()
    web.run_app(app, host=config.host, port=config.port, print=None)


if __name__ == '__main__':
    main()
