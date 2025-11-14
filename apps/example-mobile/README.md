# ActiveMirror Mobile

React Native mobile app for ActiveMirrorOS with local persistent memory.

## Features

- **Simple Chat UI**: Clean, minimal interface
- **Local Storage**: All data stored on device using AsyncStorage
- **Reflective Responses**: LingOS Lite pattern responses with uncertainty markers
- **Offline-First**: No internet required
- **Cross-Platform**: Works on iOS and Android

## Setup

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator (Mac) or Android Studio

### Installation

```bash
cd apps/example-mobile

# Install dependencies
npm install

# Start development server
npm start
```

### Run on Device

```bash
# iOS (requires Mac)
npm run ios

# Android
npm run android

# Web (for testing)
npm run web
```

## Architecture

```
App.js
├── State Management (useState)
├── Persistence (AsyncStorage)
├── UI Components
│   ├── Header
│   ├── Message List
│   └── Input Container
└── Reflection Logic
```

## Usage

1. **Send Message**: Type and press "Send ✦"
2. **View History**: Scroll up to see previous messages
3. **Clear Session**: Tap "Clear Session" to start fresh
4. **Auto-Save**: Messages automatically saved to device

## Data Storage

Data stored locally using React Native AsyncStorage:

- **Key**: `activemirror_session`
- **Format**: JSON with messages array
- **Location**: Device-specific (iOS Keychain, Android SharedPreferences)

## Customization

### Connect Real LLM

Replace the stub function:

```javascript
function generateReflection(text) {
  // Replace with actual API call
  const response = await fetch('https://your-llm-api.com', {
    method: 'POST',
    body: JSON.stringify({ message: text }),
  });
  return await response.json();
}
```

### Styling

All styles in `styles` object at bottom of `App.js`. Customize colors, fonts, spacing.

### Add Features

- **Multiple Sessions**: Add session switcher
- **Export**: Add export to text/PDF
- **Voice Input**: Integrate speech-to-text
- **Vault**: Add encrypted vault storage

## Integration with SDK

For advanced features, integrate the JavaScript SDK:

```javascript
import { ActiveMirror } from '@activemirror/sdk';

// Note: Requires additional React Native setup for file system access
const mirror = new ActiveMirror({ storagePath: RNFS.DocumentDirectoryPath });
```

## Production Build

```bash
# iOS
expo build:ios

# Android
expo build:android
```

## License

MIT - see [LICENSE](../../LICENSE)
