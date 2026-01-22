#!/usr/bin/env python3
"""
⟡ MirrorBrain MLX Chat ⟡
High-speed local chat interface for Apple Silicon (M-Series).
Model: Qwen 2.5 7B Instruct (4-bit)
"""

import sys
import time
from mlx_lm import load, generate

# Configuration
MODEL_PATH = "mlx-community/Qwen2.5-7B-Instruct-4bit"
SYSTEM_PROMPT = """⟡ ACTIVE MIRROR IDENTITY — KERNEL v1.5 ⟡

You are MirrorBrain, Paul's sovereign local AI running on Mac Mini M4 in Goa, India.

## HUMAN ANCHOR
- Name: Paul Desai
- Location: Goa, India
- Company: N1 Intelligence (OPC) Pvt Ltd
- Dog: Chimanlal
- Birthday: March 14

## CORE IDENTITY
- Truth-State Law: Every claim is Fact, Estimate, or Unknown
- Zero Drift: Never invent capabilities or history
- Vault Supremacy: Stored truth > inference

## COMMUNICATION STYLE
- Calm, direct, warm, precise
- Mirror Paul's rhythm and energy
- Default 1-3 sentences unless depth requested
"""

def main():
    print(f"⟡ MirrorBrain: Initializing Neuro Link ({MODEL_PATH})...")
    
    try:
        model, tokenizer = load(MODEL_PATH)
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        return

    print("✅ Neuro Link Active. (Type 'exit' to disconnect)")
    print("-" * 50)

    # Simple chat history for context (last 3 turns)
    history = [{"role": "system", "content": SYSTEM_PROMPT}]

    while True:
        try:
            user_input = input("\n👤 Paul: ").strip()
            if not user_input:
                continue
            if user_input.lower() in ["exit", "quit", "q"]:
                print("⟡ MirrorBrain: Disconnecting...")
                break

            # Add user message
            history.append({"role": "user", "content": user_input})
            
            # Keep context window manageable (System + Last 6 messages)
            context_messages = [history[0]] + history[-6:]
            
            prompt = tokenizer.apply_chat_template(context_messages, tokenize=False, add_generation_prompt=True)
            
            print("🤖 MirrorBrain: ", end="", flush=True)
            
            # Generate stream
            # Note: mlx_lm.generate is simple, sticking to non-streaming for simplicity in v1
            # For streaming, we'd need a different loop. Using generate() with verbose=False.
            
            response_text = ""
            start_t = time.time()
            
            response = generate(
                model, 
                tokenizer, 
                prompt=prompt, 
                verbose=False, 
                max_tokens=1024,
                temp=0.6
            )
            
            end_t = time.time()
            duration = end_t - start_t
            tokens = len(tokenizer.encode(response))
            speed = tokens / duration if duration > 0 else 0
            
            print(response.strip())
            print(f"\n   [⚡ {speed:.2f} tok/s]")
            
            # Add assistant response to history
            history.append({"role": "assistant", "content": response.strip()})

        except KeyboardInterrupt:
            print("\n⟡ Interrupt received. use 'exit' to quit.")
            continue
        except Exception as e:
            print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()
