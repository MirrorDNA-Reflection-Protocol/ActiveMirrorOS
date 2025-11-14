# Getting Started with ActiveMirrorOS

Welcome to ActiveMirrorOS - AI with memory, reflection, and continuity. This guide will get you up and running in 10 minutes.

---

## What You'll Learn

- ✅ Install ActiveMirrorOS (Python or JavaScript)
- ✅ Create your first persistent session
- ✅ Add messages and see memory in action
- ✅ Explore example apps
- ✅ Understand the core concepts

---

## Choose Your Path

| I want to... | Go to... | Time |
|--------------|----------|------|
| **Try it instantly** | [Quick Demo](#quick-demo) | 2 min |
| **Build Python apps** | [Python SDK Setup](#python-sdk-setup) | 5 min |
| **Build JavaScript apps** | [JavaScript SDK Setup](#javascript-sdk-setup) | 5 min |
| **Use the CLI tool** | [CLI App Setup](#cli-app-setup) | 3 min |
| **Understand concepts** | [Core Concepts](#core-concepts) | 5 min |

---

## Quick Demo

Copy-paste this into your terminal to see ActiveMirrorOS in action:

### Python Quick Start

```bash
# Clone and install
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
cd ActiveMirrorOS/sdk/python
pip install -e .

# Run demo
python << EOF
from activemirror import ActiveMirror

# Create mirror with persistent storage
mirror = ActiveMirror(storage_type="sqlite", db_path="quickstart.db")

# Start a session
session = mirror.create_session("my-first-session")

# Add messages (they persist automatically)
session.add_message("user", "Remember: I love Python and AI")
session.add_message("assistant", "Got it! I'll remember your interests in Python and AI.")

print("✅ Session created!")
print("\n📝 Session content:")
print(session.get_context())

# Prove persistence - reload the session
print("\n🔄 Reloading session from disk...")
loaded = mirror.load_session("my-first-session")
print(loaded.get_context())
print("\n✨ Memory persists across reloads!")
EOF
```

### JavaScript Quick Start

```bash
# Clone and install
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
cd ActiveMirrorOS/sdk/javascript
npm install

# Run demo
node << EOF
const { ActiveMirror } = require('./index.js');

// Create mirror with JSON storage
const mirror = new ActiveMirror('./quickstart-data');

// Start a session
const session = mirror.createSession('my-first-session');

// Add messages (they persist automatically)
session.addMessage('user', 'Remember: I love JavaScript and AI');
session.addMessage('assistant', 'Got it! I will remember your interests in JavaScript and AI.');

console.log('✅ Session created!');
console.log('\n📝 Session content:');
console.log(session.messages);

// Prove persistence - reload the session
console.log('\n🔄 Reloading session from disk...');
const loaded = mirror.loadSession('my-first-session');
console.log(loaded.messages);
console.log('\n✨ Memory persists across reloads!');
EOF
```

**What just happened?**
- Created a persistent storage location
- Started a session with a unique ID
- Added messages that were automatically saved to disk
- Reloaded the session to prove memory persistence

---

## Python SDK Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

**Option 1: Install from GitHub (recommended)**
```bash
pip install git+https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git#subdirectory=sdk/python
```

**Option 2: Clone and install locally**
```bash
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
cd ActiveMirrorOS/sdk/python
pip install -e .
```

### Verify Installation

```bash
python -m pytest tests/ -v
```

You should see **75 tests passing**.

### Your First Python App

Create `my_first_app.py`:

```python
from activemirror import ActiveMirror

# Initialize with SQLite storage
mirror = ActiveMirror(storage_type="sqlite", db_path="memory.db")

# Create a session
session = mirror.create_session("learning-journey")

# Add messages
session.add_message("user", "Today I learned about ActiveMirrorOS")
session.add_message("assistant", "Excellent! What aspect interests you most?")
session.add_message("user", "The persistent memory across sessions")
session.add_message("assistant", "That's the core feature - memory that never forgets.")

# View the conversation
print(session.get_context())

# List all sessions
print(f"\nTotal sessions: {len(mirror.list_sessions())}")

# Export session to markdown
mirror.export_session("learning-journey", format="markdown")
print("\n✅ Session exported to: learning-journey.md")
```

Run it:
```bash
python my_first_app.py
```

### Next Steps for Python

- [API Reference](../docs/api-reference.md) - Complete SDK documentation
- [Examples](../examples/) - More Python examples
- [Architecture](../docs/architecture.md) - How it works

---

## JavaScript SDK Setup

### Prerequisites

- Node.js 14 or higher
- npm (Node package manager)

### Installation

**Option 1: Install from GitHub**
```bash
npm install MirrorDNA-Reflection-Protocol/ActiveMirrorOS#sdk/javascript
```

**Option 2: Clone and install locally**
```bash
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
cd ActiveMirrorOS/sdk/javascript
npm install
npm link  # For local development
```

### Verify Installation

```bash
node --test tests/
```

You should see **8 tests passing**.

### Your First JavaScript App

Create `my-first-app.js`:

```javascript
const { ActiveMirror } = require('activemirror');

// Initialize with JSON storage
const mirror = new ActiveMirror('./data');

// Create a session
const session = mirror.createSession('learning-journey');

// Add messages
session.addMessage('user', 'Today I learned about ActiveMirrorOS');
session.addMessage('assistant', 'Excellent! What aspect interests you most?');
session.addMessage('user', 'The persistent memory across sessions');
session.addMessage('assistant', 'That is the core feature - memory that never forgets.');

// View the conversation
console.log(session.messages);

// List all sessions
console.log(`\nTotal sessions: ${mirror.listSessions().length}`);

// Export session to markdown
mirror.exportSession('learning-journey', 'markdown');
console.log('\n✅ Session exported to: learning-journey.md');
```

Run it:
```bash
node my-first-app.js
```

### Next Steps for JavaScript

- [API Reference](../docs/api-reference.md) - Complete SDK documentation
- [Example Apps](../apps/) - CLI, Desktop, Mobile examples
- [Architecture](../docs/architecture.md) - How it works

---

## CLI App Setup

The CLI is the fastest way to experience ActiveMirrorOS interactively.

### Installation

```bash
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
cd ActiveMirrorOS/apps/example-cli
npm install
```

### Usage

**Start journaling:**
```bash
./amos-cli.js write "What did I learn today?"
```

**List all sessions:**
```bash
./amos-cli.js list
```

**Read a session:**
```bash
./amos-cli.js read <session-id>
```

**Export a session:**
```bash
./amos-cli.js export <session-id> --format markdown
```

### Example Session

```bash
$ ./amos-cli.js write "I'm starting to learn ActiveMirrorOS"

Session: 2025-01-14-learning
You: I'm starting to learn ActiveMirrorOS