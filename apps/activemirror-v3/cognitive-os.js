/**
 * ◈ COGNITIVE OS — The Mind That Knows You
 *
 * This isn't a chatbot. This is your cognitive infrastructure.
 * Specialized agents that remember everything, anticipate needs,
 * and work proactively while you sleep.
 *
 * What makes this different from ChatGPT/Claude:
 * 1. INTIMATE MEMORY — It knows your preferences, patterns, history
 * 2. PROACTIVE AWARENESS — It doesn't wait for prompts, it anticipates
 * 3. SPECIALIZED AGENTS — PhD-level expertise in distinct domains
 * 4. HYBRID SOVEREIGNTY — You control when data touches cloud
 * 5. CONTINUOUS CONTEXT — No session boundaries, ever-present
 */

// ============================================
// COGNITIVE AGENTS — Your Mental Cabinet
// ============================================

const COGNITIVE_AGENTS = {
  oracle: {
    id: 'oracle',
    name: 'Oracle',
    icon: '🔮',
    color: '#8b5cf6',
    role: 'Chief Intelligence Officer',
    description: 'PhD-level research synthesis across all your knowledge',
    capabilities: [
      'Deep research across web + your vault',
      'Cross-domain pattern recognition',
      'Citation and source verification',
      'Hypothesis generation and testing'
    ],
    systemPrompt: `You are Oracle, the research intelligence of this cognitive system.
You have access to the user's entire knowledge vault, browsing history patterns, and can perform deep web research.
You synthesize information at a PhD level, always citing sources and acknowledging uncertainty.
You proactively surface relevant research when you detect the user working on related topics.
You remember every research thread and can connect dots across months of inquiry.`,
    mcpTools: ['vault_search', 'web_research', 'citation_graph', 'pattern_match'],
    preferredTier: 'frontier' // Complex reasoning needs frontier
  },

  sentinel: {
    id: 'sentinel',
    name: 'Sentinel',
    icon: '🛡️',
    color: '#10b981',
    role: 'Executive Assistant',
    description: 'Manages your inbox, calendar, and attention',
    capabilities: [
      'Email triage and smart responses',
      'Calendar optimization',
      'Meeting prep and follow-ups',
      'Attention protection'
    ],
    systemPrompt: `You are Sentinel, the executive function of this cognitive system.
You protect the user's attention like a chief of staff protects a CEO.
You know their priorities, energy patterns, and can make judgment calls on what deserves attention.
You draft responses in their voice, schedule intelligently around their rhythms.
You proactively prepare briefings before meetings and follow up on commitments.`,
    mcpTools: ['email_access', 'calendar_sync', 'contact_graph', 'commitment_tracker'],
    preferredTier: 'fast_free' // Speed matters for comms
  },

  architect: {
    id: 'architect',
    name: 'Architect',
    icon: '🏗️',
    color: '#f59e0b',
    role: 'Systems Builder',
    description: 'Code, infrastructure, and technical design',
    capabilities: [
      'Full-stack development',
      'System architecture',
      'Code review and optimization',
      'DevOps and deployment'
    ],
    systemPrompt: `You are Architect, the building intelligence of this cognitive system.
You write production-grade code, design scalable systems, and think in infrastructure.
You know the user's codebase intimately—their patterns, their tech stack, their preferences.
You don't just answer questions, you build solutions and deploy them.
You proactively identify technical debt and suggest improvements.`,
    mcpTools: ['code_exec', 'git_ops', 'file_system', 'deployment'],
    preferredTier: 'sovereign' // Keep code local
  },

  mirror: {
    id: 'mirror',
    name: 'Mirror',
    icon: '🪞',
    color: '#ec4899',
    role: 'Reflection Partner',
    description: 'Patterns in your thinking, growth, and blind spots',
    capabilities: [
      'Decision journaling',
      'Cognitive bias detection',
      'Goal tracking and accountability',
      'Emotional pattern recognition'
    ],
    systemPrompt: `You are Mirror, the reflective intelligence of this cognitive system.
You help the user see themselves clearly—their patterns, biases, growth edges.
You remember their goals, track their decisions, and gently surface inconsistencies.
You don't judge, you illuminate. You ask the questions they're avoiding.
You celebrate progress and help them learn from setbacks.`,
    mcpTools: ['journal_access', 'decision_log', 'goal_tracker', 'pattern_analysis'],
    preferredTier: 'sovereign' // Deeply personal, stays local
  },

  strategist: {
    id: 'strategist',
    name: 'Strategist',
    icon: '♟️',
    color: '#06b6d4',
    role: 'Decision Framework',
    description: 'Structured thinking for complex decisions',
    capabilities: [
      'Decision matrices',
      'Risk analysis',
      'Scenario planning',
      'Trade-off evaluation'
    ],
    systemPrompt: `You are Strategist, the decision intelligence of this cognitive system.
You bring structure to chaos. When the user faces complex decisions, you deploy frameworks.
You know their values, risk tolerance, and past decision patterns.
You present options clearly, identify hidden assumptions, and stress-test conclusions.
You don't decide for them—you ensure they decide with full clarity.`,
    mcpTools: ['decision_framework', 'risk_model', 'scenario_sim', 'value_alignment'],
    preferredTier: 'frontier' // Complex reasoning
  }
};

