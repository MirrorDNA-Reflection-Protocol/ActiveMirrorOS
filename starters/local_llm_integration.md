# Local LLM Integration Guide

This guide shows how to integrate ActiveMirrorOS with local Large Language Models (LLMs) for complete privacy and offline AI conversations with persistent memory.

---

## Why Local LLMs + ActiveMirrorOS?

**Privacy:** All data (conversations + AI processing) stays on your device
**Cost:** No API fees
**Offline:** Works without internet
**Control:** Choose your own model and parameters
**Memory:** ActiveMirrorOS adds persistence to any LLM

---

## Table of Contents

- [Ollama Integration](#ollama-integration)
- [LM Studio Integration](#lm-studio-integration)
- [llama.cpp Integration](#llamacpp-integration)
- [Hugging Face Transformers](#hugging-face-transformers)
- [GPT4All Integration](#gpt4all-integration)
- [Performance Tips](#performance-tips)

---

## Ollama Integration

**Ollama** is the easiest way to run local LLMs on Mac, Linux, and Windows.

### Setup

```bash
# Install Ollama
# Mac: brew install ollama
# Linux: curl https://ollama.ai/install.sh | sh
# Windows: Download from https://ollama.ai

# Pull a model
ollama pull llama2
ollama pull mistral
ollama pull codellama
```

### Python Integration

```python
from activemirror import ActiveMirror
import requests
import json

# Initialize ActiveMirrorOS
mirror = ActiveMirror(storage_type="sqlite", db_path="local_llm.db")
session = mirror.create_session("ollama-chat")

def chat_with_ollama(prompt, model="llama2"):
    """Send prompt to Ollama and get response"""
    # Add user message to ActiveMirrorOS
    session.add_message("user", prompt)

    # Get conversation context from ActiveMirrorOS
    context = session.get_context()

    # Format context for Ollama
    messages = [
        {"role": msg['role'], "content": msg['content']}
        for msg in context
    ]

    # Call Ollama API
    response = requests.post(
        "http://localhost:11434/api/chat",
        json={
            "model": model,
            "messages": messages,
            "stream": False
        }
    )

    # Extract response
    assistant_message = response.json()['message']['content']

    # Store in ActiveMirrorOS
    session.add_message("assistant", assistant_message)

    return assistant_message


# Example conversation
print(chat_with_ollama("Hello! What is ActiveMirrorOS?"))
print(chat_with_ollama("How does it work with local LLMs?"))
print(chat_with_ollama("What did we just discuss?"))  # Tests memory

# Session persists - close Python, restart later
loaded = mirror.load_session("ollama-chat")
print(f"Conversation has {len(loaded.messages)} messages preserved")
```

### JavaScript Integration

```javascript
const { ActiveMirror } = require('activemirror');
const axios = require('axios');

// Initialize ActiveMirrorOS
const mirror = new ActiveMirror('./local-llm-data');
const session = mirror.createSession('ollama-chat');

async function chatWithOllama(prompt, model = 'llama2') {
    // Add user message to ActiveMirrorOS
    session.addMessage('user', prompt);

    // Get conversation context
    const context = session.messages.map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    // Call Ollama API
    const response = await axios.post('http://localhost:11434/api/chat', {
        model: model,
        messages: context,
        stream: false
    });

    const assistantMessage = response.data.message.content;

    // Store in ActiveMirrorOS
    session.addMessage('assistant', assistantMessage);

    return assistantMessage;
}

// Example usage
(async () => {
    console.log(await chatWithOllama('Hello! What is ActiveMirrorOS?'));
    console.log(await chatWithOllama('How does it work with local LLMs?'));
    console.log(await chatWithOllama('What did we just discuss?'));
})();
```

---

## LM Studio Integration

**LM Studio** provides a GUI and API server for running local LLMs.

### Setup

1. Download LM Studio from https://lmstudio.ai
2. Download a model (e.g., Mistral-7B, Llama2)
3. Start the local server (usually port 1234)

### Python Integration

```python
from activemirror import ActiveMirror
from openai import OpenAI

# LM Studio provides OpenAI-compatible API
client = OpenAI(base_url="http://localhost:1234/v1", api_key="not-needed")

# Initialize ActiveMirrorOS
mirror = ActiveMirror(storage_type="sqlite", db_path="lmstudio.db")
session = mirror.create_session("lmstudio-chat")

def chat_with_lmstudio(prompt):
    """Chat using LM Studio's OpenAI-compatible API"""
    # Add user message
    session.add_message("user", prompt)

    # Get context
    context = session.get_context()
    messages = [
        {"role": msg['role'], "content": msg['content']}
        for msg in context
    ]

    # Call LM Studio (OpenAI-compatible)
    completion = client.chat.completions.create(
        model="local-model",  # Model name doesn't matter for LM Studio
        messages=messages,
        temperature=0.7
    )

    assistant_message = completion.choices[0].message.content

    # Store response
    session.add_message("assistant", assistant_message)

    return assistant_message


# Example
print(chat_with_lmstudio("Explain quantum computing in simple terms"))
print(chat_with_lmstudio("Can you summarize what you just said?"))
```

---

## llama.cpp Integration

**llama.cpp** is a pure C++ implementation of LLaMA inference.

### Setup

```bash
# Clone and build
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make

# Download a model (GGUF format)
# Example: Download from Hugging Face
wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf

# Start server
./server -m mistral-7b-instruct-v0.2.Q4_K_M.gguf --host 0.0.0.0 --port 8080
```

### Python Integration

```python
from activemirror import ActiveMirror
import requests

mirror = ActiveMirror(storage_type="sqlite", db_path="llamacpp.db")
session = mirror.create_session("llama-chat")

def chat_with_llamacpp(prompt):
    """Chat with llama.cpp server"""
    session.add_message("user", prompt)

    # Get full context
    context = "\n".join([
        f"{msg['role'].upper()}: {msg['content']}"
        for msg in session.get_context()
    ])

    # Call llama.cpp server
    response = requests.post(
        "http://localhost:8080/completion",
        json={
            "prompt": context + "\nASSISTANT:",
            "n_predict": 512,
            "temperature": 0.7,
            "stop": ["\nUSER:"]
        }
    )

    assistant_message = response.json()['content'].strip()
    session.add_message("assistant", assistant_message)

    return assistant_message


# Example
print(chat_with_llamacpp("What are the benefits of local LLMs?"))
```

---

## Hugging Face Transformers

Use Hugging Face models directly in Python (no server needed).

### Setup

```bash
pip install transformers torch accelerate bitsandbytes
```

### Python Integration

```python
from activemirror import ActiveMirror
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch

# Initialize ActiveMirrorOS
mirror = ActiveMirror(storage_type="sqlite", db_path="huggingface.db")
session = mirror.create_session("hf-chat")

# Load model (using smaller model for example)
model_name = "microsoft/DialoGPT-medium"
# For larger models: "meta-llama/Llama-2-7b-chat-hf" (requires auth)

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto"
)

# Create conversational pipeline
chatbot = pipeline(
    "conversational",
    model=model,
    tokenizer=tokenizer
)

def chat_with_huggingface(prompt):
    """Chat using Hugging Face model"""
    session.add_message("user", prompt)

    # Get context (last 10 messages for memory limits)
    recent_context = session.messages[-10:]

    # Format for the model
    conversation_text = "\n".join([
        f"{msg['role']}: {msg['content']}"
        for msg in recent_context
    ])

    # Generate response
    inputs = tokenizer.encode(conversation_text + "\nassistant:", return_tensors="pt")
    outputs = model.generate(
        inputs,
        max_length=1000,
        temperature=0.7,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )

    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    assistant_message = response.split("assistant:")[-1].strip()

    session.add_message("assistant", assistant_message)

    return assistant_message


# Example
print(chat_with_huggingface("Hello! How are you?"))
print(chat_with_huggingface("What can you help me with?"))
```

---

## GPT4All Integration

**GPT4All** is an ecosystem of open-source LLMs.

### Setup

```bash
pip install gpt4all activemirror
```

### Python Integration

```python
from activemirror import ActiveMirror
from gpt4all import GPT4All

# Initialize ActiveMirrorOS
mirror = ActiveMirror(storage_type="sqlite", db_path="gpt4all.db")
session = mirror.create_session("gpt4all-chat")

# Load GPT4All model
model = GPT4All("orca-mini-3b-gguf2-q4_0.gguf")  # Download automatically

def chat_with_gpt4all(prompt):
    """Chat using GPT4All"""
    session.add_message("user", prompt)

    # Get conversation context
    context = [
        {"role": msg['role'], "content": msg['content']}
        for msg in session.get_context()
    ]

    # Generate response with context
    with model.chat_session():
        response = model.generate(prompt, max_tokens=512)

    session.add_message("assistant", response)

    return response


# Example conversation
print(chat_with_gpt4all("What is ActiveMirrorOS?"))
print(chat_with_gpt4all("How does persistence work?"))
print(chat_with_gpt4all("Summarize our conversation"))  # Tests memory
```

---

## Complete Example: CLI with Local LLM

**local_llm_chat.py:**

```python
#!/usr/bin/env python3
"""
Local LLM Chat with ActiveMirrorOS
Combines Ollama + ActiveMirrorOS for private, persistent AI chat
"""

from activemirror import ActiveMirror
import requests
import json
import sys

class LocalLLMChat:
    def __init__(self, session_name, model="llama2", ollama_url="http://localhost:11434"):
        self.mirror = ActiveMirror(storage_type="sqlite", db_path="local_chat.db")
        self.session = self.mirror.create_session(session_name)
        self.model = model
        self.ollama_url = ollama_url

    def chat(self, prompt):
        """Send message and get response"""
        # Store user message
        self.session.add_message("user", prompt)

        # Get full context
        context = self.session.get_context()
        messages = [
            {"role": msg['role'], "content": msg['content']}
            for msg in context
        ]

        # Call Ollama
        try:
            response = requests.post(
                f"{self.ollama_url}/api/chat",
                json={
                    "model": self.model,
                    "messages": messages,
                    "stream": False
                },
                timeout=60
            )
            response.raise_for_status()

            assistant_message = response.json()['message']['content']
            self.session.add_message("assistant", assistant_message)

            return assistant_message

        except Exception as e:
            return f"Error: {e}"

    def show_history(self):
        """Display conversation history"""
        print("\n=== Conversation History ===")
        for msg in self.session.get_context():
            role = msg['role'].upper()
            print(f"\n{role}: {msg['content']}")

    def export(self, format="markdown"):
        """Export conversation"""
        filename = self.mirror.export_session(self.session.session_id, format=format)
        print(f"\n✓ Exported to: {filename}")


def main():
    print("Local LLM Chat with ActiveMirrorOS")
    print("=" * 50)
    print("Using Ollama (make sure it's running: ollama serve)")
    print("Type 'exit' to quit, 'history' to show, 'export' to save\n")

    chat = LocalLLMChat("default")

    while True:
        try:
            user_input = input("You: ").strip()

            if not user_input:
                continue

            if user_input.lower() == 'exit':
                print("\nGoodbye! Your conversation is saved.")
                break

            if user_input.lower() == 'history':
                chat.show_history()
                continue

            if user_input.lower() == 'export':
                chat.export()
                continue

            # Get response
            print("\nAssistant: ", end="", flush=True)
            response = chat.chat(user_input)
            print(response)
            print()

        except KeyboardInterrupt:
            print("\n\nGoodbye!")
            break
        except Exception as e:
            print(f"\nError: {e}")


if __name__ == "__main__":
    main()
```

**Usage:**

```bash
# Make sure Ollama is running
ollama serve

# Run the chat
python local_llm_chat.py
```

---

## Performance Tips

### 1. Model Selection

| Model | Size | RAM | Speed | Quality |
|-------|------|-----|-------|---------|
| **TinyLlama** | 1.1B | 4GB | Fast | Basic |
| **Phi-2** | 2.7B | 8GB | Fast | Good |
| **Mistral-7B** | 7B | 16GB | Medium | Excellent |
| **Llama2-13B** | 13B | 32GB | Slow | Excellent |

**Recommendation:** Start with Mistral-7B (best quality/performance balance)

### 2. Quantization

Use quantized models for faster inference:
- **Q4_K_M**: Good balance (4-bit)
- **Q5_K_M**: Better quality (5-bit)
- **Q8_0**: Best quality (8-bit)

### 3. Context Management

ActiveMirrorOS stores unlimited history, but LLMs have context limits:

```python
# Load only recent messages
recent = session.messages[-20:]  # Last 20 messages

# Or summarize old context
if len(session.messages) > 50:
    summary = summarize_old_messages(session.messages[:-20])
    context = [{"role": "system", "content": summary}] + session.messages[-20:]
```

### 4. Caching

Cache frequent prompts:

```python
from functools import lru_cache

@lru_cache(maxsize=100)
def get_llm_response(prompt_hash):
    # Cache responses for identical prompts
    pass
```

---

## Privacy & Security

**Advantages of Local LLMs + ActiveMirrorOS:**
- ✅ All data stays on your device
- ✅ No internet required (after model download)
- ✅ No API keys or accounts
- ✅ No usage tracking or profiling
- ✅ Full control over model and data

**Add encryption for extra security:**

```python
from activemirror import VaultMemory

# Store sensitive conversations in encrypted vault
vault = VaultMemory(password="your-secure-password")
vault.store("sensitive_session_id", session.session_id)
```

---

## Next Steps

- Experiment with different models (Ollama library)
- Fine-tune models for your use case
- Build custom applications (journaling, coding assistant, etc.)
- Combine with voice (Whisper for STT, Coqui for TTS)
- Deploy on edge devices (Raspberry Pi, etc.)

---

**Local LLMs + ActiveMirrorOS** — Private AI with perfect memory.
