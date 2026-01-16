/**
 * Turn-based Nudges for ActiveMirror v3
 * ======================================
 *
 * Gentle, contextual suggestions that appear based on:
 * - Conversation patterns
 * - Time since last interaction
 * - User behavior signals
 * - System state
 *
 * Philosophy: Guide, don't interrupt. Suggest, don't demand.
 */

class NudgeEngine {
  constructor(options = {}) {
    this.container = options.container || null;
    this.onNudge = options.onNudge || null;
    this.onDismiss = options.onDismiss || null;

    // State tracking
    this.messageCount = 0;
    this.sessionStart = Date.now();
    this.lastInteraction = Date.now();
    this.dismissedNudges = new Set();
    this.shownNudges = new Set();
    this.currentTier = 'sovereign';
    this.tierChangeCount = 0;

    // Nudge definitions
    this.nudges = this.defineNudges();

    // Timers
    this.checkInterval = null;

    // Load dismissed nudges from storage
    this.loadDismissed();
  }

  defineNudges() {
    return {
      // First-time user nudges
      'welcome-tier': {
        trigger: () => this.messageCount === 0 && !this.shownNudges.has('welcome-tier'),
        content: {
          icon: '◈',
          title: 'Sovereign by Default',
          message: 'Your messages are processed locally. Try switching tiers with ⌘+1-4 to explore different AI capabilities.',
          actions: [
            { label: 'Got it', action: 'dismiss' },
            { label: 'Learn more', action: 'help:tiers' }
          ]
        },
        priority: 100,
        delay: 3000,  // Show after 3 seconds
        once: true
      },

      'first-message': {
        trigger: () => this.messageCount === 1 && !this.shownNudges.has('first-message'),
        content: {
          icon: '✓',
          title: 'First Message Sent',
          message: 'Notice the transparency bar below showing exactly where your data went.',
          actions: [
            { label: 'Dismiss', action: 'dismiss' }
          ]
        },
        priority: 90,
        delay: 1000,
        once: true
      },

      // Feature discovery nudges
      'try-widgets': {
        trigger: () => this.messageCount >= 3 && !this.shownNudges.has('try-widgets'),
        content: {
          icon: '📋',
          title: 'Organize Your Workspace',
          message: 'Click the Widgets tab on the left to add tasks, notes, and quick links.',
          actions: [
            { label: 'Show me', action: 'toggle:left-tab' },
            { label: 'Maybe later', action: 'dismiss' }
          ]
        },
        priority: 50,
        delay: 0,
        once: true
      },

      'transparency-pane': {
        trigger: () => this.messageCount >= 5 && !this.shownNudges.has('transparency-pane'),
        content: {
          icon: '◈',
          title: 'Deep Transparency',
          message: 'Open the Transparency tab on the right for real-time data flow monitoring.',
          actions: [
            { label: 'Open', action: 'toggle:right-tab' },
            { label: 'Dismiss', action: 'dismiss' }
          ]
        },
        priority: 45,
        delay: 0,
        once: true
      },

      // Tier-related nudges
      'try-frontier': {
        trigger: () => {
          return this.currentTier === 'sovereign' &&
                 this.messageCount >= 7 &&
                 this.tierChangeCount === 0 &&
                 !this.shownNudges.has('try-frontier');
        },
        content: {
          icon: '✦',
          title: 'Need More Power?',
          message: 'For complex tasks, try Frontier tier (⌘+4). It uses cloud AI but your data is never stored.',
          actions: [
            { label: 'Try Frontier', action: 'tier:frontier' },
            { label: 'Stay local', action: 'dismiss' }
          ]
        },
        priority: 40,
        delay: 0,
        once: true
      },

      'back-to-sovereign': {
        trigger: () => {
          return this.currentTier !== 'sovereign' &&
                 this.messageCount >= 10 &&
                 !this.shownNudges.has('back-to-sovereign');
        },
        content: {
          icon: '◈',
          title: 'Return to Sovereign?',
          message: 'You\'ve been using cloud inference. Switch back to local for maximum privacy (⌘+1).',
          actions: [
            { label: 'Go local', action: 'tier:sovereign' },
            { label: 'Keep current', action: 'dismiss' }
          ]
        },
        priority: 35,
        delay: 0,
        once: true
      },

      // WebLLM nudge
      'try-webllm': {
        trigger: () => {
          return this.messageCount >= 5 &&
                 this.currentTier === 'sovereign' &&
                 !this.shownNudges.has('try-webllm') &&
                 navigator.gpu;  // Only if WebGPU available
        },
        content: {
          icon: '🌐',
          title: 'Ultimate Sovereignty',
          message: 'Try WebLLM mode — AI runs entirely in your browser. Zero network requests, ever.',
          actions: [
            { label: 'Enable WebLLM', action: 'webllm:enable' },
            { label: 'Not now', action: 'dismiss' }
          ]
        },
        priority: 60,
        delay: 0,
        once: true
      },

      // Engagement nudges
      'idle-reminder': {
        trigger: () => {
          const idleMinutes = (Date.now() - this.lastInteraction) / 60000;
          return idleMinutes >= 5 &&
                 this.messageCount > 0 &&
                 !this.shownNudges.has('idle-reminder-' + Math.floor(idleMinutes / 5));
        },
        content: {
          icon: '💡',
          title: 'Still Here?',
          message: 'Need help with something? I\'m ready when you are.',
          actions: [
            { label: 'Ask a question', action: 'focus:input' },
            { label: 'Dismiss', action: 'dismiss' }
          ]
        },
        priority: 20,
        delay: 0,
        once: false,  // Can show multiple times
        idKey: () => 'idle-reminder-' + Math.floor((Date.now() - this.lastInteraction) / 300000)
      },

      // Break reminder
      'take-break': {
        trigger: () => {
          const sessionMinutes = (Date.now() - this.sessionStart) / 60000;
          return sessionMinutes >= 30 &&
                 this.messageCount >= 15 &&
                 !this.shownNudges.has('take-break');
        },
        content: {
          icon: '☕',
          title: 'You\'ve Been Focused',
          message: 'Great session! Consider a short break to stay sharp.',
          actions: [
            { label: 'Good idea', action: 'dismiss' },
            { label: 'Keep going', action: 'dismiss' }
          ]
        },
        priority: 25,
        delay: 0,
        once: true
      },

      // Email capture nudge (waitlist)
      'join-waitlist': {
        trigger: () => {
          return this.messageCount >= 10 &&
                 !this.shownNudges.has('join-waitlist') &&
                 !localStorage.getItem('activemirror_email');
        },
        content: {
          icon: '📬',
          title: 'Stay Updated',
          message: 'Get notified about new features and the full MirrorDNA stack release.',
          actions: [
            { label: 'Join waitlist', action: 'email:capture' },
            { label: 'No thanks', action: 'dismiss' }
          ]
        },
        priority: 30,
        delay: 0,
        once: true
      }
    };
  }

