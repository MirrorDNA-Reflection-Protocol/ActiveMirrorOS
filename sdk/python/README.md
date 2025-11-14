# ActiveMirrorOS Python SDK

The Python SDK for ActiveMirrorOS - a consumer OS layer for persistent, reflective AI experiences.

## Installation

### From Source (Current)

```bash
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
cd ActiveMirrorOS/sdk/python
pip install -e .
```

### From PyPI (Coming Soon)

```bash
pip install activemirror
```

## Requirements

- Python 3.8 or higher
- Dependencies: `pyyaml>=6.0`, `cryptography>=41.0`

## Quick Start

```python
from activemirror import ActiveMirror

# Create instance with persistent memory
mirror = ActiveMirror(storage_type="sqlite", db_path="./my_memory.db")

# Start a reflective conversation
session = mirror.create_session(title="Daily Journal")
response = session.send("I'm feeling uncertain about my career path")

# Memory persists across sessions
session.save()

# Later - resume the conversation
loaded = mirror.load_session(session.id)
loaded.send("I've been thinking more about what we discussed...")
```

## Features

- **Persistent Memory**: SQLite-backed conversation storage
- **Reflective Client**: LingOS Lite pattern support
- **Session Management**: Create, save, resume conversations
- **Encryption**: Built-in encryption for sensitive data
- **Flexible Storage**: Multiple backend options

## Documentation

See the main [docs](../../docs/) directory for complete documentation:

- [Architecture](../../docs/architecture.md)
- [API Reference](../../docs/api-reference.md)
- [Quickstart](../../docs/quickstart.md)

## Examples

```python
# Reflective journaling
from activemirror import ReflectiveClient

client = ReflectiveClient()
reflection = client.reflect("I accomplished three major goals today")
# Returns formatted reflection with uncertainty markers

# Vault memory demo
from activemirror import VaultMemory

vault = VaultMemory(encryption_key="your-key")
vault.store("personal_goal", "Launch my startup by Q2")
vault.retrieve("personal_goal")
```

## Testing

Run the test suite:

```bash
# Install with dev dependencies
pip install -e ".[dev]"

# Run all tests
python -m pytest tests/ -v

# Run with coverage
python -m pytest tests/ --cov=activemirror --cov-report=html
```

## Development

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## Support

- **Documentation**: [../../docs/](../../docs/)
- **Issues**: [GitHub Issues](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues)
- **Main README**: [../../README.md](../../README.md)

## License

MIT License - see [LICENSE](../../LICENSE) for details.
