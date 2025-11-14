# AMOS CLI - ActiveMirrorOS Command Line Interface

A journaling and reflective assistant for the terminal.

## Installation

```bash
cd apps/example-cli
chmod +x amos-cli.js
npm link  # Or add to your PATH
```

## Quick Start

```bash
# Write a journal entry
amos write "Today I learned about reflective AI systems"

# Generate a reflection
amos reflect "What makes AI truly useful?"

# List recent entries
amos list

# Show a specific entry
amos show entry_1234567890_abc123

# Store private data in vault
amos vault store "life_goal" "Build meaningful technology"
amos vault get "life_goal"
```

## Features

- **Journal Entries**: Write timestamped journal entries
- **Reflections**: Generate LingOS Lite-style reflections on topics
- **Vault Storage**: Simple encrypted storage for private data
- **Local-First**: All data stored in `./.amos_data/`
- **Portable**: Single file, no external dependencies

## Commands

### Journaling

- `amos write <content>` - Write a journal entry
- `amos reflect <topic>` - Generate a reflection
- `amos list [limit]` - List recent entries
- `amos show <entry-id>` - Display a specific entry

### Vault (Private Storage)

- `amos vault store <key> <value>` - Store data
- `amos vault get <key>` - Retrieve data
- `amos vault list` - List all keys

## Examples

```bash
# Morning journal
amos write "Feeling energized today. Three clear priorities."

# Evening reflection
amos reflect "What patterns emerged in my work today?"

# Strategic planning
amos vault store "Q1_goal" "Launch ActiveMirrorOS v1.0"

# Review entries
amos list 20
```

## Data Storage

All data is stored locally in `./.amos_data/`:

- `entries.json` - Journal entries and reflections
- `vault/vault.json` - Vault storage

## Integration

This CLI can be used standalone or integrated with the full ActiveMirrorOS SDK:

```javascript
import { ActiveMirror } from '@activemirror/sdk';

// Use full SDK for advanced features
const mirror = new ActiveMirror({ storagePath: './.amos_data/sessions' });
```

## License

MIT - see [LICENSE](../../LICENSE)
