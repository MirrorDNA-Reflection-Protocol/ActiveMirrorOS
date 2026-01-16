/**
 * ⟡ COGNITIVE BRIDGE
 *
 * The world's first AI system designed to bridge neurodivergent and neurotypical minds.
 *
 * Philosophy:
 * - Linear minds excel at sequential processing, scheduling, social norms
 * - Non-linear minds excel at pattern recognition, hyperfocus, creative leaps
 * - Both are incomplete without the other
 * - This bridge translates between them, enhancing both
 *
 * What this does:
 * 1. Detects cognitive state in real-time (hyperfocus, scattered, overwhelmed, flow)
 * 2. Adapts the ENTIRE interface to match current brain state
 * 3. Provides neurodivergent-specific superpowers (time anchors, body doubling, stim breaks)
 * 4. Helps neurotypical users access non-linear thinking patterns
 * 5. Creates "translation layers" for communication between thinking styles
 */

// ============================================
// COGNITIVE PROFILES
// ============================================

const COGNITIVE_PROFILES = {
  // ADHD Spectrum
  adhd_inattentive: {
    name: 'Inattentive',
    icon: '🌊',
    strengths: ['creative connections', 'hyperfocus when interested', 'crisis performance'],
    challenges: ['time blindness', 'task initiation', 'sustained attention', 'working memory'],
    adaptations: {
      interface: 'minimal', // Reduce visual noise
      timeDisplay: 'relative', // "2 hours ago" not "14:32"
      taskStyle: 'single', // One task visible at a time
      breaks: 'prompted', // Remind to take breaks
      bodyDoubling: true,
      urgencyBoost: true // Make deadlines feel real
    }
  },

  adhd_hyperactive: {
    name: 'Hyperactive',
    icon: '⚡',
    strengths: ['energy', 'enthusiasm', 'quick thinking', 'multitasking'],
    challenges: ['sitting still', 'waiting', 'impulsivity', 'interrupting'],
    adaptations: {
      interface: 'dynamic', // Movement, animations
      fidgetMode: true, // Interactive elements to click
      parallelTasks: true, // Multiple things at once
      stimBreaks: true,
      movementReminders: true
    }
  },

  adhd_combined: {
    name: 'Combined',
    icon: '🌀',
    strengths: ['versatility', 'creativity', 'resilience'],
    challenges: ['all of the above'],
    adaptations: {
      interface: 'adaptive', // Changes based on state
      bodyDoubling: true,
      timeAnchors: true,
      rewardSystem: true,
      contextSwitchProtection: true
    }
  },

  // Autism Spectrum
  autism_high_masking: {
    name: 'High Masking',
    icon: '🎭',
    strengths: ['pattern recognition', 'deep expertise', 'honesty', 'loyalty'],
    challenges: ['social exhaustion', 'sensory overload', 'routine disruption'],
    adaptations: {
      interface: 'predictable', // Never changes unexpectedly
      socialScripts: true, // Help with communication
      maskingMeter: true, // Track exhaustion
      routineProtection: true,
      sensorySettings: true
    }
  },

  autism_low_support: {
    name: 'Low Support Needs',
    icon: '🧩',
    strengths: ['systemizing', 'attention to detail', 'special interests'],
    challenges: ['flexibility', 'ambiguity', 'small talk'],
    adaptations: {
      interface: 'structured',
      explicitCommunication: true,
      interestIntegration: true,
      changeWarnings: true
    }
  },

  // Combined presentations
  audhd: {
    name: 'AuDHD',
    icon: '🌈',
    strengths: ['unique perspective', 'intense interests', 'pattern + creativity'],
    challenges: ['conflicting needs', 'routine vs novelty', 'social + attention'],
    adaptations: {
      interface: 'customizable',
      conflictMediator: true, // Balance competing needs
      energyBudget: true,
      specialInterestTime: true,
      recoveryPlanning: true
    }
  },

  // Neurotypical (yes, this is a profile too)
  neurotypical: {
    name: 'Neurotypical',
    icon: '📐',
    strengths: ['social navigation', 'scheduling', 'sustained attention'],
    challenges: ['non-linear thinking', 'hyperfocus access', 'pattern leaps'],
    adaptations: {
      interface: 'standard',
      nonLinearMode: true, // Help think differently
      creativityBoost: true,
      patternTraining: true
    }
  }
};

// ============================================
// COGNITIVE STATE DETECTION
// ============================================

const COGNITIVE_STATES = {
  hyperfocus: {
    name: 'Hyperfocus',
    icon: '🎯',
    description: 'Deep flow state - protect at all costs',
    color: '#8b5cf6',
    actions: ['block_notifications', 'hide_time', 'single_task']
  },
  flow: {
    name: 'Flow',
    icon: '🌊',
    description: 'Good working rhythm',
    color: '#10b981',
    actions: ['gentle_reminders', 'preserve_context']
  },
  scattered: {
    name: 'Scattered',
    icon: '💨',
    description: 'Mind is jumping - need anchoring',
    color: '#f59e0b',
    actions: ['simplify_interface', 'body_double', 'one_task']
  },
  overwhelmed: {
    name: 'Overwhelmed',
    icon: '🌪️',
    description: 'Too much - need reset',
    color: '#ef4444',
    actions: ['emergency_mode', 'breathing_exercise', 'hide_everything']
  },
  paralyzed: {
    name: 'Paralyzed',
    icon: '🧊',
    description: 'Cannot start - need momentum',
    color: '#6366f1',
    actions: ['tiny_task', 'body_double', 'remove_choice']
  },
  recovering: {
    name: 'Recovering',
    icon: '🌱',
    description: 'Low energy - be gentle',
    color: '#84cc16',
    actions: ['reduce_demands', 'self_care_prompts', 'no_guilt']
  },
  energized: {
    name: 'Energized',
    icon: '✨',
    description: 'High energy - capture it!',
    color: '#ec4899',
    actions: ['capture_ideas', 'batch_tasks', 'ride_wave']
  }
};

