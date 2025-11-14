# ActiveMirrorOS Examples

This directory contains practical examples demonstrating how to use ActiveMirrorOS.

## Examples

### 1. Basic Session (`basic_session.py`)

The simplest introduction to ActiveMirrorOS. Shows:
- Creating an ActiveMirror instance
- Starting a conversation session
- Sending messages and receiving responses
- Exporting session data

**Run it:**
```bash
python examples/basic_session.py
```

### 2. Multi-Session (`multi_session.py`)

Demonstrates session persistence and continuity. Shows:
- Using SQLite storage for persistence
- Creating multiple sessions
- Saving and loading sessions
- Session linking for continuity
- Listing all sessions
- Exporting sessions to files

**Run it:**
```bash
python examples/multi_session.py
```

This creates a SQLite database at `./data/example_memories.db` with persisted conversations.

### 3. Configuration (`config_example.py`)

Shows different ways to configure ActiveMirrorOS. Covers:
- Programmatic configuration
- File-based configuration (YAML)
- Environment variable configuration
- Configuration validation

**Run it:**
```bash
python examples/config_example.py
```

This creates an example configuration file at `./data/activemirror_example.yaml`.

## Running Examples

### Prerequisites

Install ActiveMirrorOS in development mode:

```bash
# From the repository root
pip install -e .

# Or with development dependencies
pip install -e ".[dev]"
```

### Running All Examples

```bash
# Run each example individually
python examples/basic_session.py
python examples/multi_session.py
python examples/config_example.py
```

### Expected Output

Each example prints its progress and results to the console. The multi-session and configuration examples also create files in `./data/`:

- `example_memories.db` - SQLite database with persisted sessions
- `session_export.txt` - Exported session in text format
- `activemirror_example.yaml` - Example configuration file

## Next Steps

After running these examples:

1. **Explore the API** - See [docs/api-reference.md](../docs/api-reference.md) for detailed API reference
2. **Read Architecture** - Check [docs/architecture.md](../docs/architecture.md) for system design
3. **Try Custom Storage** - Implement your own storage backend
4. **Build an Application** - Use ActiveMirrorOS in your own project

## Example Use Cases

### Personal Assistant

```python
from activemirror import ActiveMirror

mirror = ActiveMirror(storage_type="sqlite", db_path="./my_assistant.db")
session = mirror.create_session(title="Daily Planning")

# Ongoing conversation with memory
session.send("What did we discuss yesterday?")
session.send("Add dentist appointment to my schedule")
session.save()
```

### Research Tool

```python
# Session 1: Initial research
research_session = mirror.create_session(title="ML Research")
research_session.send("Exploring transformer architectures")

# Later: Continue research
session = mirror.load_session(research_session.id)
session.send("Let's dive deeper into attention mechanisms")
```

### Customer Support

```python
# Customer conversation with history
customer_id = "customer_123"
mirror = ActiveMirror(storage_type="postgresql")

# Resume previous support session
sessions = mirror.list_sessions(user_id=customer_id)
if sessions:
    session = mirror.load_session(sessions[0].session_id)
else:
    session = mirror.create_session(title="Support Session")

# Continue support with full context
session.send("Customer inquiry...")
```

## Troubleshooting

### Import Errors

If you see `ModuleNotFoundError: No module named 'activemirror'`:

```bash
# Make sure you've installed the package
cd /path/to/ActiveMirrorOS
pip install -e .
```

### SQLite Errors

If SQLite operations fail, ensure the data directory exists:

```bash
mkdir -p ./data
```

### Configuration Errors

Run the configuration example to validate your setup:

```bash
python examples/config_example.py
```

## Contributing Examples

Have a useful example? Contributions welcome!

1. Create a new example file in this directory
2. Add clear comments explaining what it demonstrates
3. Update this README with a description
4. Submit a pull request

## Support

- **Issues**: Report problems on GitHub
- **Documentation**: See [docs/](../docs/) directory
- **API Reference**: [docs/api-reference.md](../docs/api-reference.md)
