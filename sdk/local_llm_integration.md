# Local LLM Integration

Guide for integrating ActiveMirrorOS with local LLMs running on your machine.

---

## Why Local LLMs?

**Benefits:**
- 🔒 **Privacy**: Your data never leaves your device
- 💰 **Cost**: No API fees or usage limits
- ⚡ **Latency**: No network round trips
- 🛠️ **Control**: Choose models, customize behavior
- 📡 **Offline**: Works without internet

**Use Cases:**
- Sensitive data (medical, legal, personal)
- High-volume applications
- Development and testing
- Air-gapped environments
- Cost-sensitive projects

---

## Table of Contents

1. [Setup Options](#setup-options)
2. [Ollama Integration](#ollama-integration)
3. [LM Studio Integration](#lm-studio-integration)
4. [llama.cpp Integration](#llamacpp-integration)
5. [GPT4All Integration](#gpt4all-integration)
6. [LocalAI Integration](#localai-integration)
7. [Best Practices](#best-practices)
8. [Performance Tips](#performance-tips)

---

## Setup Options

### Quick Comparison

| Tool | Platform | Ease of Use | Performance | Models |
|------|----------|-------------|-------------|--------|
| **Ollama** | Mac, Linux, Windows | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Large library |
| **LM Studio** | Mac, Linux, Windows | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Curated selection |
| **llama.cpp** | Cross-platform | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Any GGUF model |
| **GPT4All** | Cross-platform | ⭐⭐⭐⭐ | ⭐⭐⭐ | Optimized models |
| **LocalAI** | Cross-platform | ⭐⭐⭐ | ⭐⭐⭐⭐ | OpenAI-compatible |

**Recommendation for beginners**: Start with **Ollama** or **LM Studio**.

---

## Ollama Integration

### 1. Install Ollama

**macOS/Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
Download from https://ollama.com/download

### 2. Start Ollama

```bash
ollama serve
```

### 3. Pull a Model

```bash
# Recommended models:
ollama pull llama2              # 7B, good balance
ollama pull mistral             # 7B, fast and capable
ollama pull codellama           # 7B, code-focused
ollama pull llama2:13b          # 13B, better quality
ollama pull mixtral:8x7b        # Mixture of Experts, powerful
```

### 4. Test Ollama

```bash
ollama run llama2 "Hello, how are you?"
```

### 5. Integrate with ActiveMirrorOS

**Python:**
```python
import requests
from activemirror import ActiveMirror

class OllamaClient:
    def __init__(self, mirror, base_url="http://localhost:11434"):
        self.mirror = mirror
        self.base_url = base_url

    def chat(self, session_id, user_message, model="llama2"):
        # Load or create session
        try:
            session = self.mirror.load_session(session_id)
        except ValueError:
            session = self.mirror.create_session(session_id)

        # Add user message
        session.add_message("user", user_message)

        # Build context
        context = session.get_context()
        prompt = self._build_prompt(context)

        # Call Ollama
        response = requests.post(
            f"{self.base_url}/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False
            }
        )

        assistant_message = response.json()["response"]

        # Store response
        session.add_message("assistant", assistant_message)

        return assistant_message

    def _build_prompt(self, messages):
        """Format messages for Ollama."""
        prompt = ""
        for msg in messages:
            prompt += f"{msg.role.capitalize()}: {msg.content}\n"
        prompt += "Assistant:"
        return prompt

# Usage
mirror = ActiveMirror(storage_type="sqlite", db_path="ollama_memory.db")
client = OllamaClient(mirror)

response = client.chat(
    session_id="chat",
    user_message="Explain persistent memory in AI."
)
print(response)
```

**JavaScript:**
```javascript
const fetch = require('node-fetch');
const { ActiveMirror } = require('./activemirror');

class OllamaClient {
    constructor(mirror, baseUrl = 'http://localhost:11434') {
        this.mirror = mirror;
        this.baseUrl = baseUrl;
    }

    async chat(sessionId, userMessage, model = 'llama2') {
        // Get or create session
        let session;
        try {
            session = this.mirror.loadSession(sessionId);
        } catch {
            session = this.mirror.createSession(sessionId);
        }

        // Add user message
        session.addMessage('user', userMessage);

        // Build prompt
        const context = session.getContext();
        const prompt = this._buildPrompt(context);

        // Call Ollama
        const response = await fetch(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false
            })
        });

        const data = await response.json();
        const assistantMessage = data.response;

        // Store response
        session.addMessage('assistant', assistantMessage);

        return assistantMessage;
    }

    _buildPrompt(messages) {
        let prompt = '';
        messages.forEach(msg => {
            const role = msg.role.charAt(0).toUpperCase() + msg.role.slice(1);
            prompt += `${role}: ${msg.content}\n`;
        });
        prompt += 'Assistant:';
        return prompt;
    }
}

// Usage
const mirror = new ActiveMirror('./ollama_memory');
const client = new OllamaClient(mirror);

client.chat('chat', 'Explain persistent memory in AI.')
    .then(response => console.log(response));
```

### Streaming Responses

**Python:**
```python
def chat_stream(self, session_id, user_message, model="llama2"):
    """Stream responses token by token."""
    session = self.mirror.load_session(session_id)
    session.add_message("user", user_message)

    prompt = self._build_prompt(session.get_context())

    response = requests.post(
        f"{self.base_url}/api/generate",
        json={
            "model": model,
            "prompt": prompt,
            "stream": True
        },
        stream=True
    )

    full_response = ""
    for line in response.iter_lines():
        if line:
            chunk = json.loads(line)
            token = chunk.get("response", "")
            full_response += token
            print(token, end="", flush=True)

    session.add_message("assistant", full_response)
    return full_response
```

---

## LM Studio Integration

### 1. Install LM Studio

Download from: https://lmstudio.ai/

### 2. Download a Model

- Open LM Studio
- Go to "Discover" tab
- Search for models (e.g., "Mistral", "Llama 2")
- Click "Download"

### 3. Start Local Server

- Go to "Local Server" tab
- Select model
- Click "Start Server"
- Server runs on `http://localhost:1234`

### 4. Integrate with ActiveMirrorOS

**Python:**
```python
import requests
from activemirror import ActiveMirror

class LMStudioClient:
    def __init__(self, mirror, base_url="http://localhost:1234/v1"):
        self.mirror = mirror
        self.base_url = base_url

    def chat(self, session_id, user_message):
        # Get session
        try:
            session = self.mirror.load_session(session_id)
        except ValueError:
            session = self.mirror.create_session(session_id)

        # Add user message
        session.add_message("user", user_message)

        # Build messages (OpenAI-compatible format)
        messages = [
            {"role": msg.role, "content": msg.content}
            for msg in session.get_context()
        ]

        # Call LM Studio (OpenAI-compatible API)
        response = requests.post(
            f"{self.base_url}/chat/completions",
            json={
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 500
            }
        )

        assistant_message = response.json()["choices"][0]["message"]["content"]
        session.add_message("assistant", assistant_message)

        return assistant_message

# Usage
mirror = ActiveMirror(storage_type="sqlite", db_path="lmstudio_memory.db")
client = LMStudioClient(mirror)

response = client.chat("chat", "What are the benefits of local LLMs?")
print(response)
```

**JavaScript:**
```javascript
const fetch = require('node-fetch');
const { ActiveMirror } = require('./activemirror');

class LMStudioClient {
    constructor(mirror, baseUrl = 'http://localhost:1234/v1') {
        this.mirror = mirror;
        this.baseUrl = baseUrl;
    }

    async chat(sessionId, userMessage) {
        let session;
        try {
            session = this.mirror.loadSession(sessionId);
        } catch {
            session = this.mirror.createSession(sessionId);
        }

        session.addMessage('user', userMessage);

        const messages = session.getContext().map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;
        session.addMessage('assistant', assistantMessage);

        return assistantMessage;
    }
}
```

---

## llama.cpp Integration

### 1. Install llama.cpp

```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make
```

### 2. Download a Model

```bash
# Download GGUF model from Hugging Face
# Example: Mistral 7B
wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_K_M.gguf
```

### 3. Start Server

```bash
./server -m mistral-7b-instruct-v0.1.Q4_K_M.gguf -c 2048
```

### 4. Integration

Similar to Ollama—use HTTP API at `http://localhost:8080/completion`:

```python
response = requests.post(
    "http://localhost:8080/completion",
    json={
        "prompt": prompt,
        "n_predict": 512,
        "temperature": 0.7
    }
)
```

---

## GPT4All Integration

### 1. Install GPT4All

**Python:**
```bash
pip install gpt4all
```

**Or download GUI:** https://gpt4all.io/

### 2. Python Integration

```python
from gpt4all import GPT4All
from activemirror import ActiveMirror

class GPT4AllClient:
    def __init__(self, mirror, model_name="mistral-7b-openorca.Q4_0.gguf"):
        self.mirror = mirror
        self.model = GPT4All(model_name)

    def chat(self, session_id, user_message):
        try:
            session = self.mirror.load_session(session_id)
        except ValueError:
            session = self.mirror.create_session(session_id)

        session.add_message("user", user_message)

        # Build context
        context = "\n".join([
            f"{msg.role}: {msg.content}"
            for msg in session.get_context()
        ])

        # Generate response
        with self.model.chat_session():
            response = self.model.generate(context, max_tokens=500)

        session.add_message("assistant", response)
        return response

# Usage
mirror = ActiveMirror(storage_type="sqlite", db_path="gpt4all_memory.db")
client = GPT4AllClient(mirror)

response = client.chat("chat", "Tell me about AI memory systems.")
print(response)
```

---

## LocalAI Integration

### 1. Install with Docker

```bash
docker run -p 8080:8080 -ti --rm quay.io/go-skynet/local-ai:latest
```

### 2. Integration

LocalAI is OpenAI-compatible:

```python
import requests

response = requests.post(
    "http://localhost:8080/v1/chat/completions",
    json={
        "model": "gpt-3.5-turbo",  # Use any loaded model
        "messages": messages
    }
)
```

---

## Best Practices

### 1. Context Window Management

```python
def get_limited_context(session, max_tokens=2000):
    """Limit context to prevent exceeding model limits."""
    messages = session.get_messages()

    # Simple token estimation (rough)
    total_tokens = 0
    limited_messages = []

    for msg in reversed(messages):
        msg_tokens = len(msg.content.split()) * 1.3  # Rough estimate
        if total_tokens + msg_tokens > max_tokens:
            break
        limited_messages.insert(0, msg)
        total_tokens += msg_tokens

    return limited_messages
```

### 2. Model Selection

```python
# Choose model based on requirements
MODELS = {
    "fast": "llama2:7b",       # Quick responses
    "balanced": "mistral",      # Good quality
    "quality": "llama2:13b",    # Better but slower
    "code": "codellama",        # Code-specific
    "long": "llama2-uncensored" # Long context
}

model = MODELS["balanced"]
```

### 3. Error Handling

```python
def safe_chat(client, session_id, message, max_retries=3):
    """Robust chat with retries."""
    for attempt in range(max_retries):
        try:
            return client.chat(session_id, message)
        except requests.exceptions.ConnectionError:
            if attempt == max_retries - 1:
                raise
            print(f"Retry {attempt + 1}/{max_retries}...")
            time.sleep(2 ** attempt)
```

### 4. Caching Responses

```python
import hashlib

def get_cached_response(session, user_message, model_response):
    """Cache identical queries."""
    cache_key = hashlib.md5(user_message.encode()).hexdigest()

    # Check cache
    cached = session.metadata.get(f"cache_{cache_key}")
    if cached:
        return cached

    # Store in metadata
    session.metadata[f"cache_{cache_key}"] = model_response
    return model_response
```

---

## Performance Tips

### Hardware Requirements

| Model Size | RAM | VRAM (GPU) | Speed |
|-----------|-----|-----------|-------|
| 7B Q4 | 8 GB | 4-6 GB | Fast |
| 13B Q4 | 16 GB | 8-10 GB | Medium |
| 70B Q4 | 64 GB | 40+ GB | Slow |

### Optimization

**1. Use quantized models:**
```bash
# Q4 = 4-bit quantization (fast, good quality)
ollama pull llama2:7b-q4

# Q8 = 8-bit (slower, better quality)
ollama pull llama2:7b-q8
```

**2. Enable GPU acceleration:**
```bash
# Ollama auto-detects GPU
# For llama.cpp:
./server -m model.gguf -ngl 32  # Offload 32 layers to GPU
```

**3. Adjust context window:**
```bash
# Smaller context = faster
ollama run llama2 --ctx-size 1024  # Default is 2048
```

**4. Use streaming:**
```python
# Stream responses for better UX
for token in client.chat_stream(session_id, message):
    print(token, end="", flush=True)
```

---

## Troubleshooting

### "Connection refused"

**Problem**: LLM server not running.

**Solution**:
```bash
# Check if server is running
curl http://localhost:11434/api/tags  # Ollama
curl http://localhost:1234/v1/models  # LM Studio

# Start server if needed
ollama serve
```

### "Out of memory"

**Problem**: Model too large for your hardware.

**Solution**:
- Use smaller model (7B instead of 13B)
- Use more quantized version (Q4 instead of Q8)
- Close other applications
- Enable swap (Linux):
  ```bash
  sudo swapon -s  # Check swap
  ```

### Slow responses

**Solutions**:
- Use GPU if available
- Reduce context window size
- Use smaller/quantized model
- Lower `max_tokens` parameter

---

## Complete Example: Local AI Journal

```python
from activemirror import ActiveMirror
from activemirror.reflective_client import ReflectiveClient, ReflectivePattern
import requests

class LocalJournal:
    def __init__(self, ollama_url="http://localhost:11434"):
        self.mirror = ActiveMirror(storage_type="sqlite", db_path="journal.db")
        self.reflective = ReflectiveClient(storage_dir="journal_reflections")
        self.ollama_url = ollama_url

    def add_entry(self, entry_text):
        """Add journal entry with local AI reflection."""
        session_id = "daily-journal"

        try:
            session = self.mirror.load_session(session_id)
        except ValueError:
            session = self.mirror.create_session(session_id)

        # Add user entry
        session.add_message("user", entry_text)

        # Get reflective pattern
        reflection = self.reflective.reflect(
            session_id=session_id,
            user_input=entry_text,
            pattern=ReflectivePattern.EXPLORATORY
        )

        # Get AI insight from local LLM
        context = session.get_context(limit=10)
        prompt = self._build_prompt(context)

        response = requests.post(
            f"{self.ollama_url}/api/generate",
            json={
                "model": "llama2",
                "prompt": prompt,
                "stream": False
            }
        )

        insight = response.json()["response"]
        session.add_message("assistant", insight)

        return {
            "reflection": reflection.reflection,
            "insight": insight
        }

    def _build_prompt(self, messages):
        prompt = "You are a thoughtful journal assistant. Provide insights.\n\n"
        for msg in messages:
            prompt += f"{msg.role.capitalize()}: {msg.content}\n"
        prompt += "Assistant:"
        return prompt

# Usage
journal = LocalJournal()
result = journal.add_entry("Today I explored ActiveMirrorOS with local LLMs")

print(f"Reflection: {result['reflection']}")
print(f"AI Insight: {result['insight']}")
```

---

## Next Steps

- **[API Examples](api_examples.md)** — More integration patterns
- **[Python Starter](python_starter.py)** — Quick start template
- **[Example Apps](../apps/)** — Full applications
- **[Ollama Documentation](https://github.com/ollama/ollama)** — Official docs
- **[LM Studio](https://lmstudio.ai/)** — Download and guides

---

**Privacy-first AI with ActiveMirrorOS + Local LLMs = Complete control** 🔒
