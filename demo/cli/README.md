# ActiveMirrorOS CLI Demo

**Reflection over Prediction** — A command-line interface for reflective journaling and memory.

## What This Demo Shows

The CLI demonstrates ActiveMirrorOS in a terminal environment:

- **Journal Entries**: Timestamped thoughts and reflections
- **Reflective Prompts**: LingOS Lite-style questioning
- **Vault Storage**: Encrypted private data storage
- **Session Continuity**: Local persistence across CLI sessions
- **Power User Workflow**: Fast, keyboard-driven interaction

## Quick Start

```bash
cd demo/cli

# Make executable
chmod +x amos-demo.js

# Run demo
./amos-demo.js write "My first reflection"
```

Or use the full CLI tool:

```bash
cd ../../apps/example-cli

# Install and link
npm install
chmod +x amos-cli.js
npm link

# Now use globally
amos write "Hello, ActiveMirrorOS"
```

## Commands

### Journaling

```bash
# Write a journal entry
./amos-demo.js write "Today I explored reflective AI patterns"

# Generate a reflection
./amos-demo.js reflect "What is meaningful work?"

# List recent entries
./amos-demo.js list

# Show specific entry
./amos-demo.js show <entry-id>
```

### Vault (Private Storage)

```bash
# Store private data
./amos-demo.js vault store "goal" "Build something meaningful"

# Retrieve data
./amos-demo.js vault get "goal"

# List all keys
./amos-demo.js vault list
```

## Example Session

```bash
$ ./amos-demo.js write "Feeling energized about the project"
✓ Entry saved: entry_1732464012_x7k2m

$ ./amos-demo.js reflect "What patterns am I noticing?"
◈ Reflection:

⟨medium⟩ You're asking about patterns — that suggests you're
observing your own process. What specific thread catches your
attention when you step back?

$ ./amos-demo.js list 5
Recent entries:
  entry_1732464012_x7k2m - "Feeling energized about the project"
  entry_1732464001_p9n4j - "What patterns am I noticing?"
  ...
```

## Features

✦ **Fast Entry** — Write thoughts in seconds
✦ **Reflective Responses** — LingOS Lite questioning style
✦ **Local Storage** — All data in `./.amos_data/`
✦ **Encrypted Vault** — Private data with AES-256-GCM
✦ **Session History** — Review past entries anytime
✦ **No Dependencies** — Single file, pure Node.js

## Data Storage

All data stored locally in `./.amos_data/`:

```
.amos_data/
├── entries.json          # Journal entries
└── vault/
    └── vault.json        # Encrypted vault data
```

## Use Cases

### Morning Journal

```bash
amos write "Three priorities: 1) Code review 2) Documentation 3) Testing"
```

### Evening Reflection

```bash
amos reflect "What did I learn today?"
```

### Strategic Planning

```bash
amos vault store "Q1_goals" "Launch v1.0, build community, write docs"
amos vault get "Q1_goals"
```

### Review Progress

```bash
amos list 30
```

## Customization

### Connect Real LLM

Edit `amos-demo.js` to replace the reflection logic:

```javascript
async function generateReflection(topic) {
  const response = await fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: topic })
  });

  return await response.text();
}
```

### Change Data Location

```javascript
// In amos-demo.js
const DATA_DIR = process.env.AMOS_DATA_DIR || './.amos_data';
```

### Add Commands

```javascript
// Add new command handler
if (command === 'search') {
  const query = args[0];
  searchEntries(query);
}
```

## Integration with Full SDK

For advanced features, integrate the JavaScript SDK:

```javascript
#!/usr/bin/env node
import { ActiveMirror } from '@activemirror/sdk';

const mirror = new ActiveMirror({
  storagePath: './.amos_data',
  storageType: 'json'
});

const session = mirror.createSession('cli-session');
session.addMessage('user', process.argv[2]);

console.log(session.getContext());
```

## Why CLI?

The command line is ideal for:

1. **Speed** — No UI overhead, instant capture
2. **Automation** — Scriptable, pipeable, composable
3. **Power Users** — Terminal-native workflows
4. **Simplicity** — No frameworks, just Node.js

## Advanced Usage

### Piping

```bash
# Pipe input
echo "My thought" | ./amos-demo.js write

# Export entries
./amos-demo.js list 100 > journal_backup.txt
```

### Aliases

```bash
# Add to .bashrc or .zshrc
alias j='amos write'
alias r='amos reflect'
alias jl='amos list'

# Then use
j "Quick thought"
r "What's important now?"
```

### Cron Jobs

```bash
# Daily reminder
0 9 * * * amos reflect "What are today's priorities?"

# Weekly review
0 18 * * 5 amos list 50 | mail -s "Weekly Journal" you@example.com
```

## Tech Stack

- **Node.js** — Runtime (no transpilation needed)
- **Pure JavaScript** — No external dependencies
- **JSON Storage** — Simple, readable persistence
- **Built-in crypto** — For vault encryption

## Troubleshooting

### Permission Denied

```bash
chmod +x amos-demo.js
```

### Node Not Found

Ensure Node.js is installed:
```bash
node --version  # Should be 18+
```

### Data Directory Issues

```bash
# Manually create
mkdir -p .amos_data/vault

# Check permissions
ls -la .amos_data
```

## Full CLI Tool

For the complete implementation with all features, use:

```bash
cd ../../apps/example-cli
npm install
npm link
amos --help
```

## License

MIT — see [../../LICENSE](../../LICENSE)

---

**Part of the ActiveMirrorOS Demo Suite**
Explore: [Web Demo](../web/) • [Mobile Demo](../mobile/) • [Full Documentation](../../docs/)
