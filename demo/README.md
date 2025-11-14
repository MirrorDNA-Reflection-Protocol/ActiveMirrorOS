# ActiveMirrorOS Demo

**A working demonstration of reflective AI with persistent memory.**

This demo showcases the core concepts of ActiveMirrorOS in a simple, runnable application:
- ✓ Reflective dialogue patterns (4 thinking modes)
- ✓ Persistent memory across sessions
- ✓ Continuity logging to JSON
- ✓ Interactive and automated modes

---

## Quick Start (2 Minutes)

### 1. Install Dependencies

```bash
# Create a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements (just PyYAML)
pip install -r requirements.txt
```

### 2. Run the Demo

**Automated Demo** (see it in action):
```bash
python demo_app.py
```

This runs a pre-programmed sequence of 3 interactions showing how reflective patterns work.

**Interactive Mode** (try it yourself):
```bash
python demo_app.py interactive
```

Type your thoughts, questions, or ideas. The app will:
1. Echo your input back
2. Generate a "reflection" based on the current mode
3. Log everything to `logs/session_TIMESTAMP.json`

**Commands:**
- Type anything to get a reflection
- Type `history` to see all interactions in this session
- Type `exit` to quit (your session will be saved)

### 3. Explore the Results

After running the demo, check the `logs/` directory:

```bash
ls logs/
# You'll see: session_20250114_143022.json

cat logs/session_*.json
# View the full JSON structure
```

Each log file contains:
- Session ID and timestamps
- All user inputs and reflections
- Metadata (mode, session info)

---

## What You'll See

### Automated Demo Output

```
============================================================
🪞 ActiveMirrorOS - Reflective Conversation Demo
============================================================

Welcome, Explorer!
Mode: Exploratory
Session ID: 20250114_143022

🎬 Running demo sequence with 3 example interactions...

────────────────────────────────────────────────────────────
Example 1/3
────────────────────────────────────────────────────────────

Explorer: I want to build an AI that remembers our conversations

🔍 Exploring: What aspects of 'I want to build an AI that remembers our conversations' are most meaningful to you? ~

💾 Logged to: session_20250114_143022.json

Press Enter to continue...
```

### Interactive Mode Output

```
Explorer: How do I make AI more useful?

🔍 Exploring: What aspects of 'How do I make AI more useful?' are most meaningful to you? ~

💾 Logged to continuity store

Explorer: history

📜 Session History:
────────────────────────────────────────────────────────────

1. [14:30:45] Explorer: How do I make AI more useful?
   → 🔍 Exploring: What aspects of 'How do I make AI more useful?' are most meaningful to you? ~

────────────────────────────────────────────────────────────
```

---

## Configuration

Edit `config.yaml` to customize the demo:

```yaml
# Change your name
user_name: "YourName"

# Try different reflection modes:
# - exploratory: Open-ended questioning
# - analytical: Structured breakdown
# - creative: Generative thinking
# - strategic: Goal-oriented planning
mode: "analytical"

# Change log location
log_path: "my_logs"
```

Then run again:
```bash
python demo_app.py interactive
```

---

## Understanding the Code

The demo has three main components:

### 1. ReflectionLayer (`demo_app.py:24-56`)
Implements 4 reflective dialogue patterns:
- **Exploratory**: Open-ended questioning (🔍 ~)
- **Analytical**: Structured breakdown (🔬 ?)
- **Creative**: Generative thinking (💡 *)
- **Strategic**: Goal-oriented planning (🎯 !)

Each pattern has a unique style and uncertainty marker.

### 2. ContinuityLogger (`demo_app.py:59-94`)
Logs all interactions to JSON files in `logs/`:
- Creates unique session ID per run
- Saves user input, reflection, and metadata
- Can load and display previous sessions

### 3. DemoApp (`demo_app.py:97-260`)
Main orchestrator that:
- Loads config from `config.yaml`
- Handles user input (interactive or automated)
- Coordinates reflection and logging
- Displays history and session info

---

## What's Next?

After trying the demo:

1. **Explore the SDK** → See `../sdk/python/` for the full ActiveMirrorOS SDK
2. **Read the Docs** → Check `../docs/quickstart.md` for deeper concepts
3. **Try Example Apps** → Run the CLI, Desktop, or Mobile apps in `../apps/`
4. **Follow Onboarding** → Step-by-step guide at `../onboarding/getting_started.md`

---

## Troubleshooting

**"ModuleNotFoundError: No module named 'yaml'"**
- Solution: `pip install -r requirements.txt`

**"Permission denied" when running `python demo_app.py`**
- Solution: Make sure you're in the `demo/` directory
- Or use: `python /path/to/demo/demo_app.py`

**Logs not saving**
- Check that the `logs/` directory exists (it's created automatically)
- Verify write permissions in the demo directory

**Want to reset?**
```bash
rm -rf logs/  # Delete all session logs
python demo_app.py  # Start fresh
```

---

## How This Relates to ActiveMirrorOS

This demo is a **simplified illustration** of ActiveMirrorOS concepts:

| Demo Feature | Full SDK Feature |
|-------------|-----------------|
| ReflectionLayer | `activemirror.reflective_client.ReflectiveClient` |
| ContinuityLogger | `activemirror.storage.SQLiteStorage` |
| JSON logs | SQLite database with sessions and messages |
| config.yaml | `activemirror.core.config.Config` |
| 4 thinking modes | Full LingOS Lite pattern library |

The SDK adds:
- Encrypted vault storage (AES-256-GCM)
- Session management with context preservation
- Cross-platform support (Python & JavaScript)
- LLM integration (OpenAI, Claude, local models)
- Multi-device sync capabilities

---

## Demo Statistics

- **Lines of code**: ~260 (demo_app.py)
- **Dependencies**: 1 (PyYAML)
- **Time to run**: < 2 minutes
- **Concepts demonstrated**: 4 (reflection, persistence, continuity, interactivity)

---

## Feedback

If this demo helped you understand ActiveMirrorOS, or if you have suggestions:

- **Issues**: [GitHub Issues](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)

---

**Ready to build something real?**

→ Start with the [Python SDK](../sdk/python/) or [JavaScript SDK](../sdk/javascript/)
→ Read the [Product Overview](../docs/product_overview.md)
→ Follow the [Onboarding Guide](../onboarding/getting_started.md)
