/**
 * EVENT HUB — Central Event Wiring for ActiveMirror
 *
 * Connects all subsystems through a unified event architecture.
 * Listens for events from Quick Tools and routes them appropriately.
 */

class EventHub {
  constructor() {
    this.handlers = new Map();
    this.init();
  }

  init() {
    // === QUICK TOOLS EVENTS ===

    // Brain Dump Complete → Offer AI organization
    window.addEventListener('brain-dump-complete', (e) => {
      this.handleBrainDumpComplete(e.detail);
    });

    // Energy Matched → Update state and suggest tasks
    window.addEventListener('energy-matched', (e) => {
      this.handleEnergyMatched(e.detail);
    });

    // Panic Resolved → Log recovery, suggest reality
    window.addEventListener('panic-resolved', (e) => {
      this.handlePanicResolved(e.detail);
    });

    // Social Script Request → Route to AI
    window.addEventListener('social-script-request', (e) => {
      this.handleSocialScriptRequest(e.detail);
    });

    // Transition Complete → Track duration
    window.addEventListener('transition-complete', (e) => {
      this.handleTransitionComplete(e.detail);
    });

    // === COGNITIVE EVENTS ===

    // Cognitive State Changed → Cross-system effects
    window.addEventListener('cognitive-state-changed', (e) => {
      this.handleCognitiveStateChanged(e.detail);
    });

    // Energy Level Updated → Track patterns
    window.addEventListener('energy-level-updated', (e) => {
      this.handleEnergyLevelUpdated(e.detail);
    });

    console.log('⟡ Event Hub initialized — all systems connected');
  }

  // === EVENT HANDLERS ===

  handleBrainDumpComplete(detail) {
    const { dump, message } = detail || {};

    if (!dump) return;

    // Show completion toast
    this.showToast('🧠', message || `${dump.thoughts?.length || 0} thoughts captured`);

    // Offer to organize with AI
    this.suggestDumpOrganization(dump);

    // Track in localStorage for patterns
    localStorage.setItem('last_brain_dump', Date.now().toString());
  }

  suggestDumpOrganization(dump) {
    if (!dump.thoughts || dump.thoughts.length < 2) return;

    const prompt = document.createElement('div');
    prompt.className = 'event-hub-prompt';
    prompt.innerHTML = `
      <div class="ehp-content">
        <span class="ehp-icon">🧠</span>
        <div class="ehp-text">
          <strong>${dump.thoughts.length} thoughts captured</strong>
          <p>Would you like help organizing them?</p>
        </div>
        <div class="ehp-actions">
          <button class="ehp-yes">Organize</button>
          <button class="ehp-no">Later</button>
        </div>
      </div>
    `;

    document.body.appendChild(prompt);
    setTimeout(() => prompt.classList.add('visible'), 10);

    prompt.querySelector('.ehp-yes').addEventListener('click', () => {
      // Send to chat for AI processing
      const thoughtsText = dump.thoughts.map(t => `- ${typeof t === 'string' ? t : t.text}`).join('\n');
      const input = document.getElementById('user-input');
      if (input) {
        input.value = `Help me organize these thoughts into actionable items:\n${thoughtsText}`;
        input.focus();
        // Trigger auto-resize
        input.dispatchEvent(new Event('input'));
      }
      prompt.classList.remove('visible');
      setTimeout(() => prompt.remove(), 300);
    });

    prompt.querySelector('.ehp-no').addEventListener('click', () => {
      prompt.classList.remove('visible');
      setTimeout(() => prompt.remove(), 300);
    });

    // Auto-dismiss after 15 seconds
    setTimeout(() => {
      if (document.body.contains(prompt)) {
        prompt.classList.remove('visible');
        setTimeout(() => prompt.remove(), 300);
      }
    }, 15000);
  }

  handleEnergyMatched(detail) {
    const { message, tasks, suggestion, level } = detail || {};

    // Update energy level in localStorage
    const energyValues = { low: 30, medium: 60, high: 90 };
    const energyLevel = energyValues[level] || 60;
    localStorage.setItem('current_energy_level', energyLevel.toString());

    // Show matching tasks if available
    if (tasks && tasks.length > 0) {
      this.showEnergyTasks(tasks, message || `${tasks.length} tasks match your energy`);
    } else if (suggestion) {
      this.showToast('⚡', suggestion);
    } else if (message) {
      this.showToast('⚡', message);
    }

    // Emit for other systems
    window.dispatchEvent(new CustomEvent('energy-level-updated', {
      detail: { level, value: energyLevel }
    }));
  }

