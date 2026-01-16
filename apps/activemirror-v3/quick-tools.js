/**
 * QUICK TOOLS — Helpers for Specific Moments
 *
 * These are tools that help with specific situations,
 * especially useful for neurodivergent folks but helpful for anyone.
 *
 * Not magic, just practical shortcuts for common struggles.
 */

// ============================================
// BRAIN DUMP — When thoughts are racing
// ============================================

class BrainDump {
  constructor() {
    this.currentDump = [];
    this.dumps = this.loadDumps();
    this.isOpen = false;
  }

  loadDumps() {
    const saved = localStorage.getItem('brain_dumps');
    return saved ? JSON.parse(saved) : [];
  }

  saveDumps() {
    localStorage.setItem('brain_dumps', JSON.stringify(this.dumps));
  }

  open() {
    this.isOpen = true;
    this.currentDump = [];
    this.showUI();
  }

  addThought(text) {
    if (!text.trim()) return;

    this.currentDump.push({
      text: text.trim(),
      timestamp: Date.now()
    });

    this.updateUI();
  }

  finish() {
    if (this.currentDump.length === 0) {
      this.close();
      return;
    }

    const dump = {
      id: Date.now(),
      thoughts: this.currentDump,
      createdAt: new Date().toISOString(),
      sorted: false
    };

    this.dumps.unshift(dump);
    this.saveDumps();
    this.close();

    // Offer to sort the thoughts
    this.offerToSort(dump);
  }

  offerToSort(dump) {
    // Create a simple prompt for the user
    const thoughts = dump.thoughts.map(t => t.text).join('\n• ');

    // Dispatch event for the main app to handle
    window.dispatchEvent(new CustomEvent('brain-dump-complete', {
      detail: {
        dump,
        message: `Brain dump complete (${dump.thoughts.length} thoughts). Would you like help organizing these?`
      }
    }));
  }

  close() {
    this.isOpen = false;
    this.currentDump = [];
    const el = document.getElementById('brain-dump-overlay');
    if (el) el.remove();
  }

