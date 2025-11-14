/**
 * ActiveMirror - Main session management
 */

import { MemoryStore } from './memory.js';

export class Session {
  constructor(sessionData, memoryStore) {
    this.id = sessionData.id;
    this.title = sessionData.title;
    this.userId = sessionData.userId;
    this.createdAt = sessionData.createdAt;
    this.updatedAt = sessionData.updatedAt;
    this.messageCount = sessionData.messageCount || 0;
    this.memoryStore = memoryStore;
  }

  async send(message, metadata = {}) {
    // Add user message
    await this.memoryStore.addMessage(
      this.id,
      'user',
      message,
      metadata
    );

    // Generate response (stub - would call LLM in production)
    const response = this._generateResponse(message);

    // Add assistant message
    await this.memoryStore.addMessage(
      this.id,
      'assistant',
      response,
      { generated: true }
    );

    return {
      content: response,
      timestamp: new Date().toISOString(),
    };
  }

  _generateResponse(message) {
    return `I received your message: "${message}". This is a stub response. In production, this would use an LLM to generate context-aware replies.`;
  }

  getMessages(limit = null) {
    return this.memoryStore.getMessages(this.id, limit);
  }

  async save() {
    await this.memoryStore.saveSession(this.id);
    return this.id;
  }

  async export(format = 'json') {
    return await this.memoryStore.exportSession(this.id, format);
  }
}

export class ActiveMirror {
  /**
   * Main ActiveMirror instance for managing sessions and memory
   *
   * @param {Object} options - Configuration options
   * @param {string} options.storagePath - Path for memory storage
   * @param {string} options.userId - Optional default user ID
   */
  constructor(options = {}) {
    this.storagePath = options.storagePath || './memory';
    this.userId = options.userId || 'anonymous';
    this.memoryStore = new MemoryStore(this.storagePath);
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      await this.memoryStore.initialize();
      this.initialized = true;
    }
  }

  async createSession(title = 'Untitled', userId = null) {
    await this.initialize();

    const sessionData = await this.memoryStore.createSession(
      title,
      userId || this.userId
    );

    return new Session(sessionData, this.memoryStore);
  }

  async loadSession(sessionId) {
    await this.initialize();

    const sessionData = await this.memoryStore.loadSession(sessionId);
    return new Session(sessionData, this.memoryStore);
  }

  async listSessions(userId = null) {
    await this.initialize();
    return await this.memoryStore.listSessions(userId || this.userId);
  }

  async deleteSession(sessionId) {
    await this.initialize();
    return await this.memoryStore.deleteSession(sessionId);
  }
}
