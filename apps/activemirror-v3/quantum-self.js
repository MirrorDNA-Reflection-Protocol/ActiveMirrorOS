/**
 * SELF TRACKER — Noticing Patterns Across Your Day
 *
 * Tracks different aspects of how you're doing:
 * - Thinking (focus, clarity)
 * - Feeling (emotions)
 * - Body (energy, physical state)
 * - Time of day (when you work best)
 * - Connection (social needs)
 * - Creative (flow states)
 * - Meaning (what matters to you)
 *
 * This tries to notice patterns like:
 * - When you might be getting tired (not a guarantee, just a heads up)
 * - When you've historically been in flow (so you might want to schedule focus work)
 * - When patterns repeat
 *
 * You know yourself better than any tool. This just offers another perspective.
 */

// ============================================
// SELF TRACKER
// ============================================

class QuantumSelf {
  constructor() {
    this.dimensions = {
      cognitive: new CognitiveDimension(),
      emotional: new EmotionalDimension(),
      physical: new PhysicalDimension(),
      circadian: new CircadianDimension(),
      social: new SocialDimension(),
      creative: new CreativeDimension(),
      meaning: new MeaningDimension()
    };

    this.history = this.loadHistory();
    this.predictions = [];
    this.currentState = this.calculateCurrentState();

    // Start continuous monitoring
    this.startQuantumObservation();
  }

  loadHistory() {
    const saved = localStorage.getItem('quantum_self_history');
    return saved ? JSON.parse(saved) : [];
  }

  saveHistory() {
    // Keep last 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    this.history = this.history.filter(h => h.timestamp > thirtyDaysAgo);
    localStorage.setItem('quantum_self_history', JSON.stringify(this.history));
  }

  calculateCurrentState() {
    const state = {};
    for (const [key, dimension] of Object.entries(this.dimensions)) {
      state[key] = dimension.getCurrentLevel();
    }
    return state;
  }

  startQuantumObservation() {
    // Sample state every 5 minutes
    setInterval(() => {
      this.observe();
    }, 300000);

    // Initial observation
    this.observe();
  }

  observe() {
    const observation = {
      timestamp: Date.now(),
      state: this.calculateCurrentState(),
      context: this.gatherContext()
    };

    this.history.push(observation);
    this.saveHistory();

    // Run predictions
    this.predict();

    // Emit state update
    window.dispatchEvent(new CustomEvent('quantum-state-updated', {
      detail: { state: observation.state, predictions: this.predictions }
    }));
  }

  gatherContext() {
    const now = new Date();
    return {
      dayOfWeek: now.getDay(),
      hourOfDay: now.getHours(),
      isWeekend: now.getDay() === 0 || now.getDay() === 6,
      season: this.getSeason(now),
      moonPhase: this.getMoonPhase(now), // Some people are affected
      weather: null // Could integrate weather API
    };
  }

