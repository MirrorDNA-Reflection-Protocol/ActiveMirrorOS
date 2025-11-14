/**
 * ActiveMirror Mobile - React Native App
 *
 * Simple mobile interface for reflective AI conversations
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sessionTitle, setSessionTitle] = useState('ActiveMirror');

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const saved = await AsyncStorage.getItem('activemirror_session');
      if (saved) {
        const session = JSON.parse(saved);
        setMessages(session.messages || []);
        setSessionTitle(session.title || 'ActiveMirror');
      }
    } catch (error) {
      console.log('Failed to load session:', error);
    }
  }

  async function saveSession() {
    try {
      const session = {
        title: sessionTitle,
        messages,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem('activemirror_session', JSON.stringify(session));
    } catch (error) {
      console.log('Failed to save session:', error);
    }
  }

  function generateReflection(text) {
    const wordCount = text.split(/\s+/).length;

    if (wordCount > 30) {
      return `I notice you're sharing a substantial thought. This suggests ⟨medium⟩ deeper exploration might be valuable. What core theme emerges?`;
    }

    return `Reflecting on "${text}" — what patterns arise when you sit with this? ⟨low⟩ I'm curious what drew your attention here.`;
  }

  function handleSend() {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date().toISOString(),
    };

    const reflection = generateReflection(inputText);
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: reflection,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage, aiMessage];
    setMessages(newMessages);
    setInputText('');

    // Save to storage
    setTimeout(() => saveSession(), 100);
  }

  async function handleClearSession() {
    setMessages([]);
    await AsyncStorage.removeItem('activemirror_session');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>◈ {sessionTitle}</Text>
        <Text style={styles.headerSubtitle}>Intelligence that remembers</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
        >
          {messages.length === 0 ? (
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>◈ Welcome</Text>
              <Text style={styles.welcomeText}>
                Start a reflective conversation.
              </Text>
              <Text style={styles.welcomeText}>
                Your thoughts persist locally.
              </Text>
            </View>
          ) : (
            messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.role === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text style={styles.messageRole}>
                  {msg.role === 'user' ? '👤 You' : '🤖 ActiveMirror'}
                </Text>
                <Text style={styles.messageContent}>{msg.content}</Text>
                <Text style={styles.messageTime}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Share your thoughts..."
            placeholderTextColor="#666"
            multiline
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send ✦</Text>
          </TouchableOpacity>
        </View>

        {messages.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearSession}
          >
            <Text style={styles.clearButtonText}>Clear Session</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  keyboardView: {
    flex: 1,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  welcomeTitle: {
    fontSize: 28,
    color: '#aaa',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  messageBubble: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1a2a3a',
    borderColor: '#2a3a4a',
    borderWidth: 1,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
  },
  messageRole: {
    fontSize: 11,
    color: '#888',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  messageContent: {
    fontSize: 15,
    color: '#e0e0e0',
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 11,
    color: '#666',
    marginTop: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#222',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: '#e0e0e0',
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#1a3a5a',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  clearButton: {
    alignSelf: 'center',
    padding: 12,
    marginBottom: 8,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 13,
  },
});
