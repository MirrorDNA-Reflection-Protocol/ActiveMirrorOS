# ActiveMirrorOS Demo Suite

**Reflection over Prediction** — Explore ActiveMirrorOS through interactive demonstrations.

## Overview

The ActiveMirrorOS Demo Suite provides three ways to experience reflective AI conversation:

| Demo | Best For | Platform | Setup Time |
|------|----------|----------|------------|
| **[Web Demo](#web-demo)** | Quick browser testing | Any OS + browser | 2 minutes |
| **[Mobile Demo](#mobile-demo)** | Mobile experience | iOS/Android | 5 minutes |
| **[CLI Demo](#cli-demo)** | Power users, automation | Terminal | 1 minute |

All demos are **local-only** and use **simulated responses** — no AI API required.

---

## Web Demo

**Path**: `/demo/web/`
**Tech**: React + Vite
**Best for**: Quick exploration, sharing with non-technical users

### Features

✦ **Three Dialogue Modes**: Normal, Reflective, Adversarial
✦ **LingOS Lite Toggle**: Switch uncertainty markers on/off
✦ **Real-time Interaction**: Chat-like interface
✦ **Session Tracking**: See interaction count grow
✦ **Browser-Based**: No installation beyond Node.js

### Quick Start

```bash
cd demo/web
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

### What to Try

1. **Toggle LingOS Lite** — Notice how responses change:
   - **OFF**: Direct, assertive answers
   - **ON**: More questions, uncertainty markers ⟨⟩, reflective paraphrases

2. **Cycle Through Modes** — Click the mode button:
   - **Normal**: Standard conversational tone
   - **Reflective**: Deep exploration, more pauses
   - **Adversarial**: Challenges assumptions, tests ideas

3. **Have a Conversation** — Ask questions, share thoughts, observe patterns

### Technical Details

- **Framework**: React 18 with Vite 5
- **Styling**: Pure CSS, no frameworks
- **State**: React hooks (useState)
- **Persistence**: None (demo only — add localStorage if desired)
- **Size**: ~50KB bundle (minified)

---

## Mobile Demo

**Path**: `/demo/mobile/`
**Tech**: React Native + Expo
**Best for**: Testing mobile workflows, on-device journaling

### Features

✦ **Native Mobile UI**: Optimized for touch
✦ **Persistent Storage**: AsyncStorage for local data
✦ **Session Continuity**: Pick up where you left off
✦ **Cross-Platform**: iOS, Android, and web
✦ **Offline-First**: No internet required

### Quick Start

```bash
cd demo/mobile
npm install
npm start
```

Then:
- Press **`i`** for iOS Simulator (Mac only)
- Press **`a`** for Android Emulator
- Scan QR code with **Expo Go** app (physical device)
- Press **`w`** for web preview

### What to Try

1. **Write Reflections** — Type thoughts, see reflective responses
2. **Close & Reopen** — Notice messages persist
3. **Track Continuity** — Watch interaction counter increase
4. **Clear Session** — Start fresh anytime

### Technical Details

- **Framework**: React Native 0.73 with Expo 50
- **Storage**: AsyncStorage (iOS Keychain, Android SharedPreferences)
- **Components**: Pure React Native, no UI libraries
- **Bundle Size**: ~1.2MB (dev), ~300KB (production)
- **Targets**: iOS 13+, Android 5.0+

---

## CLI Demo

**Path**: `/demo/cli/`
**Tech**: Pure Node.js (no dependencies)
**Best for**: Terminal users, automation, scripting

### Features

✦ **Fast Entry**: Write thoughts in seconds
✦ **Journaling**: Timestamped entries
✦ **Reflections**: LingOS Lite-style responses
✦ **Vault Storage**: Simple key-value persistence
✦ **Scriptable**: Pipe, alias, automate

### Quick Start

```bash
cd demo/cli
chmod +x amos-demo.js
./amos-demo.js write "My first reflection"
```

### What to Try

```bash
# Write journal entry
./amos-demo.js write "Today I explored reflective AI patterns"

# Generate reflection
./amos-demo.js reflect "What is meaningful work?"

# List entries
./amos-demo.js list 10

# Store private data
./amos-demo.js vault store "goal" "Build meaningful tech"

# Retrieve data
./amos-demo.js vault get "goal"
```

### Advanced Usage

**Aliases** (add to `.bashrc` or `.zshrc`):
```bash
alias j='cd /path/to/demo/cli && ./amos-demo.js write'
alias r='cd /path/to/demo/cli && ./amos-demo.js reflect'
```

**Piping**:
```bash
echo "Quick thought" | ./amos-demo.js write
./amos-demo.js list 100 > backup.txt
```

**Cron Jobs**:
```bash
# Daily reflection prompt
0 9 * * * cd /path/to/demo/cli && ./amos-demo.js reflect "What are today's priorities?"
```

### Technical Details

- **Runtime**: Node.js (no transpilation)
- **Dependencies**: None (uses built-in modules)
- **Storage**: JSON files in `./.amos_data/`
- **Size**: Single 9KB file
- **Encryption**: Built-in crypto for vault

---

## Comparison Matrix

| Feature | Web | Mobile | CLI |
|---------|-----|--------|-----|
| **Setup Time** | 2 min | 5 min | 1 min |
| **Internet Required** | No* | No | No |
| **Persistence** | Optional** | Yes | Yes |
| **Mode Switching** | Yes | No*** | No*** |
| **LingOS Toggle** | Yes | No*** | No*** |
| **Session Tracking** | Yes | Yes | Yes |
| **Vault Storage** | No*** | No*** | Yes |
| **Automation** | No | No | Yes |
| **Touch Optimized** | No | Yes | No |

*Only for initial npm install
**Add localStorage easily
***Easy to add — see customization sections in READMEs

---

## Recommended First Path

**For New Users**:
1. **Start with Web Demo** — Fastest way to see features
2. **Try CLI Demo** — Experience journaling workflow
3. **Explore Mobile Demo** — If building mobile apps

**For Developers**:
1. **Clone repo** and read `/docs/architecture.md`
2. **Run Web Demo** to understand interaction patterns
3. **Inspect code** in `/demo/web/src/App.jsx`
4. **Review SDKs** in `/sdk/python/` and `/sdk/javascript/`
5. **Build your own** using the SDK

**For Product Teams**:
1. **Web Demo** — Show stakeholders the experience
2. **Mobile Demo** — Demonstrate mobile use cases
3. **Review** `/docs/quickstart.md` for integration
4. **Plan** how to integrate SDK into your product

---

## What These Demos Simulate

All demos use **rule-based responses** to demonstrate:

### LingOS Lite Patterns

1. **Uncertainty Markers**
   - `⟨low⟩` — Minor uncertainty, seeking clarification
   - `⟨medium⟩` — Moderate uncertainty, needs more context
   - `⟨high⟩` — High uncertainty, significant unknowns

2. **Reflective Questions**
   - "What aspect feels most significant?"
   - "Could you say more about...?"
   - "What emerges when you pause with this?"

3. **Paraphrasing**
   - Mirroring back user's words
   - Checking understanding
   - Inviting deeper exploration

### Why Simulation?

These demos **intentionally avoid real AI** to show:
- How the **patterns work** independent of LLM choice
- That **reflection ≠ prediction** — it's about questions, not answers
- How to **structure dialogue** for thoughtful interaction

For real LLM integration, see "Customization" sections in each demo's README.

---

## Next Steps

### Use the Full SDK

All demos can integrate the JavaScript or Python SDK:

**JavaScript**:
```bash
cd sdk/javascript
npm install
npm link
```

Then in your demo:
```javascript
import { ActiveMirror } from '@activemirror/sdk';

const mirror = new ActiveMirror('./data');
const session = mirror.createSession('demo-session');
```

**Python**:
```bash
cd sdk/python
pip install -e .
```

Then:
```python
from activemirror import ActiveMirror

mirror = ActiveMirror(storage_type="sqlite", db_path="demo.db")
session = mirror.create_session("demo-session")
```

### Explore Full Apps

Beyond demos, see production-ready apps:

- **Desktop**: `/apps/example-desktop/` — Electron chat app
- **Mobile**: `/apps/example-mobile/` — Full React Native app
- **CLI**: `/apps/example-cli/` — Complete CLI tool

### Read Documentation

- [Quickstart Guide](./quickstart.md) — 5-minute integration
- [Architecture](./architecture.md) — System design
- [API Reference](./api-reference.md) — Complete SDK docs
- [Reflective Behaviors](./reflective-behaviors.md) — LingOS Lite patterns

---

## Troubleshooting

### Web Demo Won't Start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Mobile Demo QR Code Not Working

```bash
# Try tunnel mode
npm start -- --tunnel

# Or use web preview
npm run web
```

### CLI Demo Permission Denied

```bash
chmod +x demo/cli/amos-demo.js
```

### General Node.js Issues

Ensure Node.js 18+ is installed:
```bash
node --version  # Should be v18.0.0 or higher
```

---

## Contributing

Found a bug? Want to improve a demo? See [CONTRIBUTING.md](../CONTRIBUTING.md).

Ideas for enhancements:
- [ ] Add localStorage to web demo
- [ ] Add mode switching to mobile demo
- [ ] Add export to markdown/PDF in all demos
- [ ] Create video demo mode

---

## License

MIT — see [LICENSE](../LICENSE)

---

**Questions?**
- Documentation: [/docs/](.)
- Issues: [GitHub Issues](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues)
- Discussions: [GitHub Discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)

**ActiveMirrorOS** — Intelligence that remembers is intelligence that grows.
