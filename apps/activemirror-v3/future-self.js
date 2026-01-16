/**
 * ⟡ FUTURE SELF DIALOGUE — Wisdom From Tomorrow
 *
 * RECURSION 3: Time-shifted perspective on your life
 *
 * The insight: We often know what we should do, but can't access
 * that wisdom in the moment. Your "future self" — the you who has
 * already worked through this — holds the answer.
 *
 * This system creates a dialogue between:
 * - Present You (confused, stuck, emotional)
 * - Future You (wise, compassionate, experienced)
 *
 * How it works:
 * 1. Learns your patterns, values, and how you talk when clear-headed
 * 2. When you're stuck, simulates what "wise you" would say
 * 3. Uses your past breakthroughs as training data
 * 4. Creates a genuine conversation with your best self
 *
 * This isn't generic advice — it's YOUR voice, YOUR wisdom, YOUR patterns.
 */

// ============================================
// FUTURE SELF SYSTEM
// ============================================

class FutureSelf {
  constructor() {
    this.wisdomArchive = this.loadWisdomArchive();
    this.valuesMap = this.loadValues();
    this.voicePatterns = this.loadVoicePatterns();
    this.breakthroughs = this.loadBreakthroughs();

    this.setupDialogueCapture();
  }

  loadWisdomArchive() {
    const saved = localStorage.getItem('wisdom_archive');
    return saved ? JSON.parse(saved) : [];
  }

  saveWisdomArchive() {
    localStorage.setItem('wisdom_archive', JSON.stringify(this.wisdomArchive));
  }

  loadValues() {
    const saved = localStorage.getItem('core_values');
    return saved ? JSON.parse(saved) : this.getDefaultValues();
  }

  getDefaultValues() {
    return {
      stated: [], // User explicitly stated these
      observed: [], // Inferred from behavior
      conflicts: [] // Values that seem to conflict
    };
  }

  loadVoicePatterns() {
    // How the user talks when they're being wise
    const saved = localStorage.getItem('voice_patterns');
    return saved ? JSON.parse(saved) : {
      phrases: [],
      tone: 'compassionate',
      style: 'direct'
    };
  }

  loadBreakthroughs() {
    // Past moments of clarity
    const saved = localStorage.getItem('breakthroughs');
    return saved ? JSON.parse(saved) : [];
  }

  // ============================================
  // CAPTURING WISDOM
  // ============================================

  setupDialogueCapture() {
    // Listen for reflective moments to capture wisdom
    window.addEventListener('message-sent', (e) => {
      this.analyzeForWisdom(e.detail);
    });

    // Listen for breakthrough moments
    window.addEventListener('breakthrough-flagged', (e) => {
      this.recordBreakthrough(e.detail);
    });
  }

  analyzeForWisdom(message) {
    // Detect when user is being wise/reflective
    const wisdomIndicators = [
      'i realized',
      'the truth is',
      'what matters is',
      'i need to remember',
      'future me',
      'looking back',
      'the pattern is',
      'what i really want',
      'i\'ve learned',
      'the key insight'
    ];

    const lower = message.text.toLowerCase();
    const isWisdom = wisdomIndicators.some(indicator => lower.includes(indicator));

    if (isWisdom) {
      this.captureWisdom({
        text: message.text,
        context: message.context,
        timestamp: Date.now()
      });
    }
  }

  captureWisdom(wisdom) {
    // Extract the core insight
    this.wisdomArchive.push({
      ...wisdom,
      id: this.generateId(),
      tags: this.extractTags(wisdom.text),
      emotionalContext: this.getCurrentEmotionalContext()
    });

    this.saveWisdomArchive();
    this.updateVoicePatterns(wisdom.text);

    console.log('⟡ Wisdom captured:', wisdom.text.slice(0, 50) + '...');
  }

  extractTags(text) {
    // Simple tag extraction
    const tagPatterns = {
      'productivity': /work|task|focus|done|accomplish/i,
      'relationships': /friend|family|partner|people|love/i,
      'health': /health|energy|sleep|eat|body/i,
      'emotions': /feel|emotion|sad|happy|anxious|calm/i,
      'identity': /i am|who i|myself|being/i,
      'purpose': /meaning|purpose|why|matter|important/i,
      'growth': /learn|grow|better|improve|change/i,
      'decisions': /decide|choice|option|should/i
    };

    return Object.entries(tagPatterns)
      .filter(([tag, pattern]) => pattern.test(text))
      .map(([tag]) => tag);
  }

