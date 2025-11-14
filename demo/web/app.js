/**
 * ActiveMirrorOS Web Demo
 * Demonstrates reflective interaction, continuity, and local-first storage
 */

class ActiveMirrorDemo {
    constructor() {
        this.messages = [];
        this.continuity = [];
        this.sessionStart = new Date();
        this.interactionCount = 0;

        this.chatArea = document.getElementById('chatArea');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.clearButton = document.getElementById('clearButton');
        this.continuitySummary = document.getElementById('continuitySummary');
        this.interactionCountEl = document.getElementById('interactionCount');
        this.sessionStartEl = document.getElementById('sessionStart');

        this.init();
    }

    init() {
        // Load saved session
        this.loadSession();

        // Event listeners
        this.sendButton.addEventListener('click', () => this.handleSend());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSend();
        });
        this.clearButton.addEventListener('click', () => this.clearSession());

        // Update UI
        this.updateStats();
        this.renderMessages();
        this.renderContinuity();

        // Focus input
        this.userInput.focus();
    }

    handleSend() {
        const text = this.userInput.value.trim();
        if (!text) return;

        // Clear input
        this.userInput.value = '';

        // Add user message
        this.addMessage('user', text);

        // Generate reflection (simulated thinking)
        setTimeout(() => {
            const reflection = this.generateReflection(text);
            this.addMessage('reflection', reflection);

            // Generate response
            setTimeout(() => {
                const response = this.generateResponse(text);
                this.addMessage('assistant', response);

                // Add to continuity log
                this.addToContinuity(text, response);

                // Save session
                this.saveSession();
            }, 500);
        }, 300);
    }

    addMessage(role, content) {
        const message = { role, content, timestamp: new Date() };
        this.messages.push(message);

        // Render new message
        const messageEl = this.createMessageElement(message);
        this.chatArea.appendChild(messageEl);

        // Scroll to bottom
        this.chatArea.scrollTop = this.chatArea.scrollHeight;
    }

    createMessageElement(message) {
        const div = document.createElement('div');
        div.className = `message ${message.role}`;

        const roleLabel = message.role === 'user' ? 'You' :
                         message.role === 'reflection' ? '✦ Reflection' :
                         'ActiveMirror';

        div.innerHTML = `
            <div class="message-role">${roleLabel}</div>
            <div class="message-content">${this.escapeHtml(message.content)}</div>
        `;

        return div;
    }

    generateReflection(userMessage) {
        // Simulated reflection showing the AI "thinking"
        const reflections = [
            `Considering the context of "${this.truncate(userMessage, 30)}"...`,
            `Reflecting on patterns in our conversation...`,
            `Processing with awareness of our ${this.interactionCount} previous interactions...`,
            `Examining this in light of what you've shared before...`,
            `Thinking about continuity and connection...`
        ];

        // Context-aware reflections
        if (userMessage.toLowerCase().includes('what') && userMessage.includes('?')) {
            return `Analyzing your question about ${this.extractKeyTopic(userMessage)}...`;
        }

        if (this.interactionCount > 3) {
            return `Drawing on our ${this.interactionCount} interactions to respond thoughtfully...`;
        }

        return reflections[Math.floor(Math.random() * reflections.length)];
    }

    generateResponse(userMessage) {
        // Simple pattern-based responses demonstrating memory and reflection
        const lower = userMessage.toLowerCase();

        // Check for memory/recall questions
        if (lower.includes('told you') || lower.includes('said before') || lower.includes('remember')) {
            if (this.continuity.length === 0) {
                return "This is our first interaction, so I don't have prior context yet. But I'm now building a memory of our conversation.";
            }
            return `Based on our ${this.continuity.length} interactions, you've shared thoughts about: ${this.getSummaryTopics()}. Each interaction builds on what came before.`;
        }

        // Check for pattern questions
        if (lower.includes('pattern') || lower.includes('notice')) {
            if (this.continuity.length < 2) {
                return "I'm still building context. As we interact more, I'll be able to identify patterns in our dialogue.";
            }
            return `I notice continuity in our exchange - each message contributes to a growing shared context. We've had ${this.continuity.length} meaningful interactions so far.`;
        }

        // Check for explanation requests
        if (lower.includes('how') || lower.includes('explain') || lower.includes('what is')) {
            return `This demo shows three core ActiveMirrorOS concepts:\n\n1. Reflective Interaction - I process before responding (you saw the reflection step)\n2. Continuity - our conversation persists (check the log →)\n3. Local-First - everything stays in your browser's memory\n\nYour data never leaves your machine.`;
        }

        // Acknowledge and reflect
        const responses = [
            `I hear you. "${this.truncate(userMessage, 40)}" - this adds to our shared context. What would you like to explore?`,
            `Thank you for sharing. This is interaction #${this.interactionCount + 1}. Each one builds our continuity. What's next?`,
            `Noted. I'm maintaining this in our session memory. You can always ask me to recall what we've discussed.`,
            `Interesting. This contributes to the pattern of our dialogue. Our continuity log (→) tracks this evolution.`,
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    addToContinuity(userMessage, aiResponse) {
        this.interactionCount++;

        const entry = {
            id: this.interactionCount,
            timestamp: new Date(),
            userPreview: this.truncate(userMessage, 50),
            aiPreview: this.truncate(aiResponse, 50),
            full: { userMessage, aiResponse }
        };

        this.continuity.push(entry);
        this.updateStats();
        this.renderContinuity();
    }

    renderMessages() {
        // Clear chat (keep welcome if no messages)
        if (this.messages.length > 0) {
            const welcome = this.chatArea.querySelector('.welcome-message');
            if (welcome) welcome.remove();
        }

        // Render all messages
        this.messages.forEach(msg => {
            const messageEl = this.createMessageElement(msg);
            this.chatArea.appendChild(messageEl);
        });

        this.chatArea.scrollTop = this.chatArea.scrollHeight;
    }

    renderContinuity() {
        if (this.continuity.length === 0) {
            this.continuitySummary.innerHTML = '<p class="empty-state">Your interaction history will appear here...</p>';
            return;
        }

        this.continuitySummary.innerHTML = this.continuity
            .slice()
            .reverse()
            .map(entry => `
                <div class="continuity-item">
                    <span class="timestamp">#${entry.id} - ${this.formatTime(entry.timestamp)}</span>
                    <div class="preview">${this.escapeHtml(entry.userPreview)}</div>
                </div>
            `).join('');
    }

    updateStats() {
        this.interactionCountEl.textContent = this.interactionCount;
        this.sessionStartEl.textContent = this.formatTime(this.sessionStart);
    }

    saveSession() {
        const session = {
            messages: this.messages,
            continuity: this.continuity,
            sessionStart: this.sessionStart.toISOString(),
            interactionCount: this.interactionCount
        };

        localStorage.setItem('activemirror_demo_session', JSON.stringify(session));
    }

    loadSession() {
        const saved = localStorage.getItem('activemirror_demo_session');
        if (!saved) return;

        try {
            const session = JSON.parse(saved);
            this.messages = session.messages || [];
            this.continuity = session.continuity || [];
            this.sessionStart = new Date(session.sessionStart);
            this.interactionCount = session.interactionCount || 0;

            // Convert string timestamps back to Date objects
            this.messages.forEach(msg => msg.timestamp = new Date(msg.timestamp));
            this.continuity.forEach(entry => entry.timestamp = new Date(entry.timestamp));
        } catch (e) {
            console.error('Failed to load session:', e);
        }
    }

    clearSession() {
        if (!confirm('Clear all conversation history and start fresh?')) return;

        this.messages = [];
        this.continuity = [];
        this.sessionStart = new Date();
        this.interactionCount = 0;

        localStorage.removeItem('activemirror_demo_session');

        // Reset UI
        this.chatArea.innerHTML = `
            <div class="welcome-message">
                <p><strong>Session cleared - Welcome back!</strong></p>
                <p>Starting a fresh conversation with continuity tracking.</p>
            </div>
        `;

        this.updateStats();
        this.renderContinuity();
        this.userInput.focus();
    }

    getSummaryTopics() {
        // Extract key topics from continuity
        return this.continuity
            .slice(-3)
            .map(e => `"${this.truncate(e.userPreview, 30)}"`)
            .join(', ');
    }

    extractKeyTopic(text) {
        // Simple keyword extraction
        const words = text.split(' ').filter(w => w.length > 4);
        return words[0] || 'this topic';
    }

    truncate(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize demo when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ActiveMirrorDemo();
});