  /**
   * Start the nudge checker
   */
  start() {
    if (this.checkInterval) return;

    this.checkInterval = setInterval(() => {
      this.checkNudges();
    }, 5000);  // Check every 5 seconds

    // Initial check after a short delay
    setTimeout(() => this.checkNudges(), 2000);
  }

  /**
   * Stop the nudge checker
   */
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Check and show applicable nudges
   */
  checkNudges() {
    const applicable = [];

    for (const [id, nudge] of Object.entries(this.nudges)) {
      // Skip if already dismissed
      if (this.dismissedNudges.has(id)) continue;

      // Check trigger
      try {
        if (nudge.trigger()) {
          applicable.push({ id, ...nudge });
        }
      } catch (e) {
        console.warn(`Nudge trigger error for ${id}:`, e);
      }
    }

    // Sort by priority (highest first)
    applicable.sort((a, b) => b.priority - a.priority);

    // Show the highest priority nudge
    if (applicable.length > 0) {
      const nudge = applicable[0];
      const uniqueId = nudge.idKey ? nudge.idKey() : nudge.id;

      // Check if already shown
      if (!this.shownNudges.has(uniqueId)) {
        setTimeout(() => {
          this.showNudge(nudge.id, nudge);
        }, nudge.delay || 0);
      }
    }
  }

  /**
   * Show a nudge
   */
  showNudge(id, nudge) {
    const uniqueId = nudge.idKey ? nudge.idKey() : id;
    this.shownNudges.add(uniqueId);

    if (nudge.once) {
      this.dismissedNudges.add(id);
      this.saveDismissed();
    }

    if (this.onNudge) {
      this.onNudge(id, nudge.content);
    }

    // Render if container exists
    if (this.container) {
      this.renderNudge(id, nudge.content);
    }
  }

