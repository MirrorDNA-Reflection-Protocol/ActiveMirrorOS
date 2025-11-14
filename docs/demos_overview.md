# ActiveMirrorOS Demos Overview

This document guides you through the three demo experiences for ActiveMirrorOS. Each demo showcases the same core concepts from a different interface.

## Core Concepts Demonstrated

All demos illustrate these three principles:

1. **Reflective Interaction** - The system shows its "thinking" process before responding, based on LingOS Lite patterns
2. **Continuity** - Every interaction is logged and can be recalled, building persistent memory
3. **Local-First** - All data stays on your machine, no cloud dependencies

## Available Demos

### 🌐 Web Demo (Recommended First Experience)

**Location**: `/demo/web/`

**Best for**: Quick "wow" moment, visual learners, sharing with non-technical users

**How to run**:
```bash
cd demo/web
python3 -m http.server 8000
# Visit: http://localhost:8000
```

**Features**:
- Beautiful, responsive UI
- Visual reflection step (see the AI "thinking")
- Real-time continuity log sidebar
- Persistent storage in browser localStorage
- Works offline after first load

**What you'll see**:
- Chat interface with user messages and AI responses
- Yellow reflection boxes showing the thinking process
- Sidebar tracking interaction count and history
- Session persistence across page refreshes

**Try these prompts**:
- "What is ActiveMirrorOS?"
- "What have I told you so far?"
- Type several messages, refresh, then ask about previous interactions

---

### 💻 CLI Demo

**Location**: `/demo/cli/`

**Best for**: Developers, automation, understanding the data layer

**How to run**:
```bash
cd demo/cli
python demo_cli.py
```

**Features**:
- Zero dependencies (pure Python 3)
- Session logging to JSON files
- Command support (`stats`, `help`, `exit`)
- Graceful shutdown (Ctrl+C saves session)
- Timestamped interaction logs

**What you'll see**:
- Terminal-based chat interface
- Reflection steps prefixed with ✦
- Responses from ActiveMirror prefixed with 🪞
- Session files created in `logs/` directory

**Try these commands**:
- `stats` - Show session statistics
- `help` - Get help
- "What have I told you?" - Test continuity
- `exit` - Save and quit

**Explore the data**:
```bash
# After running, check the logs
cat logs/session_*.json | jq
```

---

### 📱 Mobile Demo

**Location**: `/apps/example-mobile/`

**Best for**: Mobile-first users, React Native developers, on-device AI

**How to run**:
```bash
cd apps/example-mobile
npm install
npm start

# Then:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Press 'w' for web preview
```

**Features**:
- Full React Native app (iOS + Android)
- AsyncStorage for device-local persistence
- Touch-optimized UI
- Offline-first design
- Clean session management

**What you'll see**:
- Native mobile chat interface
- Smooth animations and transitions
- Messages persist across app restarts
- "Clear Session" button to reset

**Note**: This is a more complete app example than a simple demo. It includes proper state management and production patterns.

---

## Comparison Matrix

| Feature | Web Demo | CLI Demo | Mobile Demo |
|---------|----------|----------|-------------|
| **Setup Time** | None (instant) | None (instant) | ~5 min (npm install) |
| **Visual Impact** | ★★★★★ | ★★☆☆☆ | ★★★★★ |
| **Tech Stack** | HTML/CSS/JS | Python 3 | React Native |
| **Storage** | localStorage | JSON files | AsyncStorage |
| **Platform** | Any browser | Any OS with Python | iOS/Android/Web |
| **Best For** | First impression | Understanding data | Production example |
| **Code Complexity** | Low | Low | Medium |

---

## Which Demo Should You Try First?

### If you want a quick "wow" experience:
→ **Start with the Web Demo**

It's instant, beautiful, and clearly shows the three core concepts without any setup.

### If you're a developer who wants to understand the architecture:
→ **Start with the CLI Demo**

It's the simplest code, produces inspectable JSON logs, and shows the data layer clearly.

### If you're building a mobile app:
→ **Start with the Mobile Demo**

It's a production-ready example with proper state management and React Native patterns.

---

## Progressive Learning Path

We recommend this sequence for deep understanding:

1. **Web Demo** (5 minutes)
   - Get the conceptual overview
   - See the UI patterns
   - Experience the continuity

2. **CLI Demo** (10 minutes)
   - Run it, interact, explore the logs
   - Open `logs/session_*.json` to see the data structure
   - Read the code in `demo_cli.py` (~200 lines)

3. **SDK Quickstart** (15 minutes)
   - Read `/docs/quickstart.md`
   - Try the Python or JavaScript examples
   - Understand the real API

4. **Mobile Demo** (30 minutes)
   - Run it on a simulator
   - Read `App.js` to see patterns
   - Customize for your use case

5. **Build Your Own** (hours to days)
   - Use the SDK to build something real
   - Reference the example apps as needed
   - Join discussions for help

---

## How Demos Relate to Real ActiveMirrorOS

These demos are **conceptual illustrations**, not full implementations:

| Demo Component | Production SDK |
|----------------|----------------|
| Simple pattern matching | Real LLM integration (OpenAI, Anthropic, etc.) |
| localStorage / JSON files | SQLite with proper schema |
| Basic reflection strings | LingOS Lite dialogue manager with 4 modes |
| Manual continuity tracking | Automatic session context management |
| No encryption | AES-256-GCM encrypted vault |
| Single session | Multi-session management with exports |

