/**
 * UNIFIED TOOLS DOCK
 * A single, polished vertical dock for all floating tools
 *
 * Order (top to bottom):
 * - Theme Toggle (☀/🌙)
 * - Accessibility (♿)
 * - Settings (⚙)
 * ─── divider ───
 * - Command Center (⟡) — primary
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

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.build());
    } else {
      this.build();
    }
  }

  build() {
    // Clean up any competing elements
    this.cleanup();

    // Remove existing dock if any
    document.querySelector('.tools-dock')?.remove();

    // Create dock container
    this.dock = document.createElement('div');
    this.dock.className = 'tools-dock';
    this.dock.id = 'tools-dock';

    // Build buttons fresh every time (no moving elements around)
    this.createThemeButton();
    this.createAccessibilityButton();
    this.createSettingsButton();

    // Divider
    const divider = document.createElement('div');
    divider.className = 'tools-dock-divider';
    this.dock.appendChild(divider);

    // AI Tools
    this.createCommandCenterButton();
    this.createRealityComposerButton();
    this.createFutureSelfButton();

    // Add to document
    document.body.appendChild(this.dock);

    this.initialized = true;
    console.log('⟡ Tools Dock built — 6 buttons unified');
  }

  cleanup() {
    // Hide all old floating containers
    const oldContainers = [
      '.top-right-toolbar',
      '.bottom-left-dock',
      '.bottom-right-dock',
      '.command-icon:not(.tools-dock .command-icon)',
      '.rc-toggle:not(.tools-dock .rc-toggle)',
      '.future-self-toggle:not(.tools-dock .future-self-toggle)',
      '.wow-theme-toggle:not(.tools-dock .wow-theme-toggle)',
      '.wow-accessibility-toggle:not(.tools-dock .wow-accessibility-toggle)'
    ];

    oldContainers.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.style.pointerEvents = 'none';
      });
    });
  }

  createButton(icon, tooltip, id, onClick, primary = false) {
    const btn = document.createElement('button');
    btn.className = 'tools-dock-btn' + (primary ? ' primary' : '');
    btn.id = id;
    btn.innerHTML = icon;
    btn.setAttribute('data-tooltip', tooltip);
    btn.setAttribute('aria-label', tooltip);
    btn.addEventListener('click', onClick);
    this.dock.appendChild(btn);
    return btn;
  }

  createThemeButton() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const btn = this.createButton(
      isDark ? '☀️' : '🌙',
      'Theme',
      'dock-theme-btn',
      () => this.toggleTheme(btn)
    );
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

    // Sync with WOW features if available
    if (window.wowFeatures) {
      window.wowFeatures.theme = isLight ? 'dark' : 'light';
    }
  }

  createAccessibilityButton() {
    this.createButton(
      '♿',
      'Accessibility',
      'dock-accessibility-btn',
      () => this.toggleAccessibility()
    );
  }

  toggleAccessibility() {
    // Try WOW features accessibility
    if (window.wowFeatures?.toggleAccessibilityMenu) {
      window.wowFeatures.toggleAccessibilityMenu();
    } else {
      const menu = document.getElementById('accessibility-menu');
      if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
      } else {
        this.showToast('♿', 'Accessibility options in Settings');
      }
    }
  }

  createSettingsButton() {
    this.createButton(
      '⚙️',
      'Settings',
      'dock-settings-btn',
      () => this.openSettings()
    );
  }

  openSettings() {
    // Try settings panel
    const panel = document.getElementById('settings-panel');
    if (panel) {
      const isOpen = panel.classList.contains('open');
      if (isOpen) {
        panel.classList.remove('open');
      } else {
        panel.classList.add('open');
      }
      return;
    }

    // Try ActiveMirror settings
    if (window.activeMirror?.openSettings) {
      window.activeMirror.openSettings();
      return;
    }

    // Fallback
    this.showToast('⚙️', 'Settings panel opening...');
    document.getElementById('settings-btn')?.click();
  }

  createCommandCenterButton() {
    this.createButton(
      '⟡',
      'Command Center',
      'dock-command-btn',
      () => this.openCommandCenter(),
      true // primary
    );
  }

  openCommandCenter() {
    if (window.commandCenter?.togglePanel) {
      window.commandCenter.togglePanel();
    } else {
      // Click existing command icon if present
      const icon = document.querySelector('.command-icon-inner');
      if (icon) {
        icon.click();
      } else {
        this.showToast('⟡', 'Command Center initializing...');
      }
    }
  }

  createRealityComposerButton() {
    this.createButton(
      '🎭',
      'Reality Composer',
      'dock-reality-btn',
      () => this.openRealityComposer()
    );
  }

  openRealityComposer() {
    if (window.realityComposer?.togglePanel) {
      window.realityComposer.togglePanel();
    } else if (window.commandCenter?.openRealityComposer) {
      window.commandCenter.openRealityComposer();
    } else {
      // Check for menu
      const menu = document.querySelector('.rc-menu');
      if (menu) {
        menu.classList.toggle('visible');
      } else {
        this.showToast('🎭', 'Reality Composer loading...');
      }
    }
  }

  createFutureSelfButton() {
    this.createButton(
      '🔮',
      'Future Self',
      'dock-future-btn',
      () => this.openFutureSelf()
    );
  }

  openFutureSelf() {
    if (window.futureSelf?.showInlineDialogue) {
      window.futureSelf.showInlineDialogue();
    } else if (window.commandCenter?.openFutureSelf) {
      window.commandCenter.openFutureSelf();
    } else {
      // Check for inline panel
      const panel = document.querySelector('.future-self-inline');
      if (panel) {
        panel.classList.toggle('visible');
      } else {
        this.showToast('🔮', 'Future Self loading...');
      }
    }
  }

  showToast(icon, message) {
    // Remove existing toast
    document.querySelector('.tools-dock-toast')?.remove();

    const toast = document.createElement('div');
    toast.className = 'tools-dock-toast';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    // Remove after delay
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  refresh() {
    this.initialized = false;
    this.build();
  }
}

// Global instance
window.toolsDock = new ToolsDock();

// Initialize after other scripts have had time to load
const initDock = () => {
  if (!window.toolsDock.initialized) {
    window.toolsDock.init();
  }
};

// Multiple init points for reliability
if (document.readyState === 'complete') {
  setTimeout(initDock, 100);
} else {
  window.addEventListener('load', () => setTimeout(initDock, 200));
}

// Refresh when app enters (after consent)
window.addEventListener('app-entered', () => {
  setTimeout(() => window.toolsDock.refresh(), 500);
});

console.log('⟡ Tools Dock module loaded');