// ============================================
// THE COGNITIVE BRIDGE CLASS
// ============================================

class CognitiveBridge {
  constructor() {
    this.profile = this.loadProfile();
    this.currentState = 'flow';
    this.stateHistory = [];
    this.sessionStart = Date.now();
    this.interactions = [];
    this.energyLevel = 100;
    this.focusScore = 50;
    this.lastBreak = Date.now();
    this.bodyDoubleActive = false;
    this.hyperfocusProtected = false;

    // Initialize systems
    this.stateDetector = new CognitiveStateDetector(this);
    this.timePerception = new TimePerceptionEngine(this);
    this.bodyDouble = new BodyDoubleCompanion(this);
    this.sensoryManager = new SensoryManager(this);
    this.socialBridge = new SocialBridge(this);
    this.executiveAssist = new ExecutiveFunctionAssist(this);

    // Start monitoring
    this.startStateMonitoring();
  }

  loadProfile() {
    const saved = localStorage.getItem('cognitive_profile');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default to adaptive mode until profile is set
    return {
      type: null,
      customizations: {},
      diagnosed: false,
      selfIdentified: true
    };
  }

  saveProfile() {
    localStorage.setItem('cognitive_profile', JSON.stringify(this.profile));
  }

  setProfile(type, customizations = {}) {
    this.profile = {
      type,
      customizations,
      setAt: Date.now()
    };
    this.saveProfile();
    this.applyAdaptations();
    this.announceChange('Profile updated. Interface adapting to your brain.');
  }

  applyAdaptations() {
    const profileConfig = COGNITIVE_PROFILES[this.profile.type];
    if (!profileConfig) return;

    const adaptations = { ...profileConfig.adaptations, ...this.profile.customizations };

    // Apply interface adaptations
    document.body.setAttribute('data-cognitive-profile', this.profile.type);
    document.body.setAttribute('data-interface-mode', adaptations.interface);

    // Enable/disable specific features
    if (adaptations.bodyDoubling) this.bodyDouble.enable();
    if (adaptations.timeAnchors) this.timePerception.enableAnchors();
    if (adaptations.sensorySettings) this.sensoryManager.enable();
    if (adaptations.socialScripts) this.socialBridge.enable();

    // Emit event for other components
    window.dispatchEvent(new CustomEvent('cognitive-profile-changed', {
      detail: { profile: this.profile, adaptations }
    }));
  }

  startStateMonitoring() {
    // Track typing patterns
    document.addEventListener('keydown', (e) => this.trackInteraction('keydown', e));
    document.addEventListener('keyup', (e) => this.trackInteraction('keyup', e));

    // Track mouse patterns
    document.addEventListener('mousemove', this.throttle((e) => {
      this.trackInteraction('mousemove', { x: e.clientX, y: e.clientY });
    }, 500));

    // Track focus/blur
    window.addEventListener('blur', () => this.trackInteraction('window_blur'));
    window.addEventListener('focus', () => this.trackInteraction('window_focus'));

    // Periodic state check
    setInterval(() => this.analyzeState(), 30000);

    // Energy decay
    setInterval(() => this.decayEnergy(), 60000);
  }

  trackInteraction(type, data = {}) {
    this.interactions.push({
      type,
      data,
      timestamp: Date.now()
    });

    // Keep last 100 interactions
    if (this.interactions.length > 100) {
      this.interactions = this.interactions.slice(-100);
    }

    // Quick state updates
    this.quickStateCheck();
  }

  quickStateCheck() {
    const recentInteractions = this.interactions.filter(
      i => Date.now() - i.timestamp < 60000
    );

    const typingRate = recentInteractions.filter(i => i.type === 'keydown').length;
    const windowSwitches = recentInteractions.filter(i => i.type === 'window_blur').length;

    // Detect hyperfocus (sustained typing, no switching)
    if (typingRate > 50 && windowSwitches === 0 && !this.hyperfocusProtected) {
      this.enterHyperfocus();
    }

    // Detect scattered (lots of switching)
    if (windowSwitches > 5) {
      this.setState('scattered');
    }
  }

  analyzeState() {
    const now = Date.now();
    const sessionLength = now - this.sessionStart;
    const timeSinceBreak = now - this.lastBreak;

    // Check for overwhelm indicators
    if (this.energyLevel < 20 && this.focusScore < 30) {
      this.setState('overwhelmed');
      return;
    }

    // Check for paralysis (long session, no progress)
    if (sessionLength > 3600000 && this.interactions.length < 10) {
      this.setState('paralyzed');
      return;
    }

    // Check if break is needed
    if (timeSinceBreak > 5400000) { // 90 minutes
      this.suggestBreak('You\'ve been going for 90 minutes. Your brain needs a reset.');
    }
  }

  setState(newState) {
    if (this.currentState === newState) return;

    const oldState = this.currentState;
    this.currentState = newState;

    this.stateHistory.push({
      from: oldState,
      to: newState,
      timestamp: Date.now()
    });

    // Apply state-specific actions
    const stateConfig = COGNITIVE_STATES[newState];
    if (stateConfig) {
      this.applyStateActions(stateConfig.actions);
      this.updateStateUI(stateConfig);
    }

    // Emit event
    window.dispatchEvent(new CustomEvent('cognitive-state-changed', {
      detail: { from: oldState, to: newState, config: stateConfig }
    }));
  }

  applyStateActions(actions) {
    actions.forEach(action => {
      switch (action) {
        case 'block_notifications':
          this.blockNotifications();
          break;
        case 'hide_time':
          this.timePerception.hideTime();
          break;
        case 'single_task':
          this.executiveAssist.singleTaskMode();
          break;
        case 'simplify_interface':
          this.simplifyInterface();
          break;
        case 'body_double':
          this.bodyDouble.activate();
          break;
        case 'emergency_mode':
          this.emergencyMode();
          break;
        case 'breathing_exercise':
          this.offerBreathingExercise();
          break;
        case 'tiny_task':
          this.executiveAssist.offerTinyTask();
          break;
      }
    });
  }