  showUI() {
    const overlay = document.createElement('div');
    overlay.id = 'brain-dump-overlay';
    overlay.innerHTML = `
      <div class="brain-dump-container">
        <div class="brain-dump-header">
          <h3>🧠 Brain Dump</h3>
          <p>Just type. Don't organize. Get it all out.</p>
        </div>

        <div class="brain-dump-thoughts" id="dump-thoughts">
          <p class="dump-empty">Start typing...</p>
        </div>

        <div class="brain-dump-input">
          <input
            type="text"
            id="dump-input"
            placeholder="Type a thought and press Enter"
            autofocus
          />
        </div>

        <div class="brain-dump-actions">
          <button class="dump-btn secondary" onclick="window.brainDump.close()">Cancel</button>
          <button class="dump-btn primary" onclick="window.brainDump.finish()">
            Done (<span id="dump-count">0</span> thoughts)
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Handle input
    const input = document.getElementById('dump-input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        this.addThought(input.value);
        input.value = '';
      }
      if (e.key === 'Escape') {
        this.close();
      }
    });

    input.focus();
  }

  updateUI() {
    const container = document.getElementById('dump-thoughts');
    const count = document.getElementById('dump-count');

    if (container) {
      container.innerHTML = this.currentDump.map(t => `
        <div class="dump-thought">• ${t.text}</div>
      `).join('');
      container.scrollTop = container.scrollHeight;
    }

    if (count) {
      count.textContent = this.currentDump.length;
    }
  }
}

// ============================================
// ENERGY MATCHER — Tasks for your energy
// ============================================

class EnergyMatcher {
  constructor() {
    this.currentEnergy = 'medium';
    this.tasks = this.loadTasks();
  }

  loadTasks() {
    const saved = localStorage.getItem('energy_tasks');
    return saved ? JSON.parse(saved) : [];
  }

  saveTasks() {
    localStorage.setItem('energy_tasks', JSON.stringify(this.tasks));
  }

  addTask(task, energyRequired) {
    this.tasks.push({
      id: Date.now(),
      text: task,
      energy: energyRequired, // 'low', 'medium', 'high'
      createdAt: Date.now(),
      completed: false
    });
    this.saveTasks();
  }

  setCurrentEnergy(level) {
    this.currentEnergy = level;
    this.suggestTasks();
  }

  suggestTasks() {
    const matching = this.tasks.filter(t =>
      !t.completed && t.energy === this.currentEnergy
    );

    if (matching.length === 0) {
      return {
        message: `No ${this.currentEnergy}-energy tasks right now.`,
        tasks: [],
        suggestion: this.getEnergySuggestion()
      };
    }

    return {
      message: `Here are tasks that match your ${this.currentEnergy} energy:`,
      tasks: matching,
      suggestion: null
    };
  }

  getEnergySuggestion() {
    const suggestions = {
      low: [
        'This might be a good time for: sorting emails, light reading, organizing files',
        'Low energy is fine. Maybe just do one small thing, or rest.',
        'Consider: replying to easy messages, reviewing notes, light cleanup'
      ],
      medium: [
        'Good energy for: planning, reviewing, learning something new',
        'This is solid working energy. What feels right?',
        'Consider: meetings, collaborative work, routine tasks'
      ],
      high: [
        'High energy! Good time for: complex problems, creative work, things you\'ve been avoiding',
        'This is the time for hard things. What have you been putting off?',
        'Consider: deep focus work, difficult conversations, big decisions'
      ]
    };

    const options = suggestions[this.currentEnergy] || suggestions.medium;
    return options[Math.floor(Math.random() * options.length)];
  }

  showPicker() {
    const picker = document.createElement('div');
    picker.id = 'energy-picker';
    picker.innerHTML = `
      <div class="energy-picker-container">
        <h3>How's your energy right now?</h3>
        <p>Be honest. There's no wrong answer.</p>

        <div class="energy-options">
          <button class="energy-option" data-energy="low" onclick="window.energyMatcher.pick('low')">
            <span class="energy-icon">🔋</span>
            <span class="energy-label">Low</span>
            <span class="energy-desc">Tired, foggy, need easy wins</span>
          </button>

          <button class="energy-option" data-energy="medium" onclick="window.energyMatcher.pick('medium')">
            <span class="energy-icon">⚡</span>
            <span class="energy-label">Medium</span>
            <span class="energy-desc">Functional, can do regular stuff</span>
          </button>

          <button class="energy-option" data-energy="high" onclick="window.energyMatcher.pick('high')">
            <span class="energy-icon">🚀</span>
            <span class="energy-label">High</span>
            <span class="energy-desc">In the zone, ready for hard things</span>
          </button>
        </div>

        <button class="energy-cancel" onclick="document.getElementById('energy-picker').remove()">
          Never mind
        </button>
      </div>
    `;

    document.body.appendChild(picker);
  }

  pick(level) {
    this.setCurrentEnergy(level);
    document.getElementById('energy-picker')?.remove();

    const result = this.suggestTasks();

    window.dispatchEvent(new CustomEvent('energy-matched', {
      detail: result
    }));
  }
}

// ============================================
// TRANSITION HELPER — Switching between tasks
// ============================================

class TransitionHelper {
  constructor() {
    this.lastTask = null;
    this.transitionStarted = null;
  }

  startTransition(fromTask, toTask) {
    this.lastTask = fromTask;
    this.transitionStarted = Date.now();

    this.showTransitionUI(fromTask, toTask);
  }

  showTransitionUI(from, to) {
    const overlay = document.createElement('div');
    overlay.id = 'transition-overlay';
    overlay.innerHTML = `
      <div class="transition-container">
        <div class="transition-header">
          <h3>Switching tasks</h3>
          <p>Take a moment to transition</p>
        </div>

        <div class="transition-from">
          <div class="transition-label">Finishing</div>
          <div class="transition-task">${from || 'Previous task'}</div>
        </div>

        <div class="transition-arrow">↓</div>

        <div class="transition-to">
          <div class="transition-label">Starting</div>
          <div class="transition-task">${to || 'Next task'}</div>
        </div>

        <div class="transition-checklist">
          <label class="transition-check">
            <input type="checkbox" id="check-saved" />
            <span>Saved my work / noted where I left off</span>
          </label>
          <label class="transition-check">
            <input type="checkbox" id="check-clear" />
            <span>Took a breath / cleared my head</span>
          </label>
          <label class="transition-check">
            <input type="checkbox" id="check-ready" />
            <span>Know my first action for the new task</span>
          </label>
        </div>

        <div class="transition-actions">
          <button class="transition-btn secondary" onclick="window.transitionHelper.skip()">
            Skip
          </button>
          <button class="transition-btn primary" onclick="window.transitionHelper.complete()">
            I'm ready
          </button>
        </div>

        <div class="transition-tip">
          <p>Tip: Transitions are hard for many brains. This isn't weakness—it's just how context-switching works.</p>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
  }

