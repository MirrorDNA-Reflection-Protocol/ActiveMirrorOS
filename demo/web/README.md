# ActiveMirrorOS Web Demo

A simple, interactive web demonstration of ActiveMirrorOS core concepts: **reflective interaction**, **continuity**, and **local-first storage**.

## Quick Start

No installation or dependencies required! Just open in a browser:

```bash
# Option 1: Direct file open
open index.html

# Option 2: Simple HTTP server (recommended)
python3 -m http.server 8000
# Then visit: http://localhost:8000

# Option 3: Node.js server
npx http-server -p 8000
```

## What This Demo Shows

### 1. Reflective Interaction
- **Before responding**, the system shows a "reflection" step
- Demonstrates the AI thinking process transparently
- Based on LingOS Lite reflective dialogue patterns

### 2. Continuity
- **Every interaction is logged** in the Continuity panel
- The system references past interactions in responses
- Try asking: "What have I told you so far?"

### 3. Local-First Storage
- **All data stays in your browser** (localStorage)
- No network calls, no external dependencies
- Refresh the page - your session persists!

## Features

- **Zero Dependencies**: Pure HTML, CSS, and JavaScript
- **Persistent Memory**: Session automatically saved to browser
- **Responsive Design**: Works on desktop and mobile
- **Visual Feedback**: See the "thinking" process in real-time
- **Interaction History**: Track every exchange in the continuity log

## Try These Prompts

1. "What is ActiveMirrorOS?"
2. "What have I told you so far?"
3. "What patterns do you notice in our conversation?"
4. Type several messages, then refresh the page and ask about previous interactions

## Architecture

```
index.html          # Main HTML structure
├── styles.css      # Visual design and layout
└── app.js          # Core demo logic
    ├── Message handling
    ├── Reflection generation
    ├── Continuity tracking
    └── localStorage persistence
```

## How It Represents ActiveMirrorOS

This demo is a **simplified, browser-based simulation** that demonstrates the conceptual model:

| Demo Feature | Real ActiveMirrorOS |
|--------------|---------------------|
| localStorage | SQLite or JSON file storage |
| Reflection step | LingOS Lite dialogue patterns |
| Continuity log | Session persistence with context tracking |
| Simple pattern matching | LLM-powered responses with actual memory |

## Extending This Demo

### Connect a Real LLM

Replace the `generateResponse()` function in `app.js`:

```javascript
async generateResponse(userMessage) {
    const response = await fetch('YOUR_LLM_API', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: userMessage,
            history: this.messages
        })
    });

    const data = await response.json();
    return data.response;
}
```

### Use the ActiveMirror SDK

For production use, integrate the JavaScript SDK:

```bash
cd ../../sdk/javascript
npm install
npm link

# In your project
npm link @activemirror/sdk
```

Then:

```javascript
import { ActiveMirror } from '@activemirror/sdk';

const mirror = new ActiveMirror('./data');
const session = mirror.createSession('web-demo');
session.addMessage('user', userMessage);
```

## Limitations

This is a **demo**, not a production application:

- Uses simple pattern matching, not real AI
- localStorage is limited to ~5-10MB
- No encryption or vault features
- No session export or advanced features

For production features, see the full SDK at `/sdk/python` or `/sdk/javascript`.

## Next Steps

- **Try the CLI demo**: `cd ../cli && python demo_cli.py`
- **Explore the mobile app**: `cd ../../apps/example-mobile`
- **Read the docs**: `../../docs/quickstart.md`
- **Use the real SDK**: `../../sdk/`

## Philosophy

This demo embodies ActiveMirrorOS principles:

1. **Transparency**: You see the reflection process
2. **Continuity**: Conversations build on each other
3. **Local-First**: Your data, your machine
4. **Simplicity**: No complex setup, just open and use

---

**ActiveMirrorOS** - Intelligence that remembers is intelligence that grows.