  enterHyperfocus() {
    this.hyperfocusProtected = true;
    this.setState('hyperfocus');

    // Create protection bubble
    this.createHyperfocusBubble();

    // Don't interrupt for at least 25 minutes
    setTimeout(() => {
      this.hyperfocusProtected = false;
    }, 1500000);
  }

  createHyperfocusBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'hyperfocus-bubble';
    bubble.innerHTML = `
      <div class="hf-indicator">
        <span class="hf-icon">🎯</span>
        <span class="hf-text">Hyperfocus Active</span>
        <span class="hf-protection">Protected</span>
      </div>
    `;
    document.body.appendChild(bubble);
  }

  emergencyMode() {
    // Strip everything down to absolute essentials
    document.body.classList.add('emergency-mode');

    const overlay = document.createElement('div');
    overlay.className = 'emergency-overlay';
    overlay.innerHTML = `
      <div class="emergency-content">
        <div class="emergency-icon">🌊</div>
        <h2>It's okay. Let's pause.</h2>
        <p>Everything else can wait. Right now, just be here.</p>

        <div class="breathing-guide">
          <div class="breath-circle"></div>
          <p class="breath-instruction">Breathe with the circle</p>
        </div>

        <div class="emergency-options">
          <button class="emergency-btn" data-action="tiny">Do one tiny thing</button>
          <button class="emergency-btn" data-action="rest">I need to rest</button>
          <button class="emergency-btn" data-action="talk">I need to talk</button>
          <button class="emergency-btn" data-action="continue">I'm ready to continue</button>
        </div>
      </div>
    `;

    overlay.querySelectorAll('.emergency-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleEmergencyChoice(btn.dataset.action));
    });

    document.body.appendChild(overlay);
    this.startBreathingAnimation(overlay.querySelector('.breath-circle'));
  }

  startBreathingAnimation(element) {
    let phase = 'in';
    const cycle = () => {
      if (phase === 'in') {
        element.style.transform = 'scale(1.5)';
        element.parentElement.querySelector('.breath-instruction').textContent = 'Breathe in...';
        phase = 'hold1';
        setTimeout(cycle, 4000);
      } else if (phase === 'hold1') {
        element.parentElement.querySelector('.breath-instruction').textContent = 'Hold...';
        phase = 'out';
        setTimeout(cycle, 2000);
      } else if (phase === 'out') {
        element.style.transform = 'scale(1)';
        element.parentElement.querySelector('.breath-instruction').textContent = 'Breathe out...';
        phase = 'hold2';
        setTimeout(cycle, 4000);
      } else {
        element.parentElement.querySelector('.breath-instruction').textContent = 'Hold...';
        phase = 'in';
        setTimeout(cycle, 2000);
      }
    };
    cycle();
  }

  handleEmergencyChoice(action) {
    document.querySelector('.emergency-overlay')?.remove();
    document.body.classList.remove('emergency-mode');

    switch (action) {
      case 'tiny':
        this.executiveAssist.offerTinyTask();
        break;
      case 'rest':
        this.setState('recovering');
        this.showRestMode();
        break;
      case 'talk':
        this.bodyDouble.startSupportSession();
        break;
      case 'continue':
        this.setState('flow');
        break;
    }
  }

  decayEnergy() {
    // Energy decays over time without breaks
    const timeSinceBreak = Date.now() - this.lastBreak;
    const decayRate = timeSinceBreak > 3600000 ? 5 : 2;

    this.energyLevel = Math.max(0, this.energyLevel - decayRate);

    // Emit update
    window.dispatchEvent(new CustomEvent('energy-updated', {
      detail: { level: this.energyLevel }
    }));

    // Warnings
    if (this.energyLevel === 30) {
      this.gentleNudge('Your energy is getting low. A break might help.');
    }
    if (this.energyLevel === 10) {
      this.gentleNudge('Running on fumes. Please take care of yourself.');
    }
  }

  takeBreak() {
    this.lastBreak = Date.now();
    this.energyLevel = Math.min(100, this.energyLevel + 30);
    this.setState('recovering');
  }

  simplifyInterface() {
    document.body.classList.add('simplified-mode');
    // Hide everything except the current task
    document.querySelectorAll('.widget, .sidebar, .stats').forEach(el => {
      el.style.display = 'none';
    });
  }

  blockNotifications() {
    window.notificationsBlocked = true;
    document.body.classList.add('notifications-blocked');
  }

  updateStateUI(stateConfig) {
    // Update state indicator
    let indicator = document.getElementById('cognitive-state-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'cognitive-state-indicator';
      document.body.appendChild(indicator);
    }

    indicator.innerHTML = `
      <span class="state-icon">${stateConfig.icon}</span>
      <span class="state-name">${stateConfig.name}</span>
    `;
    indicator.style.setProperty('--state-color', stateConfig.color);
  }

  gentleNudge(message) {
    // Non-intrusive notification
    const nudge = document.createElement('div');
    nudge.className = 'gentle-nudge';
    nudge.innerHTML = `
      <span class="nudge-icon">💭</span>
      <span class="nudge-message">${message}</span>
      <button class="nudge-dismiss">×</button>
    `;

    nudge.querySelector('.nudge-dismiss').addEventListener('click', () => nudge.remove());

    document.body.appendChild(nudge);
    setTimeout(() => nudge.classList.add('visible'), 100);
    setTimeout(() => {
      nudge.classList.remove('visible');
      setTimeout(() => nudge.remove(), 300);
    }, 10000);
  }

  suggestBreak(reason) {
    if (this.hyperfocusProtected) return; // Don't interrupt hyperfocus

    const suggestion = document.createElement('div');
    suggestion.className = 'break-suggestion';
    suggestion.innerHTML = `
      <div class="break-content">
        <span class="break-icon">🌿</span>
        <p>${reason}</p>
        <div class="break-options">
          <button class="break-btn" data-minutes="5">5 min</button>
          <button class="break-btn" data-minutes="15">15 min</button>
          <button class="break-btn" data-minutes="0">Not now</button>
        </div>
      </div>
    `;

    suggestion.querySelectorAll('.break-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const minutes = parseInt(btn.dataset.minutes);
        if (minutes > 0) {
          this.startBreak(minutes);
        }
        suggestion.remove();
      });
    });

    document.body.appendChild(suggestion);
  }

  startBreak(minutes) {
    this.takeBreak();

    const breakScreen = document.createElement('div');
    breakScreen.className = 'break-screen';
    breakScreen.innerHTML = `
      <div class="break-content">
        <h2>Break Time</h2>
        <div class="break-timer">${minutes}:00</div>
        <div class="break-suggestions">
          <p>Some ideas:</p>
          <ul>
            <li>🚶 Walk around</li>
            <li>💧 Drink water</li>
            <li>👀 Look at something far away</li>
            <li>🤸 Stretch</li>
            <li>🌬️ Step outside</li>
          </ul>
        </div>
        <button class="end-break-btn">End break early</button>
      </div>
    `;

    document.body.appendChild(breakScreen);

    // Timer countdown
    let remaining = minutes * 60;
    const timer = breakScreen.querySelector('.break-timer');
    const countdown = setInterval(() => {
      remaining--;
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      timer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

      if (remaining <= 0) {
        clearInterval(countdown);
        breakScreen.remove();
        this.gentleNudge('Break complete! Ready when you are.');
      }
    }, 1000);

    breakScreen.querySelector('.end-break-btn').addEventListener('click', () => {
      clearInterval(countdown);
      breakScreen.remove();
    });
  }

  announceChange(message) {
    // For screen readers and gentle feedback
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-announcement';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  }

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// ============================================
// TIME PERCEPTION ENGINE
// For people with time blindness
// ============================================

class TimePerceptionEngine {
  constructor(bridge) {
    this.bridge = bridge;
    this.anchors = [];
    this.timeHidden = false;
  }

  enableAnchors() {
    // Create time anchors that make time feel real
    this.createTimeAnchor('morning', 'Morning started', new Date().setHours(6, 0, 0, 0));
    this.createTimeAnchor('now', 'You are here', Date.now());
    this.createTimeAnchor('evening', 'Day ends', new Date().setHours(22, 0, 0, 0));

    this.renderTimeRuler();
    this.startLiveUpdates();
  }

  createTimeAnchor(id, label, timestamp) {
    this.anchors.push({ id, label, timestamp });
  }

  renderTimeRuler() {
    let ruler = document.getElementById('time-ruler');
    if (!ruler) {
      ruler = document.createElement('div');
      ruler.id = 'time-ruler';
      ruler.className = 'time-ruler';
      document.body.appendChild(ruler);
    }

    const now = Date.now();
    const dayStart = new Date().setHours(0, 0, 0, 0);
    const dayEnd = new Date().setHours(23, 59, 59, 999);
    const dayLength = dayEnd - dayStart;
    const progress = ((now - dayStart) / dayLength) * 100;

    ruler.innerHTML = `
      <div class="time-track">
        <div class="time-progress" style="width: ${progress}%"></div>
        <div class="time-marker time-now" style="left: ${progress}%">
          <span class="marker-label">Now</span>
        </div>
        ${this.anchors.map(a => this.renderAnchor(a, dayStart, dayLength)).join('')}
      </div>
      <div class="time-labels">
        <span>Dawn</span>
        <span>Morning</span>
        <span>Afternoon</span>
        <span>Evening</span>
        <span>Night</span>
      </div>
    `;
  }

  renderAnchor(anchor, dayStart, dayLength) {
    const position = ((anchor.timestamp - dayStart) / dayLength) * 100;
    if (position < 0 || position > 100) return '';

    return `
      <div class="time-anchor" style="left: ${position}%">
        <span class="anchor-dot"></span>
        <span class="anchor-label">${anchor.label}</span>
      </div>
    `;
  }

  startLiveUpdates() {
    setInterval(() => {
      if (!this.timeHidden) {
        this.renderTimeRuler();
      }
    }, 60000);
  }

  hideTime() {
    this.timeHidden = true;
    document.getElementById('time-ruler')?.classList.add('hidden');
    document.querySelectorAll('.timestamp').forEach(el => el.classList.add('hidden'));
  }

  showTime() {
    this.timeHidden = false;
    document.getElementById('time-ruler')?.classList.remove('hidden');
    document.querySelectorAll('.timestamp').forEach(el => el.classList.remove('hidden'));
  }

  // Convert absolute time to relative, relatable time
  humanizeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 172800000) return 'yesterday';
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;

    return new Date(timestamp).toLocaleDateString();
  }

  // Estimate how long something will take (ADHD time translation)
  estimateRealTime(taskEstimate) {
    // ADHD brains often underestimate by 2-3x
    const multiplier = this.bridge.profile.type?.includes('adhd') ? 2.5 : 1.5;

    return {
      optimistic: taskEstimate,
      realistic: taskEstimate * multiplier,
      withInterruptions: taskEstimate * multiplier * 1.5
    };
  }
}

