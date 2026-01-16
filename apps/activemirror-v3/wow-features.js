/**
 * WOW FEATURES — Make ActiveMirror absolutely sticky
 * Theme toggle, accessibility, particle effects, micro-interactions
 *
 * Features:
 * - Light/Dark theme toggle with smooth transitions
 * - Spectrum-friendly accessibility mode (autism-friendly)
 * - Particle effects and ambient animations
 * - Easter eggs and delightful micro-interactions
 * - Focus mode with distraction reduction
 */

class WowFeatures {
  constructor() {
    this.theme = localStorage.getItem('am_theme') || 'dark';
    this.accessibilityMode = localStorage.getItem('am_accessibility') || 'standard';
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.particles = [];
    this.mouseTrail = [];
    this.konamiCode = [];
    this.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    this.init();
  }

  init() {
    this.injectStyles();
    this.createThemeToggle();
    this.createAccessibilityMenu();
    this.applyTheme(this.theme);
    this.applyAccessibility(this.accessibilityMode);
    this.setupParticles();
    this.setupMicroInteractions();
    this.setupKonami();
    this.setupWelcomeAnimation();

    console.log('✨ WOW Features loaded — prepare to be delighted');
  }

  // === THEME TOGGLE ===

  createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.id = 'theme-toggle';
    toggle.className = 'theme-toggle';
    toggle.innerHTML = this.theme === 'dark' ? '☀️' : '🌙';
    toggle.title = 'Toggle light/dark theme (⌘⇧T)';
    toggle.setAttribute('aria-label', 'Toggle theme');

