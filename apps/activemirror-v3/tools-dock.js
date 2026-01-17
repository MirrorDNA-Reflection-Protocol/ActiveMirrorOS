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

    // Add drag handle
    const dragHandle = document.createElement('div');
    dragHandle.className = 'tools-dock-drag-handle';
    dragHandle.innerHTML = '⋮⋮';
    dragHandle.title = 'Drag to reposition';
    this.dock.appendChild(dragHandle);

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

    // Setup dragging
    this.setupDragging(dragHandle);

    // Restore saved position
    this.restorePosition();

    this.initialized = true;
    console.log('⟡ Tools Dock built — 6 buttons unified');
  }

  setupDragging(handle) {
    let isDragging = false;
    let startX, startY, startRight, startTop;

    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = this.dock.getBoundingClientRect();
      startRight = window.innerWidth - rect.right;
      startTop = rect.top;

      this.dock.style.transition = 'none';
      this.dock.classList.add('dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const newRight = Math.max(8, Math.min(window.innerWidth - 80, startRight - deltaX));
      const newTop = Math.max(60, Math.min(window.innerHeight - 100, startTop + deltaY));

      this.dock.style.right = `${newRight}px`;
      this.dock.style.top = `${newTop}px`;
      this.dock.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        this.dock.style.transition = '';
        this.dock.classList.remove('dragging');
        this.savePosition();
      }
    });

    // Touch support
    handle.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      isDragging = true;
      startX = touch.clientX;
      startY = touch.clientY;

      const rect = this.dock.getBoundingClientRect();
      startRight = window.innerWidth - rect.right;
      startTop = rect.top;

      this.dock.style.transition = 'none';
      this.dock.classList.add('dragging');
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      const newRight = Math.max(8, Math.min(window.innerWidth - 80, startRight - deltaX));
      const newTop = Math.max(60, Math.min(window.innerHeight - 100, startTop + deltaY));

      this.dock.style.right = `${newRight}px`;
      this.dock.style.top = `${newTop}px`;
      this.dock.style.transform = 'none';
    });

    document.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        this.dock.style.transition = '';
        this.dock.classList.remove('dragging');
        this.savePosition();
      }
    });
  }

  savePosition() {
    const rect = this.dock.getBoundingClientRect();
    const pos = {
      right: window.innerWidth - rect.right,
      top: rect.top
    };
    localStorage.setItem('tools_dock_position', JSON.stringify(pos));
  }

  restorePosition() {
    const saved = localStorage.getItem('tools_dock_position');
    if (saved) {
      try {
        const pos = JSON.parse(saved);
        this.dock.style.right = `${pos.right}px`;
        this.dock.style.top = `${pos.top}px`;
        this.dock.style.transform = 'none';
      } catch (e) {
        // Use default position
      }
    }
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
    console.log('♿ Toggling accessibility...');

    // Try WOW features accessibility menu
    const menu = document.getElementById('accessibility-menu');
    if (menu) {
      menu.classList.toggle('visible');
      console.log('♿ Toggled accessibility menu');
      return;
    }

    // Try WOW features function
    if (window.wowFeatures?.toggleAccessibilityMenu) {
      window.wowFeatures.toggleAccessibilityMenu();
      console.log('♿ Called wowFeatures.toggleAccessibilityMenu');
      return;
    }

    // Fallback - show a toast and open settings
    this.showToast('♿', 'Accessibility settings are in Settings panel');
    setTimeout(() => this.openSettings(), 500);
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
    // Try settings panel (uses 'visible' class)
    const panel = document.getElementById('settings-panel');
    if (panel) {
      panel.classList.toggle('visible');
      return;
    }

    // Try ActiveMirror settings
    if (window.activeMirror?.openSettings) {
      window.activeMirror.openSettings();
      return;
    }

    // Fallback - click the settings button
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
    console.log('⟡ Opening Command Center...', window.commandCenter);

    if (window.commandCenter?.toggle) {
      window.commandCenter.toggle();
      return;
    }

    if (window.commandCenter?.togglePanel) {
      window.commandCenter.togglePanel();
      return;
    }

    // Direct panel toggle as fallback
    const panel = document.getElementById('command-center-panel');
    if (panel) {
      panel.classList.toggle('hidden');
      console.log('⟡ Toggled panel directly');
      return;
    }

    // Click existing command icon if present
    const icon = document.querySelector('.command-icon-inner');
    if (icon) {
      icon.click();
      return;
    }

    this.showToast('⟡', 'Command Center initializing...');
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
    if (window.realityComposerUI?.togglePanel) {
      window.realityComposerUI.togglePanel();
    } else if (window.realityComposer?.togglePanel) {
      window.realityComposer.togglePanel();
    } else if (window.commandCenter?.openRealityComposer) {
      window.commandCenter.openRealityComposer();
    } else {
      // Check for menu
      const menu = document.querySelector('.rc-menu');
      if (menu) {
        menu.classList.toggle('hidden');
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
    if (window.futureSelfUI?.showDialogue) {
      window.futureSelfUI.showDialogue();
    } else if (window.futureSelf?.showInlineDialogue) {
      window.futureSelf.showInlineDialogue();
    } else if (window.commandCenter?.openFutureSelf) {
      window.commandCenter.openFutureSelf();
    } else {
      // Check for future self button
      const btn = document.querySelector('.future-self-btn');
      if (btn) {
        btn.click();
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
