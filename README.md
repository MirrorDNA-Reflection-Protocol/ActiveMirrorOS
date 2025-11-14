# ActiveMirrorOS

**AI that remembers. Intelligence that evolves.**

ActiveMirrorOS is the consumer operating system for AI applications with persistent memory. Unlike traditional AI that forgets after each conversation, ActiveMirrorOS maintains continuity across sessions, contexts, and time—enabling truly intelligent experiences that learn and grow with you.

---

## What This Gives You

**For Developers:**
- Build AI apps with persistent memory in minutes, not months
- Cross-platform SDKs (Python & JavaScript) with identical APIs
- Local-first architecture—no mandatory cloud dependencies
- Production-ready code with 83 passing tests
- Plug-and-play with any LLM (OpenAI, Claude, local models)

**For Users:**
- AI assistants that remember your preferences and context
- Conversations that build on previous interactions
- Privacy-first: your data stays on your device
- Reflective dialogue patterns that adapt to your thinking style
- Encrypted vault for sensitive information

**For Teams:**
- Shared context across team members
- Audit trails for AI interactions
- Extensible architecture for custom workflows
- No vendor lock-in to proprietary platforms

---

## Who This Is For

**🧑‍💻 Individual Developers**
Build personal AI tools, journaling apps, or research assistants with memory.

**👥 Teams & Startups**
Create collaborative AI products with shared context and persistence.

**🏢 Enterprises**
Deploy self-hosted AI systems with full data control and compliance.

---

## Try the Demo (2 Minutes)

Get hands-on with a working example:

```bash
# Clone the repository
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
cd ActiveMirrorOS

# Run the interactive demo
cd demo
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python demo_app.py
```

The demo shows:
- ✓ Reflective conversation flow
- ✓ Persistent memory across runs
- ✓ Continuity logging
- ✓ Simple but powerful patterns

**Or try the CLI tool** (zero setup):
```bash
cd apps/example-cli
npm install
./amos-cli.js write "What did I accomplish today?"
```

---

## What Is ActiveMirrorOS?

ActiveMirrorOS is the **product layer** of a broader AI persistence ecosystem:

### The Ecosystem Stack

```
┌─────────────────────────────────────────┐
│      ActiveMirrorOS (This Repo)         │  ← Consumer OS layer
│      Developer-friendly SDKs & Apps      │     You are here
├─────────────────────────────────────────┤
│           LingOS (Language OS)           │  ← Linguistic protocols
│      Reflective dialogue patterns        │     github.com/MirrorDNA-Reflection-Protocol/LingOS
├─────────────────────────────────────────┤
│      MirrorDNA (Persistence Standard)    │  ← Data format spec
│      Universal memory encoding           │     github.com/MirrorDNA-Reflection-Protocol/MirrorDNA-Standard
├─────────────────────────────────────────┤
│      TrustByDesign (Governance Layer)    │  ← Security & ethics
│      Cryptographic trust primitives      │     github.com/MirrorDNA-Reflection-Protocol/TrustByDesign
└─────────────────────────────────────────┘
```

**ActiveMirrorOS** = The practical implementation. Use this to build apps today.
**LingOS** = How AI communicates reflectively. Pattern library for dialogue.
**MirrorDNA** = The data standard. How memory is stored and transferred.
**TrustByDesign** = Security primitives. Cryptographic verification and provenance.

---

## Core Features

| Feature | What You Get |
|---------|-------------|
| **Persistent Memory** | Three-tier storage (RAM → SQLite → Encrypted Vault) |
| **Session Management** | Resume conversations anytime with full context |
| **Cross-Platform SDKs** | Python & JavaScript with feature parity |
| **Reflective Dialogue** | 4 thinking modes (Exploratory, Analytical, Creative, Strategic) |
| **Local-First Design** | Your data stays on your machine by default |
| **Encrypted Vault** | AES-256-GCM for sensitive data with PBKDF2 key derivation |
| **Ready-to-Run Apps** | CLI journal, Electron desktop, React Native mobile |
| **LLM Agnostic** | Works with OpenAI, Anthropic, local models, or no LLM at all |

---

## Quick Start Paths

### 1. Run the Demo (Fastest)
```bash
cd demo && python demo_app.py
```
See reflective AI in action with 3 example interactions.

### 2. Use the Python SDK
```bash
cd sdk/python
pip install -e .
python examples/basic_session.py
```

### 3. Use the JavaScript SDK
```bash
cd sdk/javascript
npm install
node examples/basic-session.js
```

### 4. Try the Example Apps
```bash
# CLI journaling tool
cd apps/example-cli && npm install && ./amos-cli.js

# Desktop chat app (Electron)
cd apps/example-desktop && npm install && npm start

# Mobile app (React Native)
cd apps/example-mobile && npm install && npm start
```

---

## Example Code

### Python: Create a Memory Session
```python
from activemirror import ActiveMirror

# Initialize with persistent storage
mirror = ActiveMirror(storage_type="sqlite", db_path="my_memory.db")

# Create a session
session = mirror.create_session("daily-journal")

# Add messages (auto-saved)
session.add_message("user", "What did I learn about Python today?")
session.add_message("assistant", "You explored decorators and context managers...")

# Resume days later
loaded = mirror.load_session("daily-journal")
print(loaded.get_context())  # Full conversation history
```

