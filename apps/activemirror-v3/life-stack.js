/**
 * THE LIFE STACK — Personal Tools Working Together
 *
 * Different tools that help with different things.
 * Not magic, just helpful. Still learning. You're in control.
 *
 * LAYER 1: HELPERS
 * - Research, Organizer, Builder, Thinking, Decisions
 * - Memory that helps you remember things
 * - Reminders when they might be useful
 *
 * LAYER 2: COGNITIVE BRIDGE
 * - Neurodivergent support (ADHD, Autism, AuDHD)
 * - Cognitive state detection
 * - Body doubling, time perception, sensory management
 *
 * LAYER 3: QUANTUM SELF
 * - Multi-dimensional awareness (cognitive, emotional, physical, social, creative, meaning)
 * - Crash prediction
 * - Flow window identification
 * - Pattern recognition across all dimensions
 *
 * LAYER 4: COLLECTIVE INTELLIGENCE
 * - Anonymous pattern sharing
 * - Wisdom from thousands of similar minds
 * - Gratitude loops
 * - "Waze for wellbeing"
 *
 * LAYER 5: FUTURE SELF
 * - Dialogue with wise future you
 * - Wisdom capture and retrieval
 * - Time capsules
 * - Value discovery
 *
 * LAYER 6: REALITY COMPOSER
 * - Visual environment optimization
 * - Auditory landscapes
 * - Temporal manipulation
 * - Social environment controls
 *
 * THE RESULT: Tools that learn your preferences over time,
 * offer suggestions when helpful, and let you control how
 * much assistance you want. Still learning. You're in charge.
 */

// ============================================
// THE LIFE STACK
// ============================================

class LifeStack {
  constructor() {
    this.layers = {};
    this.initialized = false;
    this.user = this.loadUser();
    this.sessionStart = Date.now();

    // Stats for impact tracking
    this.impactMetrics = this.loadImpactMetrics();

    this.initialize();
  }

  async initialize() {
    console.log('⟡ Initializing Life Stack...');

    // Wait for all layers to be available
    await this.waitForLayers();

    // Register all layers
    this.layers = {
      cognitiveOS: window.cognitiveOS,
      cognitiveBridge: window.cognitiveBridgeUI?.bridge,
      quantumSelf: window.quantumSelf,
      collectiveIntelligence: window.collectiveIntelligence,
      futureSelf: window.futureSelf,
      realityComposer: window.realityComposer
    };

    // Set up cross-layer communication
    this.setupIntegration();

    // Create unified dashboard
    this.createDashboard();

    // Start life optimization
    this.startOptimization();

    this.initialized = true;
    console.log('⟡ Life Stack fully operational');

    // Track session
    this.trackSessionStart();
  }

  async waitForLayers() {
    // Wait up to 5 seconds for all layers
    const timeout = 5000;
    const start = Date.now();

    while (Date.now() - start < timeout) {
      if (window.cognitiveOS &&
          window.quantumSelf &&
          window.realityComposer) {
        return;
      }
      await new Promise(r => setTimeout(r, 100));
    }

    console.warn('Some Life Stack layers not available');
  }

  loadUser() {
    const saved = localStorage.getItem('life_stack_user');
    return saved ? JSON.parse(saved) : {
      id: this.generateUserId(),
      createdAt: Date.now(),
      journey: []
    };
  }

  generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }

  saveUser() {
    localStorage.setItem('life_stack_user', JSON.stringify(this.user));
  }

  loadImpactMetrics() {
    const saved = localStorage.getItem('life_stack_impact');
    return saved ? JSON.parse(saved) : {
      sessionsCount: 0,
      totalMinutes: 0,
      crashesPrevented: 0,
      flowStatesAchieved: 0,
      wisdomCaptured: 0,
      breakthroughs: 0,
      collectiveContributions: 0,
      realitiesComposed: 0,
      futureSelfConsultations: 0,
      streakDays: 0,
      lastActiveDate: null
    };
  }

  saveImpactMetrics() {
    localStorage.setItem('life_stack_impact', JSON.stringify(this.impactMetrics));
  }

  // ============================================
  // CROSS-LAYER INTEGRATION
  // ============================================

  setupIntegration() {
    // Cognitive state → Reality Composer
    window.addEventListener('cognitive-state-changed', (e) => {
      this.onCognitiveStateChange(e.detail);
    });

    // Quantum state → Cognitive Bridge
    window.addEventListener('quantum-state-updated', (e) => {
      this.onQuantumStateUpdate(e.detail);
    });

    // Crash warning → Emergency protocol
    window.addEventListener('quantum-state-updated', (e) => {
      const predictions = e.detail.predictions || [];
      const crashWarning = predictions.find(p => p.type === 'crash_warning');
      if (crashWarning && crashWarning.probability > 0.7) {
        this.handleCrashRisk(crashWarning);
      }
    });

    // Wisdom captured → Collective sharing
    window.addEventListener('wisdom-captured', (e) => {
      this.onWisdomCaptured(e.detail);
    });

    // Reality composed → Track impact
    window.addEventListener('reality-composed', (e) => {
      this.impactMetrics.realitiesComposed++;
      this.saveImpactMetrics();
    });

    // Flow state → Track impact
    window.addEventListener('cognitive-state-changed', (e) => {
      if (e.detail.to === 'hyperfocus' || e.detail.to === 'flow') {
        this.impactMetrics.flowStatesAchieved++;
        this.saveImpactMetrics();
      }
    });
  }

  onCognitiveStateChange(detail) {
    // Coordinate response across layers
    const state = detail.to;

    // Reality Composer responds
    if (this.layers.realityComposer) {
      // Already handled by Reality Composer's own listener
    }

    // Update Quantum Self if needed
    // (they're already independent)

    // Log for pattern analysis
    this.logStateChange(state);
  }

  onQuantumStateUpdate(detail) {
    // Use quantum state to inform all layers
    const state = detail.state;

    // If emotional is very low, activate support systems
    if (state.emotional < 25) {
      this.activateSupportMode();
    }

    // If creative is very high, optimize for capture
    if (state.creative > 85) {
      this.activateCreativeMode();
    }
  }

  handleCrashRisk(warning) {
    // Coordinate multi-layer response to crash risk
    console.log('⟡ Crash risk detected, activating prevention protocol');

    // 1. Compose recovery reality
    if (this.layers.realityComposer) {
      this.layers.realityComposer.suggestReality('recovery');
    }

    // 2. Activate body double
    if (this.layers.cognitiveBridge?.bodyDouble) {
      this.layers.cognitiveBridge.bodyDouble.activate();
    }

    // 3. Show Future Self wisdom about past recoveries
    if (this.layers.futureSelf) {
      const relevantWisdom = this.layers.futureSelf.findRelevantWisdom('overwhelmed tired exhausted crash');
      if (relevantWisdom.length > 0) {
        this.showWisdomNudge(relevantWisdom[0]);
      }
    }

    // 4. Track prevented crash
    this.impactMetrics.crashesPrevented++;
    this.saveImpactMetrics();
  }

  activateSupportMode() {
    // Multi-layer support activation
    console.log('⟡ Support mode activated');

    // Body double
    if (this.layers.cognitiveBridge?.bodyDouble) {
      this.layers.cognitiveBridge.bodyDouble.startSession('company');
    }

    // Emergency reality
    if (this.layers.realityComposer) {
      this.layers.realityComposer.suggestReality('emergency');
    }
  }

  activateCreativeMode() {
    // Optimize for creative capture
    console.log('⟡ Creative overflow detected');

    // Creative reality
    if (this.layers.realityComposer) {
      this.layers.realityComposer.suggestReality('creative');
    }

    // Prompt to capture ideas
    this.showCreativeCapturePrompt();
  }

  onWisdomCaptured(detail) {
    this.impactMetrics.wisdomCaptured++;
    this.saveImpactMetrics();

    // Share to collective if enabled
    if (this.layers.collectiveIntelligence?.enabled) {
      this.layers.collectiveIntelligence.recordDiscovery({
        context: this.getCurrentContext(),
        intervention: 'self_reflection',
        outcome: 'positive',
        effectSize: 0.7,
        tags: detail.tags
      });

      this.impactMetrics.collectiveContributions++;
      this.saveImpactMetrics();
    }
  }

  getCurrentContext() {
    const quantum = this.layers.quantumSelf?.currentState || {};
    const cognitive = this.layers.cognitiveBridge?.currentState || 'unknown';

    return {
      ...quantum,
      cognitiveState: cognitive,
      timestamp: Date.now()
    };
  }

  logStateChange(state) {
    this.user.journey.push({
      timestamp: Date.now(),
      state: state,
      context: this.getCurrentContext()
    });

    // Keep last 1000 entries
    if (this.user.journey.length > 1000) {
      this.user.journey = this.user.journey.slice(-1000);
    }

    this.saveUser();
  }

  // ============================================
  // LIFE OPTIMIZATION
  // ============================================

  startOptimization() {
    // Continuous optimization loop
    setInterval(() => {
      this.optimizationCycle();
    }, 300000); // Every 5 minutes

    // Daily summary
    this.scheduleDailySummary();

    // Check time capsules
    if (this.layers.futureSelf) {
      this.layers.futureSelf.checkTimeCapsules();
    }
  }

  optimizationCycle() {
    // Gather state from all layers
    const state = {
      quantum: this.layers.quantumSelf?.currentState,
      cognitive: this.layers.cognitiveBridge?.currentState,
      reality: this.layers.realityComposer?.currentReality,
      sessionDuration: (Date.now() - this.sessionStart) / 60000 // minutes
    };

    // Make optimization suggestions
    this.generateOptimizations(state);
  }

  generateOptimizations(state) {
    const suggestions = [];

    // Session duration check
    if (state.sessionDuration > 90) {
      suggestions.push({
        type: 'break',
        priority: 'high',
        message: 'You\'ve been going for 90+ minutes. Time for a real break.'
      });
    }

    // Quantum state misalignment with reality
    if (state.quantum?.emotional < 40 && state.reality !== 'recovery') {
      suggestions.push({
        type: 'reality',
        priority: 'medium',
        message: 'Your emotional state suggests recovery mode might help.',
        action: () => this.layers.realityComposer?.suggestReality('recovery')
      });
    }

    // High creative but not in creative reality
    if (state.quantum?.creative > 75 && state.reality !== 'creative') {
      suggestions.push({
        type: 'opportunity',
        priority: 'high',
        message: 'You\'re in creative overflow! Switch to creative mode?',
        action: () => this.layers.realityComposer?.suggestReality('creative')
      });
    }

    // Show highest priority suggestion
    if (suggestions.length > 0) {
      const highest = suggestions.sort((a, b) => {
        const priority = { high: 3, medium: 2, low: 1 };
        return priority[b.priority] - priority[a.priority];
      })[0];

      this.showOptimizationSuggestion(highest);
    }
  }

  showOptimizationSuggestion(suggestion) {
    // Don't interrupt hyperfocus
    if (this.layers.cognitiveBridge?.hyperfocusProtected) return;

    const toast = document.createElement('div');
    toast.className = `optimization-suggestion priority-${suggestion.priority}`;
    toast.innerHTML = `
      <span class="opt-icon">💡</span>
      <span class="opt-message">${suggestion.message}</span>
      ${suggestion.action ? '<button class="opt-action">Do it</button>' : ''}
      <button class="opt-dismiss">×</button>
    `;

    document.body.appendChild(toast);

    if (suggestion.action) {
      toast.querySelector('.opt-action').addEventListener('click', () => {
        suggestion.action();
        toast.remove();
      });
    }

    toast.querySelector('.opt-dismiss').addEventListener('click', () => {
      toast.remove();
    });

    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.remove();
      }
    }, 15000);
  }

  scheduleDailySummary() {
    // Check if summary should be shown
    const lastSummary = localStorage.getItem('last_daily_summary');
    const today = new Date().toDateString();

    if (lastSummary !== today) {
      // Show summary when user returns tomorrow
      // For now, just track the day
      localStorage.setItem('last_daily_summary', today);
      this.updateStreak();
    }
  }

  updateStreak() {
    const today = new Date().toDateString();
    const lastActive = this.impactMetrics.lastActiveDate;

    if (lastActive) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastActive === yesterday) {
        this.impactMetrics.streakDays++;
      } else if (lastActive !== today) {
        this.impactMetrics.streakDays = 1; // Reset streak
      }
    } else {
      this.impactMetrics.streakDays = 1;
    }

    this.impactMetrics.lastActiveDate = today;
    this.saveImpactMetrics();
  }

  trackSessionStart() {
    this.impactMetrics.sessionsCount++;
    this.saveImpactMetrics();
  }

  trackSessionEnd() {
    const duration = (Date.now() - this.sessionStart) / 60000;
    this.impactMetrics.totalMinutes += duration;
    this.saveImpactMetrics();
  }

  // ============================================
  // UNIFIED DASHBOARD
  // ============================================

  createDashboard() {
    // DISABLED: Floating dashboard breaks UX. Data now integrated into right sidebar.
    // The LifeStack data is available via window.lifeStack for other components to use.
    return;

    const dashboard = document.createElement('div');
    dashboard.id = 'life-stack-dashboard';
    dashboard.className = 'life-dashboard';
    // Start hidden until user enters the app
    dashboard.style.display = 'none';
    dashboard.innerHTML = `
      <button class="ld-toggle" title="Life Stack Dashboard">
        <span class="ld-icon">⟡</span>
        <span class="ld-label">Life Stack</span>
      </button>
      <div class="ld-panel hidden">
        <div class="ld-header">
          <h2>Your Life Stack</h2>
          <span class="ld-streak">🔥 ${this.impactMetrics.streakDays} day streak</span>
        </div>

        <div class="ld-overview">
          ${this.renderOverview()}
        </div>

        <div class="ld-layers">
          ${this.renderLayers()}
        </div>

        <div class="ld-impact">
          ${this.renderImpact()}
        </div>

        <div class="ld-quick-actions">
          <button class="lda-btn" data-action="checkIn">💭 Check In</button>
          <button class="lda-btn" data-action="futureSelf">🔮 Ask Future You</button>
          <button class="lda-btn" data-action="compose">🎭 Compose Reality</button>
        </div>
      </div>
    `;

    document.body.appendChild(dashboard);

    // Toggle
    dashboard.querySelector('.ld-toggle').addEventListener('click', () => {
      dashboard.querySelector('.ld-panel').classList.toggle('hidden');
      if (!dashboard.querySelector('.ld-panel').classList.contains('hidden')) {
        this.refreshDashboard();
      }
    });

    // Quick actions
    dashboard.querySelectorAll('.lda-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleQuickAction(btn.dataset.action));
    });
  }

  renderOverview() {
    const quantum = this.layers.quantumSelf;
    const score = quantum?.getWellnessScore() || 50;
    const guidance = quantum?.getDailyGuidance() || {};

    return `
      <div class="ld-wellness">
        <div class="wellness-score">
          <div class="score-circle" style="--score: ${score}">
            <span class="score-value">${score}</span>
          </div>
          <span class="score-label">Wellness</span>
        </div>
        <div class="wellness-guidance">
          <p class="guidance-greeting">${guidance.greeting || 'Welcome back.'}</p>
          <p class="guidance-focus">${guidance.focus || 'Taking it one moment at a time.'}</p>
        </div>
      </div>
    `;
  }

  renderLayers() {
    const layers = [
      { name: 'Cognitive OS', status: this.layers.cognitiveOS ? 'active' : 'inactive', icon: '🧠' },
      { name: 'Cognitive Bridge', status: this.layers.cognitiveBridge ? 'active' : 'inactive', icon: '🌉' },
      { name: 'Quantum Self', status: this.layers.quantumSelf ? 'active' : 'inactive', icon: '✦' },
      { name: 'Collective', status: this.layers.collectiveIntelligence?.enabled ? 'active' : 'disabled', icon: '🌐' },
      { name: 'Future Self', status: this.layers.futureSelf ? 'active' : 'inactive', icon: '🔮' },
      { name: 'Reality Composer', status: this.layers.realityComposer ? 'active' : 'inactive', icon: '🎭' }
    ];

    return `
      <div class="ld-layers-grid">
        ${layers.map(l => `
          <div class="layer-status ${l.status}">
            <span class="layer-icon">${l.icon}</span>
            <span class="layer-name">${l.name}</span>
            <span class="layer-indicator"></span>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderImpact() {
    const m = this.impactMetrics;
    const hours = Math.floor(m.totalMinutes / 60);

    return `
      <div class="ld-impact-stats">
        <h3>Your Impact</h3>
        <div class="impact-grid">
          <div class="impact-stat">
            <span class="stat-value">${m.sessionsCount}</span>
            <span class="stat-label">Sessions</span>
          </div>
          <div class="impact-stat">
            <span class="stat-value">${hours}h</span>
            <span class="stat-label">Total Time</span>
          </div>
          <div class="impact-stat">
            <span class="stat-value">${m.crashesPrevented}</span>
            <span class="stat-label">Crashes Prevented</span>
          </div>
          <div class="impact-stat">
            <span class="stat-value">${m.flowStatesAchieved}</span>
            <span class="stat-label">Flow States</span>
          </div>
          <div class="impact-stat">
            <span class="stat-value">${m.wisdomCaptured}</span>
            <span class="stat-label">Wisdom Captured</span>
          </div>
          <div class="impact-stat">
            <span class="stat-value">${m.collectiveContributions}</span>
            <span class="stat-label">Collective Helps</span>
          </div>
        </div>
      </div>
    `;
  }

  refreshDashboard() {
    const overview = document.querySelector('.ld-overview');
    const impact = document.querySelector('.ld-impact');
    const streak = document.querySelector('.ld-streak');

    if (overview) overview.innerHTML = this.renderOverview();
    if (impact) impact.innerHTML = this.renderImpact();
    if (streak) streak.textContent = `🔥 ${this.impactMetrics.streakDays} day streak`;
  }

  handleQuickAction(action) {
    switch (action) {
      case 'checkIn':
        this.showCheckIn();
        break;
      case 'futureSelf':
        // Trigger Future Self UI
        document.querySelector('.future-self-btn')?.click();
        break;
      case 'compose':
        // Trigger Reality Composer
        document.querySelector('.rc-toggle')?.click();
        break;
    }

    // Close dashboard
    document.querySelector('.ld-panel')?.classList.add('hidden');
  }

  showCheckIn() {
    const overlay = document.createElement('div');
    overlay.className = 'check-in-overlay';
    overlay.innerHTML = `
      <div class="check-in-content">
        <h2>Quick Check-In</h2>

        <div class="ci-questions">
          <div class="ci-q">
            <label>How's your energy?</label>
            <div class="ci-scale" data-dimension="physical">
              <button data-value="20">😫</button>
              <button data-value="40">😕</button>
              <button data-value="60">😐</button>
              <button data-value="80">🙂</button>
              <button data-value="100">⚡</button>
            </div>
          </div>

          <div class="ci-q">
            <label>How's your mood?</label>
            <div class="ci-scale" data-dimension="emotional">
              <button data-value="20">😢</button>
              <button data-value="40">😔</button>
              <button data-value="60">😐</button>
              <button data-value="80">🙂</button>
              <button data-value="100">😊</button>
            </div>
          </div>

          <div class="ci-q">
            <label>How's your focus?</label>
            <div class="ci-scale" data-dimension="cognitive">
              <button data-value="20">🌫️</button>
              <button data-value="40">☁️</button>
              <button data-value="60">⛅</button>
              <button data-value="80">🌤️</button>
              <button data-value="100">🎯</button>
            </div>
          </div>
        </div>

        <button class="ci-submit">Update My State</button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Track selections
    const selections = {};
    overlay.querySelectorAll('.ci-scale button').forEach(btn => {
      btn.addEventListener('click', () => {
        const dimension = btn.parentElement.dataset.dimension;
        const value = parseInt(btn.dataset.value);

        // Visual feedback
        btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        selections[dimension] = value;
      });
    });

    overlay.querySelector('.ci-submit').addEventListener('click', () => {
      // Update dimensions
      if (selections.emotional !== undefined) {
        localStorage.setItem('emotional_level', selections.emotional.toString());
      }

      // Trigger observation
      if (this.layers.quantumSelf) {
        this.layers.quantumSelf.observe();
      }

      overlay.remove();

      // Show response based on state
      const avgState = Object.values(selections).reduce((a, b) => a + b, 0) / Object.values(selections).length;
      if (avgState < 40) {
        this.layers.realityComposer?.suggestReality('recovery');
      } else if (avgState > 70) {
        this.showPositiveAffirmation();
      }
    });
  }

  showPositiveAffirmation() {
    const affirmations = [
      "You're doing better than you think.",
      "Keep that momentum going.",
      "Today is yours.",
      "You've got this.",
      "Trust yourself."
    ];

    const toast = document.createElement('div');
    toast.className = 'affirmation-toast';
    toast.innerHTML = `
      <span class="aff-icon">✨</span>
      <span class="aff-message">${affirmations[Math.floor(Math.random() * affirmations.length)]}</span>
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 100);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  showWisdomNudge(wisdom) {
    const toast = document.createElement('div');
    toast.className = 'wisdom-nudge';
    toast.innerHTML = `
      <span class="wisdom-icon">💎</span>
      <div class="wisdom-content">
        <span class="wisdom-label">You once said:</span>
        <p class="wisdom-text">"${wisdom.text}"</p>
      </div>
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 100);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 8000);
  }

  showCreativeCapturePrompt() {
    const toast = document.createElement('div');
    toast.className = 'creative-capture-toast';
    toast.innerHTML = `
      <span class="cc-icon">✨</span>
      <span class="cc-message">Creative overflow detected! Capture your ideas now.</span>
      <button class="cc-action">Open Scratchpad</button>
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 100);

    toast.querySelector('.cc-action').addEventListener('click', () => {
      // Open scratchpad or note-taking interface
      document.getElementById('message-input')?.focus();
      toast.remove();
    });

    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
      }
    }, 10000);
  }

  // ============================================
  // LIFECYCLE
  // ============================================

  shutdown() {
    this.trackSessionEnd();
    console.log('⟡ Life Stack shutting down gracefully');
  }
}

