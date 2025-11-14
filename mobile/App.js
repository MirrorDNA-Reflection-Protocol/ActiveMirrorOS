import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from './components/Header';
import MessageBubble from './components/MessageBubble';
import ContinuityItem from './components/ContinuityItem';

// Mock data for reflective chat
const mockMessages = [
  { id: 1, text: 'Hello, ActiveMirrorOS!', isUser: true },
  { id: 2, text: 'Reflecting on your input... I sense curiosity.', isUser: false },
  { id: 3, text: 'What is my current emotional state?', isUser: true },
  { id: 4, text: 'Based on our interaction, you appear engaged and exploratory. Would you like to dive deeper?', isUser: false },
];

// Mock data for continuity log
const mockContinuity = [
  { id: 1, date: '2025-11-14 10:30', summary: 'Discussed emotional awareness patterns' },
  { id: 2, date: '2025-11-13 15:45', summary: 'Explored reflective dialogue mechanics' },
  { id: 3, date: '2025-11-12 09:20', summary: 'Introduction to ActiveMirrorOS concepts' },
  { id: 4, date: '2025-11-11 14:00', summary: 'Deep reflection on consciousness and AI' },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');

  const renderWelcomeScreen = () => (
    <View style={styles.screenContainer}>
      <View style={styles.welcomeContent}>
        <Text style={styles.logo}>🪞</Text>
        <Text style={styles.title}>ActiveMirrorOS</Text>
        <Text style={styles.subtitle}>Mobile Demo</Text>
        <Text style={styles.description}>
          A conceptual prototype showcasing reflective AI interaction on mobile devices.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCurrentScreen('chat')}
          >
            <Text style={styles.buttonText}>💬 Reflective Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setCurrentScreen('continuity')}
          >
            <Text style={styles.buttonText}>📜 Continuity Log</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderChatScreen = () => (
    <View style={styles.screenContainer}>
      <Header title="Reflective Chat" onBack={() => setCurrentScreen('welcome')} />
      <ScrollView style={styles.chatContainer}>
        {mockMessages.map((message) => (
          <MessageBubble
            key={message.id}
            text={message.text}
            isUser={message.isUser}
          />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ℹ️ This is a static demo. No real chat functionality yet.
        </Text>
      </View>
    </View>
  );

  const renderContinuityScreen = () => (
    <View style={styles.screenContainer}>
      <Header title="Continuity Log" onBack={() => setCurrentScreen('welcome')} />
      <ScrollView style={styles.listContainer}>
        {mockContinuity.map((item) => (
          <ContinuityItem
            key={item.id}
            date={item.date}
            summary={item.summary}
          />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ℹ️ Local dummy data - no backend integration.
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {currentScreen === 'welcome' && renderWelcomeScreen()}
      {currentScreen === 'chat' && renderChatScreen()}
      {currentScreen === 'continuity' && renderContinuityScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenContainer: {
    flex: 1,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
