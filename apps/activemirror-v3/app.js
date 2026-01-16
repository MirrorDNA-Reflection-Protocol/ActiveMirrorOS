/**
 * ActiveMirror v3.0 — Sovereign Intelligence App
 * 
 * Features:
 * - Multi-tier inference routing
 * - Customizable widgets
 * - Mini browser panel
 * - Real-time transparency
 * - Keyboard shortcuts
 * - Polished UX
 */

class ActiveMirrorApp {
  constructor() {
    this.apiEndpoint = 'http://localhost:8086';
    this.messages = [];
    this.sessionId = this.generateSessionId();
    this.consentGranted = false;

    // Current tier
    this.currentTier = 'sovereign';
    this.tierConfig = {
      sovereign: { name: 'Local', icon: '◈', class: 'sovereign', data: 'Local only' },
      fast_free: { name: 'Fast', icon: '⚡', class: '', data: 'Groq Cloud' },
      budget: { name: 'Cloud', icon: '☁', class: 'cloud', data: 'DeepSeek' },
      frontier: { name: 'Frontier', icon: '✦', class: 'frontier', data: 'OpenAI' },
      webllm: { name: 'Browser', icon: '🌐', class: 'sovereign', data: 'WebGPU (in-browser)' }
    };

    // Session stats
    this.stats = {
      messages: 0,
      tokens: 0,
      cacheHits: 0,
      cost: 0
    };

    // WebLLM engine
    this.webllm = null;
    this.webllmReady = false;
    this.webllmLoading = false;

    // Nudge engine
    this.nudges = null;

    // Customizable widgets
    this.widgets = this.loadWidgets();

    this.init();
  }
  
  init() {
    this.setupConsentFlow();
    this.setupWidgetToggles();
    this.setupChat();
    this.setupTierSelector();
    this.setupMiniBrowser();
    this.setupKeyboardShortcuts();
    this.renderWidgets();
    this.checkStatus();
    this.setupNudges();
    this.checkWebGPUSupport();
  }
  
  generateSessionId() {
    return 'AM-' + Date.now().toString(36).toUpperCase();
  }
  
  // ============================================
  // Widget System
  // ============================================
  
