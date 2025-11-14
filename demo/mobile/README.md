# ActiveMirrorOS Mobile Demo

**Reflection over Prediction** — A mobile demonstration of reflective AI conversation on iOS and Android.

## What This Demo Shows

A native mobile interface demonstrating ActiveMirrorOS patterns:

- **Reflective Dialogue**: Questions and uncertainty markers ⟨⟩
- **Session Continuity**: Persistent conversations stored locally on device
- **Clean Mobile UI**: Optimized for touch and mobile workflows
- **Offline-First**: No internet required, all data stays on device

## Features

✦ **Chat Interface** — Clean, scrolling conversation view
✦ **Auto-Persistence** — Messages automatically saved to AsyncStorage
✦ **Session Tracking** — See your interaction count grow
✦ **Simulated Responses** — Rule-based, no API calls needed
✦ **Cross-Platform** — Works on iOS, Android, and web

## Installation

### Prerequisites

- **Node.js 18+**
- **Expo CLI**: `npm install -g expo-cli`
- **iOS Simulator** (Mac only) or **Android Studio**

### Setup

```bash
cd demo/mobile

# Install dependencies
npm install

# Start Expo development server
npm start
```

You'll see a QR code and options to run on:
- **iOS Simulator** — Press `i`
- **Android Emulator** — Press `a`
- **Physical Device** — Scan QR code with Expo Go app
- **Web Browser** — Press `w` (for quick testing)

### Run Directly

```bash
# iOS (requires Mac + Xcode)
npm run ios

# Android (requires Android Studio)
npm run android

# Web (testing only)
npm run web
```

## How It Works

This is a **simulated demo** using local rule-based responses:

1. **Type a message** in the input field
2. **Tap "Send ✦"** to add it to the conversation
3. **Receive reflection** — System generates thoughtful response with uncertainty markers
4. **Session persists** — Close and reopen, your messages remain
5. **Track continuity** — Watch interaction count increase

### Response Logic

```javascript
function generateReflection(text) {
  // Analyzes message length, questions, etc.
  // Returns response with ⟨uncertainty⟩ markers
  // Demonstrates LingOS Lite patterns
}
```

### Data Storage

Messages stored in **AsyncStorage** (React Native's key-value store):
- **iOS**: NSUserDefaults
- **Android**: SharedPreferences
- **Web**: localStorage

Storage key: `activemirror_demo_session`

## Customization

### Connect Real LLM

Replace `generateReflection()` in `App.js`:

```javascript
async function generateReflection(text) {
  const response = await fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
  });

  const data = await response.json();
  return data.reflection;
}
```

### Styling

All styles in the `StyleSheet.create()` at bottom of `App.js`. Customize:
- Colors (e.g., `backgroundColor: '#0a0a0a'`)
- Fonts (e.g., `fontSize: 15`)
- Spacing (e.g., `padding: 16`)

### Add Features

Ideas for enhancement:
- **Multiple Sessions**: Add session picker/switcher
- **Export**: Share conversations via text/email
- **Voice Input**: Integrate `expo-speech` for voice-to-text
- **Themes**: Light/dark mode toggle
- **Encrypted Vault**: Use `expo-secure-store` for sensitive data

## Integration with ActiveMirrorOS SDK

For production use with the full SDK:

```javascript
import { ActiveMirror } from '@activemirror/sdk';
import * as FileSystem from 'expo-file-system';

const mirror = new ActiveMirror({
  storagePath: FileSystem.documentDirectory + 'activemirror/',
  storageType: 'json'
});

const session = mirror.createSession('mobile-session');
```

**Note**: Requires additional React Native filesystem setup.

## Building for Production

### iOS App Store

```bash
# Build iOS binary
eas build --platform ios

# Requires Apple Developer account
```

### Google Play Store

```bash
# Build Android APK/AAB
eas build --platform android
```

See [Expo EAS Build docs](https://docs.expo.dev/build/introduction/) for details.

## Tech Stack

- **React Native 0.73** — Cross-platform mobile framework
- **Expo 50** — Development toolchain
- **AsyncStorage** — Local persistence
- **Pure React Native components** — No heavy UI libraries

## Why Mobile?

ActiveMirrorOS on mobile enables:

1. **Always Available** — Reflective journaling wherever you are
2. **Private & Local** — Sensitive thoughts stay on your device
3. **Session Continuity** — Pick up conversations from days/weeks ago
4. **Quick Capture** — Jot down reflections in seconds

## Troubleshooting

### Expo Go App Issues

If the QR code doesn't work:
1. Ensure phone and computer are on same WiFi
2. Try `expo start --tunnel` for LAN bypass
3. Use physical USB connection with `expo start --localhost`

### Android Emulator Not Starting

```bash
# List available AVDs
emulator -list-avds

# Start specific AVD
emulator -avd <name>
```

### iOS Simulator Not Opening

Ensure Xcode is installed:
```bash
xcode-select --install
```

## License

MIT — see [../../LICENSE](../../LICENSE)

---

**Part of the ActiveMirrorOS Demo Suite**
Explore: [Web Demo](../web/) • [CLI Demo](../cli/) • [Full Documentation](../../docs/)