// ============================================
// BODY DOUBLE COMPANION
// AI presence that helps with task initiation and focus
// ============================================

class BodyDoubleCompanion {
  constructor(bridge) {
    this.bridge = bridge;
    this.active = false;
    this.sessionType = null;
    this.checkInInterval = null;
  }

  enable() {
    this.createUI();
  }

  createUI() {
    const container = document.createElement('div');
    container.id = 'body-double';
    container.className = 'body-double-container';
    container.innerHTML = `
      <div class="bd-toggle" title="Body Double">
        <span class="bd-icon">👤</span>
      </div>
      <div class="bd-panel hidden">
        <div class="bd-header">
          <h4>Body Double</h4>
          <span class="bd-status">Ready to accompany you</span>
        </div>
        <div class="bd-modes">
          <button class="bd-mode" data-mode="focus">
            <span>🎯</span>
            <span>Focus Session</span>
          </button>
          <button class="bd-mode" data-mode="start">
            <span>🚀</span>
            <span>Help Me Start</span>
          </button>
          <button class="bd-mode" data-mode="company">
            <span>☕</span>
            <span>Just Company</span>
          </button>
        </div>
        <div class="bd-active-session hidden">
          <div class="bd-companion">
            <div class="bd-avatar">🧘</div>
            <p class="bd-message">I'm here with you.</p>
          </div>
          <div class="bd-progress">
            <div class="bd-progress-bar"></div>
          </div>
          <button class="bd-end">End Session</button>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Toggle panel
    container.querySelector('.bd-toggle').addEventListener('click', () => {
      container.querySelector('.bd-panel').classList.toggle('hidden');
    });

    // Mode selection
    container.querySelectorAll('.bd-mode').forEach(btn => {
      btn.addEventListener('click', () => this.startSession(btn.dataset.mode));
    });

    // End session
    container.querySelector('.bd-end').addEventListener('click', () => this.endSession());
  }

  activate() {
    // Quick activate for emergency situations
    if (!this.active) {
      this.startSession('focus');
    }
  }

  startSession(mode) {
    this.active = true;
    this.sessionType = mode;

    const container = document.getElementById('body-double');
    container.querySelector('.bd-modes').classList.add('hidden');
    container.querySelector('.bd-active-session').classList.remove('hidden');
    container.classList.add('active');

    // Set up check-ins based on mode
    const messages = this.getMessagesForMode(mode);
    let messageIndex = 0;

    this.updateMessage(messages[0]);

    this.checkInInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      this.updateMessage(messages[messageIndex]);
    }, mode === 'focus' ? 300000 : 120000); // 5 min for focus, 2 min otherwise

    // For "start" mode, immediately offer a tiny first step
    if (mode === 'start') {
      setTimeout(() => {
        this.bridge.executiveAssist.offerTinyTask();
      }, 2000);
    }
  }

  getMessagesForMode(mode) {
    const messages = {
      focus: [
        "I'm here with you. Just focus on what's in front of you.",
        "You're doing great. Keep going.",
        "Still here. You've got this.",
        "Progress is happening. Trust the process.",
        "I see you working. Proud of you."
      ],
      start: [
        "Let's do just one tiny thing. That's all.",
        "What's the smallest possible next step?",
        "You don't have to do it perfectly. Just start.",
        "I'll stay right here while you take the first step.",
        "Movement creates momentum. One tiny action."
      ],
      company: [
        "☕ Just hanging out with you.",
        "No pressure. I'm just here.",
        "Whatever you're doing or not doing is okay.",
        "Just keeping you company.",
        "Still here. No expectations."
      ]
    };

    return messages[mode] || messages.company;
  }

  updateMessage(message) {
    const messageEl = document.querySelector('.bd-message');
    if (messageEl) {
      messageEl.style.opacity = '0';
      setTimeout(() => {
        messageEl.textContent = message;
        messageEl.style.opacity = '1';
      }, 300);
    }
  }

  endSession() {
    this.active = false;
    this.sessionType = null;

    if (this.checkInInterval) {
      clearInterval(this.checkInInterval);
    }

    const container = document.getElementById('body-double');
    container.querySelector('.bd-modes').classList.remove('hidden');
    container.querySelector('.bd-active-session').classList.add('hidden');
    container.classList.remove('active');
  }

  startSupportSession() {
    // For when user needs to talk
    this.startSession('company');

    // Activate chat with supportive context
    if (window.cognitiveOS) {
      window.cognitiveOS.switchAgent('mirror'); // Switch to Mirror agent
      const input = document.getElementById('message-input');
      if (input) {
        input.focus();
        input.placeholder = "I'm here to listen. What's on your mind?";
      }
    }
  }
}

// ============================================
// SENSORY MANAGER
// Control interface intensity for sensory needs
// ============================================

class SensoryManager {
  constructor(bridge) {
    this.bridge = bridge;
    this.settings = this.loadSettings();
  }

  loadSettings() {
    const saved = localStorage.getItem('sensory_settings');
    return saved ? JSON.parse(saved) : {
      animations: 'reduced',
      contrast: 'normal',
      soundEnabled: false,
      haptics: false,
      colorIntensity: 70
    };
  }

  saveSettings() {
    localStorage.setItem('sensory_settings', JSON.stringify(this.settings));
  }

  enable() {
    this.createUI();
    this.applySettings();
  }

  createUI() {
    const panel = document.createElement('div');
    panel.id = 'sensory-panel';
    panel.className = 'sensory-panel';
    panel.innerHTML = `
      <button class="sensory-toggle" title="Sensory Settings">
        <span>🎨</span>
      </button>
      <div class="sensory-controls hidden">
        <h4>Sensory Settings</h4>

        <div class="sensory-group">
          <label>Animations</label>
          <select id="sensory-animations">
            <option value="full">Full</option>
            <option value="reduced">Reduced</option>
            <option value="none">None</option>
          </select>
        </div>

        <div class="sensory-group">
          <label>Contrast</label>
          <select id="sensory-contrast">
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        <div class="sensory-group">
          <label>Color Intensity</label>
          <input type="range" id="sensory-color" min="0" max="100" value="${this.settings.colorIntensity}">
        </div>

        <div class="sensory-group">
          <label>
            <input type="checkbox" id="sensory-sounds" ${this.settings.soundEnabled ? 'checked' : ''}>
            UI Sounds
          </label>
        </div>

        <div class="sensory-presets">
          <button class="preset-btn" data-preset="calm">🌙 Calm</button>
          <button class="preset-btn" data-preset="focus">🎯 Focus</button>
          <button class="preset-btn" data-preset="energize">⚡ Energize</button>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // Toggle
    panel.querySelector('.sensory-toggle').addEventListener('click', () => {
      panel.querySelector('.sensory-controls').classList.toggle('hidden');
    });

    // Settings changes
    panel.querySelector('#sensory-animations').addEventListener('change', (e) => {
      this.settings.animations = e.target.value;
      this.applySettings();
    });

    panel.querySelector('#sensory-contrast').addEventListener('change', (e) => {
      this.settings.contrast = e.target.value;
      this.applySettings();
    });

    panel.querySelector('#sensory-color').addEventListener('input', (e) => {
      this.settings.colorIntensity = parseInt(e.target.value);
      this.applySettings();
    });

    // Presets
    panel.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => this.applyPreset(btn.dataset.preset));
    });
  }

  applySettings() {
    const root = document.documentElement;

    // Animations
    if (this.settings.animations === 'none') {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else if (this.settings.animations === 'reduced') {
      root.style.setProperty('--animation-duration', '0.1s');
      root.style.setProperty('--transition-duration', '0.1s');
    } else {
      root.style.setProperty('--animation-duration', '0.3s');
      root.style.setProperty('--transition-duration', '0.2s');
    }

    // Contrast
    document.body.setAttribute('data-contrast', this.settings.contrast);

    // Color intensity
    root.style.setProperty('--color-intensity', this.settings.colorIntensity / 100);

    this.saveSettings();
  }

  applyPreset(preset) {
    const presets = {
      calm: {
        animations: 'reduced',
        contrast: 'low',
        colorIntensity: 50,
        soundEnabled: false
      },
      focus: {
        animations: 'none',
        contrast: 'normal',
        colorIntensity: 60,
        soundEnabled: false
      },
      energize: {
        animations: 'full',
        contrast: 'high',
        colorIntensity: 100,
        soundEnabled: true
      }
    };

    this.settings = { ...this.settings, ...presets[preset] };
    this.applySettings();
    this.updateUI();
  }

  updateUI() {
    document.getElementById('sensory-animations').value = this.settings.animations;
    document.getElementById('sensory-contrast').value = this.settings.contrast;
    document.getElementById('sensory-color').value = this.settings.colorIntensity;
    document.getElementById('sensory-sounds').checked = this.settings.soundEnabled;
  }
}

