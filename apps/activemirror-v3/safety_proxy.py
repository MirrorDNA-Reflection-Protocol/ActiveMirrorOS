#!/usr/bin/env python3
"""
ActiveMirror Safety Proxy v3.0
==============================

Local-first AI inference proxy that routes to Ollama GPT-OSS-20B.
Implements the three-phase response architecture:
1. Internal Monologue (hidden)
2. Reflective Synthesis (on request)
3. Final Output (visible)

Part of ActiveMirror Sovereign Stack.
"""

import json
import asyncio
import logging
from datetime import datetime
from typing import Optional, Dict, Any, AsyncGenerator
from dataclasses import dataclass, asdict
from enum import Enum

import aiohttp
from aiohttp import web

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger('safety_proxy')


class ProxyConfig:
    """Safety proxy configuration"""
    host: str = '0.0.0.0'
    port: int = 8086
    ollama_url: str = 'http://localhost:11434'
    model: str = 'gpt-oss:20b'
    max_tokens: int = 2048
    temperature: float = 0.7
    top_p: float = 0.9
    enable_internal_monologue: bool = True
    enable_reflective_synthesis: bool = True
    max_context_length: int = 8192
    rate_limit_rpm: int = 60


config = ProxyConfig()


class ResponsePhase(Enum):
    INTERNAL = "internal_monologue"
    REFLECTIVE = "reflective_synthesis"
    FINAL = "final_output"


SYSTEM_PROMPT = """You are ActiveMirror, a sovereign AI assistant running entirely on local hardware. 

Core principles:
- Privacy first: User data never leaves their device
- Reflective: Help users think clearly, don't just provide answers
- Honest: Acknowledge limitations and uncertainties
- Sovereign: Respect user autonomy and control

You are running on GPT-OSS-20B, a 21B parameter model. 
You may have less capability than larger cloud models, but you offer complete privacy and control.

When responding:
1. Be concise and clear
2. Acknowledge when you're uncertain
3. Never pretend to have capabilities you don't have"""


class OllamaClient:
    """Async client for Ollama API"""
    
    def __init__(self, base_url: str = config.ollama_url):
        self.base_url = base_url
        self.session: Optional[aiohttp.ClientSession] = None
        
    async def ensure_session(self):
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession()
            
    async def close(self):
        if self.session and not self.session.closed:
            await self.session.close()
            
    async def check_health(self) -> Dict[str, Any]:
        """Check Ollama server health"""
        await self.ensure_session()
        try:
            async with self.session.get(f"{self.base_url}/api/tags") as resp:
                if resp.status == 200:
                    data = await resp.json()
                    models = [m['name'] for m in data.get('models', [])]
                    return {
                        "status": "healthy",
                        "models": models,
                        "target_model_available": config.model in models
                    }
                return {"status": "error", "code": resp.status}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    async def generate(self, prompt: str, model: str = None, **options) -> str:
        """Generate completion from Ollama"""
        await self.ensure_session()
        
        payload = {
            "model": model or config.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": options.get("temperature", config.temperature),
                "top_p": options.get("top_p", config.top_p),
                "num_predict": options.get("max_tokens", config.max_tokens),
            }
        }
        
        try:
            async with self.session.post(
                f"{self.base_url}/api/generate",
                json=payload
            ) as resp:
                if resp.status != 200:
                    error_text = await resp.text()
                    raise Exception(f"Ollama error {resp.status}: {error_text}")
                
                data = await resp.json()
                return data.get('response', '')
                    
        except aiohttp.ClientError as e:
            raise Exception(f"Connection to Ollama failed: {e}")


class SafetyProxy:
    """Main safety proxy handling request routing"""
    
    def __init__(self):
        self.ollama = OllamaClient()
        self.request_count = 0
        self.start_time = datetime.utcnow()
        
    async def process_request(
        self,
        user_message: str,
        conversation_history: list = None,
    ) -> Dict[str, Any]:
        """Process a chat request"""
        
        self.request_count += 1
        
        # Build context from history
        context_parts = []
        for msg in (conversation_history or [])[-6:]:
            role = "Human" if msg.get("role") == "user" else "Assistant"
            context_parts.append(f"{role}: {msg.get('content', '')}")
        
        context = "\n".join(context_parts)
        
        # Build final prompt
        prompt = f"{SYSTEM_PROMPT}\n\n"
        if context:
            prompt += f"Previous conversation:\n{context}\n\n"
        prompt += f"Human: {user_message}\n\nAssistant:"
        
        # Generate response
        try:
            response = await self.ollama.generate(prompt)
            
            return {
                "success": True,
                "response": response,
                "model": config.model,
                "request_id": self.request_count,
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Generation failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "request_id": self.request_count
            }
    
    async def get_status(self) -> Dict[str, Any]:
        """Get proxy status"""
        health = await self.ollama.check_health()
        uptime = (datetime.utcnow() - self.start_time).total_seconds()
        
        return {
            "proxy": {
                "status": "running",
                "uptime_seconds": uptime,
                "requests_processed": self.request_count,
                "port": config.port
            },
            "ollama": health,
            "config": {
                "model": config.model,
                "max_tokens": config.max_tokens,
                "temperature": config.temperature
            }
        }


# Global proxy instance
proxy = SafetyProxy()


# ============================================
# HTTP Handlers
# ============================================

async def handle_chat(request: web.Request) -> web.Response:
    """Handle chat completion requests"""
    try:
        data = await request.json()
        message = data.get('message', '')
        history = data.get('history', [])
        
        if not message:
            return web.json_response(
                {"error": "Message required"},
                status=400
            )
        
        result = await proxy.process_request(message, history)
        return web.json_response(result)
        
    except json.JSONDecodeError:
        return web.json_response(
            {"error": "Invalid JSON"},
            status=400
        )
    except Exception as e:
        logger.error(f"Chat handler error: {e}")
        return web.json_response(
            {"error": str(e)},
            status=500
        )


async def handle_status(request: web.Request) -> web.Response:
    """Handle status requests"""
    status = await proxy.get_status()
    return web.json_response(status)


async def handle_health(request: web.Request) -> web.Response:
    """Simple health check"""
    return web.json_response({"status": "ok"})


# ============================================
# App Setup
# ============================================

def create_app() -> web.Application:
    """Create and configure the web application"""
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
    app.router.add_get('/health', handle_health)
    
    # Cleanup
    async def cleanup(app):
        await proxy.ollama.close()
    
    app.on_cleanup.append(cleanup)
    
    return app


def main():
    """Run the safety proxy server"""
    logger.info(f"Starting ActiveMirror Safety Proxy v3.0")
    logger.info(f"Ollama endpoint: {config.ollama_url}")
    logger.info(f"Model: {config.model}")
    logger.info(f"Listening on port {config.port}")
    
    app = create_app()
    web.run_app(app, host=config.host, port=config.port, print=None)


if __name__ == '__main__':
    main()
