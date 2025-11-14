import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ContinuityItem({ date, summary }) {
  return (
    <View style={styles.container}>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.summary}>{summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  summary: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
});