  loadWidgets() {
    const saved = localStorage.getItem('activemirror_widgets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    
    // Default widgets
    return [
      {
        id: 'tasks',
        type: 'tasks',
        title: 'Tasks',
        collapsed: false,
        data: {
          items: [
            { text: 'Try different inference tiers', done: false },
            { text: 'Explore the transparency panel', done: false },
            { text: 'Add your own widgets', done: false }
          ]
        }
      },
      {
        id: 'links',
        type: 'links',
        title: 'Quick Links',
        collapsed: false,
        data: {
          items: [
            { title: 'MirrorDNA Docs', url: 'https://mirrordna.dev', icon: '📚' },
            { title: 'GitHub', url: 'https://github.com/n1intelligence', icon: '💻' },
            { title: 'N1 Intelligence', url: 'https://n1intelligence.com', icon: '◈' }
          ]
        }
      }
    ];
  }
  
  saveWidgets() {
    localStorage.setItem('activemirror_widgets', JSON.stringify(this.widgets));
  }
  
  renderWidgets() {
    const container = document.getElementById('widgets-container');
    const preview = document.getElementById('widget-preview');
    if (!container) return;
    
    // Update collapsed preview
    if (preview) {
      const previewItems = this.widgets.slice(0, 4).map(w => {
        const icons = { tasks: '✓', notes: '📝', scratchpad: '⌨', links: '🔗', calendar: '📅' };
        return `<div class="preview-item">${icons[w.type] || '•'}</div>`;
      }).join('');
      preview.innerHTML = previewItems || '<div class="preview-item">+</div>';
    }
    
    // Show empty state if no widgets
    if (this.widgets.length === 0) {
      container.innerHTML = `
        <div class="empty-widgets">
          <div class="empty-icon">📋</div>
          <p>No widgets yet</p>
          <p class="empty-hint">Click + to add tasks, notes, or links</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = this.widgets.map((widget, index) => {
      let content = '';
      
      switch (widget.type) {
        case 'tasks':
          content = this.renderTasksWidget(widget);
          break;
        case 'notes':
          content = this.renderNotesWidget(widget);
          break;
        case 'links':
          content = this.renderLinksWidget(widget);
          break;
        case 'calendar':
          content = this.renderCalendarWidget(widget);
          break;
        case 'scratchpad':
          content = this.renderScratchpadWidget(widget);
          break;
        default:
          content = '<div style="padding: 16px; color: var(--text-muted);">Unknown widget type</div>';
      }
      
      return `
        <div class="sidebar-widget" data-widget-id="${widget.id}">
          <button class="widget-toggle ${widget.collapsed ? '' : 'active'}" data-target="widget-${widget.id}">
            <span class="toggle-icon">▸</span>
            <span class="toggle-title">${widget.title}</span>
            <span class="widget-actions" onclick="event.stopPropagation()">
              <span class="widget-action" onclick="activeMirror.removeWidget('${widget.id}')" title="Remove">×</span>
            </span>
          </button>
          <div id="widget-${widget.id}" class="widget-content ${widget.collapsed ? 'collapsed' : ''}">
            ${content}
          </div>
        </div>
      `;
    }).join('');
    
    // Re-setup toggles
    this.setupWidgetToggles();
    this.setupTaskListeners();
    this.setupNotesListeners();
  }
  
  renderScratchpadWidget(widget) {
    return `
      <textarea class="notes-textarea scratchpad" 
                data-widget-id="${widget.id}"
                placeholder="Quick thoughts, code snippets, anything..."
                style="min-height: 150px; font-family: var(--font-mono); font-size: 12px;">${widget.data.content || ''}</textarea>
    `;
  }
  
  renderTasksWidget(widget) {
    const items = widget.data.items || [];
    return `
      <div class="tasks-list">
        ${items.map((item, i) => `
          <div class="task-item">
            <div class="task-checkbox ${item.done ? 'completed' : ''}" 
                 data-widget-id="${widget.id}" 
                 data-task-index="${i}"></div>
            <span class="task-text" style="${item.done ? 'text-decoration: line-through; opacity: 0.5;' : ''}">${item.text}</span>
            <span class="task-delete" onclick="activeMirror.removeTask('${widget.id}', ${i})" title="Delete">×</span>
          </div>
        `).join('')}
        <input type="text" class="task-input" placeholder="Add a task..." 
               data-widget-id="${widget.id}" 
               onkeydown="activeMirror.handleTaskInput(event, '${widget.id}')">
      </div>
    `;
  }
  
  renderNotesWidget(widget) {
    return `
      <textarea class="notes-textarea" 
                data-widget-id="${widget.id}"
                placeholder="Write your notes here...">${widget.data.content || ''}</textarea>
    `;
  }
  
  renderLinksWidget(widget) {
    const items = widget.data.items || [];
    return `
      <div class="links-list">
        ${items.map((item, i) => `
          <div class="link-row">
            <a href="${item.url}" target="_blank" rel="noopener" class="link-item">
              <span class="link-icon">${item.icon || '🔗'}</span>
              <span class="link-title">${item.title}</span>
            </a>
            <span class="link-delete" onclick="activeMirror.removeLink('${widget.id}', ${i})" title="Delete">×</span>
          </div>
        `).join('')}
        <button class="add-link-btn" onclick="activeMirror.addLink('${widget.id}')">+ Add link</button>
      </div>
    `;
  }
  
  renderCalendarWidget(widget) {
    const today = new Date();
    return `
      <div class="calendar-mini">
        <div style="font-weight: 500; margin-bottom: 8px;">
          ${today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
        <div class="event-item">
          <span class="event-time">Now</span>
          <span class="event-title">Using ActiveMirror</span>
        </div>
      </div>
    `;
  }
  
  setupTaskListeners() {
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
      checkbox.addEventListener('click', () => {
        const widgetId = checkbox.dataset.widgetId;
        const taskIndex = parseInt(checkbox.dataset.taskIndex);
        this.toggleTask(widgetId, taskIndex);
      });
    });
  }
  
  setupNotesListeners() {
    document.querySelectorAll('.notes-textarea').forEach(textarea => {
      textarea.addEventListener('input', (e) => {
        const widgetId = e.target.dataset.widgetId;
        const widget = this.widgets.find(w => w.id === widgetId);
        if (widget) {
          widget.data.content = e.target.value;
          this.saveWidgets();
        }
      });
    });
  }
  
  handleTaskInput(event, widgetId) {
    if (event.key === 'Enter' && event.target.value.trim()) {
      const widget = this.widgets.find(w => w.id === widgetId);
      if (widget) {
        widget.data.items.push({ text: event.target.value.trim(), done: false });
        event.target.value = '';
        this.saveWidgets();
        this.renderWidgets();
      }
    }
  }
  
  toggleTask(widgetId, taskIndex) {
    const widget = this.widgets.find(w => w.id === widgetId);
    if (widget && widget.data.items[taskIndex]) {
      widget.data.items[taskIndex].done = !widget.data.items[taskIndex].done;
      this.saveWidgets();
      this.renderWidgets();
    }
  }
  
  removeWidget(widgetId) {
    // No confirmation — just remove (user can add back easily)
    this.widgets = this.widgets.filter(w => w.id !== widgetId);
    this.saveWidgets();
    this.renderWidgets();
  }
  
  removeTask(widgetId, taskIndex) {
    const widget = this.widgets.find(w => w.id === widgetId);
    if (widget && widget.data.items) {
      widget.data.items.splice(taskIndex, 1);
      this.saveWidgets();
      this.renderWidgets();
    }
  }
  
  removeLink(widgetId, linkIndex) {
    const widget = this.widgets.find(w => w.id === widgetId);
    if (widget && widget.data.items) {
      widget.data.items.splice(linkIndex, 1);
      this.saveWidgets();
      this.renderWidgets();
    }
  }
  
  addLink(widgetId) {
    const widget = this.widgets.find(w => w.id === widgetId);
    if (!widget) return;
    
    const url = prompt('Enter URL:');
    if (!url) return;
    
    const title = prompt('Enter title (or leave blank):') || new URL(url.startsWith('http') ? url : 'https://' + url).hostname;
    
    widget.data.items = widget.data.items || [];
    widget.data.items.push({ title, url: url.startsWith('http') ? url : 'https://' + url, icon: '🔗' });
    this.saveWidgets();
    this.renderWidgets();
  }
  
  addWidget(type) {
    const id = type + '-' + Date.now();
    const defaults = {
      tasks: { title: 'Tasks', data: { items: [] } },
      notes: { title: 'Notes', data: { content: '' } },
      scratchpad: { title: 'Scratchpad', data: { content: '' } },
      links: { title: 'Links', data: { items: [] } },
      calendar: { title: 'Calendar', data: {} }
    };
    
    if (defaults[type]) {
      this.widgets.push({
        id,
        type,
        ...defaults[type],
        collapsed: false
      });
      this.saveWidgets();
      this.renderWidgets();
    }
  }
  
  // ============================================
  // Consent Flow
  // ============================================
  
  setupConsentFlow() {
    const checkbox = document.getElementById('consent-checkbox');
    const enterBtn = document.getElementById('enter-btn');
    
    if (!checkbox || !enterBtn) return;
    
    checkbox.addEventListener('change', () => {
      enterBtn.disabled = !checkbox.checked;
    });
    
    enterBtn.addEventListener('click', () => {
      if (checkbox.checked) this.enterApp();
    });
  }
  
  enterApp() {
    const consentGate = document.getElementById('consent-gate');
    const mainApp = document.getElementById('main-app');

    consentGate.style.opacity = '0';
    consentGate.style.transform = 'scale(0.98)';
    consentGate.style.transition = 'all 0.4s ease';

    setTimeout(() => {
      consentGate.style.display = 'none';
      mainApp.classList.remove('hidden');
      mainApp.style.opacity = '0';

      requestAnimationFrame(() => {
        mainApp.style.transition = 'opacity 0.4s ease';
        mainApp.style.opacity = '1';
      });

      this.consentGranted = true;
      document.getElementById('user-input')?.focus();

      // Start nudge system
      this.startNudges();
    }, 400);
  }
  
  // ============================================
  // Widget Toggles
  // ============================================
  
  setupWidgetToggles() {
    document.querySelectorAll('.widget-toggle').forEach(toggle => {
      // Remove old listeners by cloning
      const newToggle = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(newToggle, toggle);
      
      newToggle.addEventListener('click', (e) => {
        if (e.target.closest('.widget-actions')) return;
        
        const targetId = newToggle.dataset.target;
        const content = document.getElementById(targetId);
        
        if (content) {
          const isCollapsed = content.classList.contains('collapsed');
          
          content.classList.toggle('collapsed');
          newToggle.classList.toggle('active');
          
          // Save widget state
          const widgetId = targetId.replace('widget-', '');
          const widget = this.widgets.find(w => w.id === widgetId);
          if (widget) {
            widget.collapsed = !isCollapsed;
            this.saveWidgets();
          }
        }
      });
    });
    
    // Add widget button
    const addBtn = document.getElementById('add-widget-btn');
    if (addBtn) {
      addBtn.onclick = () => this.showAddWidgetMenu();
    }
  }
  
  showAddWidgetMenu() {
    // Remove any existing menu
    document.querySelector('.add-widget-menu')?.remove();
    
    const menu = document.createElement('div');
    menu.className = 'add-widget-menu';
    menu.innerHTML = `
      <div class="menu-backdrop" onclick="this.parentElement.remove()"></div>
      <div class="menu-dropdown">
        <div class="menu-header">Add Widget</div>
        <div class="menu-item" onclick="activeMirror.addWidget('tasks'); this.closest('.add-widget-menu').remove()">
          <span class="menu-icon">✓</span>
          <span class="menu-title">Tasks</span>
        </div>
        <div class="menu-item" onclick="activeMirror.addWidget('notes'); this.closest('.add-widget-menu').remove()">
          <span class="menu-icon">📝</span>
          <span class="menu-title">Notes</span>
        </div>
        <div class="menu-item" onclick="activeMirror.addWidget('scratchpad'); this.closest('.add-widget-menu').remove()">
          <span class="menu-icon">⌨</span>
          <span class="menu-title">Scratchpad</span>
        </div>
        <div class="menu-item" onclick="activeMirror.addWidget('links'); this.closest('.add-widget-menu').remove()">
          <span class="menu-icon">🔗</span>
          <span class="menu-title">Links</span>
        </div>
        <div class="menu-item" onclick="activeMirror.addWidget('calendar'); this.closest('.add-widget-menu').remove()">
          <span class="menu-icon">📅</span>
          <span class="menu-title">Calendar</span>
        </div>
        <div class="menu-divider"></div>
        <div class="menu-item danger" onclick="activeMirror.resetWidgets(); this.closest('.add-widget-menu').remove()">
          <span class="menu-icon">🗑</span>
          <span class="menu-title">Reset to Defaults</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(menu);
    
    // Position near the button
    const btn = document.getElementById('add-widget-btn');
    const dropdown = menu.querySelector('.menu-dropdown');
    if (btn && dropdown) {
      const rect = btn.getBoundingClientRect();
      dropdown.style.top = (rect.bottom + 8) + 'px';
      dropdown.style.left = rect.left + 'px';
    }
  }
  
  resetWidgets() {
    localStorage.removeItem('activemirror_widgets');
    this.widgets = this.loadWidgets();
    this.renderWidgets();
  }
  
  // ============================================
  // Tier Selector
  // ============================================
  
  setupTierSelector() {
    document.querySelectorAll('.tier-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const tier = pill.dataset.tier;
        this.setTier(tier);
      });
    });
  }
  
