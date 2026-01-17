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
 * - RAG Context System (full app awareness)
 */

/**
 * RAG Context System
 * Provides full app awareness to the LLM by tracking:
 * - User's current location in app (panels, tabs, focus)
 * - Session history (recent actions, clipboard, widgets)
 * - Semantic retrieval from MirrorBrain vault
 * - Connected services state
 */
class SessionContext {
  constructor() {
    // Current UI state
    this.activePanel = null;          // Which panel is open (command-center, reality-composer, etc.)
    this.activeTier = 'sovereign';    // Current inference tier
    this.leftTabExpanded = false;     // Is left sidebar expanded

    // User activity tracking
    this.recentActions = [];          // Last 10 user actions
    this.clipboardHistory = [];       // Last 5 clipboard items
    this.searchHistory = [];          // Last 10 searches

    // Widget state
    this.widgetStates = {};           // Current widget data (tasks, notes, etc.)

    // Conversation context
    this.conversationSummary = '';    // Rolling summary of conversation
    this.messageCount = 0;

    // App features state
    this.cognitiveProfile = null;     // User's cognitive profile from onboarding
    this.quantumSelfState = null;     // Current wellness/state data

    // Timestamps
    this.sessionStart = Date.now();
    this.lastActivity = Date.now();

    // Initialize event listeners
    this.setupTracking();
  }

  setupTracking() {
    // Track panel opens/closes
    document.addEventListener('panel-opened', (e) => {
      this.activePanel = e.detail?.panel || null;
      this.trackAction('panel_open', { panel: this.activePanel });
    });

    document.addEventListener('panel-closed', (e) => {
      this.trackAction('panel_close', { panel: this.activePanel });
      this.activePanel = null;
    });

    // Track tab expansion
    const leftTab = document.getElementById('left-tab');
    if (leftTab) {
      const observer = new MutationObserver((mutations) => {
        this.leftTabExpanded = leftTab.classList.contains('expanded');
      });
      observer.observe(leftTab, { attributes: true, attributeFilter: ['class'] });
    }

    // Track clipboard changes (when user copies from app)
    document.addEventListener('copy', () => {
      const selection = window.getSelection()?.toString();
      if (selection) {
        this.addToClipboardHistory(selection);
      }
    });

    // Track search queries
    document.addEventListener('search-performed', (e) => {
      if (e.detail?.query) {
        this.searchHistory.unshift({
          query: e.detail.query,
          timestamp: Date.now(),
          results: e.detail.resultCount || 0
        });
        if (this.searchHistory.length > 10) this.searchHistory.pop();
      }
    });

    // Track message sends for conversation context
    window.addEventListener('message-sent', (e) => {
      this.messageCount++;
      this.lastActivity = Date.now();
      this.updateConversationSummary(e.detail?.text, 'user');
    });

    // Load cognitive profile
    this.loadCognitiveProfile();
  }

  trackAction(action, details = {}) {
    this.recentActions.unshift({
      action,
      details,
      timestamp: Date.now()
    });
    if (this.recentActions.length > 10) this.recentActions.pop();
    this.lastActivity = Date.now();
  }

  addToClipboardHistory(text) {
    // Don't add duplicates
    if (this.clipboardHistory[0]?.text === text) return;

    this.clipboardHistory.unshift({
      text: text.substring(0, 500), // Limit size
      timestamp: Date.now()
    });
    if (this.clipboardHistory.length > 5) this.clipboardHistory.pop();
  }

  updateConversationSummary(message, role) {
    // Keep a rolling context of the conversation
    // This is a simple implementation - could use LLM summarization for longer convos
    if (!message) return;

    const prefix = role === 'user' ? 'User asked: ' : 'Assistant responded: ';
    const snippet = message.substring(0, 100);

    // Maintain last 3 exchanges
    this.conversationSummary += `\n${prefix}${snippet}...`;
    const lines = this.conversationSummary.split('\n').filter(l => l.trim());
    if (lines.length > 6) {
      this.conversationSummary = lines.slice(-6).join('\n');
    }
  }

  loadCognitiveProfile() {
    const profile = localStorage.getItem('cognitive_profile');
    if (profile) {
      try {
        this.cognitiveProfile = JSON.parse(profile);
      } catch (e) {}
    }
  }

  updateWidgetStates(widgets) {
    this.widgetStates = {};
    for (const widget of widgets) {
      this.widgetStates[widget.id] = {
        type: widget.type,
        title: widget.title,
        collapsed: widget.collapsed,
        data: widget.data
      };
    }
  }