  getSeason(date) {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  getMoonPhase(date) {
    // Simplified moon phase calculation
    const synodic = 29.53059;
    const known_new = new Date(2000, 0, 6, 18, 14);
    const diff = (date - known_new) / (1000 * 60 * 60 * 24);
    const phase = ((diff % synodic) / synodic) * 100;

    if (phase < 12.5) return 'new';
    if (phase < 25) return 'waxing_crescent';
    if (phase < 37.5) return 'first_quarter';
    if (phase < 50) return 'waxing_gibbous';
    if (phase < 62.5) return 'full';
    if (phase < 75) return 'waning_gibbous';
    if (phase < 87.5) return 'last_quarter';
    return 'waning_crescent';
  }

  predict() {
    this.predictions = [];

    // Crash prediction
    const crashProbability = this.predictCrash();
    if (crashProbability > 0.6) {
      this.predictions.push({
        type: 'crash_warning',
        probability: crashProbability,
        timeframe: this.estimateCrashTime(),
        recommendation: this.getCrashPrevention()
      });
    }

    // Flow prediction
    const flowWindows = this.predictFlowWindows();
    if (flowWindows.length > 0) {
      this.predictions.push({
        type: 'flow_opportunity',
        windows: flowWindows,
        recommendation: 'Schedule your most important work during these times.'
      });
    }

    // Pattern alerts
    const patterns = this.detectPatterns();
    patterns.forEach(pattern => {
      this.predictions.push({
        type: 'pattern_insight',
        pattern: pattern.description,
        confidence: pattern.confidence,
        recommendation: pattern.action
      });
    });
  }

  predictCrash() {
    const state = this.currentState;

    // Multi-factor crash probability
    let probability = 0;

    // Low physical + low emotional = high crash risk
    if (state.physical < 30 && state.emotional < 40) {
      probability += 0.4;
    }

    // Depleted social after high social = crash coming
    if (state.social < 20 && this.recentHighSocial()) {
      probability += 0.3;
    }

    // Time-based patterns from history
    const historicalCrashes = this.findHistoricalCrashes();
    const currentHour = new Date().getHours();
    const crashesAtThisHour = historicalCrashes.filter(c =>
      new Date(c.timestamp).getHours() === currentHour
    ).length;

    if (crashesAtThisHour > 3) {
      probability += 0.2;
    }

    // Cognitive overload
    if (state.cognitive > 80 && state.physical < 50) {
      probability += 0.2;
    }

    return Math.min(1, probability);
  }

  recentHighSocial() {
    const recentHistory = this.history.filter(h =>
      Date.now() - h.timestamp < 86400000 // Last 24 hours
    );
    return recentHistory.some(h => h.state.social > 70);
  }

  findHistoricalCrashes() {
    // Identify crash patterns in history
    return this.history.filter(h => {
      const state = h.state;
      return state.emotional < 20 ||
             state.physical < 15 ||
             (state.cognitive < 20 && state.emotional < 30);
    });
  }

  estimateCrashTime() {
    // Based on current trajectory
    const recentTrend = this.calculateTrend('emotional', 6);

    if (recentTrend < -5) { // Dropping fast
      return '1-2 hours';
    } else if (recentTrend < -2) {
      return '3-4 hours';
    } else {
      return 'later today';
    }
  }

  calculateTrend(dimension, hours) {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    const recent = this.history.filter(h => h.timestamp > cutoff);

    if (recent.length < 2) return 0;

    const first = recent[0].state[dimension];
    const last = recent[recent.length - 1].state[dimension];

    return last - first;
  }

  getCrashPrevention() {
    const state = this.currentState;
    const recommendations = [];

    if (state.physical < 40) {
      recommendations.push('Eat something with protein');
      recommendations.push('Drink water');
      recommendations.push('Take a 10-minute walk');
    }

    if (state.emotional < 40) {
      recommendations.push('Talk to someone you trust');
      recommendations.push('Do something that usually makes you smile');
    }

    if (state.social < 30 && this.recentHighSocial()) {
      recommendations.push('Cancel non-essential social obligations');
      recommendations.push('Give yourself permission to rest');
    }

    return recommendations.length > 0 ? recommendations : ['Take a break. You\'ve earned it.'];
  }

  predictFlowWindows() {
    // Analyze historical flow states
    const flowStates = this.history.filter(h => {
      const s = h.state;
      return s.cognitive > 60 && s.creative > 70 && s.physical > 50;
    });

    // Group by time of day
    const hourCounts = new Array(24).fill(0);
    flowStates.forEach(f => {
      const hour = new Date(f.timestamp).getHours();
      hourCounts[hour]++;
    });

    // Find peak hours
    const windows = [];
    let maxCount = Math.max(...hourCounts);

    hourCounts.forEach((count, hour) => {
      if (count >= maxCount * 0.7 && count > 2) {
        windows.push({
          hour,
          label: this.formatHour(hour),
          likelihood: count / maxCount
        });
      }
    });

    return windows;
  }

  formatHour(hour) {
    if (hour === 0) return '12am';
    if (hour < 12) return `${hour}am`;
    if (hour === 12) return '12pm';
    return `${hour - 12}pm`;
  }

  detectPatterns() {
    const patterns = [];

    // Monday pattern
    const mondayStates = this.history.filter(h =>
      new Date(h.timestamp).getDay() === 1
    );
    if (mondayStates.length >= 4) {
      const avgMondayEmotional = mondayStates.reduce((sum, h) =>
        sum + h.state.emotional, 0) / mondayStates.length;

      if (avgMondayEmotional < 40) {
        patterns.push({
          description: 'You tend to feel low on Mondays',
          confidence: 0.8,
          action: 'Consider scheduling lighter work on Mondays or starting with something you enjoy.'
        });
      }
    }

    // Post-creative crash
    const creativeHighs = this.history.filter(h => h.state.creative > 80);
    const postCreativeCrashes = creativeHighs.filter(high => {
      const followUp = this.history.find(h =>
        h.timestamp > high.timestamp &&
        h.timestamp < high.timestamp + 86400000 &&
        h.state.emotional < 30
      );
      return followUp;
    });

    if (postCreativeCrashes.length >= 2) {
      patterns.push({
        description: 'You often crash emotionally after creative highs',
        confidence: 0.7,
        action: 'Plan recovery time after intense creative work. It\'s not a bug, it\'s a feature of creative minds.'
      });
    }

    // Evening second wind
    const eveningStates = this.history.filter(h => {
      const hour = new Date(h.timestamp).getHours();
      return hour >= 20 && hour <= 23;
    });
    const eveningHighCognitive = eveningStates.filter(h => h.state.cognitive > 70);

    if (eveningHighCognitive.length / eveningStates.length > 0.5) {
      patterns.push({
        description: 'You get a cognitive second wind in the evening',
        confidence: 0.75,
        action: 'Consider saving complex thinking tasks for evening if your schedule allows.'
      });
    }

    return patterns;
  }

  // Get overall wellness score
  getWellnessScore() {
    const state = this.currentState;
    const weights = {
      physical: 0.25,
      emotional: 0.25,
      cognitive: 0.15,
      social: 0.15,
      creative: 0.1,
      meaning: 0.1
    };

    let score = 0;
    for (const [key, weight] of Object.entries(weights)) {
      score += (state[key] || 50) * weight;
    }

    return Math.round(score);
  }

  // Get personalized daily guidance
  getDailyGuidance() {
    const score = this.getWellnessScore();
    const state = this.currentState;
    const predictions = this.predictions;

    const guidance = {
      overall: score,
      greeting: this.getTimeAppropriateGreeting(),
      focus: this.determineDayFocus(),
      warnings: predictions.filter(p => p.type === 'crash_warning'),
      opportunities: predictions.filter(p => p.type === 'flow_opportunity'),
      insights: predictions.filter(p => p.type === 'pattern_insight'),
      recommendations: this.getTopRecommendations()
    };

    return guidance;
  }

  getTimeAppropriateGreeting() {
    const hour = new Date().getHours();
    const score = this.getWellnessScore();

    let timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    if (score > 70) {
      return `${timeGreeting}. You're in good shape today.`;
    } else if (score > 50) {
      return `${timeGreeting}. You're doing okay. Let's pace ourselves.`;
    } else {
      return `${timeGreeting}. Today might be harder. I've got your back.`;
    }
  }

  determineDayFocus() {
    const state = this.currentState;

    if (state.cognitive > 70 && state.creative > 60) {
      return 'Deep work day — tackle your hardest problems';
    }
    if (state.social > 60 && state.emotional > 60) {
      return 'Connection day — great for meetings and collaboration';
    }
    if (state.physical > 70 && state.cognitive < 50) {
      return 'Action day — physical tasks, admin, organization';
    }
    if (state.creative > 70) {
      return 'Creative day — ideation, writing, design';
    }
    if (state.meaning > 70) {
      return 'Purpose day — strategic thinking, long-term planning';
    }

    return 'Maintenance day — take care of basics, no pressure';
  }

  getTopRecommendations() {
    const state = this.currentState;
    const recs = [];

    // Physical first
    if (state.physical < 40) {
      recs.push({ priority: 1, text: 'Fuel your body — you\'re running low', type: 'physical' });
    }

    // Emotional next
    if (state.emotional < 40) {
      recs.push({ priority: 2, text: 'Emotional support needed — connect or rest', type: 'emotional' });
    }

    // Social depletion
    if (state.social < 30) {
      recs.push({ priority: 3, text: 'Protect your solitude today', type: 'social' });
    }

    // Creative overflow
    if (state.creative > 80) {
      recs.push({ priority: 4, text: 'Capture your ideas now — you\'re in creative overflow', type: 'creative' });
    }

    return recs.sort((a, b) => a.priority - b.priority).slice(0, 3);
  }
}

// ============================================
// DIMENSION CLASSES
// ============================================

class CognitiveDimension {
  getCurrentLevel() {
    // This would integrate with Cognitive Bridge
    if (window.cognitiveBridge?.bridge) {
      const focus = window.cognitiveBridge.bridge.focusScore || 50;
      return focus;
    }

    // Fallback: time-based heuristic
    const hour = new Date().getHours();
    // Most people peak cognitively 2-4 hours after waking
    if (hour >= 9 && hour <= 12) return 75;
    if (hour >= 14 && hour <= 16) return 60; // Post-lunch dip
    if (hour >= 20 && hour <= 23) return 65; // Evening second wind
    return 50;
  }
}

class EmotionalDimension {
  getCurrentLevel() {
    // Would integrate with sentiment analysis of typed text
    // and explicit mood tracking
    const saved = localStorage.getItem('emotional_level');
    return saved ? parseInt(saved) : 50;
  }

