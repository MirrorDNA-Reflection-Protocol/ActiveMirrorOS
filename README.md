# ActiveMirrorOS

**Persistent AI memory for developers and users.**

ActiveMirrorOS is the product layer SDK for building AI applications with memory, context preservation, and reflective dialogue. Unlike traditional AI that forgets after each session, ActiveMirrorOS maintains continuity across conversations, sessions, and time.

---

## Quick Start

**Try the CLI** (fastest way to see it in action):
```bash
cd apps/example-cli
npm install
./amos-cli.js write "What did I learn today?"
```

**Use the Python SDK**:
```bash
cd sdk/python
pip install -e .
python -m pytest tests/  # Verify installation
```

**Use the JavaScript SDK**:
```bash
cd sdk/javascript
npm install
node --test tests/  # Verify installation
```

**Full documentation**: See [docs/quickstart.md](docs/quickstart.md)

---

## What Does It Do?

ActiveMirrorOS provides:

- **Persistent Memory**: Three-tier model (RAM → Disk → Encrypted Vault)
- **Session Management**: Intelligent context preservation across interactions
- **Cross-Platform SDKs**: Python and JavaScript with compatible APIs
- **Reflective Dialogue**: LingOS Lite patterns with uncertainty markers
- **Local-First**: Your data stays on your machine by default
- **Ready-to-Run Apps**: CLI, Desktop (Electron), Mobile (React Native)

---

## Who Is This For?

- **Developers** building AI apps that need memory
- **Product teams** creating persistent AI experiences
- **Researchers** exploring long-term AI interaction patterns
- **Anyone** who wants AI that remembers and evolves

---

## Where to Start

**New to ActiveMirrorOS?** Follow this path:

1. **Quick Try** → Run the [CLI example](#quick-start) to see it work (2 minutes)
2. **Understand** → Read the [Quickstart Guide](docs/quickstart.md) (10 minutes)
3. **Build** → Pick your SDK ([Python](sdk/python/) or [JavaScript](sdk/javascript/)) and integrate
4. **Deep Dive** → Explore [Architecture](docs/architecture.md) and [API Reference](docs/api-reference.md)
5. **Extend** → Check [examples/](examples/) for advanced patterns

**Just want to try it?** Jump to [Quick Start](#quick-start) below.

---

## Features

| Feature | Description |
|---------|-------------|
| **Persistent Memory** | Sessions saved to SQLite or JSON with automatic continuity |
| **Encrypted Vault** | AES-256-GCM for sensitive data with PBKDF2 key derivation |
| **Reflective Patterns** | 4 dialogue modes (Exploratory, Analytical, Creative, Strategic) |
| **Cross-Language** | Python & JavaScript SDKs with same capabilities |
| **Example Apps** | CLI journaling, Electron desktop, React Native mobile |
| **Local-First** | No cloud dependency, optional sync |
| **Extensible** | Plug your own storage, LLM providers, or extensions |

---

## Repository Structure

```
ActiveMirrorOS/
├── sdk/
│   ├── python/          # Python SDK + packaging
│   └── javascript/      # JavaScript/Node.js SDK
├── apps/
│   ├── example-cli/     # CLI journaling tool
│   ├── example-desktop/ # Electron chat app
│   └── example-mobile/  # React Native mobile app
├── docs/                # Complete documentation
├── examples/            # Python usage examples
└── tests/               # Test suite (83 tests)
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| [Quickstart](docs/quickstart.md) | Get started in 5 minutes |
| [Architecture](docs/architecture.md) | System design and components |
| [API Reference](docs/api-reference.md) | Complete SDK documentation |
| [State Persistence](docs/state-persistence.md) | Memory model deep dive |
| [Reflective Behaviors](docs/reflective-behaviors.md) | LingOS Lite patterns |

---

## Examples

### Python SDK Example

```python
from activemirror import ActiveMirror

# Create mirror with persistent storage
mirror = ActiveMirror(storage_type="sqlite", db_path="memory.db")

# Start a session
session = mirror.create_session("my-session")

# Add messages (automatically persisted)
session.add_message("user", "What is meaningful work?")
session.add_message("assistant", "Meaningful work combines purpose and impact...")

# Resume later
loaded = mirror.load_session("my-session")
print(loaded.get_context())  # Full conversation history
```

### JavaScript SDK Example

```javascript
const { ActiveMirror } = require('./activemirror');

// Create mirror with JSON storage
const mirror = new ActiveMirror('./data');

// Create and use session
const session = mirror.createSession('my-session');
session.addMessage('user', 'Tell me about persistent memory');

// Export session
mirror.exportSession('my-session', 'markdown');
```

---

## Development

### Run Tests

**Python** (75 tests):
```bash
cd sdk/python && python -m pytest tests/ -v
```

**JavaScript** (8 tests):
```bash
cd sdk/javascript && node --test tests/
```

### Build and Install

**Python Package**:
```bash
cd sdk/python
pip install -e .  # Editable install for development
```

**JavaScript Package**:
```bash
cd sdk/javascript
npm install
npm link  # For local development
```

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code style guidelines
- Testing requirements
- Pull request process
- Development setup

---

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features and version targets.

Current version: **v0.2.0** (Production-ready)

---

## Philosophy

ActiveMirrorOS is built on these principles:

1. **Memory is fundamental** — AI without memory is limited AI
2. **Privacy first** — Your data belongs to you, stored locally by default
3. **Simplicity over cleverness** — Clear, maintainable, understandable code
4. **No lock-in** — Works without paid APIs or cloud services
5. **Open and extensible** — Built to be modified and extended

---

## Part of the MirrorDNA Ecosystem

ActiveMirrorOS is the consumer OS layer within the broader MirrorDNA ecosystem:

- **MirrorDNA** — Core identity and continuity protocols for AI agents
- **LingOS** — Reflective dialogue framework with uncertainty markers and meta-cognition
- **ActiveMirrorOS** (this repo) — Product-ready SDK for building persistent AI applications
- **Glyphtrail** — Visual language system for AI communication patterns
- **TrustByDesign** — Security and privacy framework for AI systems

These components work together to enable AI experiences that are persistent, reflective, and trustworthy. ActiveMirrorOS provides the practical SDK layer that developers use to build applications with these capabilities.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

Copyright (c) 2025 MirrorDNA-Reflection-Protocol

---

## Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)

---

**ActiveMirrorOS** — Intelligence that remembers is intelligence that grows.