  getCurrentEmotionalContext() {
    if (window.quantumSelf) {
      return window.quantumSelf.currentState;
    }
    return { emotional: 50 };
  }

  updateVoicePatterns(text) {
    // Learn how user talks when wise
    const phrases = text.match(/[^.!?]+[.!?]+/g) || [];
    this.voicePatterns.phrases.push(...phrases.slice(0, 3));

    // Keep last 50 phrases
    if (this.voicePatterns.phrases.length > 50) {
      this.voicePatterns.phrases = this.voicePatterns.phrases.slice(-50);
    }

    localStorage.setItem('voice_patterns', JSON.stringify(this.voicePatterns));
  }

  recordBreakthrough(detail) {
    this.breakthroughs.push({
      id: this.generateId(),
      timestamp: Date.now(),
      situation: detail.situation,
      insight: detail.insight,
      emotionalBefore: detail.before,
      emotionalAfter: detail.after
    });

    localStorage.setItem('breakthroughs', JSON.stringify(this.breakthroughs));
  }

  // ============================================
  // GENERATING FUTURE SELF RESPONSE
  // ============================================

  async consultFutureSelf(currentSituation) {
    // This is where the magic happens
    // Generate what "wise you" would say to "present you"

    const context = {
      situation: currentSituation,
      relevantWisdom: this.findRelevantWisdom(currentSituation),
      relevantBreakthroughs: this.findRelevantBreakthroughs(currentSituation),
      values: this.valuesMap,
      voicePatterns: this.voicePatterns,
      currentState: this.getCurrentEmotionalContext()
    };

    // In production, this would use the AI with specialized prompt
    // For now, use template-based generation
    return this.generateFutureSelfResponse(context);
  }

  findRelevantWisdom(situation) {
    // Find past wisdom that applies to current situation
    const situationTags = this.extractTags(situation);

    return this.wisdomArchive
      .filter(w => w.tags.some(tag => situationTags.includes(tag)))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }

  findRelevantBreakthroughs(situation) {
    // Find similar past situations where user had breakthrough
    return this.breakthroughs
      .filter(b => this.similarSituation(b.situation, situation))
      .slice(0, 3);
  }

  similarSituation(past, current) {
    const pastTags = this.extractTags(past);
    const currentTags = this.extractTags(current);
    return pastTags.some(tag => currentTags.includes(tag));
  }

  generateFutureSelfResponse(context) {
    // Template-based generation (would be AI in production)
    const { situation, relevantWisdom, relevantBreakthroughs, currentState } = context;

    let response = {
      greeting: this.generateGreeting(currentState),
      acknowledgment: this.generateAcknowledgment(situation, currentState),
      wisdom: this.generateWisdomResponse(relevantWisdom, relevantBreakthroughs),
      encouragement: this.generateEncouragement(),
      question: this.generateReflectiveQuestion(situation)
    };

    return response;
  }

  generateGreeting(state) {
    if (state.emotional < 30) {
      return "I see you're having a hard time. I've been there.";
    }
    if (state.emotional < 50) {
      return "You're struggling right now. That's okay.";
    }
    return "Hey. Let's think through this together.";
  }

  generateAcknowledgment(situation, state) {
    const tags = this.extractTags(situation);

    if (tags.includes('decisions')) {
      return "I remember how overwhelming decisions felt. The fear of choosing wrong.";
    }
    if (tags.includes('emotions')) {
      return "These feelings are real and valid. They're also temporary.";
    }
    if (tags.includes('productivity')) {
      return "I know the pressure you're feeling. The weight of unfinished things.";
    }

    return "What you're going through matters. I don't minimize it.";
  }

  generateWisdomResponse(relevantWisdom, breakthroughs) {
    if (relevantWisdom.length > 0) {
      const wisdom = relevantWisdom[0];
      return `You've actually figured this out before. You said: "${wisdom.text}" — that was you, being wise. That wisdom is still true.`;
    }

    if (breakthroughs.length > 0) {
      const breakthrough = breakthroughs[0];
      return `Remember when you were stuck with "${breakthrough.situation.slice(0, 50)}..."? You found your way through. The insight was: "${breakthrough.insight}"`;
    }

    return "You know more than you think you do. The answer is already forming inside you.";
  }

