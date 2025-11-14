# Quick Start Guide

Get up and running with ActiveMirrorOS in under 5 minutes.

## What is ActiveMirrorOS?

ActiveMirrorOS is a **consumer-facing OS layer** for building AI experiences that remember. It provides:

- **Persistent Memory**: Conversations that survive across sessions
- **Reflective Patterns**: LingOS Lite implementation for thoughtful dialogue
- **Multi-Platform**: Python, JavaScript, CLI, Desktop, Mobile
- **Vault Storage**: Encrypted personal data storage
- **Local-First**: Your data stays on your device

## Choose Your Path

### Path 1: CLI Journaling (Fastest)

Perfect for terminal users who want immediate access to reflective journaling.

```bash
cd apps/example-cli
chmod +x amos-cli.js
./amos-cli.js write "First journal entry"
./amos-cli.js reflect "What am I learning?"
./amos-cli.js list
```

**Done!** You now have a working journaling system with reflective responses.

### Path 2: Desktop App (Visual)

For users who prefer a GUI chat interface.

```bash
cd apps/example-desktop
npm install
npm start
```

**Features**:
- Chat interface with persistent sessions
- Session history sidebar
- Reflective assistant panel
- All data stored locally

### Path 3: Mobile App (On-the-Go)

For mobile-first experiences.

```bash
cd apps/example-mobile
npm install
npm start
```

Scan QR code with Expo Go app on your phone.

### Path 4: Python SDK (Developers)

For Python developers building custom applications.

```bash
cd sdk/python
pip install -e .
```

```python
from activemirror import ActiveMirror, ReflectiveClient, VaultMemory

# Create persistent memory instance
mirror = ActiveMirror(storage_type="sqlite", db_path="./my_memory.db")

# Start conversation
session = mirror.create_session(title="Daily Reflection")
response = session.send("I'm thinking about career transitions")

print(response.content)

# Use reflective client
client = ReflectiveClient()
reflection = client.reflect("What brings meaning to my work?")
print(reflection['response'])

# Store private goals in encrypted vault
vault = VaultMemory(password="your-secure-password")
vault.store("life_goal", "Launch a meaningful project by Q2")
```

### Path 5: JavaScript SDK (Web Developers)

For Node.js and web developers.

```bash
cd sdk/javascript
npm install
```

```javascript
import { ActiveMirror, ReflectiveClient, VaultMemory } from '@activemirror/sdk';

// Create instance
const mirror = new ActiveMirror({ storagePath: './memory' });
await mirror.initialize();

// Start conversation
const session = await mirror.create Session('Daily Reflection');
const response = await session.send("Exploring new ideas");

console.log(response.content);

// Reflective client
const client = new ReflectiveClient();
const reflection = await client.reflect("What am I avoiding?");
console.log(reflection.response);

// Encrypted vault
const vault = new VaultMemory({ password: 'secure-password' });
await vault.initialize();
await vault.store('personal_goal', 'Build in public');
```

## Core Concepts in 60 Seconds

### 1. Sessions = Conversations

A **session** is a bounded conversation with persistent memory:

```python
session = mirror.create_session(title="Strategic Planning")
session.send("Let's plan Q1")
session.save()  # Persists to disk

# Later...
loaded = mirror.load_session(session.id)
loaded.send("Continuing from where we left off")
```

### 2. Reflective Patterns

ActiveMirrorOS uses **LingOS Lite** patterns for thoughtful dialogue:

- **Exploratory** (◊): Open-ended inquiry
- **Analytical** (✦): Rigorous examination
- **Creative** (★): Generative thinking
- **Strategic** (⬢): Long-term planning

Responses include **uncertainty markers**: `⟨low⟩`, `⟨medium⟩`, `⟨⟨high⟩⟩`

```python
from activemirror import ReflectiveClient, ReflectivePattern

client = ReflectiveClient()
reflection = client.reflect(
    "Should I pivot my startup?",
    pattern=ReflectivePattern.STRATEGIC
)

print(reflection['uncertainty'])  # Shows confidence level
```

### 3. Vault = Encrypted Storage

For sensitive personal data:

```python
from activemirror import VaultMemory, VaultCategory

vault = VaultMemory(password="your-password")
vault.store("health_goal", "Run a marathon", metadata={
    "category": VaultCategory.GOALS
})

goal = vault.retrieve("health_goal")
results = vault.search("marathon")
```

### 4. Memory Layers

ActiveMirrorOS manages memory at multiple levels:

- **Session Memory**: Current conversation (RAM)
- **Persistent Memory**: All conversations (SQLite/JSON)
- **Vault Memory**: Encrypted private data (AES-256)

## Next Steps

Now that you're up and running:

1. **Explore Examples**: Check `examples/` directory for use cases
2. **Read Architecture**: Understand the [system design](architecture.md)
3. **API Reference**: See the [complete API](api-reference.md)
4. **Build Something**: Integrate into your own app
5. **Join Community**: Share your use case

## Common Use Cases

### Personal Journal with Reflection

```bash
# CLI
amos write "Feeling uncertain about direction"
amos reflect "What clarity am I seeking?"

# Python
session = mirror.create_session("Journal")
session.send("Today I realized...")
```

### Strategic Assistant

```python
from activemirror import ReflectiveClient, ReflectivePattern

client = ReflectiveClient()
strategy = client.reflect(
    "Launch product in Q1 or Q2?",
    pattern=ReflectivePattern.STRATEGIC,
    context={"constraints": "Limited runway, 2 devs"}
)
```

### Long-term Memory

```python
# Store personal context
vault.store("career_context", {
    "current_role": "Engineer",
    "goal": "Technical Leadership",
    "timeline": "2 years"
})

# Use in conversations
context = vault.retrieve("career_context")
session.send(f"Given my goal of {context['goal']}, should I...")
```

### Continuity Across Devices

```python
# Device A
session.save()
export_data = session.export(format='json')
# Transfer export_data to Device B

# Device B
import_session(export_data)
```

## Troubleshooting

### "Module not found"

```bash
# Python
cd sdk/python && pip install -e .

# JavaScript
cd sdk/javascript && npm install
```

### "Storage error"

Ensure write permissions for storage directory:

```bash
chmod 755 ./memory
```

### "Session not found"

Check that session was saved:

```python
session_id = session.save()  # Returns ID
loaded = mirror.load_session(session_id)
```

## Help & Support

- **Documentation**: See [docs/](.)
- **Examples**: Check [examples/](../examples/)
- **Issues**: GitHub Issues for bugs
- **Discussions**: GitHub Discussions for questions

---

**You're ready!** Start building AI experiences that remember.