  skip() {
    document.getElementById('transition-overlay')?.remove();
  }

  complete() {
    const duration = Date.now() - this.transitionStarted;
    document.getElementById('transition-overlay')?.remove();

    // Track transition time
    window.dispatchEvent(new CustomEvent('transition-complete', {
      detail: { duration }
    }));
  }
}

// ============================================
// PANIC MODE — When everything feels on fire
// ============================================

class PanicMode {
  constructor() {
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
    this.showUI();
  }

  showUI() {
    const overlay = document.createElement('div');
    overlay.id = 'panic-overlay';
    overlay.innerHTML = `
      <div class="panic-container">
        <div class="panic-header">
          <h2>Let's slow down</h2>
          <p>Everything feeling overwhelming is a signal, not a failure.</p>
        </div>

        <div class="panic-step active" id="panic-step-1">
          <h3>Step 1: Breathe</h3>
          <p>Just one breath. In... and out.</p>
          <div class="breath-circle" id="breath-circle"></div>
          <button class="panic-next" onclick="window.panicMode.nextStep(2)">
            Done
          </button>
        </div>

        <div class="panic-step" id="panic-step-2">
          <h3>Step 2: What's actually urgent?</h3>
          <p>Most things feel urgent but aren't. What will actually matter tomorrow?</p>
          <textarea id="panic-urgent" placeholder="List anything truly time-sensitive..."></textarea>
          <button class="panic-next" onclick="window.panicMode.nextStep(3)">
            Continue
          </button>
        </div>

        <div class="panic-step" id="panic-step-3">
          <h3>Step 3: Pick one thing</h3>
          <p>You can't do everything. What's one small thing you could do right now?</p>
          <input type="text" id="panic-one-thing" placeholder="Just one thing..." />
          <button class="panic-next" onclick="window.panicMode.complete()">
            Okay, just that
          </button>
        </div>

        <button class="panic-exit" onclick="window.panicMode.exit()">
          I'm okay now
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Start breath animation
    this.startBreathAnimation();
  }

  startBreathAnimation() {
    const circle = document.getElementById('breath-circle');
    if (!circle) return;

    circle.classList.add('breathing');
  }

  nextStep(stepNum) {
    document.querySelectorAll('.panic-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`panic-step-${stepNum}`)?.classList.add('active');
  }

  complete() {
    const oneThing = document.getElementById('panic-one-thing')?.value;
    const urgent = document.getElementById('panic-urgent')?.value;

    this.exit();

    window.dispatchEvent(new CustomEvent('panic-resolved', {
      detail: { oneThing, urgent }
    }));
  }

  exit() {
    this.isActive = false;
    document.getElementById('panic-overlay')?.remove();
  }
}

// ============================================
// QUICK CAPTURE — Fast note taking
// ============================================

class QuickCapture {
  constructor() {
    this.captures = this.loadCaptures();
  }

  loadCaptures() {
    const saved = localStorage.getItem('quick_captures');
    return saved ? JSON.parse(saved) : [];
  }

  saveCaptures() {
    localStorage.setItem('quick_captures', JSON.stringify(this.captures));
  }

  capture(text, context = null) {
    const capture = {
      id: Date.now(),
      text,
      context, // what you were doing when you captured this
      createdAt: new Date().toISOString(),
      processed: false
    };

    this.captures.unshift(capture);
    this.saveCaptures();

    this.showConfirmation(capture);
    return capture;
  }

  showInput() {
    const existing = document.getElementById('quick-capture-input');
    if (existing) {
      existing.querySelector('input')?.focus();
      return;
    }

    const input = document.createElement('div');
    input.id = 'quick-capture-input';
    input.innerHTML = `
      <div class="capture-container">
        <input
          type="text"
          id="capture-text"
          placeholder="Quick capture... (press Enter)"
          autofocus
        />
        <button class="capture-btn" onclick="window.quickCapture.submitFromInput()">
          Capture
        </button>
      </div>
    `;

    document.body.appendChild(input);

    const textInput = document.getElementById('capture-text');
    textInput.focus();

    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && textInput.value.trim()) {
        this.capture(textInput.value.trim());
        input.remove();
      }
      if (e.key === 'Escape') {
        input.remove();
      }
    });

    // Close when clicking outside
    input.addEventListener('click', (e) => {
      if (e.target === input) input.remove();
    });
  }

  submitFromInput() {
    const text = document.getElementById('capture-text')?.value;
    if (text?.trim()) {
      this.capture(text.trim());
    }
    document.getElementById('quick-capture-input')?.remove();
  }

  showConfirmation(capture) {
    const toast = document.createElement('div');
    toast.className = 'capture-toast';
    toast.innerHTML = `
      <span class="capture-icon">✓</span>
      <span class="capture-text">Captured: "${capture.text.substring(0, 30)}${capture.text.length > 30 ? '...' : ''}"</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  getUnprocessed() {
    return this.captures.filter(c => !c.processed);
  }

  markProcessed(id) {
    const capture = this.captures.find(c => c.id === id);
    if (capture) {
      capture.processed = true;
      this.saveCaptures();
    }
  }
}

// ============================================
// SOCIAL SCRIPTS — Help with difficult messages
// ============================================

class SocialScripts {
  constructor() {
    this.templates = {
      'say-no': {
        name: 'Saying No',
        description: 'Declining requests politely',
        templates: [
          "Thanks for thinking of me. I can't take this on right now, but I appreciate you asking.",
          "I need to pass on this one—my schedule is full. Hope you find someone who can help.",
          "That sounds interesting, but I have to be honest about my capacity. Not this time."
        ]
      },
      'follow-up': {
        name: 'Following Up',
        description: 'Checking in without being annoying',
        templates: [
          "Hey, just circling back on this. No rush, but wanted to make sure it didn't slip through.",
          "Bumping this up—let me know if you need anything from me.",
          "Hi! Checking in on the below. Happy to discuss if helpful."
        ]
      },
      'apologize': {
        name: 'Apologizing',
        description: 'Taking responsibility without over-apologizing',
        templates: [
          "I should have done this sooner. Here it is now, and I'll make sure it doesn't happen again.",
          "This was my mistake. Here's what I'm doing to fix it: [action]",
          "I dropped the ball on this one. Here's the [thing], and thank you for your patience."
        ]
      },
      'set-boundary': {
        name: 'Setting Boundaries',
        description: 'Establishing limits kindly but firmly',
        templates: [
          "I'm not available for that, but here's what I can do: [alternative]",
          "I need to protect my [time/energy/schedule] for [reason]. I hope you understand.",
          "That doesn't work for me. Can we find another way?"
        ]
      },
      'ask-for-help': {
        name: 'Asking for Help',
        description: 'Requesting support without feeling like a burden',
        templates: [
          "I'm stuck on [thing]. Would you have a few minutes to talk through it?",
          "I could use some help with [task]. Is that something you'd be up for?",
          "I'm struggling with [situation]. Do you have any advice?"
        ]
      }
    };
  }