// ============================================
// SOCIAL BRIDGE
// Help with social communication and scripts
// ============================================

class SocialBridge {
  constructor(bridge) {
    this.bridge = bridge;
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
    // Social bridge features will integrate with the chat
  }

  // Generate social scripts for common situations
  generateScript(situation) {
    const scripts = {
      email_response: {
        template: "Thank you for your message. [Acknowledge their point]. [Your response]. [Next steps if any]. Best regards",
        tips: ["Match their formality level", "Keep it concise", "One ask per email"]
      },
      declining_invitation: {
        template: "Thank you for thinking of me. Unfortunately, I won't be able to make it this time. [Optional: brief reason]. I hope you have a great time!",
        tips: ["You don't owe a detailed explanation", "It's okay to just say no", "Suggesting alternative is optional"]
      },
      asking_for_help: {
        template: "Hi [name], I'm working on [task] and could use some help with [specific thing]. Would you have [time estimate] to [specific ask]?",
        tips: ["Be specific about what you need", "Give them an easy out", "Express appreciation"]
      },
      small_talk: {
        starters: ["How's your week going?", "Working on anything interesting?", "Did you catch [recent event]?"],
        exits: ["Well, I should get back to it!", "Great chatting with you!", "I'll let you get back to your day."],
        tips: ["3-4 exchanges is fine", "Mirroring their energy works", "It's okay to end it"]
      },
      meeting_contribution: {
        template: "Building on [previous point], I think [your idea]. What do others think?",
        tips: ["Reference what someone else said", "Keep it brief", "End with a question to take pressure off"]
      }
    };

    return scripts[situation];
  }