  showEnergyTasks(tasks, message) {
    const panel = document.createElement('div');
    panel.className = 'energy-tasks-panel';
    panel.innerHTML = `
      <div class="etp-header">
        <span class="etp-icon">⚡</span>
        <span class="etp-title">${message}</span>
        <button class="etp-close">×</button>
      </div>
      <div class="etp-tasks">
        ${tasks.slice(0, 5).map(t => `
          <div class="etp-task">
            <span class="task-text">${typeof t === 'string' ? t : t.text}</span>
            <button class="task-start" data-task="${typeof t === 'string' ? t : t.text}">Start</button>
          </div>
        `).join('')}
      </div>
    `;

    document.body.appendChild(panel);
    setTimeout(() => panel.classList.add('visible'), 10);

    panel.querySelector('.etp-close').addEventListener('click', () => {
      panel.classList.remove('visible');
      setTimeout(() => panel.remove(), 300);
    });

    panel.querySelectorAll('.task-start').forEach(btn => {
      btn.addEventListener('click', () => {
        const taskText = btn.dataset.task;
        // Start task with transition helper if available
        if (window.transitionHelper) {
          window.transitionHelper.startTransition('Previous task', taskText);
        }
        // Add to active task tracking
        localStorage.setItem('current_task', taskText);
        this.showToast('🎯', `Starting: ${taskText.substring(0, 40)}...`);
        panel.classList.remove('visible');
        setTimeout(() => panel.remove(), 300);
      });
    });

    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      if (document.body.contains(panel)) {
        panel.classList.remove('visible');
        setTimeout(() => panel.remove(), 300);
      }
    }, 30000);
  }

  handlePanicResolved(detail) {
    const { oneThing, urgent } = detail || {};

    // Log recovery pattern
    const panicLog = JSON.parse(localStorage.getItem('panic_recovery_log') || '[]');
    panicLog.push({
      timestamp: Date.now(),
      oneThing,
      urgentCount: urgent?.length || 0
    });
    // Keep last 50
    if (panicLog.length > 50) panicLog.shift();
    localStorage.setItem('panic_recovery_log', JSON.stringify(panicLog));

    // Suggest recovery reality
    if (window.realityComposer?.suggestReality) {
      window.realityComposer.suggestReality('recovery');
    }

    // If they identified one thing to focus on
    if (oneThing) {
      this.showToast('🎯', `Focus: ${oneThing}`);

      // Add to tasks widget if available
      this.addQuickTask(oneThing);

      // Capture wisdom for Future Self
      if (window.futureSelf?.captureWisdom) {
        window.futureSelf.captureWisdom({
          text: `When overwhelmed, I found relief by focusing on: ${oneThing}`,
          context: { type: 'panic_recovery' }
        });
      }
    }
  }

  addQuickTask(text) {
    // Try to add to tasks widget
    if (window.activeMirror?.widgets) {
      const tasksWidget = window.activeMirror.widgets.find(w => w.type === 'tasks');
      if (tasksWidget) {
        tasksWidget.data = tasksWidget.data || {};
        tasksWidget.data.items = tasksWidget.data.items || [];
        tasksWidget.data.items.unshift({
          text,
          done: false,
          addedFrom: 'panic_mode',
          addedAt: Date.now()
        });
        window.activeMirror.saveWidgets();
        window.activeMirror.renderWidgets();
      }
    }
  }

  handleSocialScriptRequest(detail) {
    const { need } = detail || {};

    if (!need) return;

    // Send to AI chat for help
    const input = document.getElementById('user-input');
    if (input) {
      input.value = `Help me write a message. I need to: ${need}. Please give me 2-3 options that sound natural and like me, not too formal.`;
      input.focus();
      input.dispatchEvent(new Event('input'));

      // Optional: auto-send
      // document.getElementById('send-btn')?.click();
    }

    this.showToast('✍️', 'I\'ll help you craft that message...');
  }

  handleTransitionComplete(detail) {
    const { duration, from, to } = detail || {};

    // Track transition for patterns
    const transitions = JSON.parse(localStorage.getItem('transition_log') || '[]');
    transitions.push({
      timestamp: Date.now(),
      durationMs: duration,
      from,
      to
    });

    // Keep last 100
    if (transitions.length > 100) transitions.shift();
    localStorage.setItem('transition_log', JSON.stringify(transitions));

    // Brief acknowledgment
    this.showToast('✓', 'Transition complete. You\'re ready.');
  }

  handleCognitiveStateChanged(detail) {
    const { from, to, config } = detail || {};

    // Log state change
    console.log(`⟡ Cognitive State: ${from || 'unknown'} → ${to || 'unknown'}`);

    // Track pattern
    const stateLog = JSON.parse(localStorage.getItem('cognitive_state_log') || '[]');
    stateLog.push({
      timestamp: Date.now(),
      from,
      to,
      overall: config?.overall
    });
    if (stateLog.length > 100) stateLog.shift();
    localStorage.setItem('cognitive_state_log', JSON.stringify(stateLog));
  }

  handleEnergyLevelUpdated(detail) {
    const { level, value } = detail || {};

    // Track energy pattern
    const energyLog = JSON.parse(localStorage.getItem('energy_log') || '[]');
    energyLog.push({
      timestamp: Date.now(),
      level,
      value
    });
    if (energyLog.length > 100) energyLog.shift();
    localStorage.setItem('energy_log', JSON.stringify(energyLog));
  }

  // === UTILITY METHODS ===

  showToast(icon, message) {
    const toast = document.createElement('div');
    toast.className = 'eh-toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 10);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// === STYLES ===
const eventHubStyles = document.createElement('style');
eventHubStyles.textContent = `
  .event-hub-prompt {
    position: fixed;
    bottom: 100px;
    right: 20px;
    background: rgba(18, 18, 26, 0.98);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
    border-radius: 12px;
    padding: 16px;
    max-width: 320px;
    z-index: 2000;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    backdrop-filter: blur(20px);
  }

  .event-hub-prompt.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .ehp-content { display: flex; flex-direction: column; gap: 12px; }
  .ehp-icon { font-size: 24px; }
  .ehp-text strong { display: block; margin-bottom: 4px; color: var(--text-primary, #f0f0f5); }
  .ehp-text p { margin: 0; font-size: 12px; color: var(--text-secondary, #a0a0b0); }

  .ehp-actions { display: flex; gap: 8px; }
  .ehp-yes {
    flex: 1;
    padding: 8px;
    background: var(--primary, #6366f1);
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }
  .ehp-yes:hover { filter: brightness(1.1); }
  .ehp-no {
    padding: 8px 12px;
    background: transparent;
    border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
    border-radius: 6px;
    color: var(--text-muted, #606070);
    cursor: pointer;
    transition: all 0.2s;
  }
  .ehp-no:hover { background: var(--bg-tertiary, #1a1a24); }

  .energy-tasks-panel {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: rgba(18, 18, 26, 0.98);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
    border-radius: 12px;
    padding: 16px;
    min-width: 300px;
    max-width: 400px;
    z-index: 2000;
    opacity: 0;
    transition: all 0.3s ease;
    backdrop-filter: blur(20px);
  }

  .energy-tasks-panel.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .etp-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--glass-border, rgba(255,255,255,0.08));
  }

  .etp-icon { font-size: 18px; }
  .etp-title { flex: 1; font-weight: 500; color: var(--text-primary, #f0f0f5); }
  .etp-close {
    background: none;
    border: none;
    color: var(--text-muted, #606070);
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
  }
  .etp-close:hover { background: var(--bg-tertiary, #1a1a24); }

  .etp-tasks { display: flex; flex-direction: column; gap: 8px; }

  .etp-task {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: var(--bg-tertiary, #1a1a24);
    border-radius: 8px;
    gap: 12px;
  }

  .task-text {
    flex: 1;
    font-size: 13px;
    color: var(--text-primary, #f0f0f5);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .task-start {
    padding: 4px 12px;
    background: var(--primary, #6366f1);
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 12px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .task-start:hover { filter: brightness(1.1); }

  .eh-toast {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    background: rgba(18, 18, 26, 0.98);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
    border-radius: 8px;
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 2001;
    backdrop-filter: blur(20px);
  }

  .eh-toast.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .toast-icon { font-size: 18px; }
  .toast-message { font-size: 14px; color: var(--text-primary, #f0f0f5); }

  /* Light theme support */
  [data-theme="light"] .event-hub-prompt,
  [data-theme="light"] .energy-tasks-panel,
  [data-theme="light"] .eh-toast {
    background: rgba(255, 255, 255, 0.98);
    border-color: rgba(0, 0, 0, 0.1);
  }
`;
document.head.appendChild(eventHubStyles);

// Initialize on load
window.eventHub = new EventHub();
