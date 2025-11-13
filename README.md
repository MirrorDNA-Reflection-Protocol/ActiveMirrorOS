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

```bash
# Clone the repository
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
cd ActiveMirrorOS

# Install dependencies
pip install -e .

# Run a basic example
python examples/basic_session.py
```

## Core Features

- **Persistent Memory**: Conversations and context that survive across sessions
- **Identity Continuity**: Powered by MirrorDNA protocol for stable AI identity
- **Reflective Dialogue**: Natural, context-aware interactions via LingOS
- **Local-First**: Your data stays on your machine by default
- **Extensible**: Plug in your own storage, LLM providers, or extensions

## Architecture

ActiveMirrorOS operates as a coordination layer:

```
┌─────────────────────────────────────┐
│       User Application/Interface     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        ActiveMirrorOS Core          │
│  (Session, Memory, Orchestration)   │
├──────────────┬──────────────────────┤
│  MirrorDNA   │  LingOS  │  Storage  │
│  (Identity)  │ (Dialog) │  (Persist)│
└──────────────┴──────────────────────┘
```

See [docs/architecture.md](docs/architecture.md) for detailed design.

## Documentation

- **[Overview](docs/overview.md)** — High-level concepts and design philosophy
- **[Architecture](docs/architecture.md)** — System design and component interaction
- **[Integration Guide](docs/integration.md)** — How to integrate ActiveMirrorOS into your app
- **[Configuration](docs/configuration.md)** — Setup and customization options
- **[API Reference](docs/api.md)** — Programmatic interface documentation

## Examples

Check the `examples/` directory for practical use cases:
- `basic_session.py` — Simple conversation with memory
- `multi_session.py` — Continuity across multiple sessions
- `mirror_dna_integration.py` — Using MirrorDNA identity
- `custom_storage.py` — Implementing custom persistence

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

```bash
# Install development dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Run type checking
mypy src/

# Run linting
ruff check src/
```

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

This is an active development project. Core functionality is being built iteratively.

**Current Phase**: Foundation and core implementation
**API Stability**: Experimental — expect changes
**Production Ready**: Not yet — use for research and exploration

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