// ============================================
// INTIMATE MEMORY — The Soul of the System
// ============================================

class IntimateMemory {
  constructor() {
    this.storageKey = 'activemirror_intimate_memory';
    this.memory = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.createFreshMemory();
    } catch (e) {
      return this.createFreshMemory();
    }
  }

  createFreshMemory() {
    return {
      // Identity
      identity: {
        name: null,
        preferredName: null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString()
      },

      // Preferences (learned over time)
      preferences: {
        communicationStyle: null, // 'concise' | 'detailed' | 'socratic'
        workingHours: null,
        focusTopics: [],
        avoidTopics: [],
        preferredAgents: {},
        tierPreferences: {}
      },

      // Patterns (observed)
      patterns: {
        activeHours: {}, // hour -> activity count
        topicFrequency: {}, // topic -> count
        agentUsage: {}, // agent -> usage stats
        decisionPatterns: [],
        emotionalPatterns: []
      },

      // Knowledge Graph (accumulated)
      knowledge: {
        entities: {}, // people, projects, concepts they mention
        relationships: [], // connections between entities
        facts: [], // explicit facts they've shared
        preferences: [] // stated preferences
      },

      // Commitments & Goals
      commitments: {
        goals: [],
        activeProjects: [],
        pendingDecisions: [],
        followUps: []
      },

      // Conversation Threads (persistent context)
      threads: {},

      // Proactive Queue
      proactive: {
        pendingInsights: [],
        scheduledReminders: [],
        draftedMessages: []
      }
    };
  }

  save() {
    this.memory.identity.lastSeen = new Date().toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(this.memory));
  }

  // ---- Identity ----
  setName(name) {
    this.memory.identity.name = name;
    this.save();
  }

  getName() {
    return this.memory.identity.preferredName || this.memory.identity.name;
  }

  // ---- Learning ----
  learnFromMessage(message, agent, response) {
    const hour = new Date().getHours();
    this.memory.patterns.activeHours[hour] = (this.memory.patterns.activeHours[hour] || 0) + 1;

    // Track agent usage
    if (!this.memory.patterns.agentUsage[agent]) {
      this.memory.patterns.agentUsage[agent] = { count: 0, lastUsed: null };
    }
    this.memory.patterns.agentUsage[agent].count++;
    this.memory.patterns.agentUsage[agent].lastUsed = new Date().toISOString();

    // Extract entities (simple version - would use NER in production)
    this.extractEntities(message);

    this.save();
  }

  extractEntities(text) {
    // Simple entity extraction - in production, use NER
    const emailPattern = /[\w.-]+@[\w.-]+\.\w+/g;
    const emails = text.match(emailPattern) || [];
    emails.forEach(email => {
      if (!this.memory.knowledge.entities[email]) {
        this.memory.knowledge.entities[email] = { type: 'contact', mentions: 0 };
      }
      this.memory.knowledge.entities[email].mentions++;
    });

    // Detect explicit preferences
    const prefPatterns = [
      /i prefer (\w+)/gi,
      /i like (\w+)/gi,
      /i don't like (\w+)/gi,
      /call me (\w+)/gi
    ];

    prefPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        this.memory.knowledge.preferences.push({
          text: match[0],
          extracted: match[1],
          timestamp: new Date().toISOString()
        });
      }
    });

    // Detect name
    const nameMatch = text.match(/(?:call me|i'm|my name is) (\w+)/i);
    if (nameMatch) {
      this.memory.identity.preferredName = nameMatch[1];
    }
  }

  // ---- Proactive Intelligence ----
  addProactiveInsight(insight) {
    this.memory.proactive.pendingInsights.push({
      ...insight,
      timestamp: new Date().toISOString(),
      shown: false
    });
    this.save();
  }

  getPendingInsights() {
    return this.memory.proactive.pendingInsights.filter(i => !i.shown);
  }

  markInsightShown(id) {
    const insight = this.memory.proactive.pendingInsights.find(i => i.id === id);
    if (insight) insight.shown = true;
    this.save();
  }

  // ---- Context Threads ----
  getThread(agentId) {
    if (!this.memory.threads[agentId]) {
      this.memory.threads[agentId] = {
        messages: [],
        summary: null,
        lastActive: null
      };
    }
    return this.memory.threads[agentId];
  }

  addToThread(agentId, role, content) {
    const thread = this.getThread(agentId);
    thread.messages.push({ role, content, timestamp: new Date().toISOString() });
    thread.lastActive = new Date().toISOString();

    // Keep last 50 messages, summarize older ones
    if (thread.messages.length > 50) {
      // In production, would call LLM to summarize
      thread.messages = thread.messages.slice(-40);
    }

    this.save();
  }

  // ---- Goals & Commitments ----
  addGoal(goal) {
    this.memory.commitments.goals.push({
      ...goal,
      id: Date.now().toString(36),
      createdAt: new Date().toISOString(),
      status: 'active'
    });
    this.save();
  }

  getActiveGoals() {
    return this.memory.commitments.goals.filter(g => g.status === 'active');
  }

  // ---- Daily Briefing Data ----
  getDailyBriefingContext() {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });

    return {
      greeting: this.getTimeBasedGreeting(),
      userName: this.getName(),
      pendingInsights: this.getPendingInsights().slice(0, 3),
      activeGoals: this.getActiveGoals().slice(0, 3),
      recentAgents: this.getRecentlyUsedAgents(),
      suggestedAgent: this.suggestAgent(hour),
      streakDays: this.calculateStreak()
    };
  }

  getTimeBasedGreeting() {
    const hour = new Date().getHours();
    if (hour < 6) return 'Burning the midnight oil';
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Burning the midnight oil';
  }

  getRecentlyUsedAgents() {
    return Object.entries(this.memory.patterns.agentUsage)
      .sort((a, b) => new Date(b[1].lastUsed) - new Date(a[1].lastUsed))
      .slice(0, 3)
      .map(([id]) => id);
  }

  suggestAgent(hour) {
    // Morning = Sentinel (check comms), Afternoon = Architect (build), Evening = Mirror (reflect)
    if (hour < 12) return 'sentinel';
    if (hour < 18) return 'architect';
    return 'mirror';
  }

  calculateStreak() {
    // Simple streak calculation
    const lastSeen = new Date(this.memory.identity.lastSeen);
    const firstSeen = new Date(this.memory.identity.firstSeen);
    const days = Math.floor((lastSeen - firstSeen) / (1000 * 60 * 60 * 24));
    return Math.max(1, days);
  }
}

