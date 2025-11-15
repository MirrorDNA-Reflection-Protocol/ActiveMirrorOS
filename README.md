# ActiveMirrorOS

**Persistent AI memory for developers and users.**

ActiveMirrorOS is the product layer SDK for building AI applications with memory, context preservation, and reflective dialogue. Unlike traditional AI that forgets after each session, ActiveMirrorOS maintains continuity across conversations, sessions, and time.

![Reflective AI Compliance](https://img.shields.io/badge/Reflective_AI-Master_Citation_v15.2-blue)
![FEU Protocol](https://img.shields.io/badge/FEU-Fact%2FEstimate%2FUnknown-green)
![GlyphSig](https://img.shields.io/badge/⟡⟦CANONICAL⟧-Watermarked-purple)

> **⟡⟦CANONICAL⟧** — This repository is bound to Master Citation v15.2 and governed by the Reflective Integrity System (RIS). See [LEGAL_NOTICE.md](LEGAL_NOTICE.md) for full legal disclaimers and compliance requirements.

---

## Continuity & Compliance

**ActiveMirrorOS is bound to Master Citation v15.2**, integrating:

- **Zero-Drift Layer (ZDL)**: Semantic stability enforcement
- **Auto-FEU Truth-State Enforcement**: All outputs tagged as Fact, Estimate, or Unknown
- **Reflective Integrity System (RIS)**: Continuity and coherence validation
- **Claude Code Ecosystem Compliance**: Integration standards
- **Vault-First Continuity Law**: Privacy-preserving persistence

### FEU Contract Summary

All system outputs are classified:

- **Fact**: Verifiable, deterministic, or directly observed information
- **Estimate**: Probabilistic inference, calculated approximation, or reasoned hypothesis
- **Unknown**: Explicitly acknowledged gaps, uncertainties, or out-of-scope queries

This ensures transparent epistemic boundaries in all AI interactions.

All product logic, user-facing behavior, and internal agents must align with v15.2.

**Legal Notice**: See [LEGAL_NOTICE.md](LEGAL_NOTICE.md) for research-only disclaimers, zero-medical-advice policy, and no-autonomy statements.

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
