/**
 * ⟡ REALITY COMPOSER — Your Environment, Optimized
 *
 * RECURSION 4: The interface between inner and outer worlds
 *
 * The insight: Our environment shapes our state more than we realize.
 * A cluttered screen creates mental clutter. The wrong lighting tanks focus.
 * The right soundscape can induce flow.
 *
 * This system composes your reality:
 * 1. Visual Environment — Interface density, colors, information load
 * 2. Auditory Environment — Soundscapes, binaural beats, silence
 * 3. Temporal Environment — Time perception manipulation
 * 4. Social Environment — Connection levels, notification policies
 * 5. Physical Prompts — Suggestions for real-world changes
 *
 * It's not just adapting to your state — it's shaping optimal conditions FOR your state.
 */

// ============================================
// REALITY COMPOSER SYSTEM
// ============================================

class RealityComposer {
  constructor() {
    this.currentReality = 'default';
    this.realities = this.loadRealities();
    this.audioContext = null;
    this.activeAudio = null;
    this.colorProfile = 'standard';

    this.setupStateListener();
  }

  loadRealities() {
    const custom = localStorage.getItem('custom_realities');
    const customRealities = custom ? JSON.parse(custom) : {};

    return {
      ...this.getDefaultRealities(),
      ...customRealities
    };
  }

