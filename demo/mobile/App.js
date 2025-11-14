/**
 * ActiveMirrorOS Mobile Demo
 *
 * Reflection over Prediction — Mobile reflective conversation interface
 */

import React, { useState, useEffect, useRef } from 'react';
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
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sessionInteractions, setSessionInteractions] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  async function loadSession() {
    try {
      const saved = await AsyncStorage.getItem('activemirror_demo_session');
      if (saved) {
        const session = JSON.parse(saved);
        setMessages(session.messages || []);
        setSessionInteractions(session.interactions || 0);
      } else {
        // Add welcome message
        setMessages([
          {
            id: Date.now().toString(),
            role: 'system',
            content: 'Welcome to ActiveMirrorOS Mobile Demo.\n\nThis interface demonstrates reflective dialogue patterns with session continuity.',
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.log('Failed to load session:', error);
    }
  }

  async function saveSession(newMessages, interactions) {
    try {
      const session = {
        messages: newMessages,
        interactions,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(
        'activemirror_demo_session',
        JSON.stringify(session)
      );
    } catch (error) {
      console.log('Failed to save session:', error);
    }
  }

  function generateReflection(text) {
    const wordCount = text.split(/\s+/).length;
    const hasQuestion = text.includes('?');

    const reflections = [
      `I'm noticing patterns in what you've shared. ⟨medium⟩ What aspect feels most significant to you?`,
      `⟨low⟩ I'm sitting with "${text.substring(0, 40)}${text.length > 40 ? '...' : ''}" — what emerges when you pause with this?`,
      `This feels important. ⟨medium⟩ Could you say more about what drew your attention here?`,
      `Your thought contains multiple threads. ⟨low⟩ Which one pulls you most strongly?`,
      `I notice depth in this reflection. ⟨medium⟩ What would help us explore it further?`,
    ];

    if (hasQuestion) {
      return `⟨medium⟩ You're asking a question that opens interesting territory. Before I respond, what's your intuition about the answer?`;
    }

    if (wordCount > 30) {
      return `I notice you're sharing a substantial thought. ⟨high⟩ This deserves careful attention — what core theme emerges for you?`;
    }

    return reflections[Math.floor(Math.random() * reflections.length)];
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
    const newInteractions = sessionInteractions + 1;

    setMessages(newMessages);
    setSessionInteractions(newInteractions);
    setInputText('');

    // Save to storage
    setTimeout(() => saveSession(newMessages, newInteractions), 100);
  }

  async function handleClearSession() {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'system',
        content: 'Session cleared. Starting fresh.',
        timestamp: new Date().toISOString(),
      },
    ]);
    setSessionInteractions(0);
    await AsyncStorage.removeItem('activemirror_demo_session');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>◈ ActiveMirrorOS Mobile Demo</Text>
        <Text style={styles.headerSubtitle}>Reflection over Prediction</Text>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionInfoText}>
            Session continuity: <Text style={styles.sessionCount}>{sessionInteractions}</Text> interactions
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.length === 0 ? (
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>◈ Welcome</Text>
              <Text style={styles.welcomeText}>
                Start a reflective conversation.
              </Text>
              <Text style={styles.welcomeText}>
                Your thoughts persist locally on this device.
              </Text>
            </View>
          ) : (
            messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.role === 'user'
                    ? styles.userBubble
                    : msg.role === 'system'
                    ? styles.systemBubble
                    : styles.aiBubble,
                ]}
              >
                <Text style={styles.messageRole}>
                  {msg.role === 'user'
                    ? '👤 You'
                    : msg.role === 'system'
                    ? '⚙️ System'
                    : '◈ ActiveMirror'}
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
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>Send ✦</Text>
          </TouchableOpacity>
        </View>

        {messages.length > 1 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearSession}>
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
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    backgroundColor: '#111',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    fontWeight: '300',
    marginBottom: 12,
  },
  sessionInfo: {
    backgroundColor: '#0d0d0d',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  sessionInfoText: {
    fontSize: 13,
    color: '#666',
  },
  sessionCount: {
    color: '#8b5cf6',
    fontWeight: '600',
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
    textAlign: 'center',
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
  systemBubble: {
    alignSelf: 'center',
    backgroundColor: '#0d1117',
    borderColor: '#1a2030',
    borderWidth: 1,
    maxWidth: '90%',
  },
  messageRole: {
    fontSize: 11,
    color: '#888',
    marginBottom: 6,
    textTransform: 'uppercase',
    fontWeight: '600',
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
    backgroundColor: '#0a0a0a',
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
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
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