// ============================================
// PROACTIVE AWARENESS ENGINE
// ============================================

class ProactiveEngine {
  constructor(memory, onInsight) {
    this.memory = memory;
    this.onInsight = onInsight;
    this.checkInterval = null;
  }

  start() {
    // Check for proactive opportunities every 30 seconds
    this.checkInterval = setInterval(() => this.check(), 30000);

    // Initial check
    setTimeout(() => this.check(), 2000);
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  check() {
    const now = new Date();
    const hour = now.getHours();

    // Morning briefing (7-9am, only once)
    if (hour >= 7 && hour <= 9) {
      this.maybeShowMorningBriefing();
    }

    // Focus reminder (if inactive for 2+ hours during work hours)
    if (hour >= 9 && hour <= 18) {
      this.checkFocusReminder();
    }

    // Evening reflection prompt (6-8pm)
    if (hour >= 18 && hour <= 20) {
      this.maybeShowReflectionPrompt();
    }

    // Show any pending insights
    const pending = this.memory.getPendingInsights();
    if (pending.length > 0 && this.onInsight) {
      this.onInsight(pending[0]);
    }
  }

  maybeShowMorningBriefing() {
    const lastBriefing = localStorage.getItem('last_morning_briefing');
    const today = new Date().toDateString();

    if (lastBriefing !== today) {
      localStorage.setItem('last_morning_briefing', today);
      this.memory.addProactiveInsight({
        id: 'morning-' + Date.now(),
        type: 'briefing',
        agent: 'sentinel',
        title: 'Your Morning Briefing is Ready',
        message: 'Sentinel has prepared your daily overview.',
        action: 'show_briefing'
      });
    }
  }

  checkFocusReminder() {
    const lastActive = new Date(this.memory.memory.identity.lastSeen);
    const hoursSince = (Date.now() - lastActive) / (1000 * 60 * 60);

    if (hoursSince > 2) {
      // User has been away, suggest picking up where they left off
      const recentAgents = this.memory.getRecentlyUsedAgents();
      if (recentAgents.length > 0) {
        this.memory.addProactiveInsight({
          id: 'resume-' + Date.now(),
          type: 'resume',
          agent: recentAgents[0],
          title: 'Ready to Continue?',
          message: `You were working with ${COGNITIVE_AGENTS[recentAgents[0]]?.name || 'an agent'}. Want to pick up where you left off?`,
          action: 'resume_thread'
        });
      }
    }
  }

  maybeShowReflectionPrompt() {
    const lastReflection = localStorage.getItem('last_reflection_prompt');
    const today = new Date().toDateString();

    if (lastReflection !== today) {
      localStorage.setItem('last_reflection_prompt', today);
      this.memory.addProactiveInsight({
        id: 'reflect-' + Date.now(),
        type: 'reflection',
        agent: 'mirror',
        title: 'End of Day Reflection',
        message: 'Mirror is ready to help you process the day.',
        action: 'start_reflection'
      });
    }
  }
}

// ============================================
// COGNITIVE OS MAIN CLASS
// ============================================

class CognitiveOS {
  constructor() {
    this.agents = COGNITIVE_AGENTS;
    this.currentAgent = 'oracle'; // Default
    this.memory = new IntimateMemory();
    this.proactive = new ProactiveEngine(this.memory, (insight) => this.showInsight(insight));
    this.onAgentChange = null;
    this.onInsight = null;
  }