  setLevel(level) {
    localStorage.setItem('emotional_level', level.toString());
    localStorage.setItem('emotional_timestamp', Date.now().toString());
  }
}

class PhysicalDimension {
  getCurrentLevel() {
    // Would integrate with health APIs, sleep tracking
    // For now: time-based + last meal tracking
    const lastMeal = parseInt(localStorage.getItem('last_meal_time') || '0');
    const hoursSinceMeal = (Date.now() - lastMeal) / (1000 * 60 * 60);

    let level = 70;

    if (hoursSinceMeal > 4) level -= 20;
    if (hoursSinceMeal > 6) level -= 20;

    // Sleep factor (simplified)
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) level -= 15;

    return Math.max(10, Math.min(100, level));
  }

  recordMeal() {
    localStorage.setItem('last_meal_time', Date.now().toString());
  }
}

class CircadianDimension {
  getCurrentLevel() {
    // Chronotype-aware energy levels
    const hour = new Date().getHours();
    const chronotype = localStorage.getItem('chronotype') || 'intermediate';

    const curves = {
      early_bird: { peak: 9, trough: 15 },
      night_owl: { peak: 21, trough: 9 },
      intermediate: { peak: 11, trough: 14 }
    };

    const curve = curves[chronotype];

    // Simple sine-wave approximation
    const hoursFromPeak = Math.abs(hour - curve.peak);
    const level = 80 - (hoursFromPeak * 5);

    return Math.max(20, Math.min(100, level));
  }
}

