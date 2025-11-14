# ActiveMirrorOS Mobile Demo

A minimal conceptual mobile demo showcasing how ActiveMirrorOS could look on phones.

## ⚠️ Important Notice

**This is a conceptual prototype, NOT a production-ready application.**

This demo provides a basic scaffold to visualize ActiveMirrorOS principles on mobile devices. It includes:
- Static UI mockups
- Local dummy data only
- No backend integration
- No real chat functionality

## 🏗️ Project Structure

```
/mobile/
├── App.js                 # Main app entry with 3 screens
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── components/
│   ├── Header.js          # Reusable header with back button
│   ├── MessageBubble.js   # Chat message display
│   └── ContinuityItem.js  # Continuity log item
└── README.md              # This file
```

## 📱 Screens

### 1. Welcome Screen
- ActiveMirrorOS branding
- Navigation buttons to other screens

### 2. Reflective Chat Screen
- Mock conversation showing reflective dialogue
- Static messages demonstrating the concept
- Message bubbles for user and AI responses

### 3. Continuity Log Screen
- List of past interactions
- Dummy data showing historical context
- Date and summary for each entry

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

### Running the Demo

#### Using Expo Go (Easiest)

1. Start the development server:
```bash
npx expo start
# or
npm start
```

2. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app (download from Play Store)

3. The app will load on your physical device.

#### Using Simulators/Emulators

For iOS Simulator (macOS only):
```bash
npm run ios
```

For Android Emulator:
```bash
npm run android
```

For Web Browser:
```bash
npm run web
```

## 🎨 Features

- **Simple Navigation**: Switch between screens with button taps
- **Responsive Design**: Works on various mobile screen sizes
- **Clean UI**: Minimalist design focused on core concepts
- **Local State**: All data stored in-memory (resets on reload)

## 🔮 Future Enhancements

This scaffold could be expanded to include:
- Real-time chat integration with ActiveMirrorOS backend
- Persistent storage (AsyncStorage or SQLite)
- Push notifications for reflective prompts
- Biometric authentication
- Cloud sync for continuity logs
- Advanced reflection visualization
- Voice input/output
- Offline mode with sync

## 📸 Screenshots

> Note: Screenshot placeholders for future additions

## 🤝 Contributing

This is a minimal demo. For production features, please coordinate with the main ActiveMirrorOS repository.

## 📄 License

Follows the same license as the parent ActiveMirrorOS project.

## 🔗 Related

- [Main ActiveMirrorOS Repository](../)
- [ActiveMirrorOS Documentation](../README.md)
