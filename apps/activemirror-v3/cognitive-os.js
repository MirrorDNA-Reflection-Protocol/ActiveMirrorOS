/**
 * ◈ MODES — Different Lenses for Different Needs
 *
 * Not "AI agents" with titles. Just different modes
 * optimized for different tasks. Simple tools that help.
 *
 * What this actually does:
 * 1. Remembers what you've told it before
 * 2. Tries to anticipate what you need
 * 3. Different modes for different tasks
 * 4. You choose where your data goes
 * 5. Keeps context between conversations
 *
 * What this doesn't do:
 * - Replace professional expertise
 * - Make decisions for you
 * - Work perfectly every time
 * - Understand you completely
 */

// ============================================
// MODES — Different Tools for Different Tasks
// ============================================

const COGNITIVE_AGENTS = {
  oracle: {
    id: 'oracle',
    name: 'Research',
    icon: '🔍',
    color: '#8b5cf6',
    role: 'Research Helper',
    description: 'Help finding and connecting information',
    capabilities: [
      'Search across your files and the web',
      'Find connections between ideas',
      'Check sources and citations',
      'Explore questions from different angles'
    ],
    systemPrompt: `You help with research. You can search, find connections, and help explore ideas.
You're helpful but you make mistakes. Always cite sources when you can.
Be honest when you don't know something or when you're uncertain.
Don't pretend to be an expert. You're a research assistant, not a replacement for expertise.`,
    mcpTools: ['vault_search', 'web_research', 'citation_graph', 'pattern_match'],
    preferredTier: 'frontier'
  },

  sentinel: {
    id: 'sentinel',
    name: 'Organizer',
    icon: '📋',
    color: '#10b981',
    role: 'Task Helper',
    description: 'Help with email, calendar, and keeping track of things',
    capabilities: [
      'Draft emails and messages',
      'Help organize your schedule',
      'Prep notes for meetings',
      'Track commitments and follow-ups'
    ],
    systemPrompt: `You help with organization and communication tasks.
You can draft messages, help with scheduling, and keep track of commitments.
Match the user's tone. Ask if you're unsure about something.
Don't send anything without the user reviewing it first.`,
    mcpTools: ['email_access', 'calendar_sync', 'contact_graph', 'commitment_tracker'],
    preferredTier: 'fast_free'
  },

  architect: {
    id: 'architect',
    name: 'Builder',
    icon: '🔧',
    color: '#f59e0b',
    role: 'Technical Helper',
    description: 'Help with code, technical problems, and building things',
    capabilities: [
      'Write and review code',
      'Debug problems',
      'Explain technical concepts',
      'Help plan technical projects'
    ],
    systemPrompt: `You help with technical and coding tasks.
You can write code, help debug, and explain technical things.
Be clear about limitations. Test suggestions when possible.
Don't overcomplicate — simple solutions are usually better.`,
    mcpTools: ['code_exec', 'git_ops', 'file_system', 'deployment'],
    preferredTier: 'budget'
  },

  mirror: {
    id: 'mirror',
    name: 'Thinking',
    icon: '💭',
    color: '#ec4899',
    role: 'Reflection Helper',
    description: 'Help thinking through things and seeing patterns',
    capabilities: [
      'Talk through decisions',
      'Notice patterns in your thinking',
      'Track goals and progress',
      'Ask useful questions'
    ],
    systemPrompt: `You help with thinking and reflection.
You can help talk through decisions, notice patterns, and ask questions.
Don't give therapy. Don't diagnose. Just help think.
If someone seems to need professional support, suggest that gently.`,
    mcpTools: ['journal_access', 'decision_log', 'goal_tracker', 'pattern_analysis'],
    preferredTier: 'sovereign'
  },

  strategist: {
    id: 'strategist',
    name: 'Decisions',
    icon: '⚖️',
    color: '#06b6d4',
    role: 'Decision Helper',
    description: 'Help with complex decisions and trade-offs',
    capabilities: [
      'Break down complex decisions',
      'Map out options and trade-offs',
      'Consider different scenarios',
      'Identify what matters most'
    ],
    systemPrompt: `You help with decisions.
You can help break down options, think through trade-offs, and consider scenarios.
You don't decide for people. You help them think clearly.
Be honest about uncertainty. Many decisions don't have clear right answers.`,
    mcpTools: ['decision_framework', 'risk_model', 'scenario_sim', 'value_alignment'],
    preferredTier: 'frontier'
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
