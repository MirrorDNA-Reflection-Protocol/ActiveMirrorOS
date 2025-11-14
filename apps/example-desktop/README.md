# ActiveMirror Desktop

Electron-based desktop application for ActiveMirrorOS with persistent memory and reflective dialogue.

## Features

- **Chat Interface**: Clean, modern chat UI
- **Session Management**: Create and switch between conversation sessions
- **Persistent Memory**: All conversations saved locally
- **Reflective Patterns**: LingOS Lite-style responses with uncertainty markers
- **Session History**: Left sidebar shows all past conversations
- **Offline-First**: No internet required, all data local

## Screenshots

```
┌─────────────────────────────────────────────────────────────┐
│ ◈ Sessions        │  ActiveMirror              │ ⬡ Patterns │
├───────────────────┼────────────────────────────┼────────────┤
│ • Today's Journal │  Intelligence that         │ ◊ Exploratory │
│ • Strategic Plan  │  remembers                 │ ✦ Analytical  │
│ • Deep Reflection │                            │ ★ Creative    │
│                   │  [Chat Messages]           │ ⬢ Strategic   │
│ [+ New]           │                            │             │
│                   │  [Message Input]  [Send ✦] │ Session Stats │
└─────────────────────────────────────────────────────────────┘
```

## Installation

```bash
cd apps/example-desktop

# Install dependencies
npm install

# Run in development
npm start

# Build for production
npm run build
```

## Usage

1. **Create Session**: Click "+ New" in the sidebar
2. **Send Messages**: Type in the input box and press Enter or click Send
3. **Switch Sessions**: Click any session in the sidebar
4. **View Reflections**: AI responses include uncertainty markers (⟨⟩)

## Data Storage

All data is stored locally in Electron's user data directory:

- **macOS**: `~/Library/Application Support/activemirror-desktop/`
- **Windows**: `%APPDATA%\activemirror-desktop\`
- **Linux**: `~/.config/activemirror-desktop/`

Data file: `memory.json` contains all sessions and messages.

## Customization

### Connecting Real LLM

Replace the stub in `main.js`:

```javascript
function generateResponse(message, history) {
  // Replace with actual LLM API call
  // e.g., OpenAI, Anthropic, local model
  return await callYourLLM(message, history);
}
```

### Styling

Edit `styles.css` to customize the appearance.

### Adding Features

- Add new panels in `index.html`
- Handle new IPC calls in `main.js`
- Update UI in `renderer.js`

## Integration with SDK

Use the full ActiveMirrorOS SDK:

```javascript
// In main.js
const { ActiveMirror } = require('@activemirror/sdk');

const mirror = new ActiveMirror({
  storagePath: path.join(app.getPath('userData'), 'memory')
});

await mirror.initialize();
```

## License

MIT - see [LICENSE](../../LICENSE)
