#!/usr/bin/env python3
"""
Quick test for ActiveMirror Inference Router
Tests each tier with a simple prompt
"""

import asyncio
import sys
sys.path.insert(0, '.')

from inference_router import InferenceRouter, InferenceTier

async def test_tiers():
    router = InferenceRouter()
    test_prompt = "What is 2+2? Reply in one word."
    
    print("◈ ActiveMirror Tier Test")
    print("=" * 50)
    
    # Test order: safest to most expensive
    tiers_to_test = [
        (InferenceTier.SOVEREIGN, "Testing local Ollama..."),
        (InferenceTier.FAST_FREE, "Testing Groq (free)..."),
        (InferenceTier.BUDGET, "Testing DeepSeek (cheap)..."),
        # Skip frontier to save money
    ]
    
    for tier, msg in tiers_to_test:
        print(f"\n{msg}")
        try:
            result = await router.route(test_prompt, tier, "127.0.0.1")
            if result['success']:
                print(f"  ✓ {tier.value}: {result['response'][:50]}...")
                print(f"    Model: {result.get('model', 'N/A')}")
                print(f"    Latency: {result.get('latency_ms', 'N/A')}ms")
                print(f"    Cost: ${result.get('cost_usd', 0):.6f}")
            else:
                print(f"  ✗ {tier.value}: {result.get('error', 'Unknown error')}")
        except Exception as e:
            print(f"  ✗ {tier.value}: {e}")
    
    await router.close()
    print("\n" + "=" * 50)
    print("Test complete!")

if __name__ == '__main__':
    asyncio.run(test_tiers())