// ============================================
// CSS FOR LIFE STACK
// ============================================

const lifeStackStyles = `
  .life-dashboard {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 10000;
  }

  .ld-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(16, 185, 129, 0.3));
    border: 1px solid rgba(139, 92, 246, 0.5);
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .ld-toggle:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  }

  .ld-icon {
    font-size: 1.2rem;
    animation: pulse 2s ease infinite;
  }

  .ld-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: white;
  }

  .ld-panel {
    position: absolute;
    top: 50px;
    left: 0;
    width: 350px;
    max-height: 80vh;
    overflow-y: auto;
    background: rgba(15, 15, 20, 0.98);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px;
    backdrop-filter: blur(20px);
  }

  .ld-panel.hidden { display: none; }

  .ld-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .ld-header h2 {
    margin: 0;
    font-size: 1.2rem;
    background: linear-gradient(135deg, #8b5cf6, #10b981);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .ld-streak {
    font-size: 0.8rem;
    color: #f59e0b;
  }

  .ld-wellness {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 20px;
  }

  .wellness-score {
    text-align: center;
  }

  .score-circle {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: conic-gradient(
      #8b5cf6 calc(var(--score) * 1%),
      rgba(255, 255, 255, 0.1) 0
    );
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .score-circle::before {
    content: '';
    position: absolute;
    inset: 5px;
    background: rgba(15, 15, 20, 1);
    border-radius: 50%;
  }

  .score-value {
    position: relative;
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
  }

  .score-label {
    display: block;
    font-size: 0.7rem;
    color: var(--text-secondary);
    margin-top: 5px;
  }

  .wellness-guidance {
    flex: 1;
  }

  .guidance-greeting {
    font-size: 0.9rem;
    color: var(--text-primary);
    margin: 0 0 5px 0;
  }

  .guidance-focus {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin: 0;
  }

  .ld-layers-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 20px;
  }

  .layer-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    font-size: 0.75rem;
  }

  .layer-status.active .layer-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
  }

  .layer-status.inactive .layer-indicator,
  .layer-status.disabled .layer-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
  }

  .layer-icon { font-size: 1rem; }
  .layer-name {
    flex: 1;
    color: var(--text-secondary);
  }

  .ld-impact-stats h3 {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin: 0 0 10px 0;
  }

  .impact-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .impact-stat {
    text-align: center;
    padding: 10px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
  }

  .stat-value {
    display: block;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--primary);
  }

  .stat-label {
    font-size: 0.65rem;
    color: var(--text-muted);
  }

  .ld-quick-actions {
    display: flex;
    gap: 8px;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .lda-btn {
    flex: 1;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .lda-btn:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: var(--primary);
  }

  /* Check-in overlay */
  .check-in-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 10, 15, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100000;
  }

  .check-in-content {
    text-align: center;
    max-width: 400px;
    padding: 30px;
  }

  .check-in-content h2 {
    margin-bottom: 30px;
  }

  .ci-q {
    margin-bottom: 25px;
  }

  .ci-q label {
    display: block;
    margin-bottom: 10px;
    color: var(--text-secondary);
  }

  .ci-scale {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .ci-scale button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .ci-scale button:hover {
    transform: scale(1.1);
    border-color: var(--primary);
  }

  .ci-scale button.selected {
    background: rgba(139, 92, 246, 0.3);
    border-color: var(--primary);
    transform: scale(1.15);
  }

  .ci-submit {
    margin-top: 20px;
    padding: 12px 30px;
    background: var(--primary);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    cursor: pointer;
  }

  /* Toasts */
  .affirmation-toast,
  .wisdom-nudge,
  .creative-capture-toast,
  .optimization-suggestion {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px 25px;
    background: rgba(30, 30, 40, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 10000;
  }

  .affirmation-toast.visible,
  .wisdom-nudge.visible,
  .creative-capture-toast.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .optimization-suggestion.priority-high {
    border-color: var(--primary);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = lifeStackStyles;
document.head.appendChild(styleSheet);

// ============================================
// INITIALIZE
// ============================================

window.LifeStack = LifeStack;

// DISABLED: Floating dashboard removed. Data available via window.lifeStack after init.
// LifeStack now initialized from app.js enterApp() via window.initLifeStack()
window.initLifeStack = function() {
  if (!window.lifeStack) {
    window.lifeStack = new LifeStack();
  }
};

// Track session end
window.addEventListener('beforeunload', () => {
  if (window.lifeStack) {
    window.lifeStack.shutdown();
  }
});

console.log('⟡ Life Stack loaded — the complete human operating system');
