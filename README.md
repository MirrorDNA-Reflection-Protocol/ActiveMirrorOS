# ActiveMirrorOS

**Intelligence that remembers.**

ActiveMirrorOS is the consumer-facing product layer of the MirrorDNA ecosystem — a persistent, reflective AI experience that maintains continuity across conversations, sessions, and time. Unlike traditional AI interactions that forget after each session, ActiveMirrorOS creates a living memory that evolves with you.

## What is ActiveMirrorOS?

ActiveMirrorOS is an orchestration layer that brings together:
- **MirrorDNA**: Identity and continuity protocol for persistent AI memory
- **LingOS**: Language-native operating system for reflective dialogue
- **Session Management**: Intelligent context preservation across interactions
- **Memory Storage**: Secure, local-first persistence of conversations and insights

Think of it as an "operating system" for AI that remembers who you are, what you've discussed, and maintains context over days, weeks, or months.

## Who is this for?

- **Developers** building AI applications that need memory and continuity
- **Product teams** creating persistent AI experiences
- **Researchers** exploring long-term AI interaction patterns
- **Users** who want AI that remembers and evolves with them

## Quick Start

Choose your path:

**Try the CLI (fastest)**
```bash
cd apps/example-cli
./amos-cli.js write "What is meaningful work?"
```

**Python SDK**
```bash
cd sdk/python
pip install -e .
python -m pytest tests/  # Run tests
```

**JavaScript SDK**
```bash
cd sdk/javascript
npm install
node --test tests/  # Run tests
```

**Desktop App**
```bash
cd apps/example-desktop
npm install
npm start
```

**Mobile App**
```bash
cd apps/example-mobile
npm install
npm start
```

## Core Features

- **Persistent Memory**: Three-tier memory model (RAM → Disk → Vault)
- **Encrypted Vault**: AES-256-GCM encrypted storage for sensitive personal data
- **Reflective Dialogue**: LingOS Lite patterns with uncertainty markers and glyphs
- **Cross-Language SDKs**: Python and JavaScript with compatible data formats
- **Ready-to-Run Apps**: CLI journaling tool, Electron desktop, React Native mobile
- **Local-First**: Your data stays on your machine by default
- **Extensible**: Plug in your own storage, LLM providers, or extensions

## Architecture

```
ActiveMirrorOS/
├── sdk/
│   ├── python/          # Python SDK with packaging
│   └── javascript/      # JavaScript/Node.js SDK
├── apps/
│   ├── example-cli/     # Standalone journaling CLI
│   ├── example-desktop/ # Electron chat app
│   └── example-mobile/  # React Native mobile app
├── docs/                # 5 comprehensive docs
├── tests/               # Unit and integration tests
└── examples/            # Usage examples
```

**Three-Tier Memory Model:**
- **Session Memory (RAM)**: Active conversation context
- **Persistent Storage (Disk)**: JSON or SQLite storage
- **Vault Memory (Encrypted)**: AES-256-GCM for sensitive data

See [docs/architecture.md](docs/architecture.md) for detailed design.

## Documentation

- **[Quickstart](docs/quickstart.md)** — 5-minute getting started guide (5 different paths)
- **[Architecture](docs/architecture.md)** — System design, components, and memory model
- **[API Reference](docs/api-reference.md)** — Complete Python and JavaScript API docs
- **[State Persistence](docs/state-persistence.md)** — Deep dive into memory management
- **[Reflective Behaviors](docs/reflective-behaviors.md)** — LingOS Lite patterns and glyphs

## Examples

**Ready-to-Run Apps:**
- `apps/example-cli/` — CLI journaling tool (standalone, no dependencies)
- `apps/example-desktop/` — Electron desktop chat app with session history
- `apps/example-mobile/` — React Native mobile app with local persistence

**SDK Examples:**
- `examples/basic_session.py` — Simple Python conversation with memory
- `examples/multi_session.py` — Continuity across multiple sessions
- `examples/config_example.py` — Configuration and customization

## Ecosystem Integration

ActiveMirrorOS is part of a larger ecosystem:

| Component | Purpose | Relationship |
|-----------|---------|--------------|
| **MirrorDNA** | Identity & continuity protocol | Core dependency |
| **LingOS** | Reflective dialogue OS | Core dependency |
| **MirrorDNA-Standard** | Constitutional compliance | Used for governance |
| **AgentDNA** | Agent personality schemas | Optional integration |
| **Glyphtrail** | Interaction lineage logs | Optional integration |
| **TrustByDesign** | Safety & governance | Used for validation |

## Development

**Python SDK:**
```bash
cd sdk/python
pip install -e .
python -m pytest tests/ -v  # Run 75 Python tests
```

**JavaScript SDK:**
```bash
cd sdk/javascript
npm install
node --test tests/  # Run 8 JavaScript tests
```

**Test Coverage:**
- 75 Python tests (core SDK + reflective + vault)
- 8 JavaScript tests (memory store)
- All tests passing with production-ready implementations

## Products & Templates

The `products/` directory contains ready-to-use kits:
- **Starter Kit** — Basic ActiveMirrorOS integration
- **Enterprise Kit** — Production-ready deployment template
- **Research Kit** — Tools for studying long-term AI interactions

## Philosophy

ActiveMirrorOS is built on these principles:

1. **Memory is fundamental** — AI that forgets is limited AI
2. **Privacy first** — Your conversations and data belong to you
3. **Simplicity over cleverness** — Clear, maintainable, understandable code
4. **No external dependencies** — Works without paid APIs or cloud services
5. **Open and extensible** — Built to be modified and extended

## Status

**Current Phase**: Production-ready v0.2.0
**API Stability**: Stable — breaking changes will increment major version
**Production Ready**: Yes — comprehensive tests, docs, and example apps
**Last Updated**: November 2025

This repository provides:
- ✅ Cross-language SDKs (Python + JavaScript)
- ✅ Three ready-to-run example apps (CLI, Desktop, Mobile)
- ✅ Comprehensive documentation (5 docs covering all aspects)
- ✅ 83 passing tests across Python and JavaScript
- ✅ Encrypted vault memory with AES-256-GCM
- ✅ LingOS Lite reflective patterns
- ✅ Local-first architecture with optional sync

## Contributing

We welcome contributions! This repository is part of the MirrorDNA-Reflection-Protocol organization.

- Keep code simple and well-documented
- Add tests for new functionality
- Update docs when changing APIs
- Follow existing patterns and conventions

## License

MIT License — see [LICENSE](LICENSE) for details.

## Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Join conversations about design and usage
- **Documentation**: Contribute improvements to docs/

---

**ActiveMirrorOS** — Because intelligence that remembers is intelligence that grows.
