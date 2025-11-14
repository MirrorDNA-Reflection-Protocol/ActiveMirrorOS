# ActiveMirrorOS JavaScript SDK

The JavaScript/Node.js SDK for ActiveMirrorOS - a consumer OS layer for persistent, reflective AI experiences.

## Installation

```bash
npm install @activemirror/sdk
```

Or from source:

```bash
cd sdk/javascript
npm install
```

## Quick Start

```javascript
import { ActiveMirror, ReflectiveClient, VaultMemory } from '@activemirror/sdk';

// Create instance with persistent memory
const mirror = new ActiveMirror({ storagePath: './my_memory' });
await mirror.initialize();

// Start a reflective conversation
const session = await mirror.createSession('Daily Journal');
const response = await session.send("I'm feeling uncertain about my career path");

// Memory persists across sessions
await session.save();

// Later - resume the conversation
const loaded = await mirror.loadSession(session.id);
await loaded.send("I've been thinking more about what we discussed...");
```

## Features

- **Persistent Memory**: JSON file-based conversation storage
- **Reflective Client**: LingOS Lite pattern support
- **Session Management**: Create, save, resume conversations
- **Vault Memory**: Encrypted storage for sensitive data
- **Cross-platform**: Works in Node.js and modern browsers (with adapters)

## Reflective Client

```javascript
import { ReflectiveClient, ReflectivePattern } from '@activemirror/sdk';

const client = new ReflectiveClient();

const reflection = await client.reflect(
  "I accomplished three major goals today",
  { pattern: ReflectivePattern.EXPLORATORY }
);

console.log(reflection.response);
console.log(reflection.uncertainty);
console.log(reflection.meta);
```

## Vault Memory

```javascript
import { VaultMemory, VaultCategory } from '@activemirror/sdk';

const vault = new VaultMemory({ password: 'your-secure-password' });
await vault.initialize();

// Store encrypted data
await vault.store('personal_goal', 'Launch my startup by Q2', {
  category: VaultCategory.GOALS,
});

// Retrieve data
const goal = await vault.retrieve('personal_goal');
console.log(goal); // 'Launch my startup by Q2'

// Search vault
const results = await vault.search('startup');
```

## Examples

See the `examples/` directory for complete examples:

- `basic.js` - Simple conversation with memory
- `reflective.js` - Using the reflective client
- `vault.js` - Encrypted vault storage

## Documentation

See the main [docs](../../docs/) directory for complete documentation:

- [Architecture](../../docs/architecture.md)
- [API Reference](../../docs/api-reference.md)
- [Quickstart](../../docs/quickstart.md)

## License

MIT License - see [LICENSE](../../LICENSE) for details.
