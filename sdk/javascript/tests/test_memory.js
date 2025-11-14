/**
 * Tests for JavaScript Memory Store
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { MemoryStore, MemoryEntry } from '../memory.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testStoragePath = path.join(__dirname, 'test_memory');

describe('MemoryStore', () => {
  it('should create a memory store', async () => {
    const store = new MemoryStore(testStoragePath);
    await store.initialize();
    assert.ok(store);

    // Cleanup
    await fs.rm(testStoragePath, { recursive: true, force: true });
  });

  it('should create and save a session', async () => {
    const store = new MemoryStore(testStoragePath);
    await store.initialize();

    const session = await store.createSession('Test Session');
    assert.strictEqual(session.title, 'Test Session');
    assert.ok(session.id);

    await fs.rm(testStoragePath, { recursive: true, force: true });
  });

  it('should add and retrieve messages', async () => {
    const store = new MemoryStore(testStoragePath);
    await store.initialize();

    const session = await store.createSession('Message Test');
    await store.addMessage(session.id, 'user', 'Hello!');
    await store.addMessage(session.id, 'assistant', 'Hi there!');

    const messages = store.getMessages(session.id);
    assert.strictEqual(messages.length, 2);
    assert.strictEqual(messages[0].content, 'Hello!');
    assert.strictEqual(messages[1].content, 'Hi there!');

    await fs.rm(testStoragePath, { recursive: true, force: true });
  });

  it('should list sessions', async () => {
    const store = new MemoryStore(testStoragePath);
    await store.initialize();

    await store.createSession('Session 1');
    await store.createSession('Session 2');

    const sessions = await store.listSessions();
    assert.ok(sessions.length >= 2);

    await fs.rm(testStoragePath, { recursive: true, force: true });
  });

  it('should delete a session', async () => {
    const store = new MemoryStore(testStoragePath);
    await store.initialize();

    const session = await store.createSession('Delete Me');
    const sessionId = session.id;

    await store.deleteSession(sessionId);

    // Verify deletion
    try {
      await store.loadSession(sessionId);
      assert.fail('Should have thrown error');
    } catch (error) {
      assert.ok(error.message.includes('not found'));
    }

    await fs.rm(testStoragePath, { recursive: true, force: true });
  });

  it('should export session as JSON', async () => {
    const store = new MemoryStore(testStoragePath);
    await store.initialize();

    const session = await store.createSession('Export Test');
    await store.addMessage(session.id, 'user', 'Test message');

    const exported = await store.exportSession(session.id, 'json');
    assert.ok(exported.includes('Test message'));

    await fs.rm(testStoragePath, { recursive: true, force: true });
  });
});

describe('MemoryEntry', () => {
  it('should create a memory entry', () => {
    const entry = new MemoryEntry({
      sessionId: 'test-session',
      role: 'user',
      content: 'Test content'
    });

    assert.strictEqual(entry.role, 'user');
    assert.strictEqual(entry.content, 'Test content');
    assert.ok(entry.id);
    assert.ok(entry.timestamp);
  });

  it('should serialize to JSON', () => {
    const entry = new MemoryEntry({
      sessionId: 'test-session',
      role: 'assistant',
      content: 'Response'
    });

    const json = entry.toJSON();
    assert.strictEqual(json.role, 'assistant');
    assert.strictEqual(json.content, 'Response');
  });
});
