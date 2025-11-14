/**
 * Memory Store - Lightweight JSON-based memory persistence
 */

import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export class MemoryEntry {
  constructor(data) {
    this.id = data.id || this._generateId();
    this.sessionId = data.sessionId;
    this.role = data.role; // 'user', 'assistant', 'system'
    this.content = data.content;
    this.timestamp = data.timestamp || new Date().toISOString();
    this.metadata = data.metadata || {};
  }

  _generateId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON() {
    return {
      id: this.id,
      sessionId: this.sessionId,
      role: this.role,
      content: this.content,
      timestamp: this.timestamp,
      metadata: this.metadata,
    };
  }
}

export class MemoryStore {
  /**
   * JSON file-based memory storage
   *
   * @param {string} storagePath - Directory for JSON storage
   */
  constructor(storagePath = './memory') {
    this.storagePath = storagePath;
    this.sessions = new Map();
    this.messages = new Map();
  }

  async initialize() {
    // Create storage directory if needed
    if (!existsSync(this.storagePath)) {
      await fs.mkdir(this.storagePath, { recursive: true });
    }

    // Load existing sessions
    await this._loadSessions();
  }

  async _loadSessions() {
    const indexPath = path.join(this.storagePath, 'index.json');

    if (existsSync(indexPath)) {
      const indexData = await fs.readFile(indexPath, 'utf-8');
      const index = JSON.parse(indexData);

      for (const sessionId of index.sessions || []) {
        await this.loadSession(sessionId);
      }
    }
  }

  async _saveIndex() {
    const indexPath = path.join(this.storagePath, 'index.json');
    const index = {
      sessions: Array.from(this.sessions.keys()),
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(indexPath, JSON.stringify(index, null, 2));
  }

  async createSession(title = 'Untitled', userId = 'anonymous') {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const session = {
      id: sessionId,
      title,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
    };

    this.sessions.set(sessionId, session);
    this.messages.set(sessionId, []);

    await this.saveSession(sessionId);
    await this._saveIndex();

    return session;
  }

  async saveSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const sessionPath = path.join(this.storagePath, `${sessionId}.json`);
    const messages = this.messages.get(sessionId) || [];

    const data = {
      ...session,
      messages: messages.map(m => m.toJSON()),
      messageCount: messages.length,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(sessionPath, JSON.stringify(data, null, 2));

    // Update session in memory
    session.updatedAt = data.updatedAt;
    session.messageCount = data.messageCount;
  }

  async loadSession(sessionId) {
    const sessionPath = path.join(this.storagePath, `${sessionId}.json`);

    if (!existsSync(sessionPath)) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const data = JSON.parse(await fs.readFile(sessionPath, 'utf-8'));

    const session = {
      id: data.id,
      title: data.title,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      messageCount: data.messageCount,
    };

    const messages = data.messages.map(m => new MemoryEntry(m));

    this.sessions.set(sessionId, session);
    this.messages.set(sessionId, messages);

    return session;
  }

  async addMessage(sessionId, role, content, metadata = {}) {
    const messages = this.messages.get(sessionId);
    if (!messages) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const entry = new MemoryEntry({
      sessionId,
      role,
      content,
      metadata,
    });

    messages.push(entry);
    await this.saveSession(sessionId);

    return entry;
  }

  getMessages(sessionId, limit = null) {
    const messages = this.messages.get(sessionId) || [];

    if (limit) {
      return messages.slice(-limit);
    }

    return messages;
  }

  async listSessions(userId = null) {
    const sessions = Array.from(this.sessions.values());

    if (userId) {
      return sessions.filter(s => s.userId === userId);
    }

    // Sort by most recent first
    return sessions.sort((a, b) =>
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }

  async deleteSession(sessionId) {
    const sessionPath = path.join(this.storagePath, `${sessionId}.json`);

    if (existsSync(sessionPath)) {
      await fs.unlink(sessionPath);
    }

    this.sessions.delete(sessionId);
    this.messages.delete(sessionId);

    await this._saveIndex();
    return true;
  }

  async exportSession(sessionId, format = 'json') {
    const session = this.sessions.get(sessionId);
    const messages = this.messages.get(sessionId);

    if (!session || !messages) {
      throw new Error(`Session ${sessionId} not found`);
    }

    if (format === 'json') {
      return JSON.stringify({
        ...session,
        messages: messages.map(m => m.toJSON()),
      }, null, 2);
    }

    if (format === 'markdown') {
      let md = `# ${session.title}\n\n`;
      md += `**Session ID**: ${session.id}\n`;
      md += `**Created**: ${session.createdAt}\n`;
      md += `**Updated**: ${session.updatedAt}\n\n`;
      md += `## Messages\n\n`;

      for (const msg of messages) {
        const emoji = msg.role === 'user' ? '👤' : msg.role === 'assistant' ? '🤖' : '⚙️';
        md += `### ${emoji} ${msg.role}\n\n`;
        md += `${msg.content}\n\n`;
        md += `*${msg.timestamp}*\n\n`;
      }

      return md;
    }

    throw new Error(`Unsupported format: ${format}`);
  }
}