  /**
   * Render nudge to DOM
   */
  renderNudge(id, content) {
    // Remove any existing nudge
    this.container.querySelector('.nudge-toast')?.remove();

    const toast = document.createElement('div');
    toast.className = 'nudge-toast';
    toast.dataset.nudgeId = id;
    toast.innerHTML = `
      <div class="nudge-icon">${content.icon}</div>
      <div class="nudge-body">
        <div class="nudge-title">${content.title}</div>
        <div class="nudge-message">${content.message}</div>
        <div class="nudge-actions">
          ${content.actions.map(a => `
            <button class="nudge-btn ${a.action === 'dismiss' ? 'secondary' : 'primary'}"
                    data-action="${a.action}">${a.label}</button>
          `).join('')}
        </div>
      </div>
      <button class="nudge-close" data-action="dismiss">×</button>
    `;

    // Add click handlers
    toast.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.handleAction(id, action);
        toast.remove();
      });
    });

    // Animate in
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    this.container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transition = 'all 0.3s ease';
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // Auto-dismiss after 15 seconds if not interacted with
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
      }
    }, 15000);
  }

  /**
   * Handle nudge action
   */
  handleAction(nudgeId, action) {
    if (action === 'dismiss') {
      this.dismiss(nudgeId);
      return;
    }

    const [type, param] = action.split(':');

    switch (type) {
      case 'help':
        // Open help modal with specific topic
        if (window.activeMirror && typeof openHelp === 'function') {
          openHelp();
        }
        break;

      case 'toggle':
        // Toggle a tab
        if (param === 'left-tab' || param === 'right-tab') {
          const tabId = param;
          if (typeof toggleTab === 'function') {
            toggleTab(tabId.replace('-tab', ''));
          }
        }
        break;

      case 'tier':
        // Switch tier
        if (window.activeMirror) {
          window.activeMirror.setTier(param);
        }
        break;

      case 'webllm':
        // Enable WebLLM
        if (param === 'enable' && window.activeMirror) {
          window.activeMirror.enableWebLLM?.();
        }
        break;

      case 'focus':
        // Focus an element
        if (param === 'input') {
          document.getElementById('user-input')?.focus();
        }
        break;

      case 'email':
        // Show email capture
        if (param === 'capture') {
          this.showEmailCapture();
        }
        break;
    }

    if (this.onDismiss) {
      this.onDismiss(nudgeId, action);
    }
  }

  /**
   * Dismiss a nudge
   */
  dismiss(id) {
    this.dismissedNudges.add(id);
    this.saveDismissed();

    if (this.onDismiss) {
      this.onDismiss(id, 'dismiss');
    }
  }

  /**
   * Show email capture modal
   */
  showEmailCapture() {
    // Remove any existing modal
    document.querySelector('.email-capture-modal')?.remove();

    const modal = document.createElement('div');
    modal.className = 'email-capture-modal';
    modal.innerHTML = `
      <div class="email-capture-backdrop"></div>
      <div class="email-capture-content">
        <button class="email-capture-close">×</button>
        <div class="email-capture-icon">◈</div>
        <h3>Join the MirrorDNA Waitlist</h3>
        <p>Be first to know when the full sovereign AI stack launches.</p>
        <form class="email-capture-form">
          <input type="email" placeholder="your@email.com" required>
          <button type="submit">Join Waitlist</button>
        </form>
        <p class="email-capture-note">No spam, ever. Unsubscribe anytime.</p>
      </div>
    `;

    // Close handlers
    modal.querySelector('.email-capture-backdrop').onclick = () => modal.remove();
    modal.querySelector('.email-capture-close').onclick = () => modal.remove();

    // Form handler
    modal.querySelector('form').onsubmit = async (e) => {
      e.preventDefault();
      const email = modal.querySelector('input').value;

      try {
        // Store locally (in real app, would POST to backend)
        localStorage.setItem('activemirror_email', email);
        localStorage.setItem('activemirror_email_date', new Date().toISOString());

        // Show success
        modal.querySelector('.email-capture-content').innerHTML = `
          <div class="email-capture-icon">✓</div>
          <h3>You're on the list!</h3>
          <p>We'll notify you at <strong>${email}</strong> when MirrorDNA launches.</p>
          <button class="email-capture-done">Done</button>
        `;
        modal.querySelector('.email-capture-done').onclick = () => modal.remove();

        // Track
        this.dismiss('join-waitlist');

      } catch (err) {
        alert('Something went wrong. Please try again.');
      }
    };

    document.body.appendChild(modal);
    modal.querySelector('input').focus();
  }

  /**
   * Track events
   */
  trackMessage() {
    this.messageCount++;
    this.lastInteraction = Date.now();
  }

  trackTierChange(tier) {
    this.currentTier = tier;
    this.tierChangeCount++;
    this.lastInteraction = Date.now();
  }

  trackInteraction() {
    this.lastInteraction = Date.now();
  }

  /**
   * Persistence
   */
  saveDismissed() {
    localStorage.setItem('activemirror_dismissed_nudges',
      JSON.stringify([...this.dismissedNudges]));
  }

  loadDismissed() {
    try {
      const saved = localStorage.getItem('activemirror_dismissed_nudges');
      if (saved) {
        this.dismissedNudges = new Set(JSON.parse(saved));
      }
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Reset all nudges (for testing)
   */
  reset() {
    this.dismissedNudges.clear();
    this.shownNudges.clear();
    this.messageCount = 0;
    this.tierChangeCount = 0;
    this.sessionStart = Date.now();
    localStorage.removeItem('activemirror_dismissed_nudges');
  }
}

// CSS for nudges
const nudgeStyles = `
  .nudge-toast {
    position: fixed;
    bottom: 100px;
    right: 24px;
    max-width: 360px;
    display: flex;
    gap: 12px;
    padding: 16px;
    background: var(--bg-secondary, #12121a);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    z-index: 1000;
    animation: nudgeIn 0.3s ease;
  }

  @keyframes nudgeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .nudge-icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  .nudge-body {
    flex: 1;
    min-width: 0;
  }

  .nudge-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary, #f0f0f5);
    margin-bottom: 4px;
  }

  .nudge-message {
    font-size: 13px;
    color: var(--text-secondary, #a0a0b0);
    line-height: 1.4;
    margin-bottom: 12px;
  }

  .nudge-actions {
    display: flex;
    gap: 8px;
  }

  .nudge-btn {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    border: none;
  }

  .nudge-btn.primary {
    background: var(--primary, #6366f1);
    color: white;
  }

  .nudge-btn.primary:hover {
    background: #5558e3;
  }

  .nudge-btn.secondary {
    background: var(--bg-tertiary, #1a1a24);
    color: var(--text-secondary, #a0a0b0);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
  }

  .nudge-btn.secondary:hover {
    background: var(--bg-hover, #22222e);
    color: var(--text-primary, #f0f0f5);
  }

  .nudge-close {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    color: var(--text-muted, #606070);
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
  }

  .nudge-close:hover {
    color: var(--text-primary, #f0f0f5);
  }

  /* Email capture modal */
  .email-capture-modal {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .email-capture-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
  }

  .email-capture-content {
    position: relative;
    width: 90%;
    max-width: 400px;
    background: var(--bg-secondary, #12121a);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
    border-radius: 16px;
    padding: 32px;
    text-align: center;
    animation: modalIn 0.3s ease;
  }

  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  .email-capture-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    color: var(--text-muted, #606070);
    font-size: 24px;
    cursor: pointer;
  }

  .email-capture-icon {
    font-size: 48px;
    color: var(--primary, #6366f1);
    margin-bottom: 16px;
  }

  .email-capture-content h3 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-primary, #f0f0f5);
  }

  .email-capture-content p {
    font-size: 14px;
    color: var(--text-secondary, #a0a0b0);
    margin-bottom: 20px;
  }

  .email-capture-form {
    display: flex;
    gap: 8px;
  }

  .email-capture-form input {
    flex: 1;
    padding: 12px 16px;
    background: var(--bg-tertiary, #1a1a24);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
    border-radius: 8px;
    color: var(--text-primary, #f0f0f5);
    font-size: 14px;
  }

  .email-capture-form input:focus {
    outline: none;
    border-color: var(--primary, #6366f1);
  }

  .email-capture-form button {
    padding: 12px 20px;
    background: var(--primary, #6366f1);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
  }

  .email-capture-form button:hover {
    background: #5558e3;
  }

  .email-capture-note {
    font-size: 11px !important;
    color: var(--text-muted, #606070) !important;
    margin-top: 12px !important;
    margin-bottom: 0 !important;
  }

  .email-capture-done {
    padding: 12px 32px;
    background: var(--primary, #6366f1);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 16px;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = nudgeStyles;
  document.head.appendChild(styleEl);
}

// Export
window.NudgeEngine = NudgeEngine;