  setTier(tier) {
    this.currentTier = tier;
    const config = this.tierConfig[tier];
    const isSovereign = tier === 'sovereign' || tier === 'webllm';

    // Track tier change for nudges
    this.trackTierChangeForNudges(tier);
    
    // Update pills - fix the active class handling
    document.querySelectorAll('.tier-pill').forEach(pill => {
      pill.classList.remove('active', 'sovereign', 'cloud', 'frontier');
      if (pill.dataset.tier === tier) {
        pill.classList.add('active');
        if (tier === 'sovereign') pill.classList.add('sovereign');
        if (tier === 'budget') pill.classList.add('cloud');
        if (tier === 'frontier') pill.classList.add('frontier');
      }
    });
    
    // Update transparency bar
    const tTier = document.getElementById('t-tier');
    const tData = document.getElementById('t-data');
    
    if (tTier) {
      tTier.textContent = `${config.icon} ${config.name}`;
      tTier.className = `t-value ${config.class}`;
    }
    if (tData) {
      tData.textContent = config.data;
      tData.className = `t-value ${isSovereign ? 'sovereign' : 'cloud'}`;
    }
    
    // Update transparency pane (right side widget)
    this.updateTransparencyPane(tier, config);
    
    // Update status
    this.updateStatus(`${config.name} tier selected`);
  }
  