class SocialDimension {
  getCurrentLevel() {
    // Based on social interaction tracking
    const socialLog = JSON.parse(localStorage.getItem('social_log') || '[]');
    const today = new Date().toDateString();
    const todaysInteractions = socialLog.filter(s =>
      new Date(s.timestamp).toDateString() === today
    );

    // Introversion factor
    const introversion = parseInt(localStorage.getItem('introversion') || '50');

    // High introversion = social energy depletes faster
    const depleteRate = introversion / 50;
    const totalDuration = todaysInteractions.reduce((sum, i) => sum + (i.duration || 30), 0);

    let level = 100 - (totalDuration * depleteRate / 10);
    return Math.max(0, Math.min(100, level));
  }

  logInteraction(duration, intensity = 'medium') {
    const log = JSON.parse(localStorage.getItem('social_log') || '[]');
    log.push({ timestamp: Date.now(), duration, intensity });

    // Keep last 7 days
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const filtered = log.filter(l => l.timestamp > weekAgo);

    localStorage.setItem('social_log', JSON.stringify(filtered));
  }
}

class CreativeDimension {
  getCurrentLevel() {
    // Creative energy is highly personal and variable
    // Track through explicit signals and patterns

    const factors = {
      recentCreativeWork: this.recentCreativeActivity(),
      sleepQuality: this.estimateSleepQuality(),
      noveltyExposure: this.recentNovelty(),
      constraints: this.hasGoodConstraints()
    };

    let level = 50;
    level += factors.recentCreativeWork ? 15 : -10;
    level += factors.sleepQuality > 0.6 ? 10 : -5;
    level += factors.noveltyExposure ? 15 : 0;
    level += factors.constraints ? 10 : 0;

    return Math.max(20, Math.min(100, level));
  }