  getDefaultRealities() {
    return {
      // Pre-composed reality states
      hyperfocus: {
        name: 'Hyperfocus Chamber',
        icon: '🎯',
        description: 'Maximum focus, minimum distraction',
        visual: {
          interfaceMode: 'minimal',
          colorTemp: 'cool', // Blue-ish for alertness
          brightness: 85,
          contrast: 'high',
          animations: 'none',
          fontSize: 'medium',
          informationDensity: 'low'
        },
        auditory: {
          soundscape: 'brown_noise',
          volume: 0.3,
          binauralBeat: 40, // Gamma for focus
          notifications: 'silent'
        },
        temporal: {
          showClock: false,
          timeReminders: 'none',
          deadlineVisibility: 'hidden'
        },
        social: {
          notificationPolicy: 'block_all',
          presenceStatus: 'dnd',
          messagingEnabled: false
        },
        physical: [
          'Close the door if possible',
          'Put phone in another room',
          'Water within reach'
        ]
      },

      flow: {
        name: 'Flow State',
        icon: '🌊',
        description: 'Optimal creativity and productivity',
        visual: {
          interfaceMode: 'balanced',
          colorTemp: 'neutral',
          brightness: 75,
          contrast: 'normal',
          animations: 'subtle',
          fontSize: 'comfortable',
          informationDensity: 'medium'
        },
        auditory: {
          soundscape: 'lo_fi',
          volume: 0.25,
          binauralBeat: 10, // Alpha for relaxed focus
          notifications: 'important_only'
        },
        temporal: {
          showClock: true,
          timeReminders: 'gentle',
          deadlineVisibility: 'subtle'
        },
        social: {
          notificationPolicy: 'important',
          presenceStatus: 'busy',
          messagingEnabled: true
        },
        physical: [
          'Comfortable temperature',
          'Natural light if available',
          'Snacks nearby for longer sessions'
        ]
      },

      recovery: {
        name: 'Recovery Mode',
        icon: '🌿',
        description: 'Gentle environment for restoration',
        visual: {
          interfaceMode: 'minimal',
          colorTemp: 'warm', // Warm for relaxation
          brightness: 50,
          contrast: 'low',
          animations: 'none',
          fontSize: 'large',
          informationDensity: 'minimal'
        },
        auditory: {
          soundscape: 'nature',
          volume: 0.2,
          binauralBeat: 4, // Theta for relaxation
          notifications: 'silent'
        },
        temporal: {
          showClock: false,
          timeReminders: 'none',
          deadlineVisibility: 'hidden'
        },
        social: {
          notificationPolicy: 'none',
          presenceStatus: 'away',
          messagingEnabled: false
        },
        physical: [
          'Lie down if you can',
          'Dim the lights',
          'Warm drink nearby',
          'Blanket if cold'
        ]
      },

      social: {
        name: 'Social Mode',
        icon: '👥',
        description: 'Optimized for connection and communication',
        visual: {
          interfaceMode: 'full',
          colorTemp: 'warm',
          brightness: 80,
          contrast: 'normal',
          animations: 'full',
          fontSize: 'comfortable',
          informationDensity: 'high'
        },
        auditory: {
          soundscape: 'none',
          volume: 0,
          binauralBeat: null,
          notifications: 'all'
        },
        temporal: {
          showClock: true,
          timeReminders: 'active',
          deadlineVisibility: 'visible'
        },
        social: {
          notificationPolicy: 'all',
          presenceStatus: 'available',
          messagingEnabled: true
        },
        physical: [
          'Camera-ready if needed',
          'Good lighting for video',
          'Quiet background'
        ]
      },

      creative: {
        name: 'Creative Chamber',
        icon: '✨',
        description: 'Unleash imagination and ideation',
        visual: {
          interfaceMode: 'expanded',
          colorTemp: 'dynamic', // Shifts slowly
          brightness: 70,
          contrast: 'normal',
          animations: 'ambient',
          fontSize: 'comfortable',
          informationDensity: 'medium'
        },
        auditory: {
          soundscape: 'ambient_electronic',
          volume: 0.35,
          binauralBeat: 7, // Theta for creativity
          notifications: 'silent'
        },
        temporal: {
          showClock: false,
          timeReminders: 'none',
          deadlineVisibility: 'hidden'
        },
        social: {
          notificationPolicy: 'none',
          presenceStatus: 'creating',
          messagingEnabled: false
        },
        physical: [
          'Pen and paper within reach',
          'Space to move if needed',
          'Something beautiful to look at'
        ]
      },

      night: {
        name: 'Night Mode',
        icon: '🌙',
        description: 'Protect circadian rhythm while working late',
        visual: {
          interfaceMode: 'minimal',
          colorTemp: 'warm_extreme', // No blue light
          brightness: 40,
          contrast: 'low',
          animations: 'none',
          fontSize: 'large',
          informationDensity: 'low'
        },
        auditory: {
          soundscape: 'white_noise_soft',
          volume: 0.15,
          binauralBeat: 2, // Delta, almost sleep
          notifications: 'silent'
        },
        temporal: {
          showClock: true,
          timeReminders: 'sleep_soon',
          deadlineVisibility: 'tomorrow'
        },
        social: {
          notificationPolicy: 'none',
          presenceStatus: 'offline',
          messagingEnabled: false
        },
        physical: [
          'Dim room lights',
          'Prepare for sleep soon',
          'No caffeine'
        ]
      },

      emergency: {
        name: 'Emergency Protocol',
        icon: '🆘',
        description: 'When everything feels too much',
        visual: {
          interfaceMode: 'emergency',
          colorTemp: 'soft',
          brightness: 30,
          contrast: 'low',
          animations: 'breathing_only',
          fontSize: 'large',
          informationDensity: 'none'
        },
        auditory: {
          soundscape: 'heartbeat',
          volume: 0.2,
          binauralBeat: 6, // Calming theta
          notifications: 'silent'
        },
        temporal: {
          showClock: false,
          timeReminders: 'none',
          deadlineVisibility: 'hidden'
        },
        social: {
          notificationPolicy: 'emergency_contacts_only',
          presenceStatus: 'need_support',
          messagingEnabled: true // To reach out
        },
        physical: [
          'Find somewhere safe',
          'Breathe slowly',
          'You are okay',
          'This will pass'
        ]
      }
    };
  }

  setupStateListener() {
    // Listen for cognitive state changes
    window.addEventListener('cognitive-state-changed', (e) => {
      this.respondToState(e.detail.to);
    });

    // Listen for quantum self updates
    window.addEventListener('quantum-state-updated', (e) => {
      this.respondToQuantumState(e.detail.state);
    });
  }

  respondToState(cognitiveState) {
    const stateToReality = {
      hyperfocus: 'hyperfocus',
      flow: 'flow',
      scattered: 'flow', // Help them find flow
      overwhelmed: 'emergency',
      paralyzed: 'recovery',
      recovering: 'recovery',
      energized: 'creative'
    };

    const targetReality = stateToReality[cognitiveState];
    if (targetReality && targetReality !== this.currentReality) {
      this.suggestReality(targetReality);
    }
  }