  updateTransparencyPane(tier, config) {
    const isSovereign = tier === 'sovereign';
    
    // Update pane badge
    const paneMode = document.getElementById('pane-mode');
    if (paneMode) {
      paneMode.textContent = isSovereign ? 'SOVEREIGN' : 'CLOUD';
      paneMode.style.background = isSovereign ? 'var(--success-soft)' : 'var(--warning-soft)';
      paneMode.style.color = isSovereign ? 'var(--success)' : 'var(--warning)';
    }
    
    // Update processing
    const paneProcessing = document.getElementById('pane-processing');
    if (paneProcessing) {
      paneProcessing.textContent = isSovereign ? 'Local' : 'Cloud';
      paneProcessing.className = `pane-value ${isSovereign ? 'sovereign' : 'cloud'}`;
    }
    
    // Update model
    const paneModel = document.getElementById('pane-model');
    if (paneModel) {
      const models = {
        sovereign: 'gpt-oss:20b',
        fast_free: 'llama-3.3-70b',
        budget: 'deepseek-v3',
        frontier: 'claude-sonnet'
      };
      paneModel.textContent = models[tier] || 'unknown';
    }
    
    // Update cloud status
    const paneCloud = document.getElementById('pane-cloud');
    if (paneCloud) {
      paneCloud.textContent = isSovereign ? 'Blocked' : 'Active';
      paneCloud.style.color = isSovereign ? 'var(--error)' : 'var(--warning)';
    }
    
    // Update flow nodes
    const flowLLM = document.getElementById('flow-llm');
    if (flowLLM) {
      flowLLM.textContent = isSovereign ? 'LLM' : 'API';
      flowLLM.className = `flow-node ${isSovereign ? 'active' : ''}`;
    }
    
    const flowVault = document.getElementById('flow-vault');
    if (flowVault) {
      flowVault.className = `flow-node ${isSovereign ? 'active' : ''}`;
    }
  }
  
