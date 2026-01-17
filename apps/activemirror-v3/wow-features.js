/**
 * WOW FEATURES — Make ActiveMirror absolutely sticky
 * Theme toggle, accessibility, particle effects, micro-interactions
 */

class WowFeatures {
  constructor() {
    this.theme = localStorage.getItem('am_theme') || 'dark';
    this.accessibilityMode = localStorage.getItem('am_accessibility') || 'standard';
    this.reducedMotion = localStorage.getItem('am_reduce_motion') === 'true' ||
                         window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.textSize = localStorage.getItem('am_text_size') || 'normal';
    this.particles = [];
    this.konamiCode = [];
    this.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    this.initialized = false;

    // Wait for DOM and consent gate
    this.waitForReady();
  }

  waitForReady() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    this.injectStyles();
    this.applyTheme(this.theme);
    this.applyAccessibility(this.accessibilityMode);
    this.setTextSize(this.textSize);

    if (this.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }

    // Create UI elements
    this.createThemeToggle();
    this.createAccessibilityMenu();

    // Setup features
    if (!this.reducedMotion) {
      this.setupParticles();
    }
    this.setupKonami();
    this.setupWelcomeAnimation();

    console.log('✨ WOW Features loaded');
  }

  // === THEME TOGGLE ===

  createThemeToggle() {
    // Remove existing if any
    document.getElementById('theme-toggle')?.remove();

    const toggle = document.createElement('button');
    toggle.id = 'theme-toggle';
    toggle.className = 'wow-theme-toggle';
    toggle.innerHTML = this.theme === 'dark' ? '☀️' : '🌙';
    toggle.title = 'Toggle light/dark theme (⌘⇧T)';
    toggle.setAttribute('aria-label', 'Toggle theme');
    toggle.type = 'button';

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleTheme();
    });

    // Append to toolbar if exists, otherwise body
    const toolbar = document.getElementById('top-right-toolbar');
    if (toolbar) {
      toolbar.appendChild(toggle);
    } else {
      document.body.appendChild(toggle);
    }

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'T' || e.key === 't')) {
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
      toggle.classList.add('spinning');
      setTimeout(() => toggle.classList.remove('spinning'), 500);
    }

    this.showToast(this.theme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode');
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    // Update meta theme-color
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
    // Remove existing
    document.getElementById('accessibility-toggle')?.remove();
    document.getElementById('accessibility-menu')?.remove();

    const btn = document.createElement('button');
    btn.id = 'accessibility-toggle';
    btn.className = 'wow-accessibility-toggle';
    btn.innerHTML = '⚙️';
    btn.title = 'Accessibility & Settings';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open settings');
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');

    const menu = document.createElement('div');
    menu.id = 'accessibility-menu';
    menu.className = 'wow-accessibility-menu';
    menu.setAttribute('role', 'menu');
    menu.innerHTML = `
      <div class="wow-menu-header">
        <span>Settings</span>
        <button class="wow-menu-close" type="button" aria-label="Close">×</button>
      </div>

      <div class="wow-menu-section">
        <label class="wow-menu-label">Display Mode</label>
        <div class="wow-menu-options">
          <button type="button" class="wow-menu-opt ${this.accessibilityMode === 'standard' ? 'active' : ''}" data-mode="standard">Standard</button>
          <button type="button" class="wow-menu-opt ${this.accessibilityMode === 'spectrum' ? 'active' : ''}" data-mode="spectrum">Spectrum</button>
          <button type="button" class="wow-menu-opt ${this.accessibilityMode === 'focus' ? 'active' : ''}" data-mode="focus">Focus</button>
        </div>
      </div>

      <div class="wow-menu-section">
        <label class="wow-menu-label">Motion</label>
        <div class="wow-menu-row">
          <span>Reduce animations</span>
          <label class="wow-switch">
            <input type="checkbox" id="wow-reduce-motion" ${this.reducedMotion ? 'checked' : ''}>
            <span class="wow-switch-slider"></span>
          </label>
        </div>
      </div>

      <div class="wow-menu-section">
        <label class="wow-menu-label">Text Size</label>
        <div class="wow-menu-sizes">
          <button type="button" class="wow-size-btn ${this.textSize === 'small' ? 'active' : ''}" data-size="small">A-</button>
          <button type="button" class="wow-size-btn ${this.textSize === 'normal' ? 'active' : ''}" data-size="normal">A</button>
          <button type="button" class="wow-size-btn ${this.textSize === 'large' ? 'active' : ''}" data-size="large">A+</button>
          <button type="button" class="wow-size-btn ${this.textSize === 'xlarge' ? 'active' : ''}" data-size="xlarge">A++</button>
        </div>
      </div>

      <div class="wow-menu-info">
        💡 Spectrum mode: Calmer colors & reduced visual noise for neurodivergent users.
      </div>
    `;

    // Toggle menu
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = menu.classList.toggle('visible');
      btn.setAttribute('aria-expanded', isOpen);
    });

    // Close button
    menu.querySelector('.wow-menu-close').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      menu.classList.remove('visible');
      btn.setAttribute('aria-expanded', 'false');
    });

    // Mode buttons
    menu.querySelectorAll('.wow-menu-opt[data-mode]').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        menu.querySelectorAll('.wow-menu-opt[data-mode]').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        this.applyAccessibility(opt.dataset.mode);
      });
    });

    // Reduce motion toggle
    menu.querySelector('#wow-reduce-motion').addEventListener('change', (e) => {
      this.reducedMotion = e.target.checked;
      document.documentElement.classList.toggle('reduce-motion', this.reducedMotion);
      localStorage.setItem('am_reduce_motion', this.reducedMotion);
    });

    // Text size buttons
    menu.querySelectorAll('.wow-size-btn').forEach(sizeBtn => {
      sizeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        menu.querySelectorAll('.wow-size-btn').forEach(b => b.classList.remove('active'));
        sizeBtn.classList.add('active');
        this.setTextSize(sizeBtn.dataset.size);
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('visible');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Prevent menu clicks from closing
    menu.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Append to toolbar if exists, otherwise body
    const toolbar = document.getElementById('top-right-toolbar');
    if (toolbar) {
      // Accessibility button goes first (left of theme)
      toolbar.insertBefore(btn, toolbar.firstChild);
      // Menu stays in body but is positioned absolutely
      document.body.appendChild(menu);
    } else {
      document.body.appendChild(btn);
      document.body.appendChild(menu);
    }
  }

  applyAccessibility(mode) {
    this.accessibilityMode = mode;
    localStorage.setItem('am_accessibility', mode);

    document.documentElement.classList.remove('spectrum-mode', 'focus-mode');
    document.body.classList.remove('spectrum-mode', 'focus-mode');

    if (mode === 'spectrum') {
      document.documentElement.classList.add('spectrum-mode');
      document.body.classList.add('spectrum-mode');
      this.showToast('🧠 Spectrum mode — calmer, clearer');
    } else if (mode === 'focus') {
      document.documentElement.classList.add('focus-mode');
      document.body.classList.add('focus-mode');
      this.showToast('🎯 Focus mode — distractions minimized');
    }
  }

  setTextSize(size) {
    this.textSize = size;
    const sizes = { small: '14px', normal: '16px', large: '18px', xlarge: '20px' };
    document.documentElement.style.setProperty('--base-font-size', sizes[size] || '16px');
    localStorage.setItem('am_text_size', size);
  }

  // === PARTICLES ===

  setupParticles() {
    if (this.reducedMotion) return;

    // Remove existing
    document.getElementById('wow-particle-canvas')?.remove();

    const canvas = document.createElement('canvas');
    canvas.id = 'wow-particle-canvas';
    canvas.className = 'wow-particle-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 25; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.2 + 0.05,
        color: ['#10b981', '#6366f1', '#8b5cf6'][Math.floor(Math.random() * 3)]
      });
    }

    const animate = () => {
      if (this.reducedMotion || document.documentElement.classList.contains('spectrum-mode')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        requestAnimationFrame(animate);
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
      requestAnimationFrame(animate);
    };

    animate();
  }

  // === EASTER EGG ===

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
    document.body.classList.add('rainbow-mode');
    this.showToast('🌈 RAINBOW MODE! You found the secret!');

    for (let i = 0; i < 50; i++) {
      setTimeout(() => this.createConfetti(), i * 30);
    }

    setTimeout(() => document.body.classList.remove('rainbow-mode'), 8000);
  }

  createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'wow-confetti';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#c49cff', '#6366f1'][Math.floor(Math.random() * 5)];
    confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }

  // === WELCOME ===

  setupWelcomeAnimation() {
    if (localStorage.getItem('am_visited')) return;

    setTimeout(() => {
      this.showToast('⟡ Welcome to ActiveMirror', 2500);
      localStorage.setItem('am_visited', 'true');
    }, 2000);
  }

  // === UTILITIES ===

  showToast(message, duration = 2000) {
    document.querySelector('.wow-toast')?.remove();

    const toast = document.createElement('div');
    toast.className = 'wow-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // === STYLES ===

  injectStyles() {
    // Remove existing
    document.getElementById('wow-features-styles')?.remove();

    const styles = document.createElement('style');
    styles.id = 'wow-features-styles';
    styles.textContent = `
      /* ===== LIGHT THEME ===== */
      [data-theme="light"],
      [data-theme="light"] body {
        --bg-primary: #f8fafc !important;
        --bg-secondary: #f1f5f9 !important;
        --bg-tertiary: #e2e8f0 !important;
        --bg-hover: #cbd5e1 !important;
        --bg-active: #94a3b8 !important;
        --glass-bg: rgba(0, 0, 0, 0.03) !important;
        --glass-border: rgba(0, 0, 0, 0.12) !important;
        --text-primary: #0f172a !important;
        --text-secondary: #475569 !important;
        --text-muted: #64748b !important;
        --primary: #4f46e5 !important;
        --primary-soft: rgba(79, 70, 229, 0.15) !important;
      }

      /* ===== SPECTRUM MODE ===== */
      .spectrum-mode {
        --bg-primary: #1a1a2e !important;
        --bg-secondary: #16213e !important;
        --bg-tertiary: #1f2b4d !important;
        --text-primary: #e8e8e8 !important;
        --text-secondary: #b8b8c8 !important;
        --primary: #7c8bcc !important;
      }

      .spectrum-mode * {
        transition-duration: 0.4s !important;
      }

      .spectrum-mode .wow-particle-canvas {
        display: none !important;
      }

      /* ===== FOCUS MODE ===== */
      .focus-mode .agent-dock,
      .focus-mode .context-toggle,
      .focus-mode #command-center-icon {
        opacity: 0.2;
        transition: opacity 0.3s ease;
      }

      .focus-mode .agent-dock:hover,
      .focus-mode .context-toggle:hover,
      .focus-mode #command-center-icon:hover {
        opacity: 1;
      }

      /* ===== REDUCE MOTION ===== */
      .reduce-motion *,
      .reduce-motion *::before,
      .reduce-motion *::after {
        animation-duration: 0.001ms !important;
        transition-duration: 0.001ms !important;
      }

      /* ===== THEME TOGGLE ===== */
      #theme-toggle,
      .wow-theme-toggle {
        position: fixed !important;
        top: 16px !important;
        right: 16px !important;
        z-index: 99999 !important;
        width: 44px !important;
        height: 44px !important;
        min-width: 44px !important;
        min-height: 44px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: var(--bg-tertiary, #1a1a24) !important;
        border: 1px solid var(--glass-border, rgba(255,255,255,0.1)) !important;
        border-radius: 50% !important;
        font-size: 20px !important;
        cursor: pointer !important;
        transition: transform 0.3s ease, box-shadow 0.3s ease !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        -webkit-appearance: none !important;
        appearance: none !important;
        pointer-events: auto !important;
        visibility: visible !important;
        opacity: 1 !important;
        overflow: visible !important;
        margin: 0 !important;
        padding: 0 !important;
        line-height: 1 !important;
      }

      #theme-toggle:hover,
      .wow-theme-toggle:hover {
        transform: scale(1.1) rotate(15deg) !important;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4) !important;
      }

      #theme-toggle:active,
      .wow-theme-toggle:active {
        transform: scale(0.95) !important;
      }

      #theme-toggle.spinning,
      .wow-theme-toggle.spinning {
        animation: wow-spin 0.5s ease !important;
      }

      @keyframes wow-spin {
        0% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(0.8) rotate(180deg); }
        100% { transform: scale(1) rotate(360deg); }
      }

      /* ===== ACCESSIBILITY TOGGLE ===== */
      #accessibility-toggle,
      .wow-accessibility-toggle {
        position: fixed !important;
        top: 16px !important;
        right: 70px !important;
        z-index: 99999 !important;
        width: 44px !important;
        height: 44px !important;
        min-width: 44px !important;
        min-height: 44px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: var(--bg-tertiary, #1a1a24) !important;
        border: 1px solid var(--glass-border, rgba(255,255,255,0.1)) !important;
        border-radius: 50% !important;
        font-size: 18px !important;
        cursor: pointer !important;
        transition: transform 0.2s ease, border-color 0.2s ease !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        -webkit-appearance: none !important;
        appearance: none !important;
        pointer-events: auto !important;
        visibility: visible !important;
        opacity: 1 !important;
        overflow: visible !important;
        margin: 0 !important;
        padding: 0 !important;
        line-height: 1 !important;
      }

      #accessibility-toggle:hover,
      .wow-accessibility-toggle:hover {
        transform: scale(1.1) !important;
        border-color: var(--primary, #6366f1) !important;
      }

      #accessibility-toggle:active,
      .wow-accessibility-toggle:active {
        transform: scale(0.95) !important;
      }

      /* ===== ACCESSIBILITY MENU ===== */
      #accessibility-menu,
      .wow-accessibility-menu {
        position: fixed !important;
        top: 70px !important;
        right: 16px !important;
        z-index: 100000 !important;
        width: 280px !important;
        background: var(--bg-secondary, #12121a) !important;
        border: 1px solid var(--glass-border, rgba(255,255,255,0.1)) !important;
        border-radius: 16px !important;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5) !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transform: translateY(-10px) !important;
        transition: all 0.3s ease !important;
        overflow: hidden !important;
      }

      .wow-accessibility-menu.visible {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateY(0) !important;
      }

      .wow-menu-header {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        padding: 14px 18px !important;
        border-bottom: 1px solid var(--glass-border) !important;
        font-weight: 600 !important;
        font-size: 14px !important;
        color: var(--text-primary) !important;
      }

      .wow-menu-close {
        background: none !important;
        border: none !important;
        color: var(--text-muted) !important;
        font-size: 22px !important;
        cursor: pointer !important;
        padding: 0 !important;
        line-height: 1 !important;
      }

      .wow-menu-close:hover {
        color: var(--text-primary) !important;
      }

      .wow-menu-section {
        padding: 14px 18px !important;
        border-bottom: 1px solid var(--glass-border) !important;
      }

      .wow-menu-label {
        display: block !important;
        font-size: 10px !important;
        font-weight: 600 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        color: var(--text-muted) !important;
        margin-bottom: 10px !important;
      }

      .wow-menu-options {
        display: flex !important;
        gap: 6px !important;
        flex-wrap: wrap !important;
      }

      .wow-menu-opt {
        padding: 8px 12px !important;
        background: var(--bg-tertiary) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: 8px !important;
        color: var(--text-secondary) !important;
        font-size: 12px !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
      }

      .wow-menu-opt:hover {
        background: var(--bg-hover) !important;
      }

      .wow-menu-opt.active {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: white !important;
      }

      .wow-menu-row {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        font-size: 13px !important;
        color: var(--text-secondary) !important;
      }

      .wow-switch {
        position: relative !important;
        width: 44px !important;
        height: 24px !important;
        display: inline-block !important;
      }

      .wow-switch input {
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
      }

      .wow-switch-slider {
        position: absolute !important;
        cursor: pointer !important;
        inset: 0 !important;
        background: var(--bg-tertiary) !important;
        border-radius: 24px !important;
        transition: 0.3s !important;
      }

      .wow-switch-slider::before {
        position: absolute !important;
        content: "" !important;
        height: 18px !important;
        width: 18px !important;
        left: 3px !important;
        bottom: 3px !important;
        background: white !important;
        border-radius: 50% !important;
        transition: 0.3s !important;
      }

      .wow-switch input:checked + .wow-switch-slider {
        background: var(--primary) !important;
      }

      .wow-switch input:checked + .wow-switch-slider::before {
        transform: translateX(20px) !important;
      }

      .wow-menu-sizes {
        display: flex !important;
        gap: 6px !important;
      }

      .wow-size-btn {
        width: 40px !important;
        height: 34px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: var(--bg-tertiary) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: 6px !important;
        color: var(--text-secondary) !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
      }

      .wow-size-btn:hover {
        background: var(--bg-hover) !important;
      }

      .wow-size-btn.active {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: white !important;
      }

      .wow-menu-info {
        padding: 12px 18px !important;
        background: var(--bg-tertiary) !important;
        font-size: 11px !important;
        color: var(--text-muted) !important;
        line-height: 1.5 !important;
      }

      /* ===== PARTICLE CANVAS ===== */
      .wow-particle-canvas {
        position: fixed !important;
        inset: 0 !important;
        z-index: -1 !important;
        pointer-events: none !important;
        opacity: 0.5 !important;
      }

      /* ===== TOAST ===== */
      .wow-toast {
        position: fixed !important;
        bottom: 30px !important;
        left: 50% !important;
        transform: translateX(-50%) translateY(20px) !important;
        padding: 12px 24px !important;
        background: var(--bg-secondary, #12121a) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: 12px !important;
        color: var(--text-primary) !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        z-index: 100001 !important;
        opacity: 0 !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
        pointer-events: none !important;
      }

      .wow-toast.visible {
        opacity: 1 !important;
        transform: translateX(-50%) translateY(0) !important;
      }

      /* ===== CONFETTI ===== */
      .wow-confetti {
        position: fixed !important;
        top: -10px !important;
        width: 10px !important;
        height: 10px !important;
        border-radius: 2px !important;
        z-index: 100002 !important;
        animation: wow-fall 3s ease-out forwards !important;
        pointer-events: none !important;
      }

      @keyframes wow-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }

      /* ===== RAINBOW MODE ===== */
      .rainbow-mode {
        animation: wow-rainbow 2s linear infinite !important;
      }

      @keyframes wow-rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(styles);
  }
}

// Initialize
window.WowFeatures = WowFeatures;
window.wowFeatures = new WowFeatures();