  recentCreativeActivity() {
    const lastCreative = localStorage.getItem('last_creative_session');
    if (!lastCreative) return false;

    const hoursSince = (Date.now() - parseInt(lastCreative)) / (1000 * 60 * 60);
    return hoursSince < 48; // Creative work in last 2 days builds momentum
  }

  estimateSleepQuality() {
    // Would integrate with sleep tracking
    return 0.7; // Placeholder
  }

  recentNovelty() {
    // Exposure to new ideas, places, people
    const noveltyLog = JSON.parse(localStorage.getItem('novelty_log') || '[]');
    const recentNovelty = noveltyLog.filter(n =>
      Date.now() - n.timestamp < 86400000
    );
    return recentNovelty.length > 0;
  }

  hasGoodConstraints() {
    // Creativity flourishes with constraints
    // Check if there's a clear project/goal
    return true; // Placeholder
  }
}

class MeaningDimension {
  getCurrentLevel() {
    // Sense of purpose and alignment
    // This is the hardest to track but most important

    const factors = {
      workingOnImportant: this.isWorkingOnImportantGoal(),
      recentProgress: this.hasRecentProgress(),
      valueAlignment: this.isActingOnValues(),
      contribution: this.recentContribution()
    };

    let level = 40; // Baseline
    level += factors.workingOnImportant ? 20 : 0;
    level += factors.recentProgress ? 15 : 0;
    level += factors.valueAlignment ? 15 : -10;
    level += factors.contribution ? 10 : 0;

    return Math.max(10, Math.min(100, level));
  }

  isWorkingOnImportantGoal() {
    // Check if current activity aligns with stated goals
    const goals = JSON.parse(localStorage.getItem('user_goals') || '[]');
    const activeGoal = goals.find(g => g.status === 'active');
    return activeGoal && activeGoal.lastWorkedOn &&
           (Date.now() - activeGoal.lastWorkedOn) < 86400000;
  }

  hasRecentProgress() {
    const progressLog = JSON.parse(localStorage.getItem('progress_log') || '[]');
    const recent = progressLog.filter(p => Date.now() - p.timestamp < 86400000);
    return recent.length > 0;
  }

  isActingOnValues() {
    // Would compare recent actions against stated values
    return true; // Placeholder
  }

  recentContribution() {
    // Helping others increases meaning
    const contributionLog = JSON.parse(localStorage.getItem('contribution_log') || '[]');
    return contributionLog.some(c => Date.now() - c.timestamp < 86400000);
  }
}

// ============================================
// QUANTUM SELF UI
// ============================================

class QuantumSelfUI {
  constructor(quantumSelf) {
    this.qs = quantumSelf;
    this.render();
    this.listen();
  }

  render() {
    // DISABLED: Floating panel breaks UX. Data integrated into right sidebar's
    // "Sovereignty Score" widget which already shows wellness metrics.
    // The QuantumSelf data is available via window.quantumSelf for other components.
    return;

    const ui = document.createElement('div');
    ui.id = 'quantum-self-ui';
    ui.className = 'quantum-self-panel';
    // Start hidden until user enters the app
    ui.style.display = 'none';
    ui.innerHTML = `
      <div class="qs-toggle" title="Quantum Self">
        <span class="qs-icon">✦</span>
        <span class="qs-score">${this.qs.getWellnessScore()}</span>
      </div>
      <div class="qs-expanded hidden">
        <div class="qs-header">
          <h3>Your Quantum State</h3>
          <span class="qs-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
        <div class="qs-dimensions">
          ${this.renderDimensions()}
        </div>
        <div class="qs-predictions">
          ${this.renderPredictions()}
        </div>
        <div class="qs-guidance">
          ${this.renderGuidance()}
        </div>
      </div>
    `;

    document.body.appendChild(ui);

    // Toggle
    ui.querySelector('.qs-toggle').addEventListener('click', () => {
      ui.querySelector('.qs-expanded').classList.toggle('hidden');
    });
  }