    toggle.addEventListener('click', () => this.toggleTheme());
    document.body.appendChild(toggle);

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('am_theme', this.theme);
    this.applyTheme(this.theme);

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.innerHTML = this.theme === 'dark' ? '☀️' : '🌙';
      toggle.classList.add('theme-switching');
      setTimeout(() => toggle.classList.remove('theme-switching'), 500);
    }

    this.showToast(this.theme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode');
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Also update meta theme-color for mobile
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = theme === 'dark' ? '#0a0a0f' : '#f8fafc';
  }

  // === ACCESSIBILITY MENU ===

  createAccessibilityMenu() {
    const btn = document.createElement('button');
    btn.id = 'accessibility-toggle';
    btn.className = 'accessibility-toggle';
    btn.innerHTML = '♿';
    btn.title = 'Accessibility options';
    btn.setAttribute('aria-label', 'Open accessibility menu');
    btn.setAttribute('aria-haspopup', 'true');

    const menu = document.createElement('div');
    menu.id = 'accessibility-menu';
    menu.className = 'accessibility-menu';
    menu.setAttribute('role', 'menu');
    menu.innerHTML = `
      <div class="access-header">
        <span>Accessibility</span>
        <button class="access-close" aria-label="Close menu">×</button>
      </div>

      <div class="access-section">
        <label class="access-label">Display Mode</label>
        <div class="access-options">
          <button class="access-opt ${this.accessibilityMode === 'standard' ? 'active' : ''}" data-mode="standard">
            Standard
          </button>
          <button class="access-opt ${this.accessibilityMode === 'spectrum' ? 'active' : ''}" data-mode="spectrum">
            Spectrum Friendly
          </button>
          <button class="access-opt ${this.accessibilityMode === 'focus' ? 'active' : ''}" data-mode="focus">
            Focus Mode
          </button>
        </div>
      </div>

      <div class="access-section">
        <label class="access-label">Motion</label>
        <div class="access-toggle-row">
          <span>Reduce motion</span>
          <label class="access-switch">
            <input type="checkbox" id="reduce-motion-toggle" ${this.reducedMotion ? 'checked' : ''}>
            <span class="access-slider"></span>
          </label>
        </div>
      </div>

      <div class="access-section">
        <label class="access-label">Text Size</label>
        <div class="access-size-controls">
          <button class="access-size" data-size="small">A-</button>
          <button class="access-size active" data-size="normal">A</button>
          <button class="access-size" data-size="large">A+</button>
          <button class="access-size" data-size="xlarge">A++</button>
        </div>
      </div>

      <div class="access-section">
        <label class="access-label">Contrast</label>
        <div class="access-options">
          <button class="access-opt active" data-contrast="normal">Normal</button>
          <button class="access-opt" data-contrast="high">High Contrast</button>
        </div>
      </div>

      <div class="access-info">
        <span class="access-info-icon">💡</span>
        <span>Spectrum Friendly mode reduces visual noise, calms animations, and uses softer colors for neurodivergent users.</span>
      </div>
    `;

    btn.addEventListener('click', () => {
      menu.classList.toggle('visible');
      btn.setAttribute('aria-expanded', menu.classList.contains('visible'));
    });

    menu.querySelector('.access-close').addEventListener('click', () => {
      menu.classList.remove('visible');
      btn.setAttribute('aria-expanded', 'false');
    });

    // Mode buttons
    menu.querySelectorAll('.access-opt[data-mode]').forEach(opt => {
      opt.addEventListener('click', () => {
        menu.querySelectorAll('.access-opt[data-mode]').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        this.applyAccessibility(opt.dataset.mode);
      });
    });

    // Reduce motion toggle
    menu.querySelector('#reduce-motion-toggle').addEventListener('change', (e) => {
      this.reducedMotion = e.target.checked;
      document.documentElement.classList.toggle('reduce-motion', this.reducedMotion);
      localStorage.setItem('am_reduce_motion', this.reducedMotion);
    });

    // Text size
    menu.querySelectorAll('.access-size').forEach(btn => {
      btn.addEventListener('click', () => {
        menu.querySelectorAll('.access-size').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setTextSize(btn.dataset.size);
      });
    });

    // Contrast
    menu.querySelectorAll('.access-opt[data-contrast]').forEach(opt => {
      opt.addEventListener('click', () => {
        menu.querySelectorAll('.access-opt[data-contrast]').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        document.documentElement.classList.toggle('high-contrast', opt.dataset.contrast === 'high');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('visible');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    document.body.appendChild(btn);
    document.body.appendChild(menu);
  }

  applyAccessibility(mode) {
    this.accessibilityMode = mode;
    localStorage.setItem('am_accessibility', mode);

    document.documentElement.classList.remove('spectrum-mode', 'focus-mode');

    if (mode === 'spectrum') {
      document.documentElement.classList.add('spectrum-mode');
      this.showToast('🧠 Spectrum Friendly mode — calmer, clearer');
    } else if (mode === 'focus') {
      document.documentElement.classList.add('focus-mode');
      this.showToast('🎯 Focus mode — distractions minimized');
    }
  }

  setTextSize(size) {
    const sizes = { small: '14px', normal: '16px', large: '18px', xlarge: '20px' };
    document.documentElement.style.setProperty('--base-font-size', sizes[size] || '16px');
    localStorage.setItem('am_text_size', size);
  }

  // === PARTICLES & VISUAL MAGIC ===

  setupParticles() {
    if (this.reducedMotion) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.className = 'particle-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let animationFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Create ambient particles
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.3 + 0.1,
        color: ['#10b981', '#6366f1', '#8b5cf6'][Math.floor(Math.random() * 3)]
      });
    }

    const animate = () => {
      if (this.reducedMotion || document.documentElement.classList.contains('spectrum-mode')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
  }

  // === MICRO-INTERACTIONS ===

  setupMicroInteractions() {
    // Button ripple effect
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button, .btn-enter, .agent-dock-item');
      if (btn && !this.reducedMotion) {
        this.createRipple(e, btn);
      }
    });

    // Hover glow on interactive elements
    document.addEventListener('mouseover', (e) => {
      const interactive = e.target.closest('button, a, .agent-dock-item, .cp-tab');
      if (interactive && !this.reducedMotion) {
        interactive.style.setProperty('--mouse-x', `${e.offsetX}px`);
        interactive.style.setProperty('--mouse-y', `${e.offsetY}px`);
      }
    });

    // Typing sound effect (subtle)
    const input = document.getElementById('user-input');
    if (input) {
      let lastKeyTime = 0;
      input.addEventListener('keydown', () => {
        const now = Date.now();
        if (now - lastKeyTime > 50) {
          this.playKeySound();
          lastKeyTime = now;
        }
      });
    }
  }

  createRipple(e, element) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  playKeySound() {
    if (this.reducedMotion || document.documentElement.classList.contains('spectrum-mode')) return;

    // Create a tiny click sound using Web Audio API
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.value = 800 + Math.random() * 200;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.05);
  }

  // === EASTER EGGS ===

  setupKonami() {
    document.addEventListener('keydown', (e) => {
      this.konamiCode.push(e.key);
      if (this.konamiCode.length > 10) this.konamiCode.shift();

      if (JSON.stringify(this.konamiCode) === JSON.stringify(this.konamiSequence)) {
        this.activateEasterEgg();
        this.konamiCode = [];
      }
    });
  }

  activateEasterEgg() {
    // Rainbow mode!
    document.body.classList.add('rainbow-mode');
    this.showToast('🌈 RAINBOW MODE ACTIVATED! You found the secret!');

    // Create confetti
    for (let i = 0; i < 100; i++) {
      this.createConfetti();
    }

    setTimeout(() => {
      document.body.classList.remove('rainbow-mode');
    }, 10000);
  }

  createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#c49cff', '#6366f1', '#10b981'][Math.floor(Math.random() * 6)];
    confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 4000);
  }

  // === WELCOME ANIMATION ===

  setupWelcomeAnimation() {
    // Check if first visit
    const hasVisited = localStorage.getItem('am_visited');

    if (!hasVisited) {
      setTimeout(() => {
        this.showWelcomeSequence();
        localStorage.setItem('am_visited', 'true');
      }, 1500);
    }
  }

  showWelcomeSequence() {
    const messages = [
      { text: 'Welcome to ActiveMirror', icon: '⟡' },
      { text: 'Your sovereign cognitive OS', icon: '🧠' },
      { text: 'Let\'s begin...', icon: '✨' }
    ];

    let i = 0;
    const showNext = () => {
      if (i >= messages.length) return;
      this.showToast(`${messages[i].icon} ${messages[i].text}`, 2000);
      i++;
      setTimeout(showNext, 2500);
    };

    showNext();
  }

  // === UTILITIES ===

  showToast(message, duration = 2000) {
    const existing = document.querySelector('.wow-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'wow-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // === STYLES ===

  injectStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      /* ========== LIGHT THEME ========== */
      [data-theme="light"] {
        --bg-primary: #f8fafc;
        --bg-secondary: #f1f5f9;
        --bg-tertiary: #e2e8f0;
        --bg-hover: #cbd5e1;
        --bg-active: #94a3b8;

        --glass-bg: rgba(0, 0, 0, 0.03);
        --glass-border: rgba(0, 0, 0, 0.1);
        --glass-hover: rgba(0, 0, 0, 0.06);

        --text-primary: #0f172a;
        --text-secondary: #475569;
        --text-muted: #64748b;
        --text-dim: #94a3b8;

        --primary: #4f46e5;
        --primary-soft: rgba(79, 70, 229, 0.15);
        --primary-glow: rgba(79, 70, 229, 0.2);

        --consciousness-gradient: linear-gradient(135deg, #059669 0%, #4f46e5 50%, #7c3aed 100%);
      }

      [data-theme="light"] .consent-gate::before,
      [data-theme="light"] .main-app::before {
        background:
          radial-gradient(ellipse at 20% 30%, rgba(16, 185, 129, 0.08) 0%, transparent 40%),
          radial-gradient(ellipse at 80% 70%, rgba(79, 70, 229, 0.06) 0%, transparent 40%),
          radial-gradient(ellipse at 50% 50%, rgba(124, 58, 237, 0.04) 0%, transparent 60%);
      }

      [data-theme="light"] .particle-canvas {
        opacity: 0.3;
      }

      /* ========== SPECTRUM FRIENDLY MODE ========== */
      .spectrum-mode {
        --bg-primary: #1a1a2e;
        --bg-secondary: #16213e;
        --bg-tertiary: #1f2b4d;

        --text-primary: #e8e8e8;
        --text-secondary: #b8b8c8;
        --text-muted: #888898;

        /* Softer, less saturated colors */
        --primary: #7c8bcc;
        --sovereign: #6eb89e;
        --warning: #c9a86c;
        --error: #c77777;

        /* Remove harsh gradients */
        --consciousness-gradient: linear-gradient(135deg, #6eb89e 0%, #7c8bcc 100%);
      }

      .spectrum-mode * {
        transition-duration: 0.4s !important;
        animation-duration: 0s !important;
      }

      .spectrum-mode .particle-canvas,
      .spectrum-mode .data-particles,
      .spectrum-mode .ripple-effect {
        display: none !important;
      }

      .spectrum-mode .agent-dock-item:hover {
        transform: none !important;
      }

      .spectrum-mode .insight-toast,
      .spectrum-mode .wow-toast {
        animation: none !important;
      }

      /* Larger click targets */
      .spectrum-mode button,
      .spectrum-mode .agent-dock-item {
        min-height: 48px;
        min-width: 48px;
      }

      /* ========== FOCUS MODE ========== */
      .focus-mode .agent-dock,
      .focus-mode .insight-toast,
      .focus-mode .context-toggle,
      .focus-mode #command-center-icon,
      .focus-mode .widget-panel,
      .focus-mode .tier-bar {
        opacity: 0.3;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .focus-mode .agent-dock:hover,
      .focus-mode .context-toggle:hover,
      .focus-mode #command-center-icon:hover {
        opacity: 1;
        pointer-events: auto;
      }

      .focus-mode #chat-container {
        max-width: 900px;
        margin: 0 auto;
      }

      /* ========== REDUCED MOTION ========== */
      .reduce-motion *,
      .reduce-motion *::before,
      .reduce-motion *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
      }

      /* ========== HIGH CONTRAST ========== */
      .high-contrast {
        --bg-primary: #000000;
        --bg-secondary: #0a0a0a;
        --text-primary: #ffffff;
        --text-secondary: #e0e0e0;
        --glass-border: rgba(255, 255, 255, 0.3);
        --primary: #6d9eff;
      }

      .high-contrast button,
      .high-contrast a {
        text-decoration: underline;
      }

      /* ========== THEME TOGGLE ========== */
      .theme-toggle {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 1000;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-tertiary);
        border: 1px solid var(--glass-border);
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .theme-toggle:hover {
        transform: scale(1.1) rotate(15deg);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      }

      .theme-toggle.theme-switching {
        animation: themeSpin 0.5s ease;
      }

      @keyframes themeSpin {
        0% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(0.8) rotate(180deg); }
        100% { transform: scale(1) rotate(360deg); }
      }

      /* ========== ACCESSIBILITY TOGGLE ========== */
      .accessibility-toggle {
        position: fixed;
        top: 16px;
        right: 70px;
        z-index: 1000;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-tertiary);
        border: 1px solid var(--glass-border);
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .accessibility-toggle:hover {
        transform: scale(1.1);
        border-color: var(--primary);
      }

      /* ========== ACCESSIBILITY MENU ========== */
      .accessibility-menu {
        position: fixed;
        top: 70px;
        right: 16px;
        z-index: 1001;
        width: 300px;
        background: var(--bg-secondary);
        border: 1px solid var(--glass-border);
        border-radius: 16px;
        padding: 0;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
      }

      .accessibility-menu.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .access-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid var(--glass-border);
        font-weight: 600;
        font-size: 15px;
      }

      .access-close {
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
      }

      .access-close:hover {
        color: var(--text-primary);
      }

      .access-section {
        padding: 16px 20px;
        border-bottom: 1px solid var(--glass-border);
      }

      .access-section:last-of-type {
        border-bottom: none;
      }

      .access-label {
        display: block;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--text-muted);
        margin-bottom: 10px;
      }

      .access-options {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .access-opt {
        padding: 8px 14px;
        background: var(--bg-tertiary);
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        color: var(--text-secondary);
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .access-opt:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
      }

      .access-opt.active {
        background: var(--primary);
        border-color: var(--primary);
        color: white;
      }

      .access-toggle-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
      }

      .access-switch {
        position: relative;
        width: 48px;
        height: 26px;
      }

      .access-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .access-slider {
        position: absolute;
        cursor: pointer;
        inset: 0;
        background: var(--bg-tertiary);
        border-radius: 26px;
        transition: 0.3s;
      }

      .access-slider::before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 3px;
        bottom: 3px;
        background: white;
        border-radius: 50%;
        transition: 0.3s;
      }

      .access-switch input:checked + .access-slider {
        background: var(--primary);
      }

      .access-switch input:checked + .access-slider::before {
        transform: translateX(22px);
      }

      .access-size-controls {
        display: flex;
        gap: 6px;
      }

      .access-size {
        width: 40px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-tertiary);
        border: 1px solid var(--glass-border);
        border-radius: 6px;
        color: var(--text-secondary);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .access-size:hover {
        background: var(--bg-hover);
      }

      .access-size.active {
        background: var(--primary);
        border-color: var(--primary);
        color: white;
      }

      .access-info {
        display: flex;
        gap: 10px;
        padding: 14px 20px;
        background: var(--bg-tertiary);
        font-size: 11px;
        color: var(--text-muted);
        line-height: 1.5;
        border-radius: 0 0 16px 16px;
      }

      .access-info-icon {
        font-size: 16px;
        flex-shrink: 0;
      }

      /* ========== PARTICLE CANVAS ========== */
      .particle-canvas {
        position: fixed;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        opacity: 0.6;
      }

      /* ========== RIPPLE EFFECT ========== */
      .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      }

      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }

      /* ========== CONFETTI ========== */
      .confetti {
        position: fixed;
        top: -10px;
        width: 10px;
        height: 10px;
        border-radius: 2px;
        z-index: 9999;
        animation: confettiFall 3s ease-out forwards;
        pointer-events: none;
      }

      @keyframes confettiFall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }

      /* ========== RAINBOW MODE (EASTER EGG) ========== */
      .rainbow-mode {
        animation: rainbowBg 2s linear infinite;
      }

      @keyframes rainbowBg {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }

      /* ========== WOW TOAST ========== */
      .wow-toast {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        padding: 12px 24px;
        background: var(--bg-secondary);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }

      .wow-toast.visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }

      /* ========== SKIP LINK FOR ACCESSIBILITY ========== */
      .skip-link {
        position: fixed;
        top: -100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: var(--primary);
        color: white;
        border-radius: 0 0 8px 8px;
        z-index: 10000;
        font-weight: 500;
        transition: top 0.3s ease;
      }

      .skip-link:focus {
        top: 0;
      }
    `;
    document.head.appendChild(styles);

    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-app';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
}

// === INITIALIZE ===
window.WowFeatures = WowFeatures;
window.wowFeatures = new WowFeatures();

console.log('✨ WOW Features ready — delight awaits');