  updateQuantumSelfState() {
    if (window.quantumSelf) {
      this.quantumSelfState = {
        score: window.quantumSelf.getWellnessScore?.() || 50,
        state: window.quantumSelf.currentState || {},
        guidance: window.quantumSelf.getDailyGuidance?.() || null
      };
    }
  }

  // Build full context for LLM
  buildContext() {
    this.updateQuantumSelfState();

    const context = {
      // Session info
      session: {
        id: window.activeMirror?.sessionId || 'unknown',
        duration: Math.floor((Date.now() - this.sessionStart) / 1000 / 60), // minutes
        messageCount: this.messageCount,
        tier: this.activeTier
      },

      // UI state
      ui: {
        activePanel: this.activePanel,
        leftSidebarExpanded: this.leftTabExpanded,
        theme: document.documentElement.getAttribute('data-theme') || 'dark'
      },

      // Recent activity
      activity: {
        recentActions: this.recentActions.slice(0, 5),
        lastActivity: this.formatTimeAgo(this.lastActivity),
        recentSearches: this.searchHistory.slice(0, 3).map(s => s.query)
      },

      // Widgets
      widgets: this.widgetStates,

      // User profile
      profile: {
        cognitive: this.cognitiveProfile,
        wellness: this.quantumSelfState
      },

      // Conversation
      conversationContext: this.conversationSummary || 'No prior context'
    };

    return context;
  }

  // Build context string for LLM prompt
  buildContextString() {
    const ctx = this.buildContext();

    let contextStr = `[App Context]\n`;
    contextStr += `Session: ${ctx.session.duration}min, ${ctx.session.messageCount} messages, tier: ${ctx.session.tier}\n`;
    contextStr += `UI: ${ctx.ui.activePanel ? `${ctx.ui.activePanel} panel open` : 'main view'}, ${ctx.ui.theme} theme\n`;

    // Add widget context if relevant
    if (Object.keys(ctx.widgets).length > 0) {
      contextStr += `\nWidgets:\n`;
      for (const [id, widget] of Object.entries(ctx.widgets)) {
        if (widget.type === 'tasks' && widget.data?.items?.length > 0) {
          const pending = widget.data.items.filter(i => !i.done).length;
          const done = widget.data.items.filter(i => i.done).length;
          contextStr += `- Tasks: ${pending} pending, ${done} done\n`;
        } else if (widget.type === 'notes' && widget.data?.content) {
          contextStr += `- Notes: "${widget.data.content.substring(0, 50)}..."\n`;
        }
      }
    }

    // Add wellness context if available
    if (ctx.profile.wellness?.score) {
      contextStr += `\nUser State: wellness ${ctx.profile.wellness.score}/100\n`;
      if (ctx.profile.wellness.guidance?.focus) {
        contextStr += `Today's focus: ${ctx.profile.wellness.guidance.focus}\n`;
      }
    }

    // Add cognitive profile
    if (ctx.profile.cognitive?.profiles?.length > 0) {
      contextStr += `\nCognitive Profile: ${ctx.profile.cognitive.profiles.join(', ')}\n`;
    }

    // Add recent searches
    if (ctx.activity.recentSearches?.length > 0) {
      contextStr += `\nRecent searches: ${ctx.activity.recentSearches.join(', ')}\n`;
    }

    // Add conversation context
    if (ctx.conversationContext && ctx.conversationContext !== 'No prior context') {
      contextStr += `\nConversation history:\n${ctx.conversationContext}\n`;
    }

    return contextStr;
  }

  formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}min ago`;
    return `${Math.floor(seconds / 3600)}hr ago`;
  }

  // Get summary for debugging/display
  getSummary() {
    return {
      session: `${Math.floor((Date.now() - this.sessionStart) / 1000 / 60)}min session`,
      messages: this.messageCount,
      activePanel: this.activePanel || 'none',
      recentActions: this.recentActions.length,
      clipboardItems: this.clipboardHistory.length,
      searches: this.searchHistory.length
    };
  }
}

// Global session context instance
window.sessionContext = new SessionContext();

class ActiveMirrorApp {
  constructor() {
    this.apiEndpoint = 'http://localhost:8086';
    this.messages = [];
    this.sessionId = this.generateSessionId();
    this.consentGranted = false;

    // RAG Context System - full app awareness for LLM
    this.ragEnabled = localStorage.getItem('rag_enabled') !== 'false';
    this.sessionContext = window.sessionContext;

    // Current tier
    this.currentTier = 'sovereign';
    this.tierConfig = {
      sovereign: { name: 'Sovereign', icon: '◈', class: 'sovereign', data: '100% Local' },
      fast_free: { name: 'Fast', icon: '⚡', class: '', data: 'Groq Cloud' },
      budget: { name: 'Budget', icon: '☁', class: 'cloud', data: 'DeepSeek' },
      frontier: { name: 'Frontier', icon: '✦', class: 'frontier', data: 'OpenAI GPT-4' },
      webllm: { name: 'In-Browser', icon: '🌐', class: 'sovereign', data: 'WebGPU Local' }
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

    // Web search enabled (for grounding responses with live data)
    this.webSearchEnabled = localStorage.getItem('web_search_enabled') !== 'false';

    // Tool integrations registry
    this.tools = {
      webSearch: {
        enabled: true,
        provider: localStorage.getItem('search_provider') || 'duckduckgo',
        providers: {
          duckduckgo: { name: 'DuckDuckGo', icon: '🦆', free: true },
          serper: { name: 'Serper', icon: '🔍', apiKey: localStorage.getItem('serper_api_key') },
          tavily: { name: 'Tavily', icon: '🌐', apiKey: localStorage.getItem('tavily_api_key') }
        }
      },
      urlFetch: { enabled: true, name: 'URL Fetch', icon: '📄' },
      calculator: { enabled: true, name: 'Calculator', icon: '🔢' },
      codeExec: { enabled: false, name: 'Code Sandbox', icon: '💻' },
      imageGen: { enabled: !!localStorage.getItem('imagen_api_key'), name: 'Image Gen', icon: '🎨' }
    };

    // MCP Tool integrations (available via Claude Desktop/Code)
    this.mcpTools = {
      mirrorbrain: {
        name: 'MirrorBrain',
        icon: '⟡',
        description: 'Sovereign intelligence - vault, state, alignment',
        tools: [
          'get_system_state', 'get_alerts', 'get_open_loops', 'get_git_status',
          'vault_semantic_search', 'vault_index_documents', 'get_handoff', 'write_handoff',
          'invoke_ag', 'get_alignment_heartbeat', 'record_correction'
        ]
      },
      sc1Fleet: {
        name: 'SC1 Fleet',
        icon: '📱',
        description: 'Mobile device control - Pixel & OnePlus',
        devices: ['pixel', 'oneplus'],
        tools: [
          'sc1_fleet_status', 'sc1_notify', 'sc1_tts', 'sc1_speak',
          'sc1_clipboard_get', 'sc1_clipboard_set', 'sc1_sms_list',
          'sc1_camera', 'sc1_location', 'sc1_battery', 'sc1_url', 'sc1_dialog'
        ]
      },
      googleDrive: {
        name: 'Google Drive',
        icon: '📁',
        description: 'File storage and sync',
        connected: true
      },
      github: {
        name: 'GitHub',
        icon: '🐙',
        description: 'Code repositories',
        connected: true
      }
    };

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

      // Initialize UI components now that user has entered
      if (window.initCognitiveBridge) window.initCognitiveBridge();
      if (window.initLifeStack) setTimeout(() => window.initLifeStack(), 1000);

      // Initialize Reality Composer UI (environment control panel)
      if (window.initRealityComposerUI) {
        setTimeout(() => window.initRealityComposerUI(), 500);
      }

      // Initialize Future Self UI (wisdom dialogue)
      if (window.initFutureSelfUI) {
        setTimeout(() => window.initFutureSelfUI(), 700);
      }

      // Check for time capsules from Future Self
      if (window.futureSelf?.checkTimeCapsules) {
        setTimeout(() => window.futureSelf.checkTimeCapsules(), 2000);
      }

      // Auto-expand left tab for first-time users to show widgets
      if (!localStorage.getItem('left_tab_seen')) {
        setTimeout(() => {
          const leftTab = document.getElementById('left-tab');
          if (leftTab) {
            leftTab.classList.remove('collapsed');
            leftTab.classList.add('expanded');
            localStorage.setItem('left_tab_seen', 'true');
          }
        }, 1500);
      }

      // Initialize Your State widget in sidebar
      this.initStateWidget();
    }, 400);
  }

  initStateWidget() {
    // Update immediately and then every 30 seconds
    this.updateStateWidget();
    setInterval(() => this.updateStateWidget(), 30000);
  }

  updateStateWidget() {
    const qs = window.quantumSelf;
    if (!qs) return;

    const score = qs.getWellnessScore();
    const guidance = qs.getDailyGuidance();
    const state = qs.currentState;
    const predictions = qs.predictions || [];

    // Update badge
    const badge = document.getElementById('state-score-badge');
    if (badge) {
      badge.textContent = score;
      badge.className = `badge ${score >= 70 ? 'badge-sovereign' : score >= 40 ? 'badge-info' : 'badge-warning'}`;
    }

    // Update score circle
    const scoreDisplay = document.getElementById('qs-score-display');
    if (scoreDisplay) {
      scoreDisplay.querySelector('div').style.setProperty('--qs-score', score);
    }
    const scoreValue = document.getElementById('qs-score-value');
    if (scoreValue) scoreValue.textContent = score;

    // Update guidance
    const guidanceText = document.getElementById('qs-guidance-text');
    if (guidanceText && guidance) {
      const focus = guidance.focus || 'Take it easy today';
      const body = guidance.bodyWisdom || '';
      guidanceText.innerHTML = `<strong style="color:var(--text-primary)">${focus}</strong>${body ? `<br><span style="font-size:11px">${body}</span>` : ''}`;
    }

    // Update dimensions
    const dimsContainer = document.getElementById('qs-dimensions');
    if (dimsContainer && state) {
      const dims = [
        { key: 'cognitive', icon: '🧠', label: 'Mind' },
        { key: 'emotional', icon: '💜', label: 'Heart' },
        { key: 'physical', icon: '💪', label: 'Body' },
        { key: 'social', icon: '👥', label: 'Social' },
        { key: 'creative', icon: '✨', label: 'Creative' },
        { key: 'meaning', icon: '🎯', label: 'Purpose' }
      ];
      dimsContainer.innerHTML = dims.map(d => `
        <div style="text-align:center;padding:4px;background:var(--bg-tertiary);border-radius:6px;">
          <div style="font-size:14px">${d.icon}</div>
          <div style="font-size:10px;color:var(--text-muted)">${state[d.key] || 50}</div>
        </div>
      `).join('');
    }

    // Update predictions
    const predsContainer = document.getElementById('qs-predictions');
    if (predsContainer) {
      if (predictions.length === 0) {
        predsContainer.innerHTML = '✓ All clear — no warnings';
      } else {
        predsContainer.innerHTML = predictions.slice(0, 2).map(p =>
          `<div style="color:var(--warning)">⚠ ${p.type === 'crash_warning' ? 'Energy dip predicted' : p.type}</div>`
        ).join('');
      }
    }
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

    // Update architecture diagram
    this.updateArchitectureDiagram(tier);

    // Update status
    this.updateStatus(`${config.name} tier selected`);
  }

  updateArchitectureDiagram(tier) {
    const isSovereign = tier === 'sovereign' || tier === 'webllm';
    const cloudProviders = {
      fast_free: 'Groq',
      budget: 'DeepSeek',
      frontier: 'OpenAI'
    };

    // Update badge
    const badge = document.getElementById('arch-mode-badge');
    if (badge) {
      badge.textContent = isSovereign ? '100% Local' : 'Hybrid';
      badge.className = isSovereign ? 'badge badge-sovereign' : 'badge badge-cloud';
    }

    // Update cloud node
    const cloudNode = document.getElementById('arch-cloud-node');
    const cloudPath = document.getElementById('arch-cloud-path');
    const cloudBox = document.getElementById('arch-cloud-box');
    const cloudLabel = document.getElementById('arch-cloud-label');
    const cloudStatus = document.getElementById('arch-cloud-status');
    const outputSublabel = document.getElementById('arch-output-sublabel');

    if (isSovereign) {
      // Blocked state
      if (cloudPath) cloudPath.style.cssText = 'stroke:var(--error);stroke-dasharray:4 2;opacity:0.3';
      if (cloudBox) cloudBox.style.cssText = 'fill:rgba(239,68,68,0.1);stroke:var(--error);stroke-dasharray:4 2;';
      if (cloudLabel) { cloudLabel.style.fill = 'var(--error)'; cloudLabel.textContent = '☁ Cloud'; }
      if (cloudStatus) { cloudStatus.style.fill = 'var(--error)'; cloudStatus.textContent = 'BLOCKED'; }
      if (outputSublabel) outputSublabel.textContent = 'Zero Cloud';
    } else {
      // Active cloud state
      const provider = cloudProviders[tier] || 'Cloud';
      if (cloudPath) cloudPath.style.cssText = 'stroke:var(--warning);stroke-width:2;opacity:1';
      if (cloudBox) cloudBox.style.cssText = 'fill:rgba(245,158,11,0.15);stroke:var(--warning);stroke-dasharray:none;';
      if (cloudLabel) { cloudLabel.style.fill = 'var(--warning)'; cloudLabel.textContent = `☁ ${provider}`; }
      if (cloudStatus) { cloudStatus.style.fill = 'var(--warning)'; cloudStatus.textContent = 'ACTIVE'; }
      if (outputSublabel) outputSublabel.textContent = 'Via Cloud';
    }
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

    // Web search toggle
    const webToggle = document.getElementById('web-search-toggle');
    if (webToggle) {
      // Set initial state
      webToggle.classList.toggle('active', this.webSearchEnabled);
      webToggle.title = this.webSearchEnabled
        ? 'Web search enabled - click to disable'
        : 'Web search disabled - click to enable';

      webToggle.addEventListener('click', () => {
        this.webSearchEnabled = !this.webSearchEnabled;
        this.toggleWebSearch(this.webSearchEnabled);
        webToggle.classList.toggle('active', this.webSearchEnabled);
        webToggle.title = this.webSearchEnabled
          ? 'Web search enabled - click to disable'
          : 'Web search disabled - click to enable';
      });
    }
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

    // Dispatch message-sent event for Future Self wisdom capture
    window.dispatchEvent(new CustomEvent('message-sent', {
      detail: {
        text: message,
        role: 'user',
        timestamp: Date.now(),
        context: {
          tier: this.currentTier,
          sessionMessages: this.stats.messages
        }
      }
    }));

    // Show web search indicator if enabled and query needs it
    const willSearchWeb = this.webSearchEnabled && this.needsWebSearch(message);
    const typingId = this.addTypingIndicator(willSearchWeb ? 'Searching the web...' : null);

    // Trigger consciousness stream burst
    if (window.consciousnessStream) {
      window.consciousnessStream.burst();
    }

    try {
      let response;

      // Use WebLLM if tier is webllm and it's ready
      if (this.currentTier === 'webllm' && this.webllmReady && this.webllm) {
        response = await this.webllm.generate(message);
        response.success = true;
        response.toolsUsed = [];
      } else if (this.currentTier === 'webllm' && !this.webllmReady) {
        // WebLLM selected but not loaded - offer to load it
        this.removeTypingIndicator(typingId);
        this.addMessage('system', 'WebLLM not loaded yet. Loading now...');
        await this.enableWebLLM();
        return;
      } else {
        // Update indicator when tools are being executed
        if (willSearchWeb) {
          this.updateTypingIndicator(typingId, `Querying ${this.tierConfig[this.currentTier]?.name || 'model'}...`);
        }
        response = await this.queryAPI(message);
      }

      this.removeTypingIndicator(typingId);

      if (response.success) {
        this.addMessage('assistant', response.response, {
          tier: response.tier,
          latency: response.latency_ms,
          cached: response.cached,
          model: response.model,
          toolsUsed: response.toolsUsed || []
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
    // Execute tools and gather context
    const { context: toolContext, toolsUsed } = await this.executeTools(prompt);

    // Build RAG context (app awareness)
    let ragContext = '';
    if (this.ragEnabled && this.sessionContext) {
      ragContext = this.sessionContext.buildContextString();
      // Update widget states before building context
      if (this.widgets) {
        this.sessionContext.updateWidgetStates(this.widgets);
      }
      // Track the tier being used
      this.sessionContext.activeTier = this.currentTier;

      // Add RAG indicator to tools used
      if (ragContext) {
        toolsUsed.push('🧠 rag');
      }
    }

    // Combine all context sources
    let fullContext = '';
    if (ragContext) fullContext += ragContext + '\n';
    if (toolContext) fullContext += toolContext;

    // Augment prompt with all context
    const augmentedPrompt = fullContext
      ? `${fullContext}[User Question]\n${prompt}\n\nUse the context above to provide a personalized, relevant answer.`
      : prompt;

    const response = await fetch(`${this.apiEndpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: augmentedPrompt,
        tier: this.currentTier,
        toolsUsed: toolsUsed,
        hasRagContext: !!ragContext
      })
    });

    const result = await response.json();
    result.toolsUsed = toolsUsed;
    return result;
  }

  // Detect if user query needs current/live web info
  needsWebSearch(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    const webTriggers = [
      'latest', 'current', 'today', 'now', 'recent', 'news', '2024', '2025', '2026',
      'price', 'stock', 'weather', 'what is happening', 'what\'s happening',
      'search for', 'look up', 'find out', 'google', 'search the web',
      'who won', 'score', 'update', 'announced', 'released', 'launched'
    ];
    return webTriggers.some(trigger => lowerPrompt.includes(trigger));
  }

  // Fetch web context using selected provider
  async fetchWebContext(query) {
    const provider = this.tools.webSearch.provider;

    // Try premium providers first if configured
    if (provider === 'serper' && this.tools.webSearch.providers.serper.apiKey) {
      return this.fetchSerperResults(query);
    }
    if (provider === 'tavily' && this.tools.webSearch.providers.tavily.apiKey) {
      return this.fetchTavilyResults(query);
    }

    // Fall back to DuckDuckGo (free, no API key needed)
    return this.fetchDuckDuckGoResults(query);
  }

  // Serper API (https://serper.dev)
  async fetchSerperResults(query) {
    try {
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.tools.webSearch.providers.serper.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ q: query, num: 5 })
      });
      const data = await response.json();
      let context = '';

      if (data.knowledgeGraph) {
        context += `${data.knowledgeGraph.title}: ${data.knowledgeGraph.description || ''}\n\n`;
      }

      if (data.organic?.length > 0) {
        context += 'Search Results:\n';
        data.organic.slice(0, 5).forEach((r, i) => {
          context += `${i + 1}. ${r.title}\n   ${r.snippet}\n   URL: ${r.link}\n\n`;
        });
      }

      return context;
    } catch (e) {
      console.log('Serper error:', e);
      return this.fetchDuckDuckGoResults(query);
    }
  }

  // Tavily API (https://tavily.com)
  async fetchTavilyResults(query) {
    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: this.tools.webSearch.providers.tavily.apiKey,
          query: query,
          search_depth: 'basic',
          max_results: 5
        })
      });
      const data = await response.json();
      let context = '';

      if (data.answer) {
        context += `Answer: ${data.answer}\n\n`;
      }

      if (data.results?.length > 0) {
        context += 'Sources:\n';
        data.results.slice(0, 5).forEach((r, i) => {
          context += `${i + 1}. ${r.title}\n   ${r.content?.substring(0, 200)}...\n   URL: ${r.url}\n\n`;
        });
      }

      return context;
    } catch (e) {
      console.log('Tavily error:', e);
      return this.fetchDuckDuckGoResults(query);
    }
  }

  // DuckDuckGo Instant Answers (free, no API key)
  async fetchDuckDuckGoResults(query) {
    return new Promise((resolve) => {
      const callbackName = `ddg_${Date.now()}`;
      const timeout = setTimeout(() => {
        delete window[callbackName];
        resolve('');
      }, 5000);

      window[callbackName] = (data) => {
        clearTimeout(timeout);
        delete window[callbackName];

        let context = '';

        // Abstract/summary
        if (data.Abstract) {
          context += `Summary: ${data.Abstract}\n`;
          if (data.AbstractURL) context += `Source: ${data.AbstractURL}\n\n`;
        }

        // Definition
        if (data.Definition) {
          context += `Definition: ${data.Definition}\n`;
          if (data.DefinitionSource) context += `Source: ${data.DefinitionSource}\n\n`;
        }

        // Related topics
        if (data.RelatedTopics?.length > 0) {
          context += 'Related Information:\n';
          data.RelatedTopics.slice(0, 5).forEach((topic, i) => {
            if (topic.Text) {
              context += `${i + 1}. ${topic.Text}\n`;
              if (topic.FirstURL) context += `   URL: ${topic.FirstURL}\n`;
            }
          });
        }

        // Infobox data
        if (data.Infobox?.content?.length > 0) {
          context += '\nQuick Facts:\n';
          data.Infobox.content.slice(0, 5).forEach(item => {
            if (item.label && item.value) {
              context += `- ${item.label}: ${item.value}\n`;
            }
          });
        }

        resolve(context || '');
      };

      const script = document.createElement('script');
      script.src = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1&callback=${callbackName}`;
      script.onerror = () => {
        clearTimeout(timeout);
        delete window[callbackName];
        resolve('');
      };
      document.head.appendChild(script);
      setTimeout(() => script.remove(), 100);
    });
  }

  // Toggle web search
  toggleWebSearch(enabled) {
    this.webSearchEnabled = enabled;
    localStorage.setItem('web_search_enabled', enabled);
    console.log(`⟡ Web search ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Fetch URL content for grounding
  async fetchUrlContent(url) {
    try {
      // Use a CORS proxy for cross-origin requests
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();

      if (data.contents) {
        // Extract text content from HTML
        const doc = new DOMParser().parseFromString(data.contents, 'text/html');
        // Remove scripts, styles, nav, footer
        doc.querySelectorAll('script, style, nav, footer, header, aside').forEach(el => el.remove());
        const text = doc.body?.textContent?.trim() || '';
        // Limit to ~2000 chars
        return text.substring(0, 2000);
      }
      return '';
    } catch (e) {
      console.log('URL fetch error:', e);
      return '';
    }
  }

  // Calculator tool
  calculateExpression(expr) {
    try {
      // Safe math evaluation (no eval)
      const sanitized = expr.replace(/[^0-9+\-*/().%\s]/g, '');
      // Use Function constructor for safer eval
      const result = new Function(`return ${sanitized}`)();
      return isFinite(result) ? result : 'Error';
    } catch (e) {
      return 'Error: Invalid expression';
    }
  }

  // Detect tool needs from prompt
  detectToolNeeds(prompt) {
    const needs = [];
    const lower = prompt.toLowerCase();

    // Web search triggers
    if (this.needsWebSearch(prompt)) {
      needs.push('webSearch');
    }

    // URL in prompt
    const urlMatch = prompt.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      needs.push({ tool: 'urlFetch', url: urlMatch[0] });
    }

    // Math expression
    if (/\b(calculate|compute|what is|eval)\b.*[\d+\-*/]+/.test(lower) ||
        /^\s*[\d+\-*/().\s]+\s*$/.test(prompt)) {
      needs.push('calculator');
    }

    return needs;
  }

  // Execute tools and gather context
  async executeTools(prompt) {
    const needs = this.detectToolNeeds(prompt);
    let context = '';
    const toolsUsed = [];

    for (const need of needs) {
      if (need === 'webSearch' && this.webSearchEnabled) {
        const webContext = await this.fetchWebContext(prompt);
        if (webContext) {
          context += `[Web Search Results]\n${webContext}\n\n`;
          toolsUsed.push('🌐 web');
        }
      } else if (need.tool === 'urlFetch' && this.tools.urlFetch.enabled) {
        const urlContent = await this.fetchUrlContent(need.url);
        if (urlContent) {
          context += `[Content from ${need.url}]\n${urlContent}\n\n`;
          toolsUsed.push('📄 url');
        }
      } else if (need === 'calculator' && this.tools.calculator.enabled) {
        const mathMatch = prompt.match(/[\d+\-*/().\s]+/);
        if (mathMatch) {
          const result = this.calculateExpression(mathMatch[0]);
          context += `[Calculator]\n${mathMatch[0].trim()} = ${result}\n\n`;
          toolsUsed.push('🔢 calc');
        }
      }
    }

    return { context, toolsUsed };
  }

  // Set search provider
  setSearchProvider(provider) {
    if (this.tools.webSearch.providers[provider]) {
      this.tools.webSearch.provider = provider;
      localStorage.setItem('search_provider', provider);
      console.log(`⟡ Search provider set to ${provider}`);
    }
  }

  // Set API key for a provider
  setProviderApiKey(provider, apiKey) {
    if (this.tools.webSearch.providers[provider]) {
      this.tools.webSearch.providers[provider].apiKey = apiKey;
      localStorage.setItem(`${provider}_api_key`, apiKey);
      console.log(`⟡ API key set for ${provider}`);
    }
  }

  // Get available tools summary
  getToolsSummary() {
    return Object.entries(this.tools).map(([key, tool]) => ({
      id: key,
      name: tool.name || key,
      icon: tool.icon || '🔧',
      enabled: tool.enabled,
      provider: tool.provider || null
    }));
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
      // Generate tool tags
      const toolTags = (meta.toolsUsed || []).map(tool =>
        `<span class="meta-tag tool-tag">${tool}</span>`
      ).join('');

      metaHTML = `
        <div class="message-meta">
          <span class="meta-tag ${config?.class || ''}">${config?.icon || '◈'} ${config?.name || meta.tier}</span>
          ${meta.latency ? `<span class="meta-tag">${meta.latency}ms</span>` : ''}
          ${meta.cached ? '<span class="meta-tag cached">cached</span>' : ''}
          ${toolTags}
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
  
  addTypingIndicator(customLabel = null) {
    const container = document.getElementById('messages');
    if (!container) return null;

    const id = 'typing-' + Date.now();
    const config = this.tierConfig[this.currentTier];
    const label = customLabel || `Querying ${config?.name || 'model'}...`;

    const indicator = document.createElement('div');
    indicator.id = id;
    indicator.className = 'message message-assistant typing';
    indicator.innerHTML = `
      <div class="message-content">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
        <div class="typing-label">${label}</div>
      </div>
    `;

    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
    return id;
  }

  updateTypingIndicator(id, newLabel) {
    const indicator = document.getElementById(id);
    if (indicator) {
      const labelEl = indicator.querySelector('.typing-label');
      if (labelEl) labelEl.textContent = newLabel;
    }
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

      // Cmd/Ctrl + /: Show shortcuts help
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        this.showShortcutsHelp();
      }
    });
  }

  showShortcutsHelp() {
    // Remove existing if present
    document.querySelector('.shortcuts-help')?.remove();

    const help = document.createElement('div');
    help.className = 'shortcuts-help';
    help.innerHTML = `
      <div class="sh-content">
        <div class="sh-header">
          <h3>Keyboard Shortcuts</h3>
          <button class="sh-close">×</button>
        </div>
        <div class="sh-grid">
          <div class="sh-section">
            <h4>Navigation</h4>
            <div class="sh-item"><kbd>⌘K</kbd> <span>Focus chat input</span></div>
            <div class="sh-item"><kbd>⌘1-4</kbd> <span>Switch AI tiers</span></div>
            <div class="sh-item"><kbd>⌘/</kbd> <span>This help</span></div>
          </div>
          <div class="sh-section">
            <h4>Quick Tools</h4>
            <div class="sh-item"><kbd>⌘⇧B</kbd> <span>Brain Dump</span></div>
            <div class="sh-item"><kbd>⌘⇧E</kbd> <span>Energy Check</span></div>
            <div class="sh-item"><kbd>⌘⇧C</kbd> <span>Quick Capture</span></div>
            <div class="sh-item"><kbd>⌘⇧P</kbd> <span>Panic Mode</span></div>
            <div class="sh-item"><kbd>⌘⇧S</kbd> <span>Social Scripts</span></div>
          </div>
        </div>
        <p class="sh-tip">Use <strong>Ctrl</strong> instead of <strong>⌘</strong> on Windows/Linux</p>
      </div>
    `;

    // Add styles if not present
    if (!document.querySelector('#sh-styles')) {
      const styles = document.createElement('style');
      styles.id = 'sh-styles';
      styles.textContent = `
        .shortcuts-help {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(18, 18, 26, 0.98);
          border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
          border-radius: 16px;
          padding: 24px;
          z-index: 3000;
          animation: shFadeIn 0.2s ease;
          backdrop-filter: blur(20px);
          max-width: 500px;
          width: 90%;
        }
        @keyframes shFadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .sh-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .sh-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary, #f0f0f5);
        }
        .sh-close {
          background: none;
          border: none;
          color: var(--text-muted, #606070);
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .sh-close:hover { background: var(--bg-tertiary, #1a1a24); }
        .sh-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        .sh-section h4 {
          margin: 0 0 12px 0;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted, #606070);
        }
        .sh-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .sh-item kbd {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 50px;
          padding: 4px 8px;
          background: var(--bg-tertiary, #1a1a24);
          border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
          border-radius: 6px;
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 12px;
          color: var(--text-primary, #f0f0f5);
        }
        .sh-item span {
          color: var(--text-secondary, #a0a0b0);
          font-size: 13px;
        }
        .sh-tip {
          margin: 20px 0 0 0;
          padding-top: 16px;
          border-top: 1px solid var(--glass-border, rgba(255,255,255,0.08));
          font-size: 12px;
          color: var(--text-muted, #606070);
          text-align: center;
        }
        .sh-tip strong { color: var(--text-secondary, #a0a0b0); }
        [data-theme="light"] .shortcuts-help {
          background: rgba(255, 255, 255, 0.98);
          border-color: rgba(0, 0, 0, 0.1);
        }
        @media (max-width: 480px) {
          .sh-grid { grid-template-columns: 1fr; }
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(help);

    // Close handlers
    const closeHelp = () => help.remove();
    help.querySelector('.sh-close').addEventListener('click', closeHelp);

    // Click outside to close
    help.addEventListener('click', (e) => {
      if (e.target === help) closeHelp();
    });

    // Escape to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeHelp();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      if (document.body.contains(help)) help.remove();
    }, 30000);
  }
  
  // ============================================
  // Status
  // ============================================
  
  async checkStatus() {
    try {
      const response = await fetch(`${this.apiEndpoint}/health`);
      if (response.ok) {
        this.updateStatus('Sovereign Mode', true);
      } else {
        this.updateStatus('Backend Offline', false);
      }
    } catch (e) {
      this.updateStatus('Connecting...', false);
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
