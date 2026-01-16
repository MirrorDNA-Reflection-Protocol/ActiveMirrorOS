/**
 * WebLLM Engine for ActiveMirror v3
 * ==================================
 *
 * In-browser AI inference using WebGPU - the ultimate sovereign mode.
 * Zero network requests, zero data leaves the browser.
 *
 * Powered by MLC WebLLM: https://webllm.mlc.ai/
 */

class WebLLMEngine {
  constructor() {
    this.engine = null;
    this.isLoading = false;
    this.isReady = false;
    this.currentModel = null;
    this.loadProgress = 0;

    // Available WebLLM models (smaller ones for browser)
    this.models = {
      'phi-3-mini': {
        id: 'Phi-3-mini-4k-instruct-q4f16_1-MLC',
        name: 'Phi-3 Mini (3.8B)',
        size: '2.2GB',
        description: 'Fast, compact model from Microsoft'
      },
      'llama-3.2-1b': {
        id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
        name: 'Llama 3.2 (1B)',
        size: '0.7GB',
        description: 'Smallest Llama, very fast'
      },
      'llama-3.2-3b': {
        id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
        name: 'Llama 3.2 (3B)',
        size: '1.8GB',
        description: 'Good balance of speed and quality'
      },
      'gemma-2b': {
        id: 'gemma-2-2b-it-q4f16_1-MLC',
        name: 'Gemma 2 (2B)',
        size: '1.4GB',
        description: 'Google\'s efficient model'
      },
      'qwen-1.5b': {
        id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
        name: 'Qwen 2.5 (1.5B)',
        size: '1.0GB',
        description: 'Alibaba\'s multilingual model'
      },
      'smollm-1.7b': {
        id: 'SmolLM2-1.7B-Instruct-q4f16_1-MLC',
        name: 'SmolLM 2 (1.7B)',
        size: '1.1GB',
        description: 'HuggingFace\'s tiny powerhouse'
      }
    };

    this.defaultModel = 'llama-3.2-1b';  // Fastest to load

    // Callbacks
    this.onProgress = null;
    this.onReady = null;
    this.onError = null;
  }

  /**
   * Check if WebGPU is supported
   */
  static async checkSupport() {
    if (!navigator.gpu) {
      return { supported: false, reason: 'WebGPU not available in this browser' };
    }

    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        return { supported: false, reason: 'No WebGPU adapter found' };
      }

      const device = await adapter.requestDevice();
      const info = await adapter.requestAdapterInfo();

      return {
        supported: true,
        gpu: info.description || info.device || 'Unknown GPU',
        vendor: info.vendor || 'Unknown'
      };
    } catch (e) {
      return { supported: false, reason: e.message };
    }
  }

  /**
   * Load the WebLLM library dynamically
   */
  async loadLibrary() {
    if (window.webllm) return window.webllm;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.innerHTML = `
        import * as webllm from 'https://esm.run/@mlc-ai/web-llm';
        window.webllm = webllm;
        window.dispatchEvent(new Event('webllm-loaded'));
      `;

      window.addEventListener('webllm-loaded', () => resolve(window.webllm), { once: true });
      script.onerror = () => reject(new Error('Failed to load WebLLM library'));

      document.head.appendChild(script);

      // Fallback timeout
      setTimeout(() => {
        if (!window.webllm) {
          reject(new Error('WebLLM load timeout'));
        }
      }, 30000);
    });
  }

  /**
   * Initialize and load a model
   */
  async initialize(modelKey = null) {
    if (this.isLoading) {
      throw new Error('Already loading a model');
    }

    modelKey = modelKey || this.defaultModel;
    const modelConfig = this.models[modelKey];

    if (!modelConfig) {
      throw new Error(`Unknown model: ${modelKey}`);
    }

    // Check WebGPU support
    const support = await WebLLMEngine.checkSupport();
    if (!support.supported) {
      throw new Error(`WebGPU not supported: ${support.reason}`);
    }

    this.isLoading = true;
    this.loadProgress = 0;

    try {
      // Load library
      const webllm = await this.loadLibrary();

      // Create engine with progress callback
      this.engine = await webllm.CreateMLCEngine(modelConfig.id, {
        initProgressCallback: (progress) => {
          this.loadProgress = progress.progress || 0;
          if (this.onProgress) {
            this.onProgress({
              progress: this.loadProgress,
              text: progress.text || 'Loading...',
              model: modelConfig.name
            });
          }
        }
      });

      this.currentModel = modelKey;
      this.isReady = true;
      this.isLoading = false;

      if (this.onReady) {
        this.onReady({
          model: modelConfig.name,
          modelId: modelConfig.id
        });
      }

      return true;

    } catch (error) {
      this.isLoading = false;
      this.isReady = false;

      if (this.onError) {
        this.onError(error);
      }

      throw error;
    }
  }

  /**
   * Generate a response (non-streaming)
   */
  async generate(prompt, options = {}) {
    if (!this.isReady || !this.engine) {
      throw new Error('WebLLM not initialized');
    }

    const systemPrompt = options.system || `You are ActiveMirror, running entirely in the browser via WebLLM.
Your inference happens 100% locally using WebGPU - no data leaves this device.
Be concise and helpful. Current model: ${this.models[this.currentModel]?.name || 'Unknown'}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    const startTime = performance.now();

    const response = await this.engine.chat.completions.create({
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1024,
      stream: false
    });

    const latencyMs = Math.round(performance.now() - startTime);
    const output = response.choices[0]?.message?.content || '';

    return {
      response: output,
      model: this.models[this.currentModel]?.name || this.currentModel,
      latency_ms: latencyMs,
      tokens: {
        input: response.usage?.prompt_tokens || 0,
        output: response.usage?.completion_tokens || 0
      },
      tier: 'webllm',
      tier_name: 'Browser (WebGPU)',
      cached: false,
      cost_usd: 0  // Always free!
    };
  }

  /**
   * Generate with streaming
   */
  async *generateStream(prompt, options = {}) {
    if (!this.isReady || !this.engine) {
      throw new Error('WebLLM not initialized');
    }

    const systemPrompt = options.system || `You are ActiveMirror, running entirely in the browser via WebLLM.
Your inference happens 100% locally using WebGPU - no data leaves this device.
Be concise and helpful.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    const stream = await this.engine.chat.completions.create({
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1024,
      stream: true
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        yield delta;
      }
    }
  }

  /**
   * Unload the current model to free memory
   */
  async unload() {
    if (this.engine) {
      await this.engine.unload();
      this.engine = null;
      this.isReady = false;
      this.currentModel = null;
    }
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      isLoading: this.isLoading,
      isReady: this.isReady,
      currentModel: this.currentModel ? this.models[this.currentModel] : null,
      loadProgress: this.loadProgress
    };
  }

  /**
   * List available models
   */
  getModels() {
    return Object.entries(this.models).map(([key, config]) => ({
      key,
      ...config,
      isLoaded: key === this.currentModel
    }));
  }
}

// Export for use
window.WebLLMEngine = WebLLMEngine;