  showPicker() {
    const picker = document.createElement('div');
    picker.id = 'social-scripts-picker';
    picker.innerHTML = `
      <div class="scripts-container">
        <div class="scripts-header">
          <h3>Social Scripts</h3>
          <p>Starting points for difficult messages. Edit them to sound like you.</p>
        </div>

        <div class="scripts-categories">
          ${Object.entries(this.templates).map(([key, cat]) => `
            <button class="script-category" onclick="window.socialScripts.showCategory('${key}')">
              <span class="script-cat-name">${cat.name}</span>
              <span class="script-cat-desc">${cat.description}</span>
            </button>
          `).join('')}
        </div>

        <div class="scripts-templates" id="scripts-templates" style="display: none;">
          <!-- Templates shown here -->
        </div>

        <button class="scripts-close" onclick="document.getElementById('social-scripts-picker').remove()">
          Close
        </button>
      </div>
    `;

    document.body.appendChild(picker);
  }

  showCategory(categoryKey) {
    const category = this.templates[categoryKey];
    if (!category) return;

    const container = document.getElementById('scripts-templates');
    if (!container) return;

    container.style.display = 'block';
    container.innerHTML = `
      <h4>${category.name}</h4>
      <div class="template-list">
        ${category.templates.map((template, i) => `
          <div class="template-item">
            <p>${template}</p>
            <button class="template-use" onclick="window.socialScripts.useTemplate('${categoryKey}', ${i})">
              Use this
            </button>
          </div>
        `).join('')}
      </div>
      <div class="custom-template">
        <p>Or describe what you need help saying:</p>
        <textarea id="custom-message-need" placeholder="I need to tell my boss..."></textarea>
        <button class="template-generate" onclick="window.socialScripts.requestHelp()">
          Help me write this
        </button>
      </div>
    `;
  }

