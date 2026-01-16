/**
 * CONTEXT PANE — Your Second Brain's Window
 *
 * The left pane that shows you everything relevant:
 * - Unified search across web, vault, files, thoughts
 * - Mini preview window for links, files, notes
 * - Session context: what you've explored, connections made
 * - Pinned references for quick access
 * - Visual connection graph
 *
 * Design: Essential like coffee. Always there when you need it.
 */

class ContextPane {
  constructor() {
    this.isOpen = false;
    this.activeTab = 'search'; // search, preview, context, pins
    this.searchResults = [];
    this.sessionContext = {
      queries: [],
      sources: [],
      connections: [],
      tokensUsed: 0,
      startTime: Date.now()
    };
    this.pinnedItems = this.loadPins();
    this.previewContent = null;
    this.searchSources = {
      web: true,
      vault: true,
      files: true,
      thoughts: true,
      history: true
    };

    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.render());
    } else {
      this.render();
    }
  }

  render() {
    // Create the pane
    const pane = document.createElement('div');
    pane.id = 'context-pane';
    pane.className = 'context-pane collapsed';
    pane.innerHTML = this.renderPaneContent();

    // Create toggle button
    const toggle = document.createElement('button');
    toggle.id = 'context-pane-toggle';
    toggle.className = 'context-toggle';
    toggle.innerHTML = `
      <span class="toggle-icon">◧</span>
      <span class="toggle-label">Context</span>
    `;

    document.body.appendChild(pane);
    document.body.appendChild(toggle);

    this.setupEvents();
    this.injectStyles();
  }

  renderPaneContent() {
    return `
      <div class="cp-header">
        <div class="cp-tabs">
          <button class="cp-tab active" data-tab="search" title="Search Everything">
            <span>🔍</span>
          </button>
          <button class="cp-tab" data-tab="preview" title="Preview">
            <span>👁</span>
          </button>
          <button class="cp-tab" data-tab="context" title="Session Context">
            <span>🧠</span>
          </button>
          <button class="cp-tab" data-tab="pins" title="Pinned Items">
            <span>📌</span>
          </button>
        </div>
        <button class="cp-close" title="Close pane">×</button>
      </div>

      <div class="cp-content">
        <!-- SEARCH TAB -->
        <div class="cp-section active" data-section="search">
          <div class="search-container">
            <div class="search-input-wrap">
              <input type="text" id="unified-search" placeholder="Search everything..." />
              <button class="search-go" id="search-go">↵</button>
            </div>
            <div class="search-sources">
              <label class="source-toggle">
                <input type="checkbox" data-source="web" checked />
                <span class="source-icon">🌐</span>
                <span>Web</span>
              </label>
              <label class="source-toggle">
                <input type="checkbox" data-source="vault" checked />
                <span class="source-icon">🗄</span>
                <span>Vault</span>
              </label>
              <label class="source-toggle">
                <input type="checkbox" data-source="files" checked />
                <span class="source-icon">📁</span>
                <span>Files</span>
              </label>
              <label class="source-toggle">
                <input type="checkbox" data-source="thoughts" checked />
                <span class="source-icon">💭</span>
                <span>Thoughts</span>
              </label>
            </div>
          </div>
          <div class="search-results" id="search-results">
            <div class="search-empty">
              <span class="empty-icon">⟡</span>
              <p>Search across your entire world</p>
              <p class="empty-hint">Web • Vault • Files • Captured Thoughts</p>
            </div>
          </div>
        </div>

        <!-- PREVIEW TAB -->
        <div class="cp-section" data-section="preview">
          <div class="preview-container" id="preview-container">
            <div class="preview-empty">
              <span class="empty-icon">👁</span>
              <p>Click any link or file to preview</p>
              <p class="empty-hint">See content without leaving your flow</p>
            </div>
          </div>
        </div>

        <!-- CONTEXT TAB -->
        <div class="cp-section" data-section="context">
          <div class="context-container">
            <div class="context-header">
              <h4>This Session</h4>
              <span class="session-time" id="session-time">0m</span>
            </div>

            <div class="context-block">
              <div class="context-label">Explored</div>
              <div class="context-list" id="explored-list">
                <span class="context-empty">Nothing explored yet</span>
              </div>
            </div>

            <div class="context-block">
              <div class="context-label">Sources Referenced</div>
              <div class="context-list" id="sources-list">
                <span class="context-empty">No sources yet</span>
              </div>
            </div>

            <div class="context-block">
              <div class="context-label">Connections Made</div>
              <div class="context-list" id="connections-list">
                <span class="context-empty">No connections yet</span>
              </div>
            </div>

            <div class="context-meter">
              <div class="meter-label">Context Used</div>
              <div class="meter-bar">
                <div class="meter-fill" id="token-meter" style="width: 0%"></div>
              </div>
              <div class="meter-value" id="token-value">0%</div>
            </div>
          </div>
        </div>

        <!-- PINS TAB -->
        <div class="cp-section" data-section="pins">
          <div class="pins-container">
            <div class="pins-header">
              <h4>Pinned References</h4>
              <button class="pins-clear" id="clear-pins" title="Clear all pins">Clear</button>
            </div>
            <div class="pins-list" id="pins-list">
              <div class="pins-empty">
                <span class="empty-icon">📌</span>
                <p>Pin important items for quick access</p>
                <p class="empty-hint">Click 📌 on any search result</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupEvents() {
    const pane = document.getElementById('context-pane');
    const toggle = document.getElementById('context-pane-toggle');

    // Toggle pane
    toggle?.addEventListener('click', () => this.toggle());

    // Close button
    pane?.querySelector('.cp-close')?.addEventListener('click', () => this.close());

    // Tab switching
    pane?.querySelectorAll('.cp-tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // Search
    const searchInput = document.getElementById('unified-search');
    const searchGo = document.getElementById('search-go');

    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.performSearch(searchInput.value);
    });
    searchGo?.addEventListener('click', () => {
      this.performSearch(searchInput?.value || '');
    });

    // Source toggles
    pane?.querySelectorAll('.source-toggle input').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        this.searchSources[e.target.dataset.source] = e.target.checked;
      });
    });

    // Clear pins
    document.getElementById('clear-pins')?.addEventListener('click', () => {
      this.clearPins();
    });

    // Update session time every minute
    setInterval(() => this.updateSessionTime(), 60000);

    // Listen for preview requests
    window.addEventListener('preview-request', (e) => {
      this.showPreview(e.detail);
    });

    // Listen for link clicks to enable preview
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link && e.altKey) {
        e.preventDefault();
        this.showPreview({ type: 'url', url: link.href, title: link.textContent });
      }
    });

    // Keyboard shortcut: Cmd/Ctrl + K to open search
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
        this.switchTab('search');
        document.getElementById('unified-search')?.focus();
      }
    });
  }

  // === SEARCH ===

  async performSearch(query) {
    if (!query.trim()) return;

    this.sessionContext.queries.push(query);
    this.searchResults = [];

    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '<div class="search-loading">Searching everywhere...</div>';

    const results = [];

    // Search all enabled sources in parallel
    const searches = [];

    if (this.searchSources.web) {
      searches.push(this.searchWeb(query));
    }
    if (this.searchSources.vault) {
      searches.push(this.searchVault(query));
    }
    if (this.searchSources.files) {
      searches.push(this.searchFiles(query));
    }
    if (this.searchSources.thoughts) {
      searches.push(this.searchThoughts(query));
    }

    const allResults = await Promise.all(searches);
    allResults.forEach(r => results.push(...r));

    this.searchResults = results;
    this.renderSearchResults(results, query);
  }

  async searchWeb(query) {
    // Web search via DuckDuckGo instant answers or similar
    try {
      const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`);
      const data = await response.json();

      const results = [];

      if (data.AbstractText) {
        results.push({
          type: 'web',
          source: 'DuckDuckGo',
          title: data.Heading || query,
          snippet: data.AbstractText,
          url: data.AbstractURL,
          icon: '🌐'
        });
      }

      if (data.RelatedTopics) {
        data.RelatedTopics.slice(0, 3).forEach(topic => {
          if (topic.Text) {
            results.push({
              type: 'web',
              source: 'Web',
              title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 50),
              snippet: topic.Text,
              url: topic.FirstURL,
              icon: '🌐'
            });
          }
        });
      }

      return results;
    } catch (e) {
      console.log('Web search error:', e);
      return [];
    }
  }

  async searchVault(query) {
    // Search MirrorDNA Vault via MCP
    try {
      if (window.mcp?.mirrorbrain?.vault_semantic_search) {
        const results = await window.mcp.mirrorbrain.vault_semantic_search({ query, n_results: 5 });
        return results.map(r => ({
          type: 'vault',
          source: 'Vault',
          title: r.title || r.path?.split('/').pop() || 'Note',
          snippet: r.content?.substring(0, 200) + '...',
          path: r.path,
          icon: '🗄'
        }));
      }

      // Fallback: search via grep
      if (window.mcp?.mirrorbrain?.search_vault) {
        const results = await window.mcp.mirrorbrain.search_vault({ query });
        return results.slice(0, 5).map(r => ({
          type: 'vault',
          source: 'Vault',
          title: r.split('/').pop(),
          snippet: 'Found in vault',
          path: r,
          icon: '🗄'
        }));
      }

      return [];
    } catch (e) {
      console.log('Vault search error:', e);
      return [];
    }
  }

  async searchFiles(query) {
    // Search local files
    try {
      // Use file-intelligence if available
      if (window.fileIntelligence?.search) {
        const results = await window.fileIntelligence.search(query);
        return results.slice(0, 5).map(r => ({
          type: 'file',
          source: 'Files',
          title: r.name,
          snippet: r.preview || r.path,
          path: r.path,
          icon: this.getFileIcon(r.name)
        }));
      }
      return [];
    } catch (e) {
      console.log('File search error:', e);
      return [];
    }
  }

  async searchThoughts(query) {
    // Search captured thoughts, brain dumps, etc.
    const results = [];
    const queryLower = query.toLowerCase();

    // Search brain dump history
    const brainDumps = JSON.parse(localStorage.getItem('brain_dumps') || '[]');
    brainDumps.forEach(dump => {
      if (dump.raw?.toLowerCase().includes(queryLower) ||
          dump.processed?.toLowerCase().includes(queryLower)) {
        results.push({
          type: 'thought',
          source: 'Brain Dump',
          title: dump.raw?.substring(0, 50) + '...',
          snippet: dump.processed || dump.raw,
          timestamp: dump.timestamp,
          icon: '💭'
        });
      }
    });

    // Search quick captures
    const captures = JSON.parse(localStorage.getItem('quick_captures') || '[]');
    captures.forEach(capture => {
      if (capture.text?.toLowerCase().includes(queryLower)) {
        results.push({
          type: 'thought',
          source: 'Quick Capture',
          title: capture.text.substring(0, 50),
          snippet: capture.text,
          timestamp: capture.timestamp,
          icon: '📝'
        });
      }
    });

    // Search wisdom archive
    const wisdom = JSON.parse(localStorage.getItem('wisdom_archive') || '[]');
    wisdom.forEach(w => {
      if (w.insight?.toLowerCase().includes(queryLower)) {
        results.push({
          type: 'thought',
          source: 'Wisdom',
          title: w.insight.substring(0, 50),
          snippet: w.insight,
          timestamp: w.timestamp,
          icon: '✨'
        });
      }
    });

    return results.slice(0, 5);
  }

  renderSearchResults(results, query) {
    const container = document.getElementById('search-results');

    if (results.length === 0) {
      container.innerHTML = `
        <div class="search-no-results">
          <span class="empty-icon">🔍</span>
          <p>No results for "${query}"</p>
          <p class="empty-hint">Try different keywords or enable more sources</p>
        </div>
      `;
      return;
    }

    // Group by source type
    const grouped = {};
    results.forEach(r => {
      if (!grouped[r.type]) grouped[r.type] = [];
      grouped[r.type].push(r);
    });

    let html = '';

    for (const [type, items] of Object.entries(grouped)) {
      html += `<div class="result-group">
        <div class="result-group-header">${this.getTypeLabel(type)} (${items.length})</div>
        ${items.map(item => this.renderResultItem(item)).join('')}
      </div>`;
    }

    container.innerHTML = html;

    // Add click handlers
    container.querySelectorAll('.result-item').forEach(item => {
      item.addEventListener('click', () => {
        const data = JSON.parse(item.dataset.result);
        this.handleResultClick(data);
      });

      item.querySelector('.result-pin')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const data = JSON.parse(item.dataset.result);
        this.pinItem(data);
      });

      item.querySelector('.result-preview')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const data = JSON.parse(item.dataset.result);
        this.showPreview(data);
      });
    });
  }

  renderResultItem(item) {
    const dataAttr = JSON.stringify(item).replace(/"/g, '&quot;');
    return `
      <div class="result-item" data-result="${dataAttr}">
        <div class="result-icon">${item.icon}</div>
        <div class="result-content">
          <div class="result-title">${this.escapeHtml(item.title)}</div>
          <div class="result-snippet">${this.escapeHtml(item.snippet?.substring(0, 100) || '')}</div>
          <div class="result-meta">
            <span class="result-source">${item.source}</span>
            ${item.timestamp ? `<span class="result-time">${this.formatTime(item.timestamp)}</span>` : ''}
          </div>
        </div>
        <div class="result-actions">
          <button class="result-preview" title="Preview">👁</button>
          <button class="result-pin" title="Pin">📌</button>
        </div>
      </div>
    `;
  }

  handleResultClick(item) {
    // Track as explored
    this.sessionContext.sources.push({
      title: item.title,
      type: item.type,
      timestamp: Date.now()
    });
    this.updateContextDisplay();

    // Open based on type
    if (item.url) {
      window.open(item.url, '_blank');
    } else if (item.path) {
      // Open file or vault item
      this.showPreview(item);
    }
  }

  // === PREVIEW ===

  async showPreview(item) {
    this.switchTab('preview');
    const container = document.getElementById('preview-container');

    container.innerHTML = '<div class="preview-loading">Loading preview...</div>';

    try {
      if (item.type === 'url' || item.url) {
        await this.previewUrl(item.url || item, container);
      } else if (item.type === 'vault' || item.type === 'file') {
        await this.previewFile(item, container);
      } else if (item.type === 'thought') {
        this.previewThought(item, container);
      } else {
        container.innerHTML = `
          <div class="preview-content">
            <h3>${this.escapeHtml(item.title || 'Preview')}</h3>
            <p>${this.escapeHtml(item.snippet || item.content || 'No preview available')}</p>
          </div>
        `;
      }
    } catch (e) {
      container.innerHTML = `
        <div class="preview-error">
          <span>⚠️</span>
          <p>Couldn't load preview</p>
          <p class="error-detail">${e.message}</p>
        </div>
      `;
    }
  }

  async previewUrl(url, container) {
    // Use a proxy or screenshot service for URL preview
    // For now, show an iframe with sandbox
    container.innerHTML = `
      <div class="preview-url">
        <div class="preview-url-header">
          <span class="preview-url-icon">🌐</span>
          <a href="${url}" target="_blank" class="preview-url-link">${url}</a>
          <button class="preview-open-new" onclick="window.open('${url}', '_blank')">↗</button>
        </div>
        <iframe
          src="${url}"
          class="preview-iframe"
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
        ></iframe>
      </div>
    `;
  }

  async previewFile(item, container) {
    const ext = item.path?.split('.').pop()?.toLowerCase();

    // Try to read file content
    let content = '';
    try {
      if (window.mcp?.mirrorbrain?.read_file) {
        content = await window.mcp.mirrorbrain.read_file({ path: item.path });
      }
    } catch (e) {
      content = item.snippet || 'Could not read file';
    }

    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) {
      container.innerHTML = `
        <div class="preview-image">
          <img src="file://${item.path}" alt="${item.title}" />
        </div>
      `;
    } else if (['md', 'txt', 'js', 'ts', 'py', 'json', 'yaml', 'yml'].includes(ext)) {
      container.innerHTML = `
        <div class="preview-code">
          <div class="preview-file-header">
            <span>${this.getFileIcon(item.path)} ${item.title}</span>
            <span class="preview-path">${item.path}</span>
          </div>
          <pre><code>${this.escapeHtml(content)}</code></pre>
        </div>
      `;
    } else if (ext === 'pdf') {
      container.innerHTML = `
        <div class="preview-pdf">
          <embed src="file://${item.path}" type="application/pdf" />
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="preview-content">
          <div class="preview-file-header">
            <span>${this.getFileIcon(item.path)} ${item.title}</span>
          </div>
          <pre>${this.escapeHtml(content)}</pre>
        </div>
      `;
    }
  }

  previewThought(item, container) {
    container.innerHTML = `
      <div class="preview-thought">
        <div class="preview-thought-header">
          <span>${item.icon} ${item.source}</span>
          <span class="preview-time">${this.formatTime(item.timestamp)}</span>
        </div>
        <div class="preview-thought-content">
          ${this.escapeHtml(item.snippet || item.title)}
        </div>
      </div>
    `;
  }

  // === PINS ===

  loadPins() {
    return JSON.parse(localStorage.getItem('context_pins') || '[]');
  }

  savePins() {
    localStorage.setItem('context_pins', JSON.stringify(this.pinnedItems));
  }

  pinItem(item) {
    // Check if already pinned
    const exists = this.pinnedItems.some(p =>
      p.title === item.title && p.type === item.type
    );

    if (!exists) {
      this.pinnedItems.unshift({
        ...item,
        pinnedAt: Date.now()
      });
      this.savePins();
      this.renderPins();
      this.showToast('📌 Pinned');
    }
  }

  clearPins() {
    this.pinnedItems = [];
    this.savePins();
    this.renderPins();
  }

  renderPins() {
    const container = document.getElementById('pins-list');

    if (this.pinnedItems.length === 0) {
      container.innerHTML = `
        <div class="pins-empty">
          <span class="empty-icon">📌</span>
          <p>Pin important items for quick access</p>
          <p class="empty-hint">Click 📌 on any search result</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.pinnedItems.map(item => `
      <div class="pin-item" data-pin="${this.escapeHtml(JSON.stringify(item))}">
        <span class="pin-icon">${item.icon}</span>
        <div class="pin-content">
          <div class="pin-title">${this.escapeHtml(item.title)}</div>
          <div class="pin-source">${item.source}</div>
        </div>
        <button class="pin-remove" title="Unpin">×</button>
      </div>
    `).join('');

    // Add handlers
    container.querySelectorAll('.pin-item').forEach(el => {
      el.addEventListener('click', () => {
        const data = JSON.parse(el.dataset.pin);
        this.handleResultClick(data);
      });

      el.querySelector('.pin-remove')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const data = JSON.parse(el.dataset.pin);
        this.pinnedItems = this.pinnedItems.filter(p =>
          !(p.title === data.title && p.type === data.type)
        );
        this.savePins();
        this.renderPins();
      });
    });
  }

  // === CONTEXT TRACKING ===

  updateSessionTime() {
    const elapsed = Date.now() - this.sessionContext.startTime;
    const mins = Math.floor(elapsed / 60000);
    const hours = Math.floor(mins / 60);

    const timeEl = document.getElementById('session-time');
    if (timeEl) {
      timeEl.textContent = hours > 0 ? `${hours}h ${mins % 60}m` : `${mins}m`;
    }
  }

  updateContextDisplay() {
    // Update explored list
    const exploredEl = document.getElementById('explored-list');
    if (exploredEl && this.sessionContext.queries.length > 0) {
      exploredEl.innerHTML = this.sessionContext.queries.slice(-5).map(q =>
        `<span class="context-item">🔍 ${this.escapeHtml(q)}</span>`
      ).join('');
    }

    // Update sources list
    const sourcesEl = document.getElementById('sources-list');
    if (sourcesEl && this.sessionContext.sources.length > 0) {
      const unique = [...new Map(this.sessionContext.sources.map(s => [s.title, s])).values()];
      sourcesEl.innerHTML = unique.slice(-5).map(s =>
        `<span class="context-item">${this.getTypeIcon(s.type)} ${this.escapeHtml(s.title.substring(0, 30))}</span>`
      ).join('');
    }
  }

  trackTokenUsage(tokens) {
    this.sessionContext.tokensUsed += tokens;
    const maxTokens = 100000; // Approximate context window
    const percentage = Math.min((this.sessionContext.tokensUsed / maxTokens) * 100, 100);

    const meter = document.getElementById('token-meter');
    const value = document.getElementById('token-value');

    if (meter) meter.style.width = `${percentage}%`;
    if (value) value.textContent = `${Math.round(percentage)}%`;
  }

  // === UI HELPERS ===

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    const pane = document.getElementById('context-pane');
    const toggle = document.getElementById('context-pane-toggle');
    if (!pane) return;

    this.isOpen = true;
    pane.classList.remove('collapsed');
    toggle?.classList.add('active');
    this.renderPins();
    this.updateSessionTime();
  }

  close() {
    const pane = document.getElementById('context-pane');
    const toggle = document.getElementById('context-pane-toggle');
    if (!pane) return;

    this.isOpen = false;
    pane.classList.add('collapsed');
    toggle?.classList.remove('active');
  }

  switchTab(tabId) {
    this.activeTab = tabId;
    const pane = document.getElementById('context-pane');

    // Update tab buttons
    pane?.querySelectorAll('.cp-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    });

    // Update sections
    pane?.querySelectorAll('.cp-section').forEach(section => {
      section.classList.toggle('active', section.dataset.section === tabId);
    });
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'cp-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('visible'), 10);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  // === UTILITIES ===

  getTypeLabel(type) {
    const labels = {
      web: '🌐 Web',
      vault: '🗄 Vault',
      file: '📁 Files',
      thought: '💭 Thoughts'
    };
    return labels[type] || type;
  }

  getTypeIcon(type) {
    const icons = { web: '🌐', vault: '🗄', file: '📁', thought: '💭' };
    return icons[type] || '📄';
  }

  getFileIcon(filename) {
    const ext = filename?.split('.').pop()?.toLowerCase();
    const icons = {
      js: '📜', ts: '📜', py: '🐍', md: '📝', txt: '📄',
      json: '📋', yaml: '📋', yml: '📋',
      png: '🖼', jpg: '🖼', jpeg: '🖼', gif: '🖼', svg: '🖼',
      pdf: '📕', doc: '📘', docx: '📘',
      mp3: '🎵', wav: '🎵', mp4: '🎬', mov: '🎬'
    };
    return icons[ext] || '📄';
  }

  escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  }

  // === STYLES ===

  injectStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      /* Context Pane Toggle */
      .context-toggle {
        position: fixed;
        left: 0;
        top: 120px;
        z-index: 900;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background: rgba(18, 18, 26, 0.95);
        border: 1px solid var(--glass-border);
        border-left: none;
        border-radius: 0 20px 20px 0;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 12px;
        backdrop-filter: blur(20px);
      }

      .context-toggle:hover {
        background: var(--bg-hover);
        border-color: var(--primary);
        color: var(--text-primary);
      }

      .context-toggle.active {
        background: var(--primary-soft);
        border-color: var(--primary);
        color: var(--primary);
      }

      .toggle-icon {
        font-size: 16px;
      }

      /* Context Pane */
      .context-pane {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: 360px;
        background: rgba(18, 18, 26, 0.98);
        border-right: 1px solid var(--glass-border);
        z-index: 800;
        display: flex;
        flex-direction: column;
        backdrop-filter: blur(20px);
        transition: transform 0.3s ease;
      }

      .context-pane.collapsed {
        transform: translateX(-100%);
      }

      .cp-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid var(--glass-border);
      }

      .cp-tabs {
        display: flex;
        gap: 4px;
      }

      .cp-tab {
        padding: 8px 12px;
        background: transparent;
        border: none;
        border-radius: 8px;
        color: var(--text-muted);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 16px;
      }

      .cp-tab:hover {
        background: var(--bg-hover);
        color: var(--text-secondary);
      }

      .cp-tab.active {
        background: var(--primary-soft);
        color: var(--primary);
      }

      .cp-close {
        padding: 4px 8px;
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 20px;
        border-radius: 4px;
      }

      .cp-close:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
      }

      .cp-content {
        flex: 1;
        overflow: hidden;
      }

      .cp-section {
        display: none;
        height: 100%;
        overflow-y: auto;
      }

      .cp-section.active {
        display: flex;
        flex-direction: column;
      }

      /* Search */
      .search-container {
        padding: 16px;
        border-bottom: 1px solid var(--glass-border);
      }

      .search-input-wrap {
        display: flex;
        gap: 8px;
      }

      #unified-search {
        flex: 1;
        padding: 10px 14px;
        background: var(--bg-tertiary);
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 14px;
      }

      #unified-search:focus {
        outline: none;
        border-color: var(--primary);
      }

      .search-go {
        padding: 10px 14px;
        background: var(--primary);
        border: none;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        font-size: 14px;
      }

      .search-sources {
        display: flex;
        gap: 8px;
        margin-top: 12px;
        flex-wrap: wrap;
      }

      .source-toggle {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: var(--bg-tertiary);
        border-radius: 12px;
        font-size: 11px;
        color: var(--text-secondary);
        cursor: pointer;
      }

      .source-toggle input {
        display: none;
      }

      .source-toggle:has(input:checked) {
        background: var(--primary-soft);
        color: var(--primary);
      }

      .source-icon {
        font-size: 12px;
      }

      .search-results {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
      }

      .search-empty, .search-no-results, .search-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        text-align: center;
        color: var(--text-muted);
      }

      .empty-icon {
        font-size: 32px;
        margin-bottom: 12px;
        opacity: 0.5;
      }

      .empty-hint {
        font-size: 11px;
        opacity: 0.7;
        margin-top: 4px;
      }

      .result-group {
        margin-bottom: 16px;
      }

      .result-group-header {
        font-size: 11px;
        text-transform: uppercase;
        color: var(--text-muted);
        padding: 8px 12px;
        background: var(--bg-tertiary);
        border-radius: 6px;
        margin-bottom: 4px;
      }

      .result-item {
        display: flex;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .result-item:hover {
        background: var(--bg-hover);
      }

      .result-icon {
        font-size: 18px;
        flex-shrink: 0;
      }

      .result-content {
        flex: 1;
        min-width: 0;
      }

      .result-title {
        font-size: 13px;
        font-weight: 500;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .result-snippet {
        font-size: 11px;
        color: var(--text-secondary);
        margin-top: 2px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .result-meta {
        display: flex;
        gap: 8px;
        margin-top: 4px;
        font-size: 10px;
        color: var(--text-muted);
      }

      .result-actions {
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .result-item:hover .result-actions {
        opacity: 1;
      }

      .result-preview, .result-pin {
        padding: 4px 6px;
        background: var(--bg-tertiary);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      }

      .result-preview:hover, .result-pin:hover {
        background: var(--primary-soft);
      }

      /* Preview */
      .preview-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .preview-empty, .preview-loading, .preview-error {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: var(--text-muted);
        padding: 40px;
      }

      .preview-url {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .preview-url-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        border-bottom: 1px solid var(--glass-border);
        background: var(--bg-tertiary);
      }

      .preview-url-link {
        flex: 1;
        font-size: 12px;
        color: var(--primary);
        text-decoration: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .preview-open-new {
        padding: 4px 8px;
        background: var(--bg-hover);
        border: none;
        border-radius: 4px;
        color: var(--text-secondary);
        cursor: pointer;
      }

      .preview-iframe {
        flex: 1;
        border: none;
        background: white;
      }

      .preview-code {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .preview-file-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: var(--bg-tertiary);
        border-bottom: 1px solid var(--glass-border);
        font-size: 12px;
      }

      .preview-path {
        font-size: 10px;
        color: var(--text-muted);
      }

      .preview-code pre {
        flex: 1;
        margin: 0;
        padding: 16px;
        overflow: auto;
        font-size: 12px;
        font-family: var(--font-mono);
        background: var(--bg-primary);
      }

      .preview-thought {
        padding: 16px;
      }

      .preview-thought-header {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: var(--text-muted);
        margin-bottom: 12px;
      }

      .preview-thought-content {
        font-size: 14px;
        line-height: 1.6;
        color: var(--text-primary);
      }

      /* Context */
      .context-container {
        padding: 16px;
      }

      .context-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .context-header h4 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
      }

      .session-time {
        font-size: 12px;
        color: var(--text-muted);
        font-family: var(--font-mono);
      }

      .context-block {
        margin-bottom: 16px;
      }

      .context-label {
        font-size: 11px;
        text-transform: uppercase;
        color: var(--text-muted);
        margin-bottom: 8px;
      }

      .context-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .context-item {
        font-size: 12px;
        color: var(--text-secondary);
        padding: 6px 10px;
        background: var(--bg-tertiary);
        border-radius: 6px;
      }

      .context-empty {
        font-size: 11px;
        color: var(--text-muted);
        font-style: italic;
      }

      .context-meter {
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid var(--glass-border);
      }

      .meter-label {
        font-size: 11px;
        color: var(--text-muted);
        margin-bottom: 8px;
      }

      .meter-bar {
        height: 6px;
        background: var(--bg-tertiary);
        border-radius: 3px;
        overflow: hidden;
      }

      .meter-fill {
        height: 100%;
        background: var(--sovereign);
        border-radius: 3px;
        transition: width 0.3s ease;
      }

      .meter-value {
        font-size: 10px;
        color: var(--text-muted);
        text-align: right;
        margin-top: 4px;
        font-family: var(--font-mono);
      }

      /* Pins */
      .pins-container {
        padding: 16px;
      }

      .pins-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .pins-header h4 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
      }

      .pins-clear {
        padding: 4px 10px;
        background: transparent;
        border: 1px solid var(--glass-border);
        border-radius: 4px;
        color: var(--text-muted);
        font-size: 11px;
        cursor: pointer;
      }

      .pins-clear:hover {
        background: var(--error-soft);
        border-color: var(--error);
        color: var(--error);
      }

      .pins-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .pins-empty {
        text-align: center;
        padding: 40px 20px;
        color: var(--text-muted);
      }

      .pin-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        background: var(--bg-tertiary);
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .pin-item:hover {
        background: var(--bg-hover);
      }

      .pin-icon {
        font-size: 16px;
      }

      .pin-content {
        flex: 1;
        min-width: 0;
      }

      .pin-title {
        font-size: 13px;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .pin-source {
        font-size: 10px;
        color: var(--text-muted);
      }

      .pin-remove {
        padding: 4px 8px;
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 16px;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .pin-item:hover .pin-remove {
        opacity: 1;
      }

      .pin-remove:hover {
        color: var(--error);
      }

      /* Toast */
      .cp-toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        padding: 10px 20px;
        background: var(--bg-secondary);
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 13px;
        z-index: 2000;
        opacity: 0;
        transition: all 0.3s ease;
      }

      .cp-toast.visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }

      /* Adjust main content when pane is open */
      body:has(.context-pane:not(.collapsed)) #main-app {
        margin-left: 360px;
        transition: margin-left 0.3s ease;
      }

      body:has(.context-pane:not(.collapsed)) .context-toggle {
        left: 360px;
      }

      body:has(.context-pane:not(.collapsed)) #command-center-icon {
        left: 380px;
      }

      body:has(.context-pane:not(.collapsed)) .agent-dock {
        left: 360px;
      }
    `;
    document.head.appendChild(styles);
  }
}

// === INITIALIZE ===
window.ContextPane = ContextPane;
window.contextPane = new ContextPane();

console.log('◧ Context Pane loaded — your second brain\'s window');