  // ============================================
  // Chat
  // ============================================
  
  setupChat() {
    const input = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    if (!input || !sendBtn) return;
    
    sendBtn.addEventListener('click', () => this.sendMessage());
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    // Auto-resize
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });
  }
  
  async sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();

    if (!message) return;

    input.value = '';
    input.style.height = 'auto';

    this.addMessage('user', message);
    this.stats.messages++;
    this.updateStats();
    this.trackMessageForNudges();

    const typingId = this.addTypingIndicator();

    try {
      let response;

      // Use WebLLM if tier is webllm and it's ready
      if (this.currentTier === 'webllm' && this.webllmReady && this.webllm) {
        response = await this.webllm.generate(message);
        response.success = true;
      } else if (this.currentTier === 'webllm' && !this.webllmReady) {
        // WebLLM selected but not loaded - offer to load it
        this.removeTypingIndicator(typingId);
        this.addMessage('system', 'WebLLM not loaded yet. Loading now...');
        await this.enableWebLLM();
        return;
      } else {
        response = await this.queryAPI(message);
      }

      this.removeTypingIndicator(typingId);

      if (response.success) {
        this.addMessage('assistant', response.response, {
          tier: response.tier,
          latency: response.latency_ms,
          cached: response.cached,
          model: response.model
        });

        this.stats.messages++;
        this.stats.tokens += (response.tokens?.input || 0) + (response.tokens?.output || 0);
        this.stats.cost += response.cost_usd || 0;
        if (response.cached) this.stats.cacheHits++;

        this.updateTransparency(response);
        this.updateStats();
      } else {
        this.addMessage('system', response.error || 'Request failed');
      }
    } catch (error) {
      this.removeTypingIndicator(typingId);
      this.addMessage('system', `Connection error: ${error.message}`);
    }
  }
  
  async queryAPI(prompt) {
    const response = await fetch(`${this.apiEndpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        tier: this.currentTier
      })
    });
    return await response.json();
  }
  
  addMessage(role, content, meta = {}) {
    this.messages.push({ role, content, timestamp: Date.now(), ...meta });
    
    const container = document.getElementById('messages');
    if (!container) return;
    
    const welcome = container.querySelector('.welcome-message');
    if (welcome) welcome.remove();
    
    const config = meta.tier ? this.tierConfig[meta.tier] : null;
    
    let metaHTML = '';
    if (role === 'assistant' && meta.tier) {
      metaHTML = `
        <div class="message-meta">
          <span class="meta-tag ${config?.class || ''}">${config?.icon || '◈'} ${config?.name || meta.tier}</span>
          ${meta.latency ? `<span class="meta-tag">${meta.latency}ms</span>` : ''}
          ${meta.cached ? '<span class="meta-tag cached">cached</span>' : ''}
        </div>
      `;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${role}`;
    messageDiv.innerHTML = `
      <div class="message-content">
        <div class="message-header">
          <span class="message-role">${role === 'user' ? 'You' : role === 'assistant' ? '◈ ActiveMirror' : '⚠ System'}</span>
          <span class="message-time">${this.formatTime(Date.now())}</span>
        </div>
        <div class="message-text">${this.formatMessage(content)}</div>
        ${metaHTML}
      </div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
  }
  
  addTypingIndicator() {
    const container = document.getElementById('messages');
    if (!container) return null;
    
    const id = 'typing-' + Date.now();
    const config = this.tierConfig[this.currentTier];
    
    const indicator = document.createElement('div');
    indicator.id = id;
    indicator.className = 'message message-assistant typing';
    indicator.innerHTML = `
      <div class="message-content">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
        <div class="typing-label">Querying ${config?.name || 'model'}...</div>
      </div>
    `;
    
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
    return id;
  }
  
  removeTypingIndicator(id) {
    document.getElementById(id)?.remove();
  }
  
  formatMessage(content) {
    return content
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }
  
  formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  updateTransparency(response) {
    const tLatency = document.getElementById('t-latency');
    const tCost = document.getElementById('t-cost');
    
    if (tLatency) tLatency.textContent = response.latency_ms ? `${response.latency_ms}ms` : '—';
    if (tCost) tCost.textContent = `$${this.stats.cost.toFixed(4)}`;
  }
  
  updateStats() {
    const els = {
      messages: document.getElementById('stat-messages'),
      tokens: document.getElementById('stat-tokens'),
      cache: document.getElementById('stat-cache'),
      cost: document.getElementById('stat-cost')
    };
    
    if (els.messages) els.messages.textContent = this.stats.messages;
    if (els.tokens) els.tokens.textContent = this.stats.tokens;
    if (els.cache) els.cache.textContent = this.stats.cacheHits;
    if (els.cost) els.cost.textContent = `$${this.stats.cost.toFixed(2)}`;
  }
  
  // ============================================
  // Mini Browser
  // ============================================
  
  setupMiniBrowser() {
    const urlInput = document.getElementById('browser-url');
    const goBtn = document.getElementById('browser-go');
    const frame = document.getElementById('browser-frame');
    const placeholder = document.getElementById('browser-placeholder');
    
    if (!urlInput || !goBtn) return;
    
    const navigate = () => {
      let url = urlInput.value.trim();
      if (!url) return;
      
      // If not a URL, search DuckDuckGo
      if (!url.startsWith('http') && !url.includes('.')) {
        url = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`;
      } else if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      
      if (frame && placeholder) {
        placeholder.style.display = 'none';
        frame.style.display = 'block';
        frame.src = url;
      }
    };
    
    goBtn.addEventListener('click', navigate);
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') navigate();
    });
  }
  
  // ============================================
  // Keyboard Shortcuts
  // ============================================
  
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + K: Focus input
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('user-input')?.focus();
      }
      
      // Cmd/Ctrl + 1-4: Switch tiers
      if ((e.metaKey || e.ctrlKey) && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        const tiers = ['sovereign', 'fast_free', 'budget', 'frontier'];
        this.setTier(tiers[parseInt(e.key) - 1]);
      }
    });
  }
  
  // ============================================
  // Status
  // ============================================
  
  async checkStatus() {
    try {
      const response = await fetch(`${this.apiEndpoint}/health`);
      if (response.ok) {
        this.updateStatus('Ready', true);
      } else {
        this.updateStatus('Server error', false);
      }
    } catch (e) {
      this.updateStatus('Offline', false);
    }
    
    setTimeout(() => this.checkStatus(), 30000);
  }
  
  updateStatus(text, active = true) {
    const dot = document.getElementById('status-dot');
    const textEl = document.getElementById('status-text');

    if (dot) {
      dot.classList.toggle('active', active);
    }
    if (textEl) {
      textEl.textContent = text;
    }
  }

  // ============================================
  // WebLLM Integration
  // ============================================

  async checkWebGPUSupport() {
    if (typeof WebLLMEngine === 'undefined') return;

    const support = await WebLLMEngine.checkSupport();
    if (support.supported) {
      console.log(`WebGPU available: ${support.gpu}`);
      // Add WebLLM tier option
      this.addWebLLMTierOption();
    } else {
      console.log(`WebGPU not available: ${support.reason}`);
    }
  }

  addWebLLMTierOption() {
    const tierPills = document.getElementById('tier-pills');
    if (!tierPills || document.querySelector('[data-tier="webllm"]')) return;

    const webllmPill = document.createElement('button');
    webllmPill.className = 'tier-pill';
    webllmPill.dataset.tier = 'webllm';
    webllmPill.title = 'In-Browser AI (WebGPU)';
    webllmPill.innerHTML = `
      <span class="tier-icon">🌐</span>
      <span>Browser</span>
    `;
    webllmPill.addEventListener('click', () => this.setTier('webllm'));

    tierPills.appendChild(webllmPill);
  }

  async enableWebLLM(modelKey = null) {
    if (this.webllmLoading) return;

    if (typeof WebLLMEngine === 'undefined') {
      this.addMessage('system', 'WebLLM not available. Make sure webllm-engine.js is loaded.');
      return;
    }

    this.webllmLoading = true;
    this.updateStatus('Loading WebLLM...', true);

    // Show loading indicator
    const loadingId = this.addTypingIndicator();
    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) {
      loadingEl.querySelector('.typing-label').textContent = 'Downloading AI model to browser...';
    }

    try {
      this.webllm = new WebLLMEngine();

      this.webllm.onProgress = (progress) => {
        const pct = Math.round(progress.progress * 100);
        if (loadingEl) {
          loadingEl.querySelector('.typing-label').textContent =
            `Loading ${progress.model}: ${pct}%`;
        }
        this.updateStatus(`Loading model: ${pct}%`, true);
      };

      this.webllm.onReady = (info) => {
        this.webllmReady = true;
        this.webllmLoading = false;
        this.removeTypingIndicator(loadingId);
        this.updateStatus(`Browser AI ready`, true);
        this.addMessage('system', `🌐 WebLLM loaded: ${info.model}. Your AI now runs entirely in the browser!`);
        this.setTier('webllm');
      };

      this.webllm.onError = (error) => {
        this.webllmLoading = false;
        this.removeTypingIndicator(loadingId);
        this.updateStatus('WebLLM failed', false);
        this.addMessage('system', `WebLLM error: ${error.message}`);
      };

      await this.webllm.initialize(modelKey);

    } catch (error) {
      this.webllmLoading = false;
      this.removeTypingIndicator(loadingId);
      this.updateStatus('WebLLM failed', false);
      this.addMessage('system', `Failed to load WebLLM: ${error.message}`);
    }
  }

  // ============================================
  // Nudge System
  // ============================================

  setupNudges() {
    if (typeof NudgeEngine === 'undefined') return;

    this.nudges = new NudgeEngine({
      container: document.body,
      onNudge: (id, content) => {
        console.log('Nudge shown:', id, content.title);
      },
      onDismiss: (id, action) => {
        console.log('Nudge action:', id, action);
      }
    });

    // Start checking for nudges after consent is granted
    // (will be triggered in enterApp)
  }

  startNudges() {
    if (this.nudges) {
      this.nudges.start();
    }
  }

  // Track message for nudges
  trackMessageForNudges() {
    if (this.nudges) {
      this.nudges.trackMessage();
    }
  }

  // Track tier change for nudges
  trackTierChangeForNudges(tier) {
    if (this.nudges) {
      this.nudges.trackTierChange(tier);
    }
  }

  // ============================================
  // Fetch Transparency Data
  // ============================================

  async fetchTransparencyData() {
    try {
      const response = await fetch(`${this.apiEndpoint}/api/transparency?tier=${this.currentTier}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Could not fetch transparency data:', e);
    }
    return null;
  }

  async updateTransparencyPane() {
    const data = await this.fetchTransparencyData();
    if (!data) return;

    // Update pane elements with live data
    const paneProcessing = document.getElementById('pane-processing');
    if (paneProcessing) {
      paneProcessing.textContent = data.data_flow.processing === 'local' ? 'Local' : 'Cloud';
      paneProcessing.className = `pane-value ${data.data_flow.processing === 'local' ? 'sovereign' : 'cloud'}`;
    }

    const paneCloud = document.getElementById('pane-cloud');
    if (paneCloud) {
      paneCloud.textContent = data.data_flow.processing === 'local' ? 'Blocked' : 'Active';
      paneCloud.style.color = data.data_flow.processing === 'local' ? 'var(--error)' : 'var(--warning)';
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.activeMirror = new ActiveMirrorApp();
});