  // Decode unclear communication
  decodeMessage(message) {
    // This would integrate with the AI to help interpret subtext
    return {
      literal: message,
      possibleMeanings: [],
      suggestedResponse: "",
      confidenceLevel: "medium"
    };
  }

  // Track social energy/masking
  getMaskingLevel() {
    const today = new Date().toDateString();
    const interactions = JSON.parse(localStorage.getItem('social_interactions') || '[]')
      .filter(i => new Date(i.timestamp).toDateString() === today);

    const totalDuration = interactions.reduce((sum, i) => sum + (i.duration || 0), 0);
    const maskingLevel = Math.min(100, totalDuration / 60); // Percentage of "spoons" used

    return {
      level: maskingLevel,
      remaining: 100 - maskingLevel,
      recommendation: maskingLevel > 70
        ? "Social battery low. Prioritize recovery time."
        : maskingLevel > 40
          ? "Moderate social energy. Be selective."
          : "Social energy available."
    };
  }
}

// ============================================
// EXECUTIVE FUNCTION ASSIST
// Help with task initiation, prioritization, and completion
// ============================================

class ExecutiveFunctionAssist {
  constructor(bridge) {
    this.bridge = bridge;
    this.singleTaskMode = false;
    this.currentTask = null;
  }

  singleTaskMode() {
    this.singleTaskMode = true;
    document.body.classList.add('single-task-mode');

    // Hide all but current task
    this.showOnlyCurrentTask();
  }