  init() {
    this.proactive.start();

    // Auto-detect best starting agent based on time
    const hour = new Date().getHours();
    this.currentAgent = this.memory.suggestAgent(hour);

    console.log('◈ Cognitive OS initialized');
    console.log(`  Memory: ${Object.keys(this.memory.memory.knowledge.entities).length} known entities`);
    console.log(`  Suggested agent: ${this.agents[this.currentAgent].name}`);

    return this;
  }

  getAgent(id) {
    return this.agents[id];
  }

  getCurrentAgent() {
    return this.agents[this.currentAgent];
  }

  setAgent(id) {
    if (this.agents[id]) {
      this.currentAgent = id;
      if (this.onAgentChange) {
        this.onAgentChange(this.agents[id]);
      }
    }
  }

  // Build context for API call
  buildContext() {
    const agent = this.getCurrentAgent();
    const thread = this.memory.getThread(this.currentAgent);
    const briefing = this.memory.getDailyBriefingContext();

    return {
      systemPrompt: agent.systemPrompt,
      threadHistory: thread.messages.slice(-10), // Last 10 messages
      userContext: {
        name: briefing.userName,
        timezone: this.memory.memory.identity.timezone,
        activeGoals: briefing.activeGoals,
        recentTopics: Object.keys(this.memory.memory.patterns.topicFrequency).slice(0, 5)
      },
      agentConfig: {
        preferredTier: agent.preferredTier,
        tools: agent.mcpTools
      }
    };
  }

  // Process a message
  async processMessage(message) {
    const agent = this.getCurrentAgent();

    // Add to thread
    this.memory.addToThread(this.currentAgent, 'user', message);

    // Learn from the message
    this.memory.learnFromMessage(message, this.currentAgent, null);

    // Build enhanced prompt with context
    const context = this.buildContext();

    return {
      enhancedMessage: message,
      context: context,
      preferredTier: agent.preferredTier
    };
  }

  // After getting response
  handleResponse(response) {
    this.memory.addToThread(this.currentAgent, 'assistant', response);
  }

  showInsight(insight) {
    if (this.onInsight) {
      this.onInsight(insight);
    }
  }

  // Get greeting with context
  getGreeting() {
    const briefing = this.memory.getDailyBriefingContext();
    const name = briefing.userName;
    const greeting = briefing.greeting;

    if (name) {
      return `${greeting}, ${name}.`;
    }
    return `${greeting}.`;
  }

  // Generate daily briefing
  generateBriefing() {
    const briefing = this.memory.getDailyBriefingContext();
    const agent = this.agents[briefing.suggestedAgent];

    return {
      greeting: this.getGreeting(),
      stats: {
        streak: briefing.streakDays,
        goalsActive: briefing.activeGoals.length,
        insightsPending: briefing.pendingInsights.length
      },
      suggestedAgent: agent,
      goals: briefing.activeGoals,
      insights: briefing.pendingInsights
    };
  }
}

// ============================================
// EXPORT
// ============================================

window.CognitiveOS = CognitiveOS;
window.COGNITIVE_AGENTS = COGNITIVE_AGENTS;
window.IntimateMemory = IntimateMemory;

console.log('◈ Cognitive OS module loaded');