**To use ActiveMirrorOS in production**, you'll want the full SDK:
- Python: `/sdk/python/`
- JavaScript: `/sdk/javascript/`

See `/docs/quickstart.md` for SDK usage.

---

## Extending the Demos

All demos are designed to be extended:

### Add Real AI
Replace the stub response functions with actual LLM calls:
- OpenAI GPT-4
- Anthropic Claude
- Local models (Ollama, etc.)

### Connect to SDK
Import the ActiveMirror SDK and replace demo storage with real persistence:

```python
# In CLI demo
from activemirror import ActiveMirror

mirror = ActiveMirror(storage_type="sqlite", db_path="demo.db")
session = mirror.create_session("cli-demo")
```

```javascript
// In web demo
import { ActiveMirror } from '@activemirror/sdk';

const mirror = new ActiveMirror('./data');
const session = mirror.createSession('web-demo');
```

### Add Features
- Voice input/output
- Image understanding
- Multi-session management
- Export to PDF/Markdown
- Encrypted vault storage
- Sync across devices

---

## LingOS Lite Integration

All demos demonstrate **LingOS Lite** reflective dialogue patterns:

**LingOS Lite** is a lightweight framework for reflective AI communication. It emphasizes:
- Showing uncertainty explicitly
- Transparent thinking process
- Context-aware responses
- Progressive refinement

In the demos, you see this as:
- The reflection step before responses
- Acknowledgment of limitations ("I'm still building context...")
- References to interaction history
- Explicit markers (✦ for reflection, 🪞 for response)

For more on LingOS Lite patterns, see:
- `/docs/reflective-behaviors.md`
- The "LingOS Lite + ActiveMirrorOS" section below

---

## LingOS Lite + ActiveMirrorOS

These two concepts work together:

| **LingOS Lite** | **ActiveMirrorOS** |
|-----------------|---------------------|
| Reflective dialogue patterns | Persistent memory substrate |
| How AI communicates | What AI remembers |
| Transparency in thinking | Continuity across time |
| Dialogue modes | Session management |

**Combined power**:
- LingOS Lite provides the *communication patterns*
- ActiveMirrorOS provides the *memory infrastructure*
- Together: AI that thinks reflectively AND remembers contextually

**In practice**:
```python
from activemirror import ActiveMirror

# Create mirror with LingOS Lite mode
mirror = ActiveMirror(dialogue_mode="exploratory")  # LingOS Lite mode

session = mirror.create_session("project-planning")

# LingOS Lite patterns automatically applied
session.add_message("user", "Let's plan the architecture")
# Response uses Exploratory mode: uncertainty markers, questions, curiosity

# Switch modes mid-conversation
session.set_dialogue_mode("analytical")
session.add_message("user", "Now let's analyze trade-offs")
# Response uses Analytical mode: systematic, comparative, structured

# All stored in persistent memory (ActiveMirrorOS)
# All communicated reflectively (LingOS Lite)
```

See `/docs/reflective-behaviors.md` for all LingOS Lite modes:
- **Exploratory**: Curious, uncertain, questioning
- **Analytical**: Systematic, structured, comparative
- **Creative**: Generative, divergent, playful
- **Strategic**: Goal-oriented, prioritizing, decisive

---

## Troubleshooting

### Web Demo

**Issue**: Page doesn't load
- **Solution**: Use `python3 -m http.server` instead of opening file directly (CORS issues)

**Issue**: Session doesn't persist
- **Solution**: Check browser console for localStorage errors. Try a different browser.

### CLI Demo

**Issue**: `python: command not found`
- **Solution**: Use `python3` instead of `python`

**Issue**: Can't write to logs directory
- **Solution**: Check permissions: `chmod +w demo/cli/logs`

### Mobile Demo

**Issue**: `npm install` fails
- **Solution**: Ensure Node.js 18+ installed. Try `npm cache clean --force`

**Issue**: Simulator won't start
- **Solution**: For iOS, ensure Xcode installed. For Android, ensure Android Studio and emulator configured.

---

## Next Steps

After trying the demos:

1. **Read the documentation**
   - `/docs/quickstart.md` - Get started with the SDK
   - `/docs/architecture.md` - Understand the system design
   - `/docs/api-reference.md` - Full SDK API

2. **Explore the SDKs**
   - `/sdk/python/` - Python implementation
   - `/sdk/javascript/` - JavaScript/Node.js implementation

3. **Check out example apps**
   - `/apps/example-cli/` - Production CLI journaling tool
   - `/apps/example-desktop/` - Electron desktop app
   - `/apps/example-mobile/` - React Native mobile app

4. **Build something**
   - Start with `/examples/` for Python code samples
   - Reference the SDK docs
   - Join GitHub Discussions for help

---

## Philosophy

These demos embody ActiveMirrorOS core principles:

1. **Memory is fundamental** - See how persistence changes interaction
2. **Privacy first** - All data local, no network calls in demos
3. **Simplicity** - Clear, understandable code you can modify
4. **No lock-in** - Plain JSON/localStorage, easy to export
5. **Transparency** - See the reflection process, inspect the logs

---

## Contributing

Want to improve the demos?

- Add new features
- Improve the UI
- Create additional demos (Discord bot, Slack app, etc.)
- Write tutorials

See `/CONTRIBUTING.md` for guidelines.

---

**ActiveMirrorOS** - Intelligence that remembers is intelligence that grows.
