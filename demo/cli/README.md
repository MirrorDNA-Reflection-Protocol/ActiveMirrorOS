# ActiveMirrorOS CLI Demo

A simple command-line demonstration of ActiveMirrorOS core concepts: **reflective interaction**, **continuity**, and **local-first storage**.

## Quick Start

```bash
# Navigate to demo directory
cd demo/cli

# Run the demo (Python 3.6+)
python demo_cli.py

# Or make it executable
chmod +x demo_cli.py
./demo_cli.py
```

That's it! No dependencies, no installation required.

## What This Demo Shows

### 1. Reflective Interaction
Every response includes a **reflection step** before the actual reply:

```
You: What is meaningful work?

✦ Analyzing your question...

🪞 ActiveMirror: [response]
```

This demonstrates the "thinking" process, inspired by LingOS Lite reflective dialogue patterns.

### 2. Continuity
Every interaction is **automatically logged** to a JSON file in `logs/`:

```json
{
  "session_id": "20250114_143022",
  "interactions": [
    {
      "id": 1,
      "timestamp": "2025-01-14T14:30:25",
      "user_input": "Hello",
      "reflection": "✦ Reflecting on interaction #1...",
      "response": "Noted. This is interaction #1..."
    }
  ]
}
```

The system references this history in responses. Try asking: **"What have I told you?"**

### 3. Local-First Storage
- All data saved to `logs/session_YYYYMMDD_HHMMSS.json`
- No network calls, no cloud services
- Your data stays on your machine
- Survives crashes (Ctrl+C saves before exit)

## Features

- **Zero Dependencies**: Pure Python 3 standard library
- **Persistent Logging**: Every interaction saved to JSON
- **Session Management**: Each run creates a new session file
- **Commands**: `stats`, `help`, `exit`
- **Graceful Handling**: Ctrl+C saves session before exiting

## Try These Commands

```bash
# Start demo
python demo_cli.py

# Try these prompts:
You: What is this demo?
You: What have I told you so far?
You: What patterns do you notice?

# Show session stats
You: stats

# Get help
You: help

# Exit (saves session)
You: exit
```

## Architecture

```
demo_cli.py
├── ActiveMirrorCLI class
│   ├── process_interaction()  # Main interaction loop
│   ├── reflect()              # Generate reflection
│   ├── respond()              # Generate response
│   └── _save_log()            # Persist to JSON
└── logs/
    └── session_*.json         # All session data
```

## Example Session

```
╔==========================================================╗
║               ✦ ActiveMirrorOS CLI Demo                 ║
╚==========================================================╝

Demonstrating: Reflective Interaction | Continuity | Local-First

============================================================
Session: 20250114_143022
Interactions: 0
Log file: logs/session_20250114_143022.json
============================================================

You: Hello, what can you do?

✦ Analyzing your question...

🪞 ActiveMirror: This demo shows ActiveMirrorOS concepts:
  1. Reflective Interaction - I show my 'thinking' before responding
  2. Continuity - Every interaction is logged to JSON
  3. Local-First - All data stays on your machine

Your session is saved to: logs/session_20250114_143022.json

You: What have I told you?

✦ Drawing on our 1 previous interactions...

🪞 ActiveMirror: Based on our 1 interactions, you've discussed:
'Hello, what can you do?'. Check session_20250114_143022.json
for full history.

You: exit

👋 Session ended. Your conversation is saved to:
   logs/session_20250114_143022.json
```

## How It Represents ActiveMirrorOS

This CLI demo is a **simplified simulation** showing the conceptual model:

| Demo Feature | Real ActiveMirrorOS |
|--------------|---------------------|
| JSON logging | SQLite or JSON file storage with SDK |
| Reflection step | LingOS Lite dialogue patterns |
| Session files | Persistent sessions with `Session` class |
| Pattern matching | LLM-powered responses with memory |

## Extending This Demo

### Connect to Real ActiveMirror SDK

```python
from activemirror import ActiveMirror

# Initialize with persistent storage
mirror = ActiveMirror(storage_type="sqlite", db_path="demo.db")

# Create session
session = mirror.create_session("cli-demo")

# Add messages
session.add_message("user", user_input)
session.add_message("assistant", response)

# Load session later
loaded = mirror.load_session("cli-demo")
print(loaded.get_context())
```

### Add LLM Integration

Replace the `respond()` method with real AI:

```python
def respond(self, user_input):
    import openai  # or anthropic, etc.

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are ActiveMirror..."},
            {"role": "user", "content": user_input}
        ]
    )

    return response.choices[0].message.content
```

## Session Log Format

Each session creates a JSON file with this structure:

```json
{
  "session_id": "20250114_143022",
  "started_at": "2025-01-14T14:30:22.123456",
  "interaction_count": 3,
  "last_updated": "2025-01-14T14:32:15.789012",
  "interactions": [
    {
      "id": 1,
      "timestamp": "2025-01-14T14:30:25.123456",
      "user_input": "Hello",
      "reflection": "✦ Reflecting on interaction #1...",
      "response": "Noted. This is interaction #1..."
    }
  ]
}
```

## Limitations

This is a **demo**, not a production tool:

- Uses simple pattern matching, not real AI
- No encryption or vault features
- No session resumption (each run = new session)
- Basic text I/O only

For production features, use the full SDK at `/sdk/python` or `/sdk/javascript`.

## Next Steps

- **Try the web demo**: `cd ../web && open index.html`
- **Explore the mobile app**: `cd ../../apps/example-mobile`
- **Read the docs**: `../../docs/quickstart.md`
- **Use the real SDK**: `../../sdk/python`

## Philosophy

This demo embodies ActiveMirrorOS principles:

1. **Transparency**: You see the reflection process
2. **Continuity**: Every interaction is preserved
3. **Local-First**: No network, no cloud
4. **Simplicity**: Just run and interact

---

**ActiveMirrorOS** - Intelligence that remembers is intelligence that grows.
