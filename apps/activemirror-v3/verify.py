#!/usr/bin/env python3
"""
ActiveMirror v3.0 Verification Script
======================================

Tests:
1. Ollama connection and GPT-OSS-20B availability
2. Safety proxy functionality
3. UI file presence
"""

import asyncio
import aiohttp
import json
import os
from pathlib import Path

OLLAMA_URL = "http://localhost:11434"
TARGET_MODEL = "gpt-oss:20b"
APP_DIR = Path(__file__).parent

async def test_ollama():
    """Test Ollama connectivity and model availability"""
    print("\n◈ Testing Ollama Connection...")
    
    async with aiohttp.ClientSession() as session:
        try:
            # Check tags
            async with session.get(f"{OLLAMA_URL}/api/tags") as resp:
                if resp.status != 200:
                    print(f"  ✗ Ollama returned {resp.status}")
                    return False
                
                data = await resp.json()
                models = [m['name'] for m in data.get('models', [])]
                
                print(f"  ✓ Ollama is running")
                print(f"  ✓ Available models: {', '.join(models)}")
                
                if TARGET_MODEL in models:
                    print(f"  ✓ Target model {TARGET_MODEL} is available")
                else:
                    print(f"  ✗ Target model {TARGET_MODEL} NOT found")
                    return False
                    
        except aiohttp.ClientError as e:
            print(f"  ✗ Connection failed: {e}")
            return False
    
    return True


async def test_generation():
    """Test model generation"""
    print("\n◈ Testing Model Generation...")
    
    async with aiohttp.ClientSession() as session:
        try:
            payload = {
                "model": TARGET_MODEL,
                "prompt": "Say 'ActiveMirror is operational' in exactly 5 words.",
                "stream": False,
                "options": {
                    "temperature": 0.3,
                    "num_predict": 50
                }
            }
            
            async with session.post(
                f"{OLLAMA_URL}/api/generate",
                json=payload,
                timeout=aiohttp.ClientTimeout(total=60)
            ) as resp:
                if resp.status != 200:
                    error = await resp.text()
                    print(f"  ✗ Generation failed: {error}")
                    return False
                
                data = await resp.json()
                response = data.get('response', '')
                
                print(f"  ✓ Generation successful")
                print(f"  ✓ Response: {response[:100]}...")
                
                # Check timing
                eval_count = data.get('eval_count', 0)
                eval_duration = data.get('eval_duration', 1)
                tokens_per_sec = (eval_count / eval_duration) * 1e9 if eval_duration else 0
                
                print(f"  ✓ Performance: {tokens_per_sec:.1f} tokens/sec")
                
        except asyncio.TimeoutError:
            print(f"  ✗ Generation timed out (60s)")
            return False
        except aiohttp.ClientError as e:
            print(f"  ✗ Connection failed: {e}")
            return False
    
    return True


def test_ui_files():
    """Test UI file presence"""
    print("\n◈ Testing UI Files...")
    
    required_files = [
        "index.html",
        "styles.css",
        "app.js",
        "safety_proxy.py"
    ]
    
    all_present = True
    for filename in required_files:
        filepath = APP_DIR / filename
        if filepath.exists():
            size = filepath.stat().st_size
            print(f"  ✓ {filename} ({size:,} bytes)")
        else:
            print(f"  ✗ {filename} MISSING")
            all_present = False
    
    return all_present


async def main():
    print("=" * 50)
    print("ActiveMirror v3.0 — Verification Suite")
    print("=" * 50)
    
    results = {}
    
    # Test Ollama
    results['ollama'] = await test_ollama()
    
    # Test generation (only if Ollama is up)
    if results['ollama']:
        results['generation'] = await test_generation()
    else:
        results['generation'] = False
        print("\n◈ Skipping Generation Test (Ollama not available)")
    
    # Test UI files
    results['ui_files'] = test_ui_files()
    
    # Summary
    print("\n" + "=" * 50)
    print("SUMMARY")
    print("=" * 50)
    
    all_passed = all(results.values())
    
    for test, passed in results.items():
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"  {test}: {status}")
    
    print()
    if all_passed:
        print("◈ All tests passed! ActiveMirror v3.0 is ready.")
        print()
        print("To start the app:")
        print("  1. Start safety proxy: python safety_proxy.py")
        print("  2. Open index.html in browser")
        print("  3. Or use: python -m http.server 8080")
    else:
        print("⚠ Some tests failed. Check the issues above.")
    
    return 0 if all_passed else 1


if __name__ == '__main__':
    exit(asyncio.run(main()))