  useTemplate(categoryKey, templateIndex) {
    const template = this.templates[categoryKey]?.templates[templateIndex];
    if (!template) return;

    // Copy to clipboard
    navigator.clipboard.writeText(template).then(() => {
      document.getElementById('social-scripts-picker')?.remove();
      this.showCopiedToast();
    });
  }

  showCopiedToast() {
    const toast = document.createElement('div');
    toast.className = 'script-toast';
    toast.textContent = 'Copied! Now make it sound like you.';
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  requestHelp() {
    const need = document.getElementById('custom-message-need')?.value;
    if (!need) return;

    document.getElementById('social-scripts-picker')?.remove();

    window.dispatchEvent(new CustomEvent('social-script-request', {
      detail: { need }
    }));
  }
}

// ============================================
// STYLES FOR ALL QUICK TOOLS
// ============================================

const quickToolsStyles = document.createElement('style');
quickToolsStyles.textContent = `
  /* Brain Dump */
  #brain-dump-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(10px);
  }

  .brain-dump-container {
    background: var(--bg-secondary, #1a1a2e);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    padding: 24px;
  }

  .brain-dump-header h3 {
    margin: 0 0 8px;
    color: var(--text-primary, #fff);
  }

  .brain-dump-header p {
    margin: 0;
    color: var(--text-muted, #888);
    font-size: 14px;
  }

  .brain-dump-thoughts {
    flex: 1;
    min-height: 200px;
    max-height: 300px;
    overflow-y: auto;
    padding: 16px;
    margin: 16px 0;
    background: var(--bg-tertiary, #0a0a15);
    border-radius: 8px;
  }

  .dump-empty {
    color: var(--text-muted, #888);
    font-style: italic;
  }

  .dump-thought {
    padding: 8px 0;
    color: var(--text-secondary, #aaa);
    border-bottom: 1px solid var(--glass-border, rgba(255,255,255,0.05));
  }

  .brain-dump-input input {
    width: 100%;
    padding: 12px 16px;
    background: var(--bg-tertiary, #0a0a15);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
    border-radius: 8px;
    color: var(--text-primary, #fff);
    font-size: 16px;
  }

  .brain-dump-input input:focus {
    outline: none;
    border-color: var(--primary, #8b5cf6);
  }

  .brain-dump-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .dump-btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .dump-btn.secondary {
    background: transparent;
    border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
    color: var(--text-secondary, #aaa);
  }

  .dump-btn.primary {
    background: var(--primary, #8b5cf6);
    border: none;
    color: white;
  }

  /* Energy Picker */
  #energy-picker {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(10px);
  }

  .energy-picker-container {
    background: var(--bg-secondary, #1a1a2e);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
    border-radius: 16px;
    padding: 32px;
    text-align: center;
  }

  .energy-picker-container h3 {
    margin: 0 0 8px;
    color: var(--text-primary, #fff);
  }

  .energy-picker-container p {
    margin: 0 0 24px;
    color: var(--text-muted, #888);
  }

  .energy-options {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
  }

  .energy-option {
    flex: 1;
    padding: 20px;
    background: var(--bg-tertiary, #0a0a15);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .energy-option:hover {
    border-color: var(--primary, #8b5cf6);
    transform: translateY(-2px);
  }

  .energy-icon { font-size: 24px; }
  .energy-label { font-weight: 600; color: var(--text-primary, #fff); }
  .energy-desc { font-size: 12px; color: var(--text-muted, #888); }

  .energy-cancel {
    background: transparent;
    border: none;
    color: var(--text-muted, #888);
    cursor: pointer;
    padding: 8px 16px;
  }

  /* Transition Helper */
  #transition-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(15px);
  }

  .transition-container {
    background: var(--bg-secondary, #1a1a2e);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
    border-radius: 16px;
    padding: 32px;
    max-width: 400px;
    text-align: center;
  }

  .transition-from, .transition-to {
    padding: 16px;
    background: var(--bg-tertiary, #0a0a15);
    border-radius: 8px;
    margin: 12px 0;
  }

  .transition-label {
    font-size: 11px;
    color: var(--text-muted, #888);
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .transition-task {
    color: var(--text-primary, #fff);
    font-weight: 500;
  }

  .transition-arrow {
    font-size: 24px;
    color: var(--primary, #8b5cf6);
    margin: 8px 0;
  }

  .transition-checklist {
    text-align: left;
    margin: 20px 0;
  }

  .transition-check {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    color: var(--text-secondary, #aaa);
    cursor: pointer;
  }

  .transition-check input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  .transition-tip {
    margin-top: 20px;
    padding: 12px;
    background: rgba(139, 92, 246, 0.1);
    border-radius: 8px;
    font-size: 12px;
    color: var(--text-muted, #888);
  }

  /* Panic Mode */
  #panic-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }

  .panic-container {
    background: var(--bg-secondary, #1a1a2e);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
    border-radius: 16px;
    padding: 32px;
    max-width: 450px;
    text-align: center;
  }

  .panic-header h2 {
    color: var(--text-primary, #fff);
    margin: 0 0 8px;
  }

  .panic-header p {
    color: var(--text-muted, #888);
    margin: 0 0 24px;
  }

  .panic-step {
    display: none;
    margin: 24px 0;
  }

  .panic-step.active {
    display: block;
  }

  .panic-step h3 {
    color: var(--text-primary, #fff);
    margin: 0 0 12px;
  }

  .panic-step p {
    color: var(--text-secondary, #aaa);
    margin: 0 0 16px;
  }

  .panic-step textarea, .panic-step input {
    width: 100%;
    padding: 12px;
    background: var(--bg-tertiary, #0a0a15);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
    border-radius: 8px;
    color: var(--text-primary, #fff);
    font-size: 14px;
    margin-bottom: 16px;
  }

  .panic-step textarea {
    min-height: 100px;
    resize: vertical;
  }

  .breath-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: var(--primary, #8b5cf6);
    margin: 20px auto;
    opacity: 0.3;
  }

  .breath-circle.breathing {
    animation: breathe 4s ease-in-out infinite;
  }

  @keyframes breathe {
    0%, 100% { transform: scale(0.8); opacity: 0.3; }
    50% { transform: scale(1.2); opacity: 0.8; }
  }

  .panic-next, .panic-exit {
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .panic-next {
    background: var(--primary, #8b5cf6);
    border: none;
    color: white;
  }

  .panic-exit {
    background: transparent;
    border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
    color: var(--text-muted, #888);
    margin-top: 24px;
  }

  /* Quick Capture */
  #quick-capture-input {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 20vh;
    z-index: 10000;
  }

  .capture-container {
    display: flex;
    gap: 8px;
    background: var(--bg-secondary, #1a1a2e);
    padding: 8px;
    border-radius: 12px;
    border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }

  .capture-container input {
    width: 300px;
    padding: 12px 16px;
    background: transparent;
    border: none;
    color: var(--text-primary, #fff);
    font-size: 16px;
  }

  .capture-container input:focus {
    outline: none;
  }

  .capture-btn {
    padding: 12px 20px;
    background: var(--primary, #8b5cf6);
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
  }

  .capture-toast {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--bg-secondary, #1a1a2e);
    border: 1px solid var(--success, #10b981);
    padding: 12px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    opacity: 0;
    transition: all 0.3s;
    z-index: 10001;
  }

  .capture-toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .capture-icon { color: var(--success, #10b981); }
  .capture-text { color: var(--text-secondary, #aaa); font-size: 14px; }

  /* Social Scripts */
  #social-scripts-picker {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(10px);
  }

  .scripts-container {
    background: var(--bg-secondary, #1a1a2e);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
    border-radius: 16px;
    padding: 24px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
  }

  .scripts-header h3 {
    margin: 0 0 8px;
    color: var(--text-primary, #fff);
  }

  .scripts-header p {
    margin: 0 0 20px;
    color: var(--text-muted, #888);
    font-size: 14px;
  }

  .scripts-categories {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .script-category {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    background: var(--bg-tertiary, #0a0a15);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .script-category:hover {
    border-color: var(--primary, #8b5cf6);
  }

  .script-cat-name {
    color: var(--text-primary, #fff);
    font-weight: 500;
  }

  .script-cat-desc {
    color: var(--text-muted, #888);
    font-size: 12px;
    margin-top: 4px;
  }

  .scripts-templates h4 {
    color: var(--text-primary, #fff);
    margin: 20px 0 12px;
  }

  .template-item {
    padding: 16px;
    background: var(--bg-tertiary, #0a0a15);
    border-radius: 8px;
    margin-bottom: 8px;
  }

  .template-item p {
    color: var(--text-secondary, #aaa);
    margin: 0 0 12px;
    font-size: 14px;
    line-height: 1.5;
  }

  .template-use {
    padding: 6px 12px;
    background: var(--primary, #8b5cf6);
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 12px;
    cursor: pointer;
  }

  .custom-template {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--glass-border, rgba(255,255,255,0.1));
  }

  .custom-template p {
    color: var(--text-secondary, #aaa);
    margin: 0 0 12px;
    font-size: 14px;
  }

  .custom-template textarea {
    width: 100%;
    padding: 12px;
    background: var(--bg-tertiary, #0a0a15);
    border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
    border-radius: 8px;
    color: var(--text-primary, #fff);
    font-size: 14px;
    min-height: 80px;
    margin-bottom: 12px;
  }

  .template-generate {
    padding: 10px 20px;
    background: var(--primary, #8b5cf6);
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
  }

  .scripts-close {
    width: 100%;
    margin-top: 20px;
    padding: 12px;
    background: transparent;
    border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
    border-radius: 8px;
    color: var(--text-muted, #888);
    cursor: pointer;
  }

  .script-toast {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--bg-secondary, #1a1a2e);
    border: 1px solid var(--success, #10b981);
    padding: 12px 20px;
    border-radius: 8px;
    color: var(--text-secondary, #aaa);
    font-size: 14px;
    opacity: 0;
    transition: all 0.3s;
    z-index: 10001;
  }

  .script-toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  /* Transition buttons */
  .transition-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 20px;
  }

  .transition-btn {
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .transition-btn.secondary {
    background: transparent;
    border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
    color: var(--text-secondary, #aaa);
  }

  .transition-btn.primary {
    background: var(--primary, #8b5cf6);
    border: none;
    color: white;
  }
`;

document.head.appendChild(quickToolsStyles);

// ============================================
// INITIALIZE ALL QUICK TOOLS
// ============================================

window.brainDump = new BrainDump();
window.energyMatcher = new EnergyMatcher();
window.transitionHelper = new TransitionHelper();
window.panicMode = new PanicMode();
window.quickCapture = new QuickCapture();
window.socialScripts = new SocialScripts();

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
  // Cmd/Ctrl + Shift + B = Brain Dump
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'b') {
    e.preventDefault();
    window.brainDump.open();
  }

  // Cmd/Ctrl + Shift + E = Energy Picker
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'e') {
    e.preventDefault();
    window.energyMatcher.showPicker();
  }

  // Cmd/Ctrl + Shift + C = Quick Capture
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'c') {
    e.preventDefault();
    window.quickCapture.showInput();
  }

  // Cmd/Ctrl + Shift + P = Panic Mode
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'p') {
    e.preventDefault();
    window.panicMode.activate();
  }

  // Cmd/Ctrl + Shift + S = Social Scripts
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 's') {
    e.preventDefault();
    window.socialScripts.showPicker();
  }
});

console.log('⟡ Quick Tools loaded — Brain Dump (⌘⇧B), Energy (⌘⇧E), Capture (⌘⇧C), Panic (⌘⇧P), Scripts (⌘⇧S)');
