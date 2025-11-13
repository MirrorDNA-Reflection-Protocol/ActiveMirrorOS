# ActiveMirrorOS Starter Kit

Quick start template for building with ActiveMirrorOS.

## What's Included

- Pre-configured setup for common use cases
- Sample configuration files
- Basic integration examples
- Development scripts

## Quick Start

### 1. Install ActiveMirrorOS

```bash
pip install activemirror
```

Or install from source:

```bash
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
cd ActiveMirrorOS
pip install -e .
```

### 2. Copy This Kit

```bash
cp -r products/starter-kit/ my-activemirror-app/
cd my-activemirror-app/
```

### 3. Run Example

```bash
python simple_app.py
```

## Configuration

The kit includes a pre-configured `config.yaml`:

```yaml
storage:
  type: sqlite
  db_path: ./data/starter_memories.db

memory:
  max_context_messages: 30
  enable_semantic_memory: true

identity:
  type: anonymous
```

Modify this file to customize behavior.

## What to Build Next

### Personal Assistant

```python
from activemirror import ActiveMirror

mirror = ActiveMirror.from_config("config.yaml")
session = mirror.create_session(title="My Assistant")

# Your assistant logic here
```

### Chatbot with Memory

```python
# Web endpoint that maintains conversation history
# across multiple user interactions
```

### Research Tool

```python
# Accumulate knowledge over multiple research sessions
# with semantic memory
```

## Next Steps

1. **Explore Examples**: Check out [examples/](../../examples/)
2. **Read Docs**: See [docs/](../../docs/) for detailed guides
3. **Customize**: Modify the configuration for your needs
4. **Build**: Create your application!

## Support

- GitHub Issues: Bug reports and questions
- Documentation: Full docs in main repository
- Examples: Additional examples in repo

## License

MIT License - see main repository LICENSE file
