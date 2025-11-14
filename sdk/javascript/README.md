# ActiveMirrorOS JavaScript SDK

The JavaScript/Node.js SDK for ActiveMirrorOS - a consumer OS layer for persistent, reflective AI experiences.

## Installation

### From Source (Current)

```bash
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
cd ActiveMirrorOS/sdk/javascript
npm install
```

### From npm (Coming Soon)

```bash
npm install @activemirror/sdk
```

## Requirements

- Node.js 16 or higher
- No external dependencies (uses built-in crypto)

## Quick Start

```javascript
const { ActiveMirror } = require('./activemirror');

// Create instance with persistent memory
const mirror = new ActiveMirror('./my_memory');

// Create a session
const session = mirror.createSession('Daily Journal');

// Add messages to session
session.addMessage('user', "I'm feeling uncertain about my career path");
session.addMessage('assistant', "Let's explore what's causing this uncertainty...");

// Export session
mirror.exportSession(session.id, 'markdown');
```

## Features

- **Persistent Memory**: JSON file-based conversation storage
- **Reflective Client**: LingOS Lite pattern support
- **Session Management**: Create, save, resume conversations
- **Vault Memory**: Encrypted storage for sensitive data
- **Cross-platform**: Works in Node.js and modern browsers (with adapters)

## Reflective Client

```javascript
const { ReflectiveClient } = require('./reflective-client');

const client = new ReflectiveClient();

const reflection = client.generateReflection(
  "I accomplished three major goals today",
  'exploratory'
);

console.log(reflection.response);
console.log(reflection.uncertainty);
console.log(reflection.pattern);
```

## Vault Memory

```javascript
const { VaultMemory } = require('./vault');

const vault = new VaultMemory('./vault-data', 'your-secure-password');

// Store encrypted data
vault.store('personal_goal', 'Launch my startup by Q2');

// Retrieve data
const goal = vault.get('personal_goal');
console.log(goal); // 'Launch my startup by Q2'

// List all entries
const entries = vault.list();
```

## Documentation

See the main [docs](../../docs/) directory for complete documentation:

- [Architecture](../../docs/architecture.md)
- [API Reference](../../docs/api-reference.md)
- [Quickstart](../../docs/quickstart.md)

## Testing

Run the test suite:

```bash
# Install dependencies
npm install

# Run all tests
node --test tests/

# Run specific test
node --test tests/test_memory.js
```

## Development

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## Support

- **Documentation**: [../../docs/](../../docs/)
- **Issues**: [GitHub Issues](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues)
- **Main README**: [../../README.md](../../README.md)

## License

MIT License - see [LICENSE](../../LICENSE) for details.
