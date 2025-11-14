# Getting Started with ActiveMirrorOS

Welcome to ActiveMirrorOS! This guide will take you from zero to running your first AI application with persistent memory in about 15 minutes.

---

## What You'll Learn

By the end of this guide, you'll:
- ✓ Understand what ActiveMirrorOS is and why it matters
- ✓ Run your first demo application
- ✓ Create a simple memory session using the SDK
- ✓ Know where to go next for deeper learning

---

## Prerequisites

Before starting, make sure you have:

**Required:**
- Python 3.8+ or Node.js 16+
- Basic command line familiarity
- A text editor

**Optional:**
- Git (for cloning the repository)
- Virtual environment tool (venv, conda)

**Time estimate**: 15-20 minutes

---

## Step 1: Get ActiveMirrorOS (2 minutes)

### Option A: Clone from GitHub (Recommended)

```bash
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
cd ActiveMirrorOS
```

### Option B: Download ZIP

1. Visit https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS
2. Click "Code" → "Download ZIP"
3. Extract and navigate to the folder

---

## Step 2: Run the Demo (5 minutes)

The fastest way to see ActiveMirrorOS in action is the demo:

```bash
cd demo

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies (just PyYAML)
pip install -r requirements.txt

# Run the demo
python demo_app.py
```

**What you'll see:**
- 3 pre-programmed interactions showing reflective dialogue
- Real-time logging to JSON files
- Different thinking modes in action

**Try interactive mode:**
```bash
python demo_app.py interactive
```

Type anything, see reflections, type `history` to see your session, `exit` to quit.

**Check the logs:**
```bash
cat logs/session_*.json
```

You'll see your interactions saved as structured JSON.

---

## Step 3: Install the Python SDK (3 minutes)

Now let's install the full SDK:

```bash
cd ../sdk/python

# Install in development mode
pip install -e .

# Verify installation
python -m pytest tests/ -v
```

You should see "75 passed" in green.

---

## Step 4: Your First Memory Session (5 minutes)

Create a new file called `my_first_session.py`:

```python
from activemirror import ActiveMirror

# Initialize with persistent storage
mirror = ActiveMirror(
    storage_type="sqlite",
    db_path="my_memory.db"
)

# Create a session
session = mirror.create_session("journal")

# Add some messages
session.add_message("user", "What did I learn today?")
session.add_message(
    "assistant",
    "You learned how ActiveMirrorOS maintains persistent memory across sessions."
)

print(f"Session ID: {session.session_id}")
print(f"Message count: {len(session.messages)}")

# View the context
print("\nConversation:")
for msg in session.messages:
    print(f"{msg.role}: {msg.content}")
```

Run it:
```bash
python my_first_session.py
```

**Run it again:**
```bash
python my_first_session.py
```

Notice: The session persists! The database file `my_memory.db` stores everything.

---

## Step 5: Load and Continue a Session

Create `continue_session.py`:

```python
from activemirror import ActiveMirror

# Load existing mirror
mirror = ActiveMirror(
    storage_type="sqlite",
    db_path="my_memory.db"
)

# Load previous session
session = mirror.load_session("journal")

# Add a new message
session.add_message("user", "Tell me more about persistent memory.")
session.add_message(
    "assistant",
    "Persistent memory means AI can remember context from days, weeks, or months ago."
)

# See full history
print(f"Total messages now: {len(session.messages)}")
print("\nFull conversation:")
for msg in session.messages:
    print(f"  {msg.role}: {msg.content}")
```

Run it:
```bash
python continue_session.py
```

You'll see all 4 messages—the original 2 plus the new 2!

---

## Step 6: Try Reflective Patterns (5 minutes)

Create `reflective_example.py`:

```python
from activemirror import ActiveMirror
from activemirror.reflective_client import ReflectiveClient, ReflectivePattern

# Initialize reflective client
client = ReflectiveClient(storage_dir="reflective_memory")

# Create a reflective session
session = client.create_session("problem-solving")

# Use exploratory pattern
response = client.reflect(
    session_id="problem-solving",
    user_input="How should I structure my AI application?",
    pattern=ReflectivePattern.EXPLORATORY
)

print("Reflective response:")
print(response)
```

Run it:
```bash
python reflective_example.py
```

---

## What You've Accomplished

🎉 Congratulations! You've:
- ✅ Run the demo and seen reflective dialogue
- ✅ Installed the Python SDK
- ✅ Created your first persistent memory session
- ✅ Loaded and continued a session
- ✅ Explored reflective patterns

---

## Next Steps

### Learn More Concepts

- **[Product Overview](../docs/product_overview.md)** — Deeper dive into what ActiveMirrorOS does
- **[Architecture](../docs/architecture.md)** — How the system is designed
- **[API Reference](../docs/api-reference.md)** — Complete SDK documentation

### Try Advanced Features

- **[Install LingOS Lite](install_lingos_lite.md)** — Enable full reflective patterns
- **[Encrypted Vault](../docs/state-persistence.md)** — Secure sensitive data
- **[JavaScript SDK](../sdk/javascript/)** — Try the Node.js version

### Build Something

- **[Example Apps](../apps/)** — CLI, Desktop, Mobile templates
- **[SDK Starter Code](../sdk/python_starter.py)** — Starter templates
- **[API Examples](../sdk/api_examples.md)** — Integration patterns

### Join the Community

- **[GitHub Issues](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues)** — Report bugs or request features
- **[GitHub Discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)** — Ask questions

---

## Common First Questions

**Q: Do I need an API key for OpenAI or Claude?**
A: No! ActiveMirrorOS works without any LLM by default. It provides the memory and structure. You can add LLM integration later.

**Q: Can I use this in production?**
A: Yes! Version 0.2.0 is production-ready with 83 passing tests.

**Q: Where is my data stored?**
A: Locally on your machine. SQLite database files or JSON files, depending on your choice. Nothing goes to the cloud unless you explicitly add sync.

**Q: Does it work on Windows?**
A: Yes! Python and Node.js are cross-platform. Use `venv\Scripts\activate` instead of `source venv/bin/activate`.

**Q: What if I get stuck?**
A: Check the [Troubleshooting Guide](troubleshooting.md) or open a GitHub issue.

---

## Troubleshooting

If you run into issues, see the [Troubleshooting Guide](troubleshooting.md) for common problems and solutions.

Quick fixes:
- **Import errors**: Make sure you're in the virtual environment
- **Permission errors**: Check file permissions in the directory
- **Test failures**: Try `pip install -e ".[dev]"` to get dev dependencies

---

## Recap: 3-Command Quickstart

If you just want to see it work:

```bash
# 1. Get the code
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
cd ActiveMirrorOS/demo

# 2. Install and run
python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt

# 3. Try it
python demo_app.py interactive
```

That's it!

---

**Ready to build?** → Check out the [SDK Documentation](../docs/api-reference.md)

**Want to understand the system better?** → Read the [Product Overview](../docs/product_overview.md)

**Need help?** → See [Troubleshooting](troubleshooting.md) or ask in [GitHub Discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)