  renderDimensions() {
    const state = this.qs.currentState;
    const dims = [
      { key: 'cognitive', icon: '🧠', label: 'Mind' },
      { key: 'emotional', icon: '💜', label: 'Heart' },
      { key: 'physical', icon: '💪', label: 'Body' },
      { key: 'social', icon: '👥', label: 'Social' },
      { key: 'creative', icon: '✨', label: 'Creative' },
      { key: 'meaning', icon: '🎯', label: 'Purpose' }
    ];

    return dims.map(d => `
      <div class="qs-dim">
        <span class="dim-icon">${d.icon}</span>
        <div class="dim-bar">
          <div class="dim-fill" style="width: ${state[d.key]}%"></div>
        </div>
        <span class="dim-value">${state[d.key]}</span>
      </div>
    `).join('');
  }

  renderPredictions() {
    const predictions = this.qs.predictions;

    if (predictions.length === 0) {
      return '<p class="qs-no-predictions">All clear — no warnings detected</p>';
    }

    return predictions.map(p => {
      if (p.type === 'crash_warning') {
        return `
          <div class="qs-prediction warning">
            <span class="pred-icon">⚠️</span>
            <div class="pred-content">
              <strong>Crash risk: ${Math.round(p.probability * 100)}%</strong>
              <p>Estimated: ${p.timeframe}</p>
              <ul>${p.recommendation.map(r => `<li>${r}</li>`).join('')}</ul>
            </div>
          </div>
        `;
      }
      if (p.type === 'flow_opportunity') {
        return `
          <div class="qs-prediction opportunity">
            <span class="pred-icon">🌊</span>
            <div class="pred-content">
              <strong>Flow windows today</strong>
              <p>${p.windows.map(w => w.label).join(', ')}</p>
            </div>
          </div>
        `;
      }
      if (p.type === 'pattern_insight') {
        return `
          <div class="qs-prediction insight">
            <span class="pred-icon">💡</span>
            <div class="pred-content">
              <strong>${p.pattern}</strong>
              <p>${p.recommendation}</p>
            </div>
          </div>
        `;
      }
      return '';
    }).join('');
  }

  renderGuidance() {
    const guidance = this.qs.getDailyGuidance();

    return `
      <div class="qs-focus">
        <span class="focus-label">Today's Focus:</span>
        <span class="focus-text">${guidance.focus}</span>
      </div>
      ${guidance.recommendations.length > 0 ? `
        <div class="qs-recs">
          ${guidance.recommendations.map(r => `
            <div class="qs-rec ${r.type}">
              ${r.text}
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
  }

  listen() {
    window.addEventListener('quantum-state-updated', () => {
      this.update();
    });
  }

  update() {
    const score = document.querySelector('.qs-score');
    if (score) score.textContent = this.qs.getWellnessScore();

    const dims = document.querySelector('.qs-dimensions');
    if (dims) dims.innerHTML = this.renderDimensions();

    const preds = document.querySelector('.qs-predictions');
    if (preds) preds.innerHTML = this.renderPredictions();

    const guidance = document.querySelector('.qs-guidance');
    if (guidance) guidance.innerHTML = this.renderGuidance();
  }
}

// ============================================
// INITIALIZE
// ============================================

window.QuantumSelf = QuantumSelf;
// Data class instantiated immediately (no UI)
window.quantumSelf = new QuantumSelf();

// DISABLED: Floating UI removed. Data shown in sidebar "Your State" widget instead.
// QuantumSelfUI no longer instantiated.

console.log('✦ Quantum Self initialized — observing all dimensions');