### JavaScript: Reflective Dialogue
```javascript
const { ReflectiveClient } = require('./activemirror');

const client = new ReflectiveClient('./memory');

// Use reflective patterns
const response = client.reflect(
  "How should I approach this problem?",
  { mode: 'analytical', uncertainty: 0.3 }
);

console.log(response.reflection);
// → "Let's break this into components... ~(confidence: 70%)"
```

---

## Documentation

| Document | Description |
|----------|-------------|
| **[🚀 Quickstart](docs/quickstart.md)** | Get started in 5 minutes |
| **[📘 Product Overview](docs/product_overview.md)** | Non-technical introduction |
| **[🏗️ Architecture](docs/architecture.md)** | System design and layers |
| **[📖 API Reference](docs/api-reference.md)** | Complete SDK documentation |
| **[💾 State Persistence](docs/state-persistence.md)** | How memory works |
| **[🔄 Reflective Behaviors](docs/reflective-behaviors.md)** | LingOS Lite patterns |
| **[❓ FAQ](docs/faq.md)** | Common questions answered |
| **[💰 Pricing](docs/pricing.md)** | Individual, Team, Enterprise options |

---

## Getting Started Resources

New to ActiveMirrorOS? Start here:

📚 **[Onboarding Guide](onboarding/getting_started.md)** — Step-by-step setup
🔧 **[Install LingOS Lite](onboarding/install_lingos_lite.md)** — Enable reflective patterns
⚡ **[Upgrade to LingOS Pro](onboarding/upgrade_to_lingos_pro.md)** — Advanced features
📖 **[Glossary](onboarding/glossary.md)** — Key terms explained
🔍 **[Troubleshooting](onboarding/troubleshooting.md)** — Common issues & fixes

---

## Ecosystem Links

**Core Repositories:**

- **[MirrorDNA-Standard](https://github.com/MirrorDNA-Reflection-Protocol/MirrorDNA-Standard)** — Universal memory format specification
- **[LingOS](https://github.com/MirrorDNA-Reflection-Protocol/LingOS)** — Linguistic operating system for reflective AI
- **[TrustByDesign](https://github.com/MirrorDNA-Reflection-Protocol/TrustByDesign)** — Cryptographic trust and governance layer
- **[Vault Manager](https://github.com/MirrorDNA-Reflection-Protocol/VaultManager)** — Encrypted memory storage system

**Developer Tools:**

- **[ActiveMirrorOS](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS)** ← You are here
- **[SDK Examples](sdk/)** — Python and JavaScript starter code
- **[Example Apps](apps/)** — CLI, Desktop, and Mobile templates

---

## Roadmap

See **[ROADMAP.md](docs/roadmap.md)** for detailed timeline.

**✅ v0.2.0 (Current)** — Production-ready SDKs, example apps, encryption
**🚧 v0.3.0 (Q1 2025)** — Enhanced search, tagging, memory insights
**📋 v0.4.0 (Q2 2025)** — Full LLM integration (OpenAI, Claude, local)
**🔄 v0.5.0 (Q3 2025)** — Multi-device sync with E2E encryption
**🎯 v1.0.0 (2026)** — Stable API, enterprise deployment, performance tuning

---

## Repository Structure

```
ActiveMirrorOS/
├── demo/                # ← START HERE: Working demo in 2 minutes
├── onboarding/          # Step-by-step guides for new users
├── sdk/
│   ├── python/          # Python SDK + examples
│   └── javascript/      # JavaScript SDK + examples
├── apps/
│   ├── example-cli/     # CLI journaling tool
│   ├── example-desktop/ # Electron chat app
│   └── example-mobile/  # React Native mobile app
├── docs/                # Complete documentation
├── scripts/             # Utilities (demo package generator, etc.)
└── tests/               # Test suite (83 tests)
```

---

## Philosophy

ActiveMirrorOS is built on these principles:

1. **Memory is fundamental** — AI without continuity is inherently limited
2. **Privacy first** — Your data belongs to you, stored locally by default
3. **Simplicity over cleverness** — Clear, maintainable, understandable code
4. **No lock-in** — Works without proprietary APIs or mandatory cloud services
5. **Open and extensible** — Built to be modified, forked, and adapted

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Ways to help:**
- Try the demo and report issues
- Add examples or tutorials
- Improve documentation
- Build integrations (LLM providers, storage backends)
- Share your use cases

---

## Development

### Run Tests
```bash
# Python (75 tests)
cd sdk/python && python -m pytest tests/ -v

# JavaScript (8 tests)
cd sdk/javascript && node --test tests/
```

### Build Demo Package
```bash
python scripts/generate_demo_package.py
# Creates: dist/active-mirror-demo-kit.zip
```

---

## Support & Community

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)

---

## License

MIT License — see [LICENSE](LICENSE) for details.

Copyright (c) 2025 MirrorDNA-Reflection-Protocol

---

**ActiveMirrorOS** — Intelligence that remembers is intelligence that grows.

*Start with the [demo](demo/) or jump into [onboarding](onboarding/getting_started.md) →*