  respondToQuantumState(quantumState) {
    // More nuanced response based on multiple dimensions
    if (quantumState.emotional < 25) {
      this.suggestReality('emergency');
    } else if (quantumState.creative > 75 && quantumState.cognitive > 60) {
      this.suggestReality('creative');
    } else if (quantumState.social < 30 && quantumState.physical < 50) {
      this.suggestReality('recovery');
    }
  }

  // ============================================
  // REALITY COMPOSITION
  // ============================================

  async composeReality(realityId) {
    const reality = this.realities[realityId];
    if (!reality) {
      console.warn('Unknown reality:', realityId);
      return;
    }

    this.currentReality = realityId;

    // Apply all dimensions
    await Promise.all([
      this.applyVisualEnvironment(reality.visual),
      this.applyAuditoryEnvironment(reality.auditory),
      this.applyTemporalEnvironment(reality.temporal),
      this.applySocialEnvironment(reality.social)
    ]);

    // Show physical suggestions
    this.showPhysicalSuggestions(reality.physical);

    // Emit event
    window.dispatchEvent(new CustomEvent('reality-composed', {
      detail: { reality: realityId, config: reality }
    }));

    console.log(`⟡ Reality composed: ${reality.name}`);
  }

  // ============================================
  // VISUAL ENVIRONMENT
  // ============================================

  async applyVisualEnvironment(config) {
    const root = document.documentElement;

    // Interface mode
    document.body.setAttribute('data-interface-mode', config.interfaceMode);

    // Color temperature
    this.applyColorTemperature(config.colorTemp);

    // Brightness
    root.style.setProperty('--screen-brightness', `${config.brightness}%`);

    // Contrast
    document.body.setAttribute('data-contrast', config.contrast);

    // Animations
    if (config.animations === 'none') {
      root.style.setProperty('--animation-duration', '0s');
    } else if (config.animations === 'subtle') {
      root.style.setProperty('--animation-duration', '0.15s');
    } else if (config.animations === 'ambient') {
      this.startAmbientAnimations();
    } else {
      root.style.setProperty('--animation-duration', '0.3s');
    }

    // Font size
    const fontSizes = { small: '14px', medium: '16px', comfortable: '18px', large: '20px' };
    root.style.setProperty('--base-font-size', fontSizes[config.fontSize] || '16px');

    // Information density
    document.body.setAttribute('data-density', config.informationDensity);
  }

  applyColorTemperature(temp) {
    const root = document.documentElement;
    const temps = {
      cool: { filter: 'hue-rotate(-10deg) saturate(1.1)', warmth: 0 },
      neutral: { filter: 'none', warmth: 0 },
      warm: { filter: 'sepia(0.1) saturate(0.9)', warmth: 20 },
      warm_extreme: { filter: 'sepia(0.3) saturate(0.8) brightness(0.9)', warmth: 40 },
      dynamic: { filter: 'none', warmth: 'dynamic' }
    };

    const config = temps[temp] || temps.neutral;

    if (config.warmth === 'dynamic') {
      this.startDynamicColorTemp();
    } else {
      root.style.setProperty('--color-filter', config.filter);
    }
  }

  startDynamicColorTemp() {
    // Slowly shift color temperature over time
    let hue = 0;
    const shift = () => {
      hue = (hue + 1) % 20 - 10; // -10 to +10
      document.documentElement.style.setProperty(
        '--color-filter',
        `hue-rotate(${hue}deg)`
      );
    };

    this.dynamicTempInterval = setInterval(shift, 30000); // Shift every 30s
  }

  startAmbientAnimations() {
    // Add subtle ambient animations for creative mode
    if (!document.querySelector('.ambient-layer')) {
      const ambient = document.createElement('div');
      ambient.className = 'ambient-layer';
      ambient.innerHTML = `
        <div class="ambient-orb orb-1"></div>
        <div class="ambient-orb orb-2"></div>
        <div class="ambient-orb orb-3"></div>
      `;
      document.body.appendChild(ambient);
    }
  }

  // ============================================
  // AUDITORY ENVIRONMENT
  // ============================================