  generateEncouragement() {
    const encouragements = [
      "You've survived every difficult day so far. That's 100% success rate.",
      "The fact that you're asking shows you care. That matters.",
      "You don't have to figure it all out today.",
      "Progress isn't linear. Neither is wisdom.",
      "Trust yourself more. You've earned it.",
      "What feels impossible today will feel different tomorrow.",
      "You're not behind. You're exactly where you need to be to learn this."
    ];

    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  generateReflectiveQuestion(situation) {
    const tags = this.extractTags(situation);

    const questions = {
      decisions: "If you weren't afraid of making the wrong choice, what would you do?",
      relationships: "What would love do here?",
      productivity: "What's the ONE thing that would make everything else easier?",
      emotions: "What would you tell your best friend if they felt this way?",
      identity: "Who do you want to be when you look back on this moment?",
      purpose: "What matters to you more than comfort?",
      growth: "What's this situation trying to teach you?",
      health: "What does your body actually need right now?"
    };

    for (const tag of tags) {
      if (questions[tag]) return questions[tag];
    }

    return "What do you already know that you're not admitting to yourself?";
  }

  // ============================================
  // VALUE DISCOVERY
  // ============================================

  async discoverValues() {
    // Interactive value discovery session
    return new Promise((resolve) => {
      this.showValueDiscovery(resolve);
    });
  }

  showValueDiscovery(resolve) {
    const overlay = document.createElement('div');
    overlay.className = 'value-discovery-overlay';
    overlay.innerHTML = `
      <div class="value-discovery-content">
        <h2>Let's discover what matters to you</h2>
        <p>When your future self looks back, what will they thank you for prioritizing?</p>

        <div class="value-categories">
          <div class="value-category">
            <h3>Core Values</h3>
            <p>Select the values that resonate most deeply:</p>
            <div class="value-options">
              ${this.getValueOptions()}
            </div>
          </div>

          <div class="value-question">
            <h3>In your own words:</h3>
            <p>What matters more to you than being comfortable?</p>
            <textarea id="value-freeform" placeholder="Write what comes to mind..."></textarea>
          </div>
        </div>

        <button class="value-submit">Save My Values</button>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('.value-submit').addEventListener('click', () => {
      const selected = Array.from(overlay.querySelectorAll('.value-option.selected'))
        .map(el => el.dataset.value);
      const freeform = overlay.querySelector('#value-freeform').value;

      this.valuesMap.stated = selected;
      if (freeform) {
        this.valuesMap.stated.push(freeform);
      }

      localStorage.setItem('core_values', JSON.stringify(this.valuesMap));
      overlay.remove();
      resolve(this.valuesMap);
    });

    overlay.querySelectorAll('.value-option').forEach(opt => {
      opt.addEventListener('click', () => opt.classList.toggle('selected'));
    });
  }

  getValueOptions() {
    const values = [
      'authenticity', 'growth', 'connection', 'creativity',
      'freedom', 'security', 'adventure', 'wisdom',
      'compassion', 'excellence', 'integrity', 'impact',
      'health', 'family', 'learning', 'peace'
    ];

    return values.map(v => `
      <button class="value-option" data-value="${v}">${v}</button>
    `).join('');
  }

  // ============================================
  // TIME CAPSULE
  // ============================================

  createTimeCapsule(message, openDate) {
    // Message to future self
    const capsule = {
      id: this.generateId(),
      created: Date.now(),
      openDate: openDate,
      message: message,
      context: this.getCurrentEmotionalContext(),
      opened: false
    };

    const capsules = JSON.parse(localStorage.getItem('time_capsules') || '[]');
    capsules.push(capsule);
    localStorage.setItem('time_capsules', JSON.stringify(capsules));

    return capsule;
  }

  checkTimeCapsules() {
    const capsules = JSON.parse(localStorage.getItem('time_capsules') || '[]');
    const now = Date.now();

    const ready = capsules.filter(c => !c.opened && c.openDate <= now);

    if (ready.length > 0) {
      this.showTimeCapsule(ready[0]);
    }
  }

  showTimeCapsule(capsule) {
    const overlay = document.createElement('div');
    overlay.className = 'time-capsule-overlay';

    const created = new Date(capsule.created);
    const daysAgo = Math.floor((Date.now() - capsule.created) / (1000 * 60 * 60 * 24));

    overlay.innerHTML = `
      <div class="time-capsule-content">
        <div class="capsule-header">
          <span class="capsule-icon">💌</span>
          <h2>A message from Past You</h2>
          <p class="capsule-date">Written ${daysAgo} days ago, on ${created.toLocaleDateString()}</p>
        </div>

        <div class="capsule-message">
          <p>${capsule.message}</p>
        </div>

        <div class="capsule-context">
          <p>When you wrote this, your emotional state was: ${capsule.context.emotional || 50}%</p>
        </div>

        <div class="capsule-actions">
          <button class="capsule-reflect">Write back to Past You</button>
          <button class="capsule-close">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('.capsule-close').addEventListener('click', () => {
      this.markCapsuleOpened(capsule.id);
      overlay.remove();
    });

    overlay.querySelector('.capsule-reflect').addEventListener('click', () => {
      this.markCapsuleOpened(capsule.id);
      overlay.remove();
      this.showReflectionPrompt(capsule);
    });
  }

  markCapsuleOpened(id) {
    const capsules = JSON.parse(localStorage.getItem('time_capsules') || '[]');
    const updated = capsules.map(c =>
      c.id === id ? { ...c, opened: true } : c
    );
    localStorage.setItem('time_capsules', JSON.stringify(updated));
  }

  showReflectionPrompt(originalCapsule) {
    // Prompt user to reflect on how things have changed
    const overlay = document.createElement('div');
    overlay.className = 'reflection-overlay';
    overlay.innerHTML = `
      <div class="reflection-content">
        <h2>Reflect on Your Journey</h2>
        <p>Past You wrote: "${originalCapsule.message.slice(0, 100)}..."</p>

        <div class="reflection-questions">
          <div class="rq">
            <label>How has your situation changed?</label>
            <textarea id="reflect-change"></textarea>
          </div>
          <div class="rq">
            <label>What would you tell Past You now?</label>
            <textarea id="reflect-advice"></textarea>
          </div>
        </div>

        <button class="reflection-save">Save Reflection</button>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('.reflection-save').addEventListener('click', () => {
      const change = overlay.querySelector('#reflect-change').value;
      const advice = overlay.querySelector('#reflect-advice').value;

      if (change || advice) {
        this.captureWisdom({
          text: advice,
          context: { type: 'time_capsule_reflection', originalId: originalCapsule.id },
          timestamp: Date.now()
        });
      }

      overlay.remove();
    });
  }

  generateId() {
    return 'fs_' + Math.random().toString(36).substr(2, 9);
  }
}

// ============================================
// FUTURE SELF UI
// ============================================

class FutureSelfUI {
  constructor(futureSelf) {
    this.fs = futureSelf;
    this.render();
  }

  render() {
    const btn = document.createElement('button');
    btn.className = 'future-self-btn';
    btn.innerHTML = `
      <span class="fs-icon">🔮</span>
      <span class="fs-label">Ask Future You</span>
    `;
    btn.title = 'Consult your future self';

    btn.addEventListener('click', () => this.showDialogue());

    // Add to chat interface area
    const chatContainer = document.querySelector('.chat-container') ||
                          document.querySelector('#app-container') ||
                          document.body;
    chatContainer.appendChild(btn);
  }

  async showDialogue() {
    const overlay = document.createElement('div');
    overlay.className = 'future-self-overlay';
    overlay.innerHTML = `
      <div class="future-self-dialogue">
        <div class="dialogue-header">
          <div class="future-avatar">
            <span class="avatar-glow"></span>
            <span class="avatar-icon">🌟</span>
          </div>
          <div class="future-intro">
            <h2>Future You</h2>
            <p>The version of you who has already figured this out</p>
          </div>
          <button class="close-dialogue">×</button>
        </div>

        <div class="dialogue-area">
          <div class="dialogue-prompt">
            <p>What are you struggling with right now?</p>
            <textarea id="present-struggle" placeholder="I'm feeling... / I can't decide... / I'm stuck on..."></textarea>
            <button class="ask-future">Ask Future You</button>
          </div>
          <div class="dialogue-response hidden">
            <div class="response-loading">
              <span class="loading-dot"></span>
              <span class="loading-text">Future You is reflecting...</span>
            </div>
            <div class="response-content hidden"></div>
          </div>
        </div>

        <div class="dialogue-footer">
          <button class="time-capsule-btn">📬 Write to Future You</button>
          <button class="values-btn">💎 Discover Your Values</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Close button
    overlay.querySelector('.close-dialogue').addEventListener('click', () => {
      overlay.remove();
    });

    // Ask Future Self
    overlay.querySelector('.ask-future').addEventListener('click', async () => {
      const struggle = overlay.querySelector('#present-struggle').value;
      if (!struggle.trim()) return;

      overlay.querySelector('.dialogue-prompt').classList.add('hidden');
      overlay.querySelector('.dialogue-response').classList.remove('hidden');

      // Simulate thinking time
      await new Promise(r => setTimeout(r, 2000));

      const response = await this.fs.consultFutureSelf(struggle);
      this.displayResponse(response, overlay);
    });

    // Time capsule
    overlay.querySelector('.time-capsule-btn').addEventListener('click', () => {
      overlay.remove();
      this.showTimeCapsuleCreator();
    });

    // Values discovery
    overlay.querySelector('.values-btn').addEventListener('click', () => {
      overlay.remove();
      this.fs.discoverValues();
    });
  }

  displayResponse(response, overlay) {
    const loadingEl = overlay.querySelector('.response-loading');
    const contentEl = overlay.querySelector('.response-content');

    loadingEl.classList.add('hidden');
    contentEl.classList.remove('hidden');

    contentEl.innerHTML = `
      <div class="fs-greeting">${response.greeting}</div>
      <div class="fs-acknowledgment">${response.acknowledgment}</div>
      <div class="fs-wisdom">${response.wisdom}</div>
      <div class="fs-encouragement">${response.encouragement}</div>
      <div class="fs-question">
        <p class="question-text">${response.question}</p>
        <textarea class="question-answer" placeholder="Let yourself answer..."></textarea>
      </div>
      <div class="fs-actions">
        <button class="save-reflection">Save This Reflection</button>
        <button class="ask-again">Ask About Something Else</button>
      </div>
    `;

    contentEl.querySelector('.save-reflection').addEventListener('click', () => {
      const answer = contentEl.querySelector('.question-answer').value;
      if (answer) {
        this.fs.captureWisdom({
          text: answer,
          context: { type: 'future_self_dialogue', question: response.question }
        });

        // Show saved confirmation
        const btn = contentEl.querySelector('.save-reflection');
        btn.textContent = '✓ Saved';
        btn.disabled = true;
      }
    });

    contentEl.querySelector('.ask-again').addEventListener('click', () => {
      overlay.querySelector('.dialogue-prompt').classList.remove('hidden');
      overlay.querySelector('.dialogue-response').classList.add('hidden');
      overlay.querySelector('#present-struggle').value = '';
    });
  }

  showTimeCapsuleCreator() {
    const overlay = document.createElement('div');
    overlay.className = 'time-capsule-creator';
    overlay.innerHTML = `
      <div class="capsule-creator-content">
        <h2>📬 Write to Future You</h2>
        <p>What do you want to tell yourself in the future?</p>

        <textarea id="capsule-message" placeholder="Dear Future Me..."></textarea>

        <div class="capsule-timing">
          <label>Open this capsule in:</label>
          <select id="capsule-delay">
            <option value="7">1 week</option>
            <option value="30" selected>1 month</option>
            <option value="90">3 months</option>
            <option value="180">6 months</option>
            <option value="365">1 year</option>
          </select>
        </div>

        <div class="capsule-actions">
          <button class="create-capsule">Seal Time Capsule</button>
          <button class="cancel-capsule">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('.create-capsule').addEventListener('click', () => {
      const message = overlay.querySelector('#capsule-message').value;
      const days = parseInt(overlay.querySelector('#capsule-delay').value);

      if (message.trim()) {
        const openDate = Date.now() + (days * 24 * 60 * 60 * 1000);
        this.fs.createTimeCapsule(message, openDate);

        overlay.innerHTML = `
          <div class="capsule-created">
            <span class="capsule-icon">📬</span>
            <h2>Time Capsule Sealed</h2>
            <p>Your message will be delivered on ${new Date(openDate).toLocaleDateString()}</p>
            <button class="close-capsule">Close</button>
          </div>
        `;

        overlay.querySelector('.close-capsule').addEventListener('click', () => {
          overlay.remove();
        });
      }
    });

    overlay.querySelector('.cancel-capsule').addEventListener('click', () => {
      overlay.remove();
    });
  }
}

// ============================================
// INITIALIZE
// ============================================

window.FutureSelf = FutureSelf;
window.futureSelf = new FutureSelf();

document.addEventListener('DOMContentLoaded', () => {
  new FutureSelfUI(window.futureSelf);

  // Check for unopened time capsules
  window.futureSelf.checkTimeCapsules();
});

console.log('🔮 Future Self initialized — wisdom from tomorrow, available today');
