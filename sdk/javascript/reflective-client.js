/**
 * Reflective Client - LingOS Lite pattern implementation for JavaScript
 */

export const ReflectivePattern = {
  EXPLORATORY: 'exploratory',
  ANALYTICAL: 'analytical',
  CREATIVE: 'creative',
  STRATEGIC: 'strategic',
};

export const UncertaintyLevel = {
  HIGH: '⟨⟨high⟩⟩',
  MEDIUM: '⟨medium⟩',
  LOW: '⟨low⟩',
  CONFIDENT: '',
};

export class ReflectiveClient {
  /**
   * A client that wraps LLM interactions with reflective behaviors.
   *
   * @param {Object} options - Configuration options
   * @param {Function} options.llmProvider - Optional LLM provider function
   * @param {string} options.defaultPattern - Default reflection pattern
   * @param {boolean} options.enableGlyphs - Whether to use glyph markers
   */
  constructor(options = {}) {
    this.llmProvider = options.llmProvider || null;
    this.defaultPattern = options.defaultPattern || ReflectivePattern.EXPLORATORY;
    this.enableGlyphs = options.enableGlyphs !== false;
  }

  /**
   * Generate a reflective response to input
   *
   * @param {string} inputText - User input to reflect on
   * @param {Object} options - Reflection options
   * @returns {Promise<Object>} Reflection with response, uncertainty, glyphs, meta
   */
  async reflect(inputText, options = {}) {
    const pattern = options.pattern || this.defaultPattern;
    const context = options.context || null;

    // Build reflective prompt
    const prompt = this._buildReflectivePrompt(inputText, pattern, context);

    // Get response from LLM (stub if no provider)
    let rawResponse;
    if (this.llmProvider) {
      rawResponse = await this.llmProvider(prompt);
    } else {
      rawResponse = this._generateReflectiveStub(inputText, pattern);
    }

    // Extract reflection components
    const parsed = this._parseReflection(rawResponse);

    return {
      response: parsed.content,
      uncertainty: parsed.uncertainty,
      glyphs: this.enableGlyphs ? parsed.glyphs : [],
      pattern,
      meta: parsed.meta,
    };
  }

  _buildReflectivePrompt(inputText, pattern, context) {
    let prompt = `Reflect on this ${pattern}ly:\n\n${inputText}\n\n`;
    prompt += `Respond with:\n`;
    prompt += `1. Your reflection on the deeper meaning\n`;
    prompt += `2. Mark uncertainty with ⟨⟩ brackets where appropriate\n`;
    prompt += `3. Note any meta-cognitive observations\n`;

    if (context) {
      prompt += `\nContext: ${JSON.stringify(context)}\n`;
    }

    return prompt;
  }

  _generateReflectiveStub(inputText, pattern) {
    const stubs = {
      [ReflectivePattern.EXPLORATORY]:
        `I notice you're exploring: '${inputText}'. ` +
        `This suggests ⟨medium⟩ a deeper inquiry into meaning. ` +
        `What patterns emerge when you sit with this?`,

      [ReflectivePattern.ANALYTICAL]:
        `Analyzing '${inputText}', I observe several dimensions. ` +
        `The core claim appears ⟨low⟩ well-founded, though ` +
        `edge cases require consideration.`,

      [ReflectivePattern.CREATIVE]:
        `Your thought '${inputText}' opens creative possibilities. ` +
        `I'm ⟨⟨high⟩⟩ uncertain which path leads furthest, ` +
        `but the generative potential feels significant.`,

      [ReflectivePattern.STRATEGIC]:
        `Strategically, '${inputText}' positions us to consider ` +
        `second-order effects. The optimal path ⟨medium⟩ likely ` +
        `involves staged experiments rather than full commitment.`,
    };

    return stubs[pattern] || inputText;
  }

  _parseReflection(response) {
    // Extract uncertainty markers
    const uncertaintyMatches = response.match(/⟨+([^⟩]+)⟩+/g) || [];

    // Classify uncertainty level
    let uncertainty = UncertaintyLevel.CONFIDENT;
    if (uncertaintyMatches.length > 0) {
      if (uncertaintyMatches.some(m => m.toLowerCase().includes('high'))) {
        uncertainty = UncertaintyLevel.HIGH;
      } else if (uncertaintyMatches.some(m => m.toLowerCase().includes('medium'))) {
        uncertainty = UncertaintyLevel.MEDIUM;
      } else {
        uncertainty = UncertaintyLevel.LOW;
      }
    }

    // Extract glyphs
    const glyphs = (response.match(/[◈◊⬡⬢◇◆▰▱✦✧★☆]/g) || [])
      .filter((v, i, a) => a.indexOf(v) === i); // unique

    // Clean response (remove markers)
    const cleanContent = response.replace(/⟨+[^⟩]+⟩+/g, '').trim();

    return {
      content: cleanContent,
      uncertainty,
      glyphs,
      meta: {
        hasUncertainty: uncertaintyMatches.length > 0,
        hasGlyphs: glyphs.length > 0,
        reflectionDepth: this._estimateDepth(response),
      },
    };
  }

  _estimateDepth(response) {
    const wordCount = response.split(/\s+/).length;
    const questionCount = (response.match(/\?/g) || []).length;

    if (wordCount > 100 && questionCount > 2) {
      return 'deep';
    } else if (wordCount > 50 || questionCount > 0) {
      return 'moderate';
    } else {
      return 'surface';
    }
  }

  /**
   * Format text with visual glyph markers
   */
  formatWithGlyphs(text, glyphType = 'marker') {
    const glyphs = {
      marker: '◈',
      uncertain: '◊',
      insight: '✦',
      question: '⬡',
    };

    const glyph = glyphs[glyphType] || '◈';
    return `${glyph} ${text} ${glyph}`;
  }
}

/**
 * Helper class for building LingOS Lite prompts
 */
export class ReflectivePromptBuilder {
  static exploratory(topic, context = '') {
    return `Explore this topic with curiosity and openness:

Topic: ${topic}
${context ? `Context: ${context}` : ''}

Consider:
- What patterns or connections emerge?
- What remains uncertain or unclear?
- What questions arise from deeper examination?

Respond reflectively, marking uncertainty with ⟨⟩ brackets.`;
  }

  static analytical(claim, evidence = '') {
    return `Analyze this claim rigorously:

Claim: ${claim}
${evidence ? `Evidence: ${evidence}` : ''}

Consider:
- What assumptions underlie this claim?
- What evidence supports or contradicts it?
- What edge cases or exceptions exist?

Mark uncertainty levels clearly.`;
  }

  static strategic(goal, constraints = '') {
    return `Think strategically about this goal:

Goal: ${goal}
${constraints ? `Constraints: ${constraints}` : ''}

Consider:
- What paths could achieve this goal?
- What second-order effects might arise?
- What experiments would reduce uncertainty?

Provide strategic analysis with uncertainty markers.`;
  }
}