  async applyAuditoryEnvironment(config) {
    // Stop any existing audio
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio = null;
    }

    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator = null;
    }

    // Soundscape
    if (config.soundscape && config.soundscape !== 'none') {
      await this.playSoundscape(config.soundscape, config.volume);
    }

    // Binaural beats (if supported)
    if (config.binauralBeat) {
      this.playBinauralBeat(config.binauralBeat, config.volume * 0.3);
    }

    // Notification policy
    this.setNotificationPolicy(config.notifications);
  }

  async playSoundscape(type, volume) {
    // In production: actual audio files
    // For now: Web Audio API generated sounds

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const sounds = {
      brown_noise: () => this.generateBrownNoise(),
      white_noise_soft: () => this.generateWhiteNoise(0.3),
      nature: () => this.loadAudioFile('/sounds/nature.mp3'),
      lo_fi: () => this.loadAudioFile('/sounds/lofi.mp3'),
      ambient_electronic: () => this.loadAudioFile('/sounds/ambient.mp3'),
      heartbeat: () => this.generateHeartbeat()
    };

    const generator = sounds[type];
    if (generator) {
      const source = await generator();
      if (source) {
        const gain = this.audioContext.createGain();
        gain.gain.value = volume;
        source.connect(gain);
        gain.connect(this.audioContext.destination);
        source.start();
        this.activeSource = source;
      }
    }
  }

  generateBrownNoise() {
    const bufferSize = 2 * this.audioContext.sampleRate;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Increase volume
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    return source;
  }

  generateWhiteNoise(intensity = 1) {
    const bufferSize = 2 * this.audioContext.sampleRate;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * intensity;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    return source;
  }

  generateHeartbeat() {
    // Simulated heartbeat sound using oscillators
    // In production: use actual heartbeat audio
    return null; // Placeholder
  }

  playBinauralBeat(targetFreq, volume) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Binaural beat: two tones with slight frequency difference
    const baseFreq = 200;

    const leftOsc = this.audioContext.createOscillator();
    const rightOsc = this.audioContext.createOscillator();

    leftOsc.frequency.value = baseFreq;
    rightOsc.frequency.value = baseFreq + targetFreq;

    const leftGain = this.audioContext.createGain();
    const rightGain = this.audioContext.createGain();
    leftGain.gain.value = volume;
    rightGain.gain.value = volume;

    // Create stereo panner for left/right
    const leftPan = this.audioContext.createStereoPanner();
    const rightPan = this.audioContext.createStereoPanner();
    leftPan.pan.value = -1;
    rightPan.pan.value = 1;

    leftOsc.connect(leftGain).connect(leftPan).connect(this.audioContext.destination);
    rightOsc.connect(rightGain).connect(rightPan).connect(this.audioContext.destination);

    leftOsc.start();
    rightOsc.start();

    this.binauralOscillators = [leftOsc, rightOsc];
  }

  async loadAudioFile(url) {
    // Would load actual audio file
    console.log('Would load:', url);
    return null;
  }

  setNotificationPolicy(policy) {
    window.notificationPolicy = policy;
    document.body.setAttribute('data-notification-policy', policy);

    // Could integrate with system notifications
    console.log('Notification policy set:', policy);
  }

  // ============================================
  // TEMPORAL ENVIRONMENT
  // ============================================

  applyTemporalEnvironment(config) {
    // Clock visibility
    const clocks = document.querySelectorAll('.clock, #time-ruler, .timestamp');
    clocks.forEach(clock => {
      clock.style.display = config.showClock ? '' : 'none';
    });

    // Time reminders
    this.setTimeReminderMode(config.timeReminders);

    // Deadline visibility
    this.setDeadlineVisibility(config.deadlineVisibility);
  }

  setTimeReminderMode(mode) {
    // Clear existing reminders
    if (this.timeReminderInterval) {
      clearInterval(this.timeReminderInterval);
    }

    if (mode === 'none') return;

    if (mode === 'gentle') {
      // Hourly gentle reminder
      this.timeReminderInterval = setInterval(() => {
        this.showTimeReminder('Another hour has passed. How are you doing?');
      }, 3600000);
    } else if (mode === 'sleep_soon') {
      // Check time and remind about sleep
      this.timeReminderInterval = setInterval(() => {
        const hour = new Date().getHours();
        if (hour >= 22) {
          this.showTimeReminder('It\'s getting late. Your body will thank you for sleep.');
        }
      }, 1800000);
    }
  }

  showTimeReminder(message) {
    if (window.cognitiveBridge?.bridge?.hyperfocusProtected) return;

    const reminder = document.createElement('div');
    reminder.className = 'time-reminder';
    reminder.innerHTML = `
      <span class="reminder-icon">⏰</span>
      <span class="reminder-message">${message}</span>
    `;

    document.body.appendChild(reminder);
    setTimeout(() => reminder.classList.add('visible'), 100);
    setTimeout(() => {
      reminder.classList.remove('visible');
      setTimeout(() => reminder.remove(), 300);
    }, 5000);
  }

  setDeadlineVisibility(mode) {
    const deadlines = document.querySelectorAll('.deadline, .due-date, .commitment');
    deadlines.forEach(el => {
      if (mode === 'hidden') {
        el.style.display = 'none';
      } else if (mode === 'subtle') {
        el.style.opacity = '0.5';
      } else {
        el.style.display = '';
        el.style.opacity = '1';
      }
    });
  }

  // ============================================
  // SOCIAL ENVIRONMENT
  // ============================================

  applySocialEnvironment(config) {
    // Presence status
    this.setPresenceStatus(config.presenceStatus);

    // Messaging toggle
    if (!config.messagingEnabled) {
      document.body.classList.add('messaging-disabled');
    } else {
      document.body.classList.remove('messaging-disabled');
    }
  }

  setPresenceStatus(status) {
    // Would integrate with communication tools
    window.presenceStatus = status;
    console.log('Presence status:', status);
  }

  // ============================================
  // PHYSICAL SUGGESTIONS
  // ============================================

  showPhysicalSuggestions(suggestions) {
    if (!suggestions || suggestions.length === 0) return;

    const existing = document.querySelector('.physical-suggestions');
    if (existing) existing.remove();

    const panel = document.createElement('div');
    panel.className = 'physical-suggestions';
    panel.innerHTML = `
      <div class="ps-header">
        <span class="ps-icon">🌍</span>
        <span class="ps-title">Physical Environment</span>
      </div>
      <ul class="ps-list">
        ${suggestions.map(s => `<li>${s}</li>`).join('')}
      </ul>
      <button class="ps-dismiss">Got it</button>
    `;

    document.body.appendChild(panel);

    panel.querySelector('.ps-dismiss').addEventListener('click', () => {
      panel.classList.add('dismissed');
      setTimeout(() => panel.remove(), 300);
    });

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (document.body.contains(panel)) {
        panel.classList.add('dismissed');
        setTimeout(() => panel.remove(), 300);
      }
    }, 10000);
  }

  // ============================================
  // REALITY SUGGESTION
  // ============================================

  suggestReality(realityId) {
    const reality = this.realities[realityId];
    if (!reality) return;

    const suggestion = document.createElement('div');
    suggestion.className = 'reality-suggestion';
    suggestion.innerHTML = `
      <div class="rs-content">
        <span class="rs-icon">${reality.icon}</span>
        <div class="rs-info">
          <strong>${reality.name}</strong>
          <p>${reality.description}</p>
        </div>
        <div class="rs-actions">
          <button class="rs-accept">Compose</button>
          <button class="rs-dismiss">×</button>
        </div>
      </div>
    `;

    document.body.appendChild(suggestion);

    suggestion.querySelector('.rs-accept').addEventListener('click', () => {
      this.composeReality(realityId);
      suggestion.remove();
    });

    suggestion.querySelector('.rs-dismiss').addEventListener('click', () => {
      suggestion.remove();
    });

    // Auto-dismiss after 15 seconds
    setTimeout(() => {
      if (document.body.contains(suggestion)) {
        suggestion.remove();
      }
    }, 15000);
  }

  // ============================================
  // CUSTOM REALITY CREATION
  // ============================================

  createCustomReality(name, config) {
    const id = 'custom_' + Date.now();
    this.realities[id] = {
      name,
      icon: '🎨',
      description: 'Custom reality',
      ...config
    };

    this.saveCustomRealities();
    return id;
  }

  saveCustomRealities() {
    const custom = {};
    Object.entries(this.realities).forEach(([id, reality]) => {
      if (id.startsWith('custom_')) {
        custom[id] = reality;
      }
    });
    localStorage.setItem('custom_realities', JSON.stringify(custom));
  }

  // ============================================
  // CLEANUP
  // ============================================

  stopAudio() {
    if (this.activeSource) {
      this.activeSource.stop();
      this.activeSource = null;
    }
    if (this.binauralOscillators) {
      this.binauralOscillators.forEach(osc => osc.stop());
      this.binauralOscillators = null;
    }
  }
}

