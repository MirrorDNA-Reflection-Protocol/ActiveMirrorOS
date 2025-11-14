# ActiveMirrorOS Web Demo

**Reflection over Prediction** — A browser-based demonstration of ActiveMirrorOS reflective dialogue patterns.

## What This Demo Shows

This interactive web application simulates how ActiveMirrorOS engages in reflective conversation:

- **Three Dialogue Modes**: Normal, Reflective, and Adversarial
- **LingOS Lite Toggle**: Switch between standard and uncertainty-aware responses
- **Local Simulation**: All responses are rule-based; no AI API calls needed
- **Clean Chat Interface**: See how the system maintains conversational flow

### LingOS Lite Features

When enabled, responses demonstrate:
- **More questions** — Clarifying and exploring rather than asserting
- **Explicit uncertainty** — Using ⟨low⟩, ⟨medium⟩, ⟨high⟩ markers
- **Reflective paraphrases** — Mirroring back user's thoughts for deeper exploration

## Installation

```bash
cd demo/web

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open in your browser at `http://localhost:3000`

## Build for Production

```bash
npm run build

# Preview production build
npm run preview
```

## How It Works

This is a **simulated demo** — responses are generated using simple rules, not real AI:

1. **Mode Selection**: Click the mode button to cycle through Normal → Reflective → Adversarial
2. **LingOS Toggle**: Enable/disable uncertainty markers and reflective patterns
3. **Type & Send**: Enter messages to see different response styles
4. **Session Tracking**: Watch the interaction counter increase

### Response Logic

```javascript
// Simplified logic
if (lingosLiteEnabled) {
  return reflectiveResponseWithUncertainty(message)
} else {
  return standardResponse(message)
}
```

## Customization

### Connect Real LLM

Replace the `generateResponse()` function in `src/App.jsx`:

```javascript
const generateResponse = async (userMessage, mode, lingosEnabled) => {
  const response = await fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userMessage,
      mode: mode,
      lingos_lite: lingosEnabled
    })
  })

  return await response.json()
}
```

### Styling

Edit `src/App.css` to customize colors, fonts, and layout.

### Add Features

- **Session Persistence**: Use `localStorage` to save conversations
- **Export**: Add export to markdown/JSON
- **Multi-Session**: Implement session switcher
- **Voice Input**: Integrate Web Speech API

## Integration with ActiveMirrorOS SDK

For production use, integrate the JavaScript SDK:

```javascript
import { ActiveMirror } from '@activemirror/sdk'

const mirror = new ActiveMirror({
  storagePath: './data',
  storageType: 'json'
})

const session = mirror.createSession('web-session')
session.addMessage('user', userMessage)
```

## Tech Stack

- **React 18** — UI library
- **Vite 5** — Fast build tool
- **Pure CSS** — No frameworks, lightweight styling

## What Makes This "Reflective"?

Unlike typical chatbots that aim to answer questions directly, this demo shows:

1. **Questioning over Asserting**: More "What do you mean?" than "Here's the answer"
2. **Uncertainty Markers**: Explicit ⟨medium⟩ acknowledgment of what's unknown
3. **Mode Awareness**: Different strategies for different conversation types
4. **Paraphrasing**: Mirroring back to check understanding

## License

MIT — see [../../LICENSE](../../LICENSE)

---

**Part of the ActiveMirrorOS Demo Suite**
Explore: [Mobile Demo](../mobile/) • [CLI Demo](../cli/) • [Full Documentation](../../docs/)
