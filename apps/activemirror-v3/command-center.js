/**
 * COMMAND CENTER — Your Life at a Glance
 *
 * A single point of awareness. Tap to see:
 * - Your current state (energy, focus, mood)
 * - What's coming (predictions, warnings)
 * - Quick actions (focus mode, break, future self)
 * - All Life Stack tools in one place
 *
 * Design principle: Glanceable → Actionable → Invisible
 */

class CommandCenter {
  constructor() {
    this.isOpen = false;
    this.currentState = {
      energy: 70,
      focus: 60,
      mood: 65,
      overall: 65
    };
    this.predictions = [];
    this.activeMode = null; // 'focus', 'break', 'recovery'
    this.modeStartTime = null;

    // Wait for DOM and other systems
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      setTimeout(() => this.init(), 100);
    }
  }

  init() {
    // Don't render until user enters app
    this.waitForAppEntry();
  }

  waitForAppEntry() {
    // Check if main-app is visible
    const checkApp = () => {
      const mainApp = document.getElementById('main-app');
      if (mainApp && !mainApp.classList.contains('hidden')) {
        this.render();
        this.startStateMonitoring();
        this.startPredictionEngine();
      } else {
        setTimeout(checkApp, 500);
      }
    };
    checkApp();
  }

  render() {
    // Create the command center icon (below agent dock)
    const icon = document.createElement('div');
    icon.id = 'command-center-icon';
    icon.className = 'command-icon';
    icon.innerHTML = `
      <div class="command-icon-inner" title="Command Center">
        <div class="command-pulse"></div>
        <span class="command-icon-symbol">⟡</span>
        <span class="command-score">${this.currentState.overall}</span>
      </div>
    `;

    // Create the panel
    const panel = document.createElement('div');
    panel.id = 'command-center-panel';
    panel.className = 'command-panel hidden';
    panel.innerHTML = this.renderPanelContent();

    // Append to bottom-left dock if exists, otherwise body
    const dock = document.getElementById('bottom-left-dock');
    if (dock) {
      dock.appendChild(icon);
      dock.appendChild(panel);
    } else {
      document.body.appendChild(icon);
      document.body.appendChild(panel);
    }

    // Event listeners
    icon.addEventListener('click', () => this.toggle());

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen &&
          !panel.contains(e.target) &&
          !icon.contains(e.target)) {
        this.close();
      }
    });

    // Setup panel interactions
    this.setupPanelEvents();

    // Initial state sync
    this.syncWithQuantumSelf();
  }

  renderPanelContent() {
    return `
      <div class="command-header">
        <div class="command-title">
          <span class="command-greeting">${this.getGreeting()}</span>
          <span class="command-time">${this.getTimeContext()}</span>
        </div>
        <button class="command-close">×</button>
      </div>

      <div class="command-state">
        <div class="state-ring" id="state-ring">
          <svg viewBox="0 0 100 100">
            <circle class="state-ring-bg" cx="50" cy="50" r="45"/>
            <circle class="state-ring-fill" cx="50" cy="50" r="45"
              stroke-dasharray="${this.currentState.overall * 2.83} 283"
              stroke-dashoffset="0"/>
          </svg>
          <div class="state-ring-content">
            <span class="state-score" id="main-score">${this.currentState.overall}</span>
            <span class="state-label">Overall</span>
          </div>
        </div>
        <div class="state-dimensions">
          <div class="dimension" data-dim="energy">
            <span class="dim-icon">⚡</span>
            <div class="dim-bar"><div class="dim-fill" style="width:${this.currentState.energy}%"></div></div>
            <span class="dim-value">${this.currentState.energy}</span>
          </div>
          <div class="dimension" data-dim="focus">
            <span class="dim-icon">🎯</span>
            <div class="dim-bar"><div class="dim-fill" style="width:${this.currentState.focus}%"></div></div>
            <span class="dim-value">${this.currentState.focus}</span>
          </div>
          <div class="dimension" data-dim="mood">
            <span class="dim-icon">💜</span>
            <div class="dim-bar"><div class="dim-fill" style="width:${this.currentState.mood}%"></div></div>
            <span class="dim-value">${this.currentState.mood}</span>
          </div>
        </div>
      </div>

      <div class="command-predictions" id="predictions-section">
        <div class="predictions-header">
          <span>Predictions</span>
          <span class="predictions-status" id="pred-status">Analyzing...</span>
        </div>
        <div class="predictions-list" id="predictions-list">
          <!-- Populated dynamically -->
        </div>
      </div>

      <div class="command-actions">
        <button class="action-btn" data-action="focus">
          <span class="action-icon">🧘</span>
          <span class="action-label">Focus Mode</span>
        </button>
        <button class="action-btn" data-action="break">
          <span class="action-icon">☕</span>
          <span class="action-label">Take Break</span>
        </button>
        <button class="action-btn" data-action="future">
          <span class="action-icon">🔮</span>
          <span class="action-label">Future Self</span>
        </button>
        <button class="action-btn" data-action="dump">
          <span class="action-icon">🧠</span>
          <span class="action-label">Brain Dump</span>
        </button>
      </div>

      <div class="command-tools">
        <div class="tools-header">Quick Tools</div>
        <div class="tools-grid">
          <button class="tool-btn" data-tool="energy" title="Log Energy">⚡</button>
          <button class="tool-btn" data-tool="capture" title="Quick Capture">📝</button>
          <button class="tool-btn" data-tool="breathe" title="Breathe">🌬️</button>
          <button class="tool-btn" data-tool="reality" title="Reality Composer">🎭</button>
        </div>
      </div>

      <div class="command-insight" id="insight-section">
        <div class="insight-content" id="insight-content">
          <!-- Dynamic insight -->
        </div>
      </div>
    `;
  }

  setupPanelEvents() {
    const panel = document.getElementById('command-center-panel');
    if (!panel) return;

    // Close button
    panel.querySelector('.command-close')?.addEventListener('click', () => this.close());

    // Action buttons
    panel.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleAction(btn.dataset.action));
    });

    // Tool buttons
    panel.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleTool(btn.dataset.tool));
    });
  }

  handleAction(action) {
    switch(action) {
      case 'focus':
        this.startFocusMode();
        break;
      case 'break':
        this.startBreak();
        break;
      case 'future':
        this.openFutureSelf();
        break;
      case 'dump':
        this.openBrainDump();
        break;
    }
    this.close();
  }

  handleTool(tool) {
    switch(tool) {
      case 'energy':
        this.logEnergy();
        break;
      case 'capture':
        this.quickCapture();
        break;
      case 'breathe':
        this.startBreathing();
        break;
      case 'reality':
        this.openRealityComposer();
        break;
    }
  }

  // === STATE MANAGEMENT ===

  syncWithQuantumSelf() {
    const qs = window.quantumSelf;
    if (!qs) return;

    const state = qs.currentState || {};
    this.currentState = {
      energy: state.physical || 70,
      focus: state.cognitive || 60,
      mood: state.emotional || 65,
      overall: qs.getWellnessScore?.() || 65
    };

    this.predictions = qs.predictions || [];
    this.updateDisplay();
  }

  startStateMonitoring() {
    // Sync every 30 seconds
    setInterval(() => this.syncWithQuantumSelf(), 30000);

    // Listen for state changes
    window.addEventListener('quantum-state-updated', () => {
      this.syncWithQuantumSelf();
    });
  }

  updateDisplay() {
    // Update icon
    const scoreEl = document.querySelector('.command-score');
    if (scoreEl) scoreEl.textContent = this.currentState.overall;

    // Update icon pulse based on state
    const iconInner = document.querySelector('.command-icon-inner');
    if (iconInner) {
      iconInner.classList.remove('state-good', 'state-warning', 'state-alert');
      if (this.currentState.overall >= 70) {
        iconInner.classList.add('state-good');
      } else if (this.currentState.overall >= 40) {
        iconInner.classList.add('state-warning');
      } else {
        iconInner.classList.add('state-alert');
      }
    }

    // Update panel if open
    if (this.isOpen) {
      this.updatePanelDisplay();
    }
  }

  updatePanelDisplay() {
    // Score
    const mainScore = document.getElementById('main-score');
    if (mainScore) mainScore.textContent = this.currentState.overall;

    // Ring
    const ring = document.querySelector('.state-ring-fill');
    if (ring) {
      ring.setAttribute('stroke-dasharray', `${this.currentState.overall * 2.83} 283`);
    }

    // Dimensions
    const dims = ['energy', 'focus', 'mood'];
    dims.forEach(dim => {
      const dimEl = document.querySelector(`[data-dim="${dim}"]`);
      if (dimEl) {
        const fill = dimEl.querySelector('.dim-fill');
        const value = dimEl.querySelector('.dim-value');
        if (fill) fill.style.width = `${this.currentState[dim]}%`;
        if (value) value.textContent = this.currentState[dim];
      }
    });

    // Predictions
    this.updatePredictions();

    // Insight
    this.updateInsight();
  }

  // === PREDICTION ENGINE ===

  startPredictionEngine() {
    // Initial prediction
    this.generatePredictions();

    // Re-predict every 5 minutes
    setInterval(() => this.generatePredictions(), 300000);
  }

  generatePredictions() {
    const predictions = [];
    const hour = new Date().getHours();
    const dayOfWeek = new Date().getDay();
    const energy = this.currentState.energy;
    const focus = this.currentState.focus;
    const mood = this.currentState.mood;
    const overall = this.currentState.overall;

    // === MORNING PATTERNS ===
    if (hour >= 6 && hour < 9) {
      if (energy < 40) {
        predictions.push({
          type: 'morning_slow',
          icon: '☕',
          title: 'Slow morning start',
          desc: 'Energy is low. Give yourself time to warm up.',
          action: null,
          urgency: 'info'
        });
      } else if (energy > 70 && focus > 60) {
        predictions.push({
          type: 'morning_prime',
          icon: '🌅',
          title: 'Morning prime time',
          desc: 'You\'re starting strong. Tackle important tasks now.',
          action: 'focus',
          actionLabel: 'Start focus mode',
          urgency: 'positive'
        });
      }
    }

    // === PEAK FLOW WINDOWS ===
    if (energy > 70 && focus > 65 && hour >= 9 && hour <= 12) {
      predictions.push({
        type: 'flow',
        icon: '🌊',
        title: 'Flow window open',
        desc: 'Your focus is high. Prime time for deep work.',
        action: 'focus',
        actionLabel: 'Start focus mode',
        urgency: 'positive'
      });
    }

    // === AFTERNOON CRASH PREDICTION ===
    if (energy < 50 && hour >= 13 && hour <= 16) {
      predictions.push({
        type: 'crash',
        icon: '⚠️',
        title: 'Energy dip detected',
        desc: 'Afternoon slump. A short break will help more than pushing through.',
        action: 'break',
        actionLabel: 'Take 10min break',
        urgency: 'warning'
      });
    }

    // === FOCUS RECOVERY ===
    if (focus < 40) {
      predictions.push({
        type: 'recovery',
        icon: '🔄',
        title: 'Attention scattered',
        desc: 'Your focus is fragmented. A brain dump might help clear the mental load.',
        action: 'dump',
        actionLabel: 'Brain dump',
        urgency: 'info'
      });
    }

    // === MOOD-BASED INSIGHTS ===
    if (mood < 40 && energy > 50) {
      predictions.push({
        type: 'mood_low',
        icon: '💜',
        title: 'Emotional dip noticed',
        desc: 'You have energy but mood is low. Reach out to someone or take a mindful break.',
        action: 'break',
        actionLabel: 'Mindful break',
        urgency: 'warning'
      });
    }

    // === BURNOUT WARNING ===
    if (overall < 35) {
      predictions.push({
        type: 'burnout',
        icon: '🔥',
        title: 'Running on empty',
        desc: 'All indicators are low. Please stop and rest. This is not sustainable.',
        action: 'break',
        actionLabel: 'Rest now',
        urgency: 'warning'
      });
    }

    // === WEEKEND MODE ===
    if ((dayOfWeek === 0 || dayOfWeek === 6) && hour >= 10 && hour <= 18) {
      if (focus > 60 && energy > 50) {
        predictions.push({
          type: 'weekend_work',
          icon: '📅',
          title: 'Weekend productivity',
          desc: 'You\'re in a good state. But remember to also rest.',
          action: null,
          urgency: 'info'
        });
      }
    }

    // === LATE NIGHT ===
    if (hour >= 22 || hour < 5) {
      predictions.push({
        type: 'late_night',
        icon: '🌙',
        title: 'It\'s late',
        desc: 'Quality sleep is foundational. Consider wrapping up.',
        action: null,
        urgency: 'info'
      });
    } else if (hour >= 20) {
      predictions.push({
        type: 'winddown',
        icon: '🌆',
        title: 'Wind-down time',
        desc: 'Evening hours. Start transitioning out of work mode.',
        action: null,
        urgency: 'info'
      });
    }

    // === OPTIMAL STATE ===
    if (overall > 75 && predictions.length === 0) {
      predictions.push({
        type: 'optimal',
        icon: '⟡',
        title: 'You\'re in a great state',
        desc: 'Energy, focus, and mood are all aligned. Make this count.',
        action: 'focus',
        actionLabel: 'Deep work',
        urgency: 'positive'
      });
    }

    // === ALL CLEAR ===
    if (predictions.length === 0) {
      predictions.push({
        type: 'clear',
        icon: '✓',
        title: 'All systems nominal',
        desc: 'No interventions needed. Keep doing what you\'re doing.',
        action: null,
        urgency: 'positive'
      });
    }

    this.predictions = predictions;
    this.updatePredictions();
  }

  updatePredictions() {
    const list = document.getElementById('predictions-list');
    const status = document.getElementById('pred-status');
    if (!list) return;

    if (status) {
      status.textContent = this.predictions.length > 0 && this.predictions[0].type !== 'clear'
        ? `${this.predictions.length} active`
        : 'All clear';
    }

    list.innerHTML = this.predictions.map(p => `
      <div class="prediction-item ${p.urgency}">
        <span class="pred-icon">${p.icon}</span>
        <div class="pred-content">
          <div class="pred-title">${p.title}</div>
          <div class="pred-desc">${p.desc}</div>
        </div>
        ${p.action ? `<button class="pred-action" data-action="${p.action}">${p.actionLabel}</button>` : ''}
      </div>
    `).join('');

    // Add event listeners to prediction actions
    list.querySelectorAll('.pred-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleAction(btn.dataset.action);
      });
    });
  }

  updateInsight() {
    const insightEl = document.getElementById('insight-content');
    if (!insightEl) return;

    const insights = this.generateInsights();
    if (insights.length > 0) {
      const insight = insights[0];
      insightEl.innerHTML = `
        <span class="insight-icon">${insight.icon}</span>
        <span class="insight-text">${insight.text}</span>
      `;
    }
  }

  generateInsights() {
    const insights = [];
    const qs = window.quantumSelf;
    const guidance = qs?.getDailyGuidance?.() || {};

    if (guidance.focus) {
      insights.push({
        icon: '💡',
        text: guidance.focus
      });
    }

    if (guidance.bodyWisdom) {
      insights.push({
        icon: '🧘',
        text: guidance.bodyWisdom
      });
    }

    // Default insight
    if (insights.length === 0) {
      insights.push({
        icon: '⟡',
        text: 'Take a moment to check in with yourself.'
      });
    }

    return insights;
  }

  // === ACTIONS ===

  startFocusMode() {
    this.activeMode = 'focus';
    this.modeStartTime = Date.now();

    // Update icon to show focus mode
    const icon = document.getElementById('command-center-icon');
    if (icon) icon.classList.add('mode-focus');

    // Notify user
    this.showNotification('🧘 Focus mode active', 'Notifications silenced. Deep work time.');

    // Trigger cognitive bridge if available
    if (window.cognitiveBridgeUI?.bridge) {
      window.cognitiveBridgeUI.bridge.enterFocusMode?.();
    }

    // Auto-end after 25 minutes (pomodoro)
    setTimeout(() => {
      if (this.activeMode === 'focus') {
        this.endFocusMode();
      }
    }, 25 * 60 * 1000);
  }

  endFocusMode() {
    this.activeMode = null;
    const icon = document.getElementById('command-center-icon');
    if (icon) icon.classList.remove('mode-focus');
    this.showNotification('✓ Focus session complete', '25 minutes of deep work. Nice!');
  }

  startBreak() {
    this.activeMode = 'break';
    this.modeStartTime = Date.now();

    const icon = document.getElementById('command-center-icon');
    if (icon) icon.classList.add('mode-break');

    this.showBreakOverlay();
  }

  showBreakOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'break-overlay';
    overlay.className = 'break-overlay';
    overlay.innerHTML = `
      <div class="break-content">
        <div class="break-icon">☕</div>
        <div class="break-title">Break Time</div>
        <div class="break-timer" id="break-timer">10:00</div>
        <div class="break-suggestion">Step away from the screen. Stretch. Hydrate.</div>
        <button class="break-end" id="break-end">End Break</button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Timer
    let remaining = 10 * 60;
    const timerEl = document.getElementById('break-timer');
    const interval = setInterval(() => {
      remaining--;
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      if (timerEl) timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
      if (remaining <= 0) {
        clearInterval(interval);
        this.endBreak();
      }
    }, 1000);

    // End button
    document.getElementById('break-end')?.addEventListener('click', () => {
      clearInterval(interval);
      this.endBreak();
    });
  }

  endBreak() {
    this.activeMode = null;
    const icon = document.getElementById('command-center-icon');
    if (icon) icon.classList.remove('mode-break');
    document.getElementById('break-overlay')?.remove();
    this.showNotification('✓ Break complete', 'Refreshed and ready to go!');
  }

  openFutureSelf() {
    // Check for Future Self button created by FutureSelfUI
    const futureSelfBtn = document.querySelector('.future-self-btn');
    if (futureSelfBtn) {
      futureSelfBtn.click();
      return;
    }

    // Check for FutureSelfUI panel
    const futureSelfPanel = document.getElementById('future-self-panel');
    if (futureSelfPanel) {
      futureSelfPanel.classList.toggle('hidden');
      return;
    }

    // Use Future Self API directly if available
    if (window.futureSelf?.consultFutureSelf) {
      const context = `I'm checking in. Energy: ${this.currentState.energy}, Focus: ${this.currentState.focus}, Mood: ${this.currentState.mood}`;
      window.futureSelf.consultFutureSelf(context).then(response => {
        this.showInlineFutureSelf(response);
      });
      return;
    }

    // Initialize if not present
    if (window.initFutureSelfUI) {
      window.initFutureSelfUI();
      setTimeout(() => {
        document.querySelector('.future-self-btn')?.click();
      }, 200);
      return;
    }

    this.showNotification('🔮 Future Self', 'Take a moment to reflect on what future you would say.');
  }

  showInlineFutureSelf(response) {
    // Remove existing panel if any
    document.querySelector('.future-self-inline')?.remove();

    const panel = document.createElement('div');
    panel.className = 'future-self-inline';
    panel.innerHTML = `
      <div class="fsi-header">
        <span class="fsi-icon">🔮</span>
        <span class="fsi-title">Future You Says</span>
        <button class="fsi-close">×</button>
      </div>
      <div class="fsi-content">
        ${response.greeting ? `<p class="fsi-greeting">${response.greeting}</p>` : ''}
        ${response.acknowledgment ? `<p class="fsi-ack">${response.acknowledgment}</p>` : ''}
        ${response.wisdom ? `<p class="fsi-wisdom">${response.wisdom}</p>` : ''}
        ${response.encouragement ? `<p class="fsi-encouragement">${response.encouragement}</p>` : ''}
        ${response.question ? `<p class="fsi-question"><em>${response.question}</em></p>` : ''}
      </div>
    `;

    // Add styles if not present
    if (!document.querySelector('#fsi-styles')) {
      const styles = document.createElement('style');
      styles.id = 'fsi-styles';
      styles.textContent = `
        .future-self-inline {
          position: fixed;
          bottom: 100px;
          right: 80px;
          width: 340px;
          background: rgba(18, 18, 26, 0.98);
          border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
          border-radius: 16px;
          padding: 20px;
          z-index: 2000;
          animation: fsiSlide 0.3s ease;
          backdrop-filter: blur(20px);
        }
        @keyframes fsiSlide {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fsi-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--glass-border, rgba(255,255,255,0.08));
        }
        .fsi-icon { font-size: 24px; }
        .fsi-title { flex: 1; font-weight: 600; color: var(--text-primary, #f0f0f5); }
        .fsi-close {
          background: none;
          border: none;
          color: var(--text-muted, #606070);
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .fsi-close:hover { background: var(--bg-tertiary, #1a1a24); }
        .fsi-content p { margin: 0 0 12px 0; line-height: 1.5; }
        .fsi-greeting { color: var(--text-secondary, #a0a0b0); font-size: 13px; }
        .fsi-ack { color: var(--text-primary, #f0f0f5); font-size: 14px; }
        .fsi-wisdom {
          color: var(--primary, #6366f1);
          font-weight: 500;
          padding: 12px;
          background: var(--primary-soft, rgba(99,102,241,0.1));
          border-radius: 8px;
        }
        .fsi-encouragement { color: var(--success, #10b981); font-size: 13px; }
        .fsi-question { color: var(--text-secondary, #a0a0b0); font-size: 13px; }
        [data-theme="light"] .future-self-inline {
          background: rgba(255, 255, 255, 0.98);
          border-color: rgba(0, 0, 0, 0.1);
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(panel);
    panel.querySelector('.fsi-close').addEventListener('click', () => panel.remove());

    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      if (document.body.contains(panel)) panel.remove();
    }, 30000);
  }

  openBrainDump() {
    if (window.brainDump?.open) {
      window.brainDump.open();
    } else {
      this.showNotification('🧠 Brain Dump', 'Coming soon...');
    }
  }

  logEnergy() {
    if (window.energyMatcher?.showPicker) {
      window.energyMatcher.showPicker();
    } else {
      this.showNotification('⚡ Energy', 'Log how you\'re feeling right now.');
    }
  }

  quickCapture() {
    if (window.quickCapture?.showInput) {
      window.quickCapture.showInput();
    } else {
      this.showNotification('📝 Capture', 'Quick note feature loading...');
    }
  }

  startBreathing() {
    if (window.panicMode?.activate) {
      window.panicMode.activate();
    } else {
      this.showNotification('🌬️ Breathe', 'Take 3 deep breaths. In... Out...');
    }
  }

  openRealityComposer() {
    // Look for Reality Composer panel
    const panel = document.querySelector('.reality-composer-panel');
    if (panel) {
      const menu = panel.querySelector('.rc-menu');
      if (menu) {
        menu.classList.toggle('hidden');
      }
      return;
    }

    // Look for toggle button
    const toggle = document.querySelector('.rc-toggle');
    if (toggle) {
      toggle.click();
      return;
    }

    // Initialize if not present
    if (window.initRealityComposerUI) {
      window.initRealityComposerUI();
      setTimeout(() => {
        document.querySelector('.rc-toggle')?.click();
      }, 200);
      return;
    }

    this.showNotification('🎭 Reality Composer', 'Environment control loading...');
  }

  // === UI HELPERS ===

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    const panel = document.getElementById('command-center-panel');
    const icon = document.getElementById('command-center-icon');
    if (!panel) return;

    this.isOpen = true;
    panel.classList.remove('hidden');
    icon?.classList.add('active');
    this.updatePanelDisplay();
  }

  close() {
    const panel = document.getElementById('command-center-panel');
    const icon = document.getElementById('command-center-icon');
    if (!panel) return;

    this.isOpen = false;
    panel.classList.add('hidden');
    icon?.classList.remove('active');
  }

  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  getTimeContext() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  showNotification(title, body) {
    const toast = document.createElement('div');
    toast.className = 'command-toast';
    toast.innerHTML = `
      <div class="toast-title">${title}</div>
      <div class="toast-body">${body}</div>
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
const commandCenterStyles = document.createElement('style');
commandCenterStyles.textContent = `
  /* Command Center Icon */
  .command-icon {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
    cursor: pointer;
  }

  .command-icon-inner {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(99, 102, 241, 0.2));
    border: 2px solid rgba(16, 185, 129, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .command-icon-inner:hover {
    transform: scale(1.1);
    border-color: var(--sovereign);
    box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
  }

  .command-icon.active .command-icon-inner {
    border-color: var(--sovereign);
    box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
  }

  .command-pulse {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid var(--sovereign);
    opacity: 0;
    animation: commandPulse 2s ease-out infinite;
  }

  @keyframes commandPulse {
    0% { transform: scale(1); opacity: 0.5; }
    100% { transform: scale(1.3); opacity: 0; }
  }

  .command-icon-symbol {
    font-size: 20px;
    line-height: 1;
  }

  .command-score {
    font-size: 11px;
    font-weight: 700;
    color: var(--sovereign);
    font-family: var(--font-mono);
  }

  /* State colors */
  .command-icon-inner.state-good { border-color: var(--sovereign); }
  .command-icon-inner.state-good .command-score { color: var(--sovereign); }

  .command-icon-inner.state-warning { border-color: var(--warning); }
  .command-icon-inner.state-warning .command-score { color: var(--warning); }
  .command-icon-inner.state-warning .command-pulse { border-color: var(--warning); }

  .command-icon-inner.state-alert { border-color: var(--error); }
  .command-icon-inner.state-alert .command-score { color: var(--error); }
  .command-icon-inner.state-alert .command-pulse { border-color: var(--error); }

  /* Mode indicators */
  .command-icon.mode-focus .command-icon-inner {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(99, 102, 241, 0.3));
    border-color: var(--frontier);
  }

  .command-icon.mode-break .command-icon-inner {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(16, 185, 129, 0.3));
    border-color: var(--warning);
  }

  /* Command Panel */
  .command-panel {
    position: fixed;
    bottom: 90px;
    left: 20px;
    width: 320px;
    max-height: calc(100vh - 120px);
    background: rgba(18, 18, 26, 0.98);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    z-index: 999;
    overflow: hidden;
    backdrop-filter: blur(20px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: panelSlideIn 0.3s ease;
  }

  .command-panel.hidden {
    display: none;
  }

  @keyframes panelSlideIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .command-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid var(--glass-border);
  }

  .command-greeting {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .command-time {
    font-size: 12px;
    color: var(--text-muted);
    margin-left: 8px;
    font-family: var(--font-mono);
  }

  .command-close {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 20px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
  }

  .command-close:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  /* State Section */
  .command-state {
    display: flex;
    gap: 16px;
    padding: 16px;
    border-bottom: 1px solid var(--glass-border);
  }

  .state-ring {
    width: 80px;
    height: 80px;
    position: relative;
  }

  .state-ring svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .state-ring-bg {
    fill: none;
    stroke: var(--bg-tertiary);
    stroke-width: 8;
  }

  .state-ring-fill {
    fill: none;
    stroke: var(--sovereign);
    stroke-width: 8;
    stroke-linecap: round;
    transition: stroke-dasharray 0.5s ease;
  }

  .state-ring-content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .state-score {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    font-family: var(--font-mono);
  }

  .state-label {
    font-size: 10px;
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .state-dimensions {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
  }

  .dimension {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dim-icon {
    font-size: 14px;
    width: 20px;
    text-align: center;
  }

  .dim-bar {
    flex: 1;
    height: 6px;
    background: var(--bg-tertiary);
    border-radius: 3px;
    overflow: hidden;
  }

  .dim-fill {
    height: 100%;
    background: var(--sovereign);
    border-radius: 3px;
    transition: width 0.5s ease;
  }

  .dim-value {
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--text-muted);
    width: 24px;
    text-align: right;
  }

  /* Predictions */
  .command-predictions {
    padding: 12px 16px;
    border-bottom: 1px solid var(--glass-border);
  }

  .predictions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .predictions-status {
    font-size: 10px;
    color: var(--sovereign);
  }

  .prediction-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px;
    background: var(--bg-tertiary);
    border-radius: 8px;
    margin-bottom: 6px;
  }

  .prediction-item:last-child {
    margin-bottom: 0;
  }

  .prediction-item.warning {
    background: rgba(245, 158, 11, 0.1);
    border-left: 3px solid var(--warning);
  }

  .prediction-item.positive {
    background: rgba(16, 185, 129, 0.1);
    border-left: 3px solid var(--sovereign);
  }

  .prediction-item.info {
    background: rgba(99, 102, 241, 0.1);
    border-left: 3px solid var(--primary);
  }

  .pred-icon {
    font-size: 16px;
    line-height: 1;
  }

  .pred-content {
    flex: 1;
    min-width: 0;
  }

  .pred-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .pred-desc {
    font-size: 11px;
    color: var(--text-secondary);
    margin-top: 2px;
  }

  .pred-action {
    padding: 4px 10px;
    background: var(--bg-hover);
    border: 1px solid var(--glass-border);
    border-radius: 4px;
    color: var(--text-secondary);
    font-size: 10px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
  }

  .pred-action:hover {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
  }

  /* Actions */
  .command-actions {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--glass-border);
  }

  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px 8px;
    background: var(--bg-tertiary);
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-btn:hover {
    background: var(--bg-hover);
    border-color: var(--primary);
    transform: translateY(-2px);
  }

  .action-icon {
    font-size: 20px;
  }

  .action-label {
    font-size: 9px;
    color: var(--text-muted);
    text-align: center;
  }

  /* Tools */
  .command-tools {
    padding: 12px 16px;
    border-bottom: 1px solid var(--glass-border);
  }

  .tools-header {
    font-size: 11px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .tools-grid {
    display: flex;
    gap: 8px;
  }

  .tool-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-tertiary);
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .tool-btn:hover {
    background: var(--bg-hover);
    border-color: var(--primary);
    transform: scale(1.1);
  }

  /* Insight */
  .command-insight {
    padding: 12px 16px;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(99, 102, 241, 0.05));
  }

  .insight-content {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.4;
  }

  .insight-icon {
    font-size: 16px;
  }

  /* Toast */
  .command-toast {
    position: fixed;
    bottom: 90px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--bg-secondary);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    padding: 12px 20px;
    z-index: 2000;
    opacity: 0;
    transition: all 0.3s ease;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .command-toast.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .toast-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .toast-body {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 2px;
  }

  /* Break Overlay */
  .break-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 10, 15, 0.98);
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .break-content {
    text-align: center;
  }

  .break-icon {
    font-size: 64px;
    margin-bottom: 20px;
  }

  .break-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 10px;
  }

  .break-timer {
    font-size: 48px;
    font-family: var(--font-mono);
    color: var(--sovereign);
    margin-bottom: 20px;
  }

  .break-suggestion {
    font-size: 16px;
    color: var(--text-secondary);
    margin-bottom: 30px;
  }

  .break-end {
    padding: 12px 32px;
    background: var(--bg-tertiary);
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .break-end:hover {
    background: var(--primary);
    border-color: var(--primary);
  }
`;
document.head.appendChild(commandCenterStyles);

// === INITIALIZE ===
window.CommandCenter = CommandCenter;
window.commandCenter = new CommandCenter();

console.log('⟡ Command Center loaded — your life at a glance');