  showOnlyCurrentTask() {
    // Simplified view with just one thing
    const overlay = document.createElement('div');
    overlay.className = 'single-task-overlay';
    overlay.innerHTML = `
      <div class="single-task-content">
        <h2>One thing at a time.</h2>
        <div class="current-task-display">
          ${this.currentTask ? `
            <div class="task-card">
              <span class="task-icon">🎯</span>
              <span class="task-text">${this.currentTask}</span>
            </div>
          ` : `
            <p>What's the one thing you want to focus on?</p>
            <input type="text" class="single-task-input" placeholder="Type your one thing...">
          `}
        </div>
        <button class="exit-single-task">Show everything</button>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector('.single-task-input');
    if (input) {
      input.focus();
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
          this.currentTask = input.value.trim();
          this.showOnlyCurrentTask();
          overlay.remove();
        }
      });
    }

    overlay.querySelector('.exit-single-task').addEventListener('click', () => {
      this.exitSingleTaskMode();
      overlay.remove();
    });
  }

  exitSingleTaskMode() {
    this.singleTaskMode = false;
    document.body.classList.remove('single-task-mode');
    document.querySelector('.single-task-overlay')?.remove();
  }

  offerTinyTask() {
    // Break down resistance by offering the smallest possible step
    const overlay = document.createElement('div');
    overlay.className = 'tiny-task-overlay';
    overlay.innerHTML = `
      <div class="tiny-task-content">
        <h2>Let's make it tiny.</h2>
        <p>What feels impossible right now?</p>
        <input type="text" class="impossible-task-input" placeholder="The thing you're avoiding...">

        <div class="tiny-suggestions hidden">
          <p>How about just:</p>
          <div class="tiny-options"></div>
        </div>

        <button class="skip-tiny">I just can't right now (that's okay)</button>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector('.impossible-task-input');
    input.focus();

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        this.generateTinyVersions(input.value.trim(), overlay);
      }
    });

    overlay.querySelector('.skip-tiny').addEventListener('click', () => {
      overlay.remove();
      this.bridge.setState('recovering');
      this.bridge.gentleNudge("That's okay. Rest is productive too.");
    });
  }

  generateTinyVersions(task, overlay) {
    // Generate tiny versions of the task
    const tinyVersions = [
      `Open the thing related to "${task}"`,
      `Look at "${task}" for 2 minutes`,
      `Write ONE word about "${task}"`,
      `Just think about "${task}" while standing up`,
      `Tell me what's hard about "${task}"`
    ];

    const suggestions = overlay.querySelector('.tiny-suggestions');
    const options = overlay.querySelector('.tiny-options');

    options.innerHTML = tinyVersions.map(tiny => `
      <button class="tiny-option">${tiny}</button>
    `).join('');

    suggestions.classList.remove('hidden');

    options.querySelectorAll('.tiny-option').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentTask = btn.textContent;
        overlay.remove();
        this.bridge.setState('flow');
        this.bridge.gentleNudge(`Starting with: ${this.currentTask}`);

        // Start body double for support
        this.bridge.bodyDouble.startSession('start');
      });
    });
  }

  // Priority matrix that accounts for ADHD
  prioritize(tasks) {
    return tasks.map(task => {
      let score = 0;

      // Urgency (but with ADHD-aware weighting)
      if (task.deadline) {
        const daysUntil = (task.deadline - Date.now()) / (1000 * 60 * 60 * 24);
        if (daysUntil < 1) score += 100; // Crisis mode
        else if (daysUntil < 3) score += 50;
        else score += 10;
      }

      // Interest factor (ADHD brains need this)
      score += (task.interest || 5) * 8;

      // Momentum (is it already started?)
      if (task.started) score += 30;

      // Energy match
      const currentEnergy = this.bridge.energyLevel;
      const taskEnergy = task.energyRequired || 50;
      if (Math.abs(currentEnergy - taskEnergy) < 20) score += 20;

      // Doom factor (will not doing it cause doom?)
      score += (task.doomFactor || 0) * 15;

      return { ...task, priorityScore: score };
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }
}

// ============================================
// COGNITIVE STATE DETECTOR
// Pattern recognition for mental states
// ============================================

class CognitiveStateDetector {
  constructor(bridge) {
    this.bridge = bridge;
    this.patterns = [];
  }

  analyze(interactions) {
    const features = this.extractFeatures(interactions);
    return this.classifyState(features);
  }

  extractFeatures(interactions) {
    const recent = interactions.filter(i => Date.now() - i.timestamp < 300000);

    return {
      typingSpeed: this.calculateTypingSpeed(recent),
      pauseFrequency: this.calculatePauses(recent),
      correctionRate: this.calculateCorrections(recent),
      focusSwitches: this.calculateFocusSwitches(recent),
      mouseJitter: this.calculateMouseJitter(recent)
    };
  }

  calculateTypingSpeed(interactions) {
    const keydowns = interactions.filter(i => i.type === 'keydown');
    if (keydowns.length < 2) return 0;

    const timeSpan = keydowns[keydowns.length - 1].timestamp - keydowns[0].timestamp;
    return keydowns.length / (timeSpan / 60000); // Keys per minute
  }

  calculatePauses(interactions) {
    // Count gaps > 5 seconds between interactions
    let pauses = 0;
    for (let i = 1; i < interactions.length; i++) {
      if (interactions[i].timestamp - interactions[i-1].timestamp > 5000) {
        pauses++;
      }
    }
    return pauses;
  }

  calculateCorrections(interactions) {
    const backspaces = interactions.filter(i =>
      i.type === 'keydown' && i.data?.key === 'Backspace'
    ).length;
    const total = interactions.filter(i => i.type === 'keydown').length;
    return total > 0 ? backspaces / total : 0;
  }

  calculateFocusSwitches(interactions) {
    return interactions.filter(i => i.type === 'window_blur').length;
  }

  calculateMouseJitter(interactions) {
    const moves = interactions.filter(i => i.type === 'mousemove');
    if (moves.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < moves.length; i++) {
      const dx = moves[i].data.x - moves[i-1].data.x;
      const dy = moves[i].data.y - moves[i-1].data.y;
      totalDistance += Math.sqrt(dx*dx + dy*dy);
    }

    return totalDistance / moves.length;
  }

  classifyState(features) {
    // Simple rule-based classification (could be ML-enhanced)
    if (features.typingSpeed > 60 && features.focusSwitches === 0) {
      return 'hyperfocus';
    }
    if (features.focusSwitches > 5 || features.mouseJitter > 100) {
      return 'scattered';
    }
    if (features.pauseFrequency > 10 && features.typingSpeed < 10) {
      return 'paralyzed';
    }
    if (features.correctionRate > 0.3) {
      return 'overwhelmed';
    }

    return 'flow';
  }
}

// ============================================
// BIDIRECTIONAL BRIDGE
// Help neurotypical users access non-linear thinking
// ============================================

class BidirectionalBridge {
  constructor() {
    this.mode = 'standard';
  }

  // Help linear thinkers experience non-linear patterns
  enableNonLinearMode() {
    this.mode = 'nonlinear';

    // Show connections between ideas
    // Enable tangent exploration
    // Reward creative leaps
    // Reduce sequential constraints

    document.body.classList.add('nonlinear-mode');
    this.createConnectionVisualizer();
  }

  createConnectionVisualizer() {
    // Visual web showing how ideas connect
    const viz = document.createElement('div');
    viz.id = 'connection-visualizer';
    viz.className = 'connection-viz';
    document.body.appendChild(viz);

    // This would show a dynamic web of connected concepts
    // as the user works, revealing non-linear relationships
  }

  // Translate between communication styles
  translate(message, fromStyle, toStyle) {
    if (fromStyle === 'nonlinear' && toStyle === 'linear') {
      // Convert associative jumps to sequential steps
      return this.linearize(message);
    }
    if (fromStyle === 'linear' && toStyle === 'nonlinear') {
      // Add connection points and tangent options
      return this.enrichWithConnections(message);
    }
    return message;
  }

  linearize(message) {
    // Would use AI to restructure non-linear thoughts into clear sequences
    return {
      original: message,
      linearized: message, // AI would transform this
      connections: [] // Show what connections exist
    };
  }

  enrichWithConnections(message) {
    // Would use AI to suggest tangents and connections
    return {
      original: message,
      tangents: [],
      relatedConcepts: [],
      creativeleaps: []
    };
  }
}

// ============================================
// INITIALIZE COGNITIVE BRIDGE
// ============================================

class CognitiveBridgeUI {
  constructor() {
    this.bridge = null;
  }

  init() {
    // Don't auto-initialize; wait for user to engage
    this.createOnboardingPrompt();
  }

  createOnboardingPrompt() {
    // Check if already onboarded
    if (localStorage.getItem('cognitive_profile')) {
      this.bridge = new CognitiveBridge();
      return;
    }

    // First-time onboarding
    const onboarding = document.createElement('div');
    onboarding.id = 'cognitive-onboarding';
    onboarding.className = 'cognitive-onboarding';
    onboarding.innerHTML = `
      <div class="onboarding-content">
        <h2>Your brain works differently.</h2>
        <p>That's not a bug — it's a feature. Let's set up your Cognitive Bridge.</p>

        <div class="profile-selection">
          <h3>How does your brain work? (Select all that apply)</h3>

          <div class="profile-options">
            <label class="profile-option">
              <input type="checkbox" value="adhd_inattentive">
              <span class="option-content">
                <span class="option-icon">🌊</span>
                <span class="option-name">ADHD (Inattentive)</span>
                <span class="option-desc">Time blindness, daydreaming, hyperfocus</span>
              </span>
            </label>

            <label class="profile-option">
              <input type="checkbox" value="adhd_hyperactive">
              <span class="option-content">
                <span class="option-icon">⚡</span>
                <span class="option-name">ADHD (Hyperactive)</span>
                <span class="option-desc">Need movement, quick thinking, impatience</span>
              </span>
            </label>

            <label class="profile-option">
              <input type="checkbox" value="autism_high_masking">
              <span class="option-content">
                <span class="option-icon">🎭</span>
                <span class="option-name">Autism (High Masking)</span>
                <span class="option-desc">Social scripts, routine needs, sensory sensitivity</span>
              </span>
            </label>

            <label class="profile-option">
              <input type="checkbox" value="autism_low_support">
              <span class="option-content">
                <span class="option-icon">🧩</span>
                <span class="option-name">Autism (Lower Support)</span>
                <span class="option-desc">Pattern thinking, special interests, direct communication</span>
              </span>
            </label>

            <label class="profile-option">
              <input type="checkbox" value="neurotypical">
              <span class="option-content">
                <span class="option-icon">📐</span>
                <span class="option-name">Neurotypical</span>
                <span class="option-desc">I want to access non-linear thinking tools</span>
              </span>
            </label>

            <label class="profile-option">
              <input type="checkbox" value="exploring">
              <span class="option-content">
                <span class="option-icon">🔍</span>
                <span class="option-name">Still figuring it out</span>
                <span class="option-desc">Let me explore and adapt as I learn</span>
              </span>
            </label>
          </div>

          <div class="onboarding-note">
            <p>💡 No diagnosis needed. Self-identification is valid.<br>
            Your settings are stored locally and can be changed anytime.</p>
          </div>

          <button class="onboarding-submit">Set up my Cognitive Bridge</button>
          <button class="onboarding-skip">Skip for now</button>
        </div>
      </div>
    `;

    document.body.appendChild(onboarding);

    onboarding.querySelector('.onboarding-submit').addEventListener('click', () => {
      const selected = Array.from(onboarding.querySelectorAll('input:checked'))
        .map(i => i.value);

      if (selected.length > 0) {
        // Determine primary profile
        let primaryProfile = selected[0];
        if (selected.includes('adhd_inattentive') && selected.includes('adhd_hyperactive')) {
          primaryProfile = 'adhd_combined';
        }
        if (selected.some(s => s.includes('adhd')) && selected.some(s => s.includes('autism'))) {
          primaryProfile = 'audhd';
        }

        this.bridge = new CognitiveBridge();
        this.bridge.setProfile(primaryProfile, { selectedTraits: selected });
        onboarding.remove();
      }
    });

    onboarding.querySelector('.onboarding-skip').addEventListener('click', () => {
      localStorage.setItem('cognitive_profile', JSON.stringify({ type: 'exploring' }));
      this.bridge = new CognitiveBridge();
      onboarding.remove();
    });
  }
}

// ============================================
// EXPORT & INITIALIZE
// ============================================

window.CognitiveBridge = CognitiveBridge;
window.cognitiveBridgeUI = new CognitiveBridgeUI();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.cognitiveBridgeUI.init();
});

console.log('⟡ Cognitive Bridge loaded — bridging minds, empowering all.');
