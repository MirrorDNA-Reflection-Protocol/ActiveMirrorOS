/**
 * ActiveMirror Desktop - Main Process
 *
 * Electron main process for ActiveMirrorOS desktop app
 */

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let memoryStore = {};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// Initialize memory storage
function initializeMemory() {
  const memoryPath = path.join(app.getPath('userData'), 'memory.json');

  if (fs.existsSync(memoryPath)) {
    try {
      const data = fs.readFileSync(memoryPath, 'utf-8');
      memoryStore = JSON.parse(data);
    } catch (error) {
      console.error('Failed to load memory:', error);
      memoryStore = { sessions: {}, currentSessionId: null };
    }
  } else {
    memoryStore = { sessions: {}, currentSessionId: null };
  }
}

function saveMemory() {
  const memoryPath = path.join(app.getPath('userData'), 'memory.json');
  fs.writeFileSync(memoryPath, JSON.stringify(memoryStore, null, 2));
}

// IPC Handlers
ipcMain.handle('create-session', (event, title) => {
  const sessionId = `session_${Date.now()}`;
  memoryStore.sessions[sessionId] = {
    id: sessionId,
    title: title || 'Untitled Session',
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryStore.currentSessionId = sessionId;
  saveMemory();
  return memoryStore.sessions[sessionId];
});

ipcMain.handle('get-sessions', () => {
  return Object.values(memoryStore.sessions).sort((a, b) =>
    new Date(b.updatedAt) - new Date(a.updatedAt)
  );
});

ipcMain.handle('load-session', (event, sessionId) => {
  memoryStore.currentSessionId = sessionId;
  return memoryStore.sessions[sessionId] || null;
});

ipcMain.handle('send-message', (event, message) => {
  const sessionId = memoryStore.currentSessionId;
  if (!sessionId || !memoryStore.sessions[sessionId]) {
    return { error: 'No active session' };
  }

  const session = memoryStore.sessions[sessionId];

  // Add user message
  session.messages.push({
    id: `msg_${Date.now()}`,
    role: 'user',
    content: message,
    timestamp: new Date().toISOString(),
  });

  // Generate response (stub)
  const response = generateResponse(message, session.messages);

  session.messages.push({
    id: `msg_${Date.now()}_ai`,
    role: 'assistant',
    content: response,
    timestamp: new Date().toISOString(),
  });

  session.updatedAt = new Date().toISOString();
  saveMemory();

  return { userMessage: message, aiResponse: response };
});

function generateResponse(message, history) {
  // Simple reflective response stub
  const wordCount = message.split(/\s+/).length;

  if (wordCount > 30) {
    return `I notice you're sharing a substantial thought: "${message.substring(0, 50)}..." ` +
           `This suggests ⟨medium⟩ deeper exploration might be valuable. What core theme emerges for you?`;
  }

  return `Reflecting on "${message}" — what patterns or questions arise when you sit with this? ` +
         `⟨low⟩ I'm curious what drew your attention to this particular thought.`;
}

ipcMain.handle('delete-session', (event, sessionId) => {
  delete memoryStore.sessions[sessionId];
  if (memoryStore.currentSessionId === sessionId) {
    memoryStore.currentSessionId = null;
  }
  saveMemory();
  return true;
});

// App lifecycle
app.whenReady().then(() => {
  initializeMemory();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
