/**
 * UNIFIED TOOLS DOCK
 * Consolidates all floating buttons into one clean vertical dock
 *
 * Order (top to bottom):
 * - Theme Toggle (☼)
 * - Accessibility (♿)
 * - Settings (⚙)
 * --- divider ---
 * - Command Center (⟡) - Primary
 * - Reality Composer (🎭)
 * - Future Self (🔮)
 */

class ToolsDock {
  constructor() {
    this.dock = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.build());
    } else {
      // Small delay to ensure other components have initialized
      setTimeout(() => this.build(), 100);
    }
  }

  build() {
    // Remove any existing dock
    const existingDock = document.querySelector('.tools-dock');
    if (existingDock) existingDock.remove();

    // Create the dock container
    this.dock = document.createElement('div');
    this.dock.className = 'tools-dock';
    this.dock.id = 'tools-dock';

    // Section 1: Display & Access Controls
    this.addThemeToggle();
    this.addAccessibilityToggle();
    this.addSettingsButton();

    // Divider
    const divider = document.createElement('div');
    divider.className = 'tools-dock-divider';
    this.dock.appendChild(divider);

    // Section 2: AI Tools
    this.addCommandCenter();
    this.addRealityComposer();
    this.addFutureSelf();

    // Add to document
    document.body.appendChild(this.dock);

    this.initialized = true;
    console.log('⟡ Tools Dock initialized — all buttons unified');
  }

  createButton(icon, tooltip, onClick, className = '') {
    const btn = document.createElement('button');
    btn.className = `tools-dock-btn ${className}`.trim();
    btn.innerHTML = icon;
    btn.setAttribute('data-tooltip', tooltip);
    btn.addEventListener('click', onClick);
    return btn;
  }

  addThemeToggle() {
    // Check if WOW features created a theme toggle
    const existingToggle = document.getElementById('theme-toggle') ||
                           document.querySelector('.wow-theme-toggle');

    if (existingToggle) {
      // Move existing toggle into dock
      existingToggle.setAttribute('data-tooltip', 'Theme');
      existingToggle.classList.add('tools-dock-btn');
      this.dock.appendChild(existingToggle);
    } else {
      // Create new theme toggle
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const btn = this.createButton(
        isDark ? '☀️' : '🌙',
        'Theme',
        () => this.toggleTheme(btn)
      );
      btn.id = 'theme-toggle';
      this.dock.appendChild(btn);
    }
  }

  toggleTheme(btn) {
    const html = document.documentElement;
    const isLight = html.getAttribute('data-theme') === 'light';

    if (isLight) {
      html.removeAttribute('data-theme');
      btn.innerHTML = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
      btn.innerHTML = '🌙';
      localStorage.setItem('theme', 'light');
    }
  }

  addAccessibilityToggle() {
    // Check if WOW features created an accessibility toggle
    const existingToggle = document.getElementById('accessibility-toggle') ||
                           document.querySelector('.wow-accessibility-toggle');

    if (existingToggle) {
      existingToggle.setAttribute('data-tooltip', 'Accessibility');
      existingToggle.classList.add('tools-dock-btn');
      this.dock.appendChild(existingToggle);
    } else {
      // Create new accessibility toggle
      const btn = this.createButton(
        '♿',
        'Accessibility',
        () => this.toggleAccessibilityMenu()
      );
      btn.id = 'accessibility-toggle';
      this.dock.appendChild(btn);
    }
  }

  toggleAccessibilityMenu() {
    // Try to use WOW features accessibility menu
    if (window.wowFeatures?.toggleAccessibilityMenu) {
      window.wowFeatures.toggleAccessibilityMenu();
    } else {
      // Show toast that accessibility features can be configured
      this.showToast('♿', 'Accessibility settings coming soon');
    }
  }

  addSettingsButton() {
    // Check if settings button already exists
    const existingBtn = document.getElementById('toolbar-settings-btn') ||
                        document.querySelector('.toolbar-settings-btn');

    if (existingBtn) {
      existingBtn.setAttribute('data-tooltip', 'Settings');
      existingBtn.classList.add('tools-dock-btn');
      this.dock.appendChild(existingBtn);
    } else {
      const btn = this.createButton(
        '⚙️',
        'Settings',
        () => this.openSettings()
      );
      btn.id = 'toolbar-settings-btn';
      this.dock.appendChild(btn);
    }
  }

  openSettings() {
    // Try to use existing settings functionality
    if (window.activeMirror?.openSettings) {
      window.activeMirror.openSettings();
    } else {
      // Look for settings modal
      const settingsModal = document.getElementById('settings-modal');
      if (settingsModal) {
        settingsModal.style.display = 'flex';
        setTimeout(() => settingsModal.classList.add('visible'), 10);
      } else {
        this.showToast('⚙️', 'Opening settings...');
        // Trigger any settings button click handler
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) settingsBtn.click();
      }
    }
  }

  addCommandCenter() {
    // Check if Command Center created its icon
    const existingIcon = document.querySelector('.command-icon');

    if (existingIcon) {
      // Move the entire command icon into dock
      this.dock.appendChild(existingIcon);
    } else {
      // Create a button that opens command center
      const btn = this.createButton(
        '⟡',
        'Command Center',
        () => this.openCommandCenter(),
        'primary'
      );
      btn.id = 'command-center-btn';
      this.dock.appendChild(btn);
    }
  }

  openCommandCenter() {
    if (window.commandCenter?.togglePanel) {
      window.commandCenter.togglePanel();
    } else {
      // Try to find and click command icon
      const icon = document.querySelector('.command-icon-inner');
      if (icon) icon.click();
    }
  }

  addRealityComposer() {
    // Check if Reality Composer created its toggle
    const existingToggle = document.querySelector('.rc-toggle');

    if (existingToggle) {
      existingToggle.setAttribute('data-tooltip', 'Reality Composer');
      this.dock.appendChild(existingToggle);
    } else {
      // Check for reality composer panel
      const panel = document.querySelector('.reality-composer-panel');
      if (panel) {
        this.dock.appendChild(panel);
      } else {
        // Create a button for Reality Composer
        const btn = this.createButton(
          '🎭',
          'Reality Composer',
          () => this.openRealityComposer()
        );
        btn.id = 'reality-composer-btn';
        this.dock.appendChild(btn);
      }
    }
  }

  openRealityComposer() {
    if (window.realityComposer?.togglePanel) {
      window.realityComposer.togglePanel();
    } else if (window.commandCenter?.openRealityComposer) {
      window.commandCenter.openRealityComposer();
    } else {
      this.showToast('🎭', 'Reality Composer loading...');
    }
  }

  addFutureSelf() {
    // Check if Future Self created its button
    const existingToggle = document.querySelector('.future-self-toggle') ||
                           document.getElementById('future-self-toggle');

    if (existingToggle) {
      existingToggle.setAttribute('data-tooltip', 'Future Self');
      existingToggle.classList.add('tools-dock-btn');
      this.dock.appendChild(existingToggle);
    } else {
      // Create a button for Future Self
      const btn = this.createButton(
        '🔮',
        'Future Self',
        () => this.openFutureSelf()
      );
      btn.id = 'future-self-btn';
      this.dock.appendChild(btn);
    }
  }

  openFutureSelf() {
    if (window.futureSelf?.showInlineDialogue) {
      window.futureSelf.showInlineDialogue();
    } else if (window.commandCenter?.openFutureSelf) {
      window.commandCenter.openFutureSelf();
    } else {
      this.showToast('🔮', 'Future Self loading...');
    }
  }

  showToast(icon, message) {
    const toast = document.createElement('div');
    toast.className = 'tools-dock-toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 80px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: var(--bg-secondary, #12121a);
      border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
      border-radius: 8px;
      opacity: 0;
      transform: translateX(20px);
      transition: all 0.3s ease;
      z-index: 100001;
      backdrop-filter: blur(20px);
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }, 10);

    // Animate out and remove
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Refresh dock (call after components initialize)
  refresh() {
    this.initialized = false;
    this.build();
  }
}

// Create global instance
window.toolsDock = new ToolsDock();

// Initialize after a delay to ensure other components are ready
setTimeout(() => {
  window.toolsDock.init();
}, 500);

// Also initialize on DOMContentLoaded if not already done
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (!window.toolsDock.initialized) {
      window.toolsDock.init();
    }
  }, 800);
});

// Listen for when app enters
window.addEventListener('app-entered', () => {
  setTimeout(() => {
    window.toolsDock.refresh();
  }, 1000);
});

console.log('⟡ Tools Dock module loaded');