// ============================================
// REALITY COMPOSER UI
// ============================================

class RealityComposerUI {
  constructor(composer) {
    this.composer = composer;
    this.render();
  }

  render() {
    const panel = document.createElement('div');
    panel.id = 'reality-composer';
    panel.className = 'reality-composer-panel';
    panel.innerHTML = `
      <button class="rc-toggle" title="Reality Composer">
        <span class="rc-icon">🎭</span>
      </button>
      <div class="rc-menu hidden">
        <div class="rc-header">
          <h4>Compose Reality</h4>
          <span class="rc-current">${this.composer.realities[this.composer.currentReality]?.name || 'Default'}</span>
        </div>
        <div class="rc-options">
          ${this.renderOptions()}
        </div>
        <div class="rc-quick">
          <button class="rc-stop-audio" title="Stop Audio">🔇</button>
          <button class="rc-reset" title="Reset to Default">↩️</button>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // Toggle menu
    panel.querySelector('.rc-toggle').addEventListener('click', () => {
      panel.querySelector('.rc-menu').classList.toggle('hidden');
    });

    // Reality options
    panel.querySelectorAll('.rc-option').forEach(opt => {
      opt.addEventListener('click', () => {
        this.composer.composeReality(opt.dataset.reality);
        panel.querySelector('.rc-current').textContent =
          this.composer.realities[opt.dataset.reality].name;
        panel.querySelector('.rc-menu').classList.add('hidden');
      });
    });

    // Stop audio
    panel.querySelector('.rc-stop-audio').addEventListener('click', () => {
      this.composer.stopAudio();
    });

    // Reset
    panel.querySelector('.rc-reset').addEventListener('click', () => {
      location.reload(); // Simple reset
    });
  }

  renderOptions() {
    return Object.entries(this.composer.realities).map(([id, reality]) => `
      <button class="rc-option" data-reality="${id}">
        <span class="option-icon">${reality.icon}</span>
        <div class="option-info">
          <span class="option-name">${reality.name}</span>
          <span class="option-desc">${reality.description}</span>
        </div>
      </button>
    `).join('');
  }
}

// ============================================
// CSS STYLES
// ============================================

const realityComposerStyles = document.createElement('style');
realityComposerStyles.textContent = `
  .reality-composer-panel {
    position: fixed;
    bottom: 90px;
    right: 20px;
    z-index: 1000;
  }

  .rc-toggle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2));
    border: 1px solid rgba(139, 92, 246, 0.4);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .rc-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
  }

  .rc-menu {
    position: absolute;
    bottom: 60px;
    right: 0;
    width: 300px;
    background: rgba(18, 18, 26, 0.98);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
    border-radius: 16px;
    padding: 16px;
    backdrop-filter: blur(20px);
    opacity: 1;
    transform: translateY(0);
    transition: all 0.3s ease;
  }

  .rc-menu.hidden {
    opacity: 0;
    transform: translateY(10px);
    pointer-events: none;
  }

  .rc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--glass-border, rgba(255,255,255,0.08));
  }

  .rc-header h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary, #f0f0f5);
  }

  .rc-current {
    font-size: 12px;
    color: var(--text-muted, #606070);
  }

  .rc-options {
    max-height: 300px;
    overflow-y: auto;
  }

  .rc-option {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
    margin-bottom: 4px;
    color: var(--text-primary, #f0f0f5);
  }

  .rc-option:hover {
    background: var(--bg-tertiary, #1a1a24);
    border-color: var(--glass-border, rgba(255,255,255,0.08));
  }

  .rc-option.active {
    background: var(--primary-soft, rgba(99, 102, 241, 0.15));
    border-color: var(--primary, #6366f1);
  }

  .option-icon {
    font-size: 20px;
    flex-shrink: 0;
  }

  .option-info {
    flex: 1;
    min-width: 0;
  }

  .option-name {
    display: block;
    font-weight: 500;
    color: var(--text-primary, #f0f0f5);
    font-size: 13px;
  }

  .option-desc {
    display: block;
    font-size: 11px;
    color: var(--text-muted, #606070);
    margin-top: 2px;
  }

  .rc-quick {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--glass-border, rgba(255,255,255,0.08));
  }

  .rc-stop-audio, .rc-reset {
    flex: 1;
    padding: 8px;
    background: var(--bg-tertiary, #1a1a24);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    color: var(--text-secondary, #a0a0b0);
    transition: all 0.2s;
  }

  .rc-stop-audio:hover, .rc-reset:hover {
    background: var(--bg-hover, #22222e);
    color: var(--text-primary, #f0f0f5);
  }

  /* Reality Suggestion Toast */
  .reality-suggestion {
    position: fixed;
    bottom: 150px;
    right: 20px;
    background: rgba(18, 18, 26, 0.98);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
    border-radius: 12px;
    padding: 16px;
    max-width: 320px;
    z-index: 1001;
    animation: rcSlideIn 0.3s ease;
    backdrop-filter: blur(20px);
  }

  @keyframes rcSlideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .rs-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .rs-icon { font-size: 32px; }

  .rs-info strong {
    display: block;
    color: var(--text-primary, #f0f0f5);
    margin-bottom: 4px;
  }

  .rs-info p {
    margin: 0;
    font-size: 12px;
    color: var(--text-secondary, #a0a0b0);
  }

  .rs-actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }

  .rs-accept {
    padding: 8px 16px;
    background: var(--primary, #6366f1);
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }

  .rs-accept:hover { filter: brightness(1.1); }

  .rs-dismiss {
    padding: 8px 12px;
    background: transparent;
    border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
    border-radius: 6px;
    color: var(--text-muted, #606070);
    cursor: pointer;
    transition: all 0.2s;
  }

  .rs-dismiss:hover { background: var(--bg-tertiary, #1a1a24); }

  /* Physical Suggestions Panel */
  .physical-suggestions {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(18, 18, 26, 0.95);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
    border-radius: 12px;
    padding: 16px 20px;
    z-index: 999;
    transition: all 0.3s ease;
    backdrop-filter: blur(20px);
  }

  .physical-suggestions.dismissed {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
    pointer-events: none;
  }

  .ps-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .ps-icon { font-size: 16px; }
  .ps-title {
    font-weight: 500;
    font-size: 13px;
    color: var(--text-primary, #f0f0f5);
  }

  .ps-list {
    margin: 0;
    padding-left: 20px;
    font-size: 12px;
    color: var(--text-secondary, #a0a0b0);
  }

  .ps-list li { margin: 4px 0; }

  .ps-dismiss {
    margin-top: 12px;
    padding: 6px 12px;
    background: transparent;
    border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
    border-radius: 6px;
    color: var(--text-muted, #606070);
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .ps-dismiss:hover { background: var(--bg-tertiary, #1a1a24); }

  /* Light theme support */
  [data-theme="light"] .reality-composer-panel .rc-menu,
  [data-theme="light"] .reality-suggestion,
  [data-theme="light"] .physical-suggestions {
    background: rgba(255, 255, 255, 0.98);
    border-color: rgba(0, 0, 0, 0.1);
  }

  [data-theme="light"] .rc-toggle {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.15));
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;
document.head.appendChild(realityComposerStyles);

// ============================================
// INITIALIZE
// ============================================

window.RealityComposer = RealityComposer;
window.realityComposer = new RealityComposer();

// UI initialization deferred until user enters app (called from app.js)
window.initRealityComposerUI = function() {
  new RealityComposerUI(window.realityComposer);
};

console.log('🎭 Reality Composer initialized — your environment, optimized');
