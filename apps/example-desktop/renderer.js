/**
 * ActiveMirror Desktop - Renderer Process
 *
 * Handles UI interactions and IPC communication
 */

const { ipcRenderer } = require('electron');

let currentSession = null;

// DOM Elements
const newSessionBtn = document.getElementById('new-session-btn');
const sessionList = document.getElementById('session-list');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const sessionTitle = document.getElementById('session-title');
const messageCount = document.getElementById('message-count');
const sessionAge = document.getElementById('session-age');

// Event Listeners
newSessionBtn.addEventListener('click', createNewSession);
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Initialize
async function init() {
  await loadSessions();
}

async function createNewSession() {
  const title = prompt('Session title:', 'New Conversation');
  if (!title) return;

  currentSession = await ipcRenderer.invoke('create-session', title);
  await loadSessions();
  displaySession(currentSession);
}

async function loadSessions() {
  const sessions = await ipcRenderer.invoke('get-sessions');

  sessionList.innerHTML = '';

  if (sessions.length === 0) {
    sessionList.innerHTML = '<p style="color:#666;padding:12px;text-align:center;">No sessions yet</p>';
    return;
  }

  for (const session of sessions) {
    const item = document.createElement('div');
    item.className = 'session-item';
    if (currentSession && session.id === currentSession.id) {
      item.classList.add('active');
    }

    const date = new Date(session.updatedAt);
    const dateStr = date.toLocaleDateString();

    item.innerHTML = `
      <h4>${session.title}</h4>
      <p>${session.messages.length} messages • ${dateStr}</p>
    `;

    item.addEventListener('click', async () => {
      currentSession = await ipcRenderer.invoke('load-session', session.id);
      displaySession(currentSession);
      loadSessions(); // Refresh to update active state
    });

    sessionList.appendChild(item);
  }
}

function displaySession(session) {
  sessionTitle.textContent = session.title;
  messageContainer.innerHTML = '';

  if (session.messages.length === 0) {
    messageContainer.innerHTML = `
      <div class="welcome-message">
        <h2>◈ ${session.title}</h2>
        <p>Start your reflective conversation...</p>
      </div>
    `;
  } else {
    for (const msg of session.messages) {
      appendMessage(msg);
    }
  }

  updateStats(session);

  // Scroll to bottom
  messageContainer.scrollTop = messageContainer.scrollHeight;

  // Focus input
  messageInput.focus();
}

function appendMessage(msg) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${msg.role}`;

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';

  const roleLabel = msg.role === 'user' ? '👤 You' : '🤖 ActiveMirror';
  const time = new Date(msg.timestamp).toLocaleTimeString();

  bubble.innerHTML = `
    <div class="role">${roleLabel}</div>
    <div class="content">${escapeHtml(msg.content)}</div>
    <div class="timestamp">${time}</div>
  `;

  msgDiv.appendChild(bubble);
  messageContainer.appendChild(msgDiv);
}

async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  if (!currentSession) {
    alert('Please create or select a session first');
    return;
  }

  // Clear input
  messageInput.value = '';

  // Send to backend
  const result = await ipcRenderer.invoke('send-message', message);

  if (result.error) {
    alert(result.error);
    return;
  }

  // Reload session to get updated messages
  currentSession = await ipcRenderer.invoke('load-session', currentSession.id);
  displaySession(currentSession);
}

function updateStats(session) {
  messageCount.textContent = session.messages.length;

  const created = new Date(session.createdAt);
  const now = new Date();
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) {
    sessionAge.textContent = `${diffMins}m ago`;
  } else if (diffMins < 1440) {
    sessionAge.textContent = `${Math.floor(diffMins / 60)}h ago`;
  } else {
    sessionAge.textContent = `${Math.floor(diffMins / 1440)}d ago`;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on load
init();
