# ActiveMirrorOS

**AI that remembers. AI that grows. AI that's yours.**

ActiveMirrorOS is the product home for intelligent, persistent AI experiences. It's where memory meets reflection, where conversations continue across time, and where AI becomes a true partner in your thinking.

---

## What is ActiveMirrorOS?

ActiveMirrorOS is a **memory-first operating system for AI interactions**. Unlike traditional AI that forgets after each conversation, ActiveMirrorOS maintains continuity, learns from context, and evolves with you.

Think of it as:
- **Your AI's long-term memory** — conversations persist across sessions, devices, and time
- **A reflection layer** — AI that can think about its own patterns and improve
- **A trust framework** — your data stays local, encrypted, and under your control

---

## The Ecosystem

ActiveMirrorOS is part of the **MirrorDNA Reflection Protocol** ecosystem:

| Component | Purpose | Relationship |
|-----------|---------|--------------|
| **[MirrorDNA-Standard](https://github.com/MirrorDNA-Reflection-Protocol/MirrorDNA-Standard)** | Core protocol specification | **Architecture foundation** — defines the standard |
| **ActiveMirrorOS** (this repo) | Product SDK & apps | **Experience layer** — implements the standard |
| **[LingOS](https://github.com/MirrorDNA-Reflection-Protocol/LingOS)** | Reflective AI dialogue framework | **Thinking patterns** — powers conversational intelligence |
| **TrustByDesign** | Privacy & security framework | **Security foundation** — ensures data sovereignty |

```
┌─────────────────────────────────────────┐
│         MirrorDNA-Standard              │  ← Protocol Layer
│      (Architecture & Specs)             │
└─────────────────┬───────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
┌────────▼─────────┐  ┌───▼──────────────┐
│   LingOS          │  │ TrustByDesign    │  ← Capability Layers
│  (Reflection)     │  │  (Security)      │
└────────┬─────────┘  └───┬──────────────┘
         │                │
         └────────┬───────┘
                  │
         ┌────────▼─────────┐
         │  ActiveMirrorOS  │                ← Product Layer
         │  (SDK & Apps)    │
         └──────────────────┘
```

---

## Quickstart Demo

### One-Line Try (Copy-Paste)

**Python** (try it now):
```bash
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git && cd ActiveMirrorOS/sdk/python && pip install -e . && python -c "from activemirror import ActiveMirror; m = ActiveMirror(storage_type='sqlite', db_path='demo.db'); s = m.create_session('quickstart'); s.add_message('user', 'Remember: I love hiking'); s.add_message('assistant', 'Noted! I will remember your interest in hiking.'); print('✓ Session created with memory!'); print(s.get_context())"
```

**JavaScript** (try it now):
```bash
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git && cd ActiveMirrorOS/sdk/javascript && npm install && node -e "const {ActiveMirror} = require('./index.js'); const m = new ActiveMirror('./demo-data'); const s = m.createSession('quickstart'); s.addMessage('user', 'Remember: I love hiking'); s.addMessage('assistant', 'Noted! I will remember your interest in hiking.'); console.log('✓ Session created with memory!'); console.log(m.listSessions());"
```

**CLI App** (interactive experience):
```bash
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git && cd ActiveMirrorOS/apps/example-cli && npm install && ./amos-cli.js write "What am I thinking about today?"
```

---

## Features

### Core Capabilities

- **Persistent Memory** — Three-tier architecture (RAM → Disk → Vault)
- **Cross-Session Continuity** — Pick up where you left off, anytime
- **Encrypted Storage** — AES-256-GCM for sensitive data
- **Local-First** — Your data stays on your device by default
- **Multi-Platform SDKs** — Python & JavaScript with feature parity
- **Reflective Dialogue** — LingOS Lite patterns with uncertainty markers
- **Zero Cloud Dependency** — Works offline, no API keys required

### Production-Ready

- **83 automated tests** across Python and JavaScript
- **Cross-platform apps** (CLI, Desktop, Mobile)
- **Complete documentation** with API references and examples
- **Version 0.2.0** — Production-ready release

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Application Layer                    │
│  (CLI, Desktop, Mobile, Web — Your Products)            │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   SDK Layer (Python/JS)                  │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐ │
│  │ ActiveMirror │  │ Session Mgmt  │  │ Memory Vault │ │
│  │    Core      │  │               │  │              │ │
│  └──────────────┘  └───────────────┘  └──────────────┘ │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  Storage Layer                           │
│  ┌─────────┐  ┌──────────┐  ┌────────────────────────┐ │
│  │ SQLite  │  │   JSON   │  │  Encrypted Vault       │ │
│  │ (Prod)  │  │ (Simple) │  │  (AES-256-GCM)         │ │
│  └─────────┘  └──────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Key Design Principles:**
1. Memory is fundamental
2. Privacy first (local by default)
3. No vendor lock-in
4. Simple, extensible, testable

---

## Screenshots & Demos

_Coming soon: Visual demos of CLI, Desktop, and Mobile apps_

📸 **CLI Journaling** — [See demo →](demo/demo_conversation.md)
📸 **Desktop Chat** — Electron-based persistent AI chat
📸 **Mobile Experience** — React Native cross-platform app
📸 **Reflective Dialogue** — [See showcase →](demo/demo_reflective_ai.md)

---

## Installation

### Choose Your Path

| Path | Command | Use Case |
|------|---------|----------|
| **Python SDK** | `pip install git+https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git#subdirectory=sdk/python` | Build Python AI apps |
| **JavaScript SDK** | `npm install MirrorDNA-Reflection-Protocol/ActiveMirrorOS#sdk/javascript` | Build Node.js/JS apps |
| **CLI Tool** | See [apps/example-cli](apps/example-cli/) | Try interactive journaling |
| **Desktop App** | See [apps/example-desktop](apps/example-desktop/) | Try Electron app |
| **Mobile App** | See [apps/example-mobile](apps/example-mobile/) | Try React Native app |

### Quick Install

**Python developers:**
```bash
cd sdk/python
pip install -e .
python -m pytest tests/  # Verify with 75 tests
```

**JavaScript developers:**
```bash
cd sdk/javascript
npm install
node --test tests/  # Verify with 8 tests
```

---

## Getting Started

### 5-Minute Tutorial

1. **Install**: Choose Python or JavaScript above
2. **Create**: Initialize your first mirror
3. **Session**: Start a persistent conversation
4. **Remember**: Add messages that persist forever
5. **Resume**: Load your session anytime, anywhere

**Python:**
```python
from activemirror import ActiveMirror

# Create mirror with persistent storage
mirror = ActiveMirror(storage_type="sqlite", db_path="my_memory.db")

# Start a session
session = mirror.create_session("my-first-session")

# Add memories
session.add_message("user", "I'm learning ActiveMirrorOS")
session.add_message("assistant", "Great! I'll remember our learning journey.")

# Resume later (even after restart)
loaded = mirror.load_session("my-first-session")
print(loaded.get_context())  # Full history preserved
```

**JavaScript:**
```javascript
const { ActiveMirror } = require('activemirror');

// Create mirror with JSON storage
const mirror = new ActiveMirror('./data');

// Start a session
const session = mirror.createSession('my-first-session');

// Add memories
session.addMessage('user', 'I am learning ActiveMirrorOS');
session.addMessage('assistant', 'Great! I will remember our learning journey.');

// Resume later
const loaded = mirror.loadSession('my-first-session');
console.log(loaded.messages);  // Full history preserved
```

---

## Documentation

| Resource | Description |
|----------|-------------|
| **[Getting Started](onboarding/getting_started.md)** | Complete onboarding guide |
| **[Product Overview](docs/product_overview.md)** | What, why, and how |
| **[API Reference](docs/api-reference.md)** | Complete SDK documentation |
| **[Architecture](docs/architecture.md)** | System design deep dive |
| **[FAQ](docs/faq.md)** | Common questions answered |
| **[Quickstart](docs/quickstart.md)** | 5-minute technical guide |
| **[Roadmap](docs/roadmap.md)** | Future plans and vision |

---

## Use Cases

### For Developers
- Build AI apps with persistent memory
- Create conversational interfaces that remember
- Implement privacy-first AI solutions
- Prototype quickly with ready-to-use SDKs

### For Product Teams
- Ship AI features with continuity
- Design experiences that evolve with users
- Maintain context across sessions
- Own your data and infrastructure

### For Researchers
- Study long-term AI interaction patterns
- Explore reflective dialogue systems
- Experiment with memory architectures
- Analyze conversation evolution over time

### For End Users
- AI journaling with memory
- Personal knowledge assistants
- Contextual task management
- Privacy-respecting AI companions

---

## Repository Structure

```
ActiveMirrorOS/
├── README.md                    # This file (product home)
├── sdk/
│   ├── python/                  # Python SDK (pip installable)
│   └── javascript/              # JavaScript SDK (npm installable)
├── apps/
│   ├── example-cli/             # CLI journaling tool
│   ├── example-desktop/         # Electron desktop app
│   └── example-mobile/          # React Native mobile app
├── demo/                        # Demo conversations & showcases
│   ├── demo_conversation.md
│   ├── demo_reflective_ai.md
│   └── demo_continuity_showcase.md
├── onboarding/                  # Getting started guides
│   ├── getting_started.md
│   ├── install_lingos_lite.md
│   ├── upgrade_to_lingos_pro.md
│   ├── glossary.md
│   └── troubleshooting.md
├── docs/                        # Complete documentation
│   ├── product_overview.md
│   ├── architecture.md
│   ├── api-reference.md
│   ├── roadmap.md
│   ├── faq.md
│   └── pricing.md
├── examples/                    # Python code examples
├── tests/                       # Test suite (83 tests)
└── scripts/
    └── generate_demo_package.py # Generate demo kits
```

---

## Related Repositories

| Repository | Description | Link |
|------------|-------------|------|
| **MirrorDNA-Standard** | Core protocol specification | [View →](https://github.com/MirrorDNA-Reflection-Protocol/MirrorDNA-Standard) |
| **LingOS** | Reflective AI framework | [View →](https://github.com/MirrorDNA-Reflection-Protocol/LingOS) |
| **LingOS-Lite** | Lightweight LingOS implementation | [View →](https://github.com/MirrorDNA-Reflection-Protocol/LingOS-Lite) |
| **TrustByDesign** | Privacy & security framework | [View →](https://github.com/MirrorDNA-Reflection-Protocol/TrustByDesign) |

---

## Contributing

We welcome contributions! Whether you're fixing bugs, adding features, improving docs, or building apps:

1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Check open [issues](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues)
3. Submit pull requests
4. Join [discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)

---

## Pricing & Licensing

**Open Source:** ActiveMirrorOS is MIT licensed — free forever.

**LingOS Lite:** Included, open source, no costs.

**LingOS Pro:** Advanced reflection capabilities (coming soon).
See [pricing.md](docs/pricing.md) for enterprise and commercial options.

---

## Community & Support

- **Documentation**: [/docs](docs/)
- **Issues**: [GitHub Issues](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)
- **Updates**: [CHANGELOG.md](CHANGELOG.md)

---

## Roadmap Highlights

**v0.2.0** (Current) — Production-ready release
- ✅ Cross-platform SDKs (Python + JavaScript)
- ✅ Encrypted vault storage
- ✅ 83 automated tests
- ✅ Example apps (CLI, Desktop, Mobile)

**v0.3.0** (Planned) — Enhanced reflection
- 🔄 Advanced LingOS integration
- 🔄 Real-time sync capabilities
- 🔄 Plugin architecture
- 🔄 Cloud backup options

See [roadmap.md](docs/roadmap.md) for the complete vision.

---

## Philosophy

**Memory is fundamental** — AI without memory is just a parlor trick.

**Privacy first** — Your thoughts belong to you, not a cloud provider.

**Local by default** — Run on your machine, sync on your terms.

**Open and extensible** — Built to be modified, forked, and improved.

**No lock-in** — Works without paid APIs or proprietary services.

---

## Quick Links

- [Get Started in 5 Minutes](onboarding/getting_started.md)
- [Try the Demo](demo/demo_conversation.md)
- [Read the Docs](docs/product_overview.md)
- [Install LingOS Lite](onboarding/install_lingos_lite.md)
- [View Examples](examples/)
- [Check Roadmap](docs/roadmap.md)

---

## Version

**Current:** v0.2.0 (Production-ready)
**License:** MIT
**Status:** ✅ Ready for production use

---

**ActiveMirrorOS** — *Intelligence that remembers is intelligence that grows.*

Copyright © 2025 MirrorDNA-Reflection-Protocol
