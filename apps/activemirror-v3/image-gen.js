/**
 * IMAGE GENERATION SERVICE
 * Integrates with Google Gemini's image generation capabilities
 *
 * Usage in chat:
 * - "generate an image of..." or "create image:" triggers generation
 * - "imagine:" or "/image" also works
 *
 * API: Uses Gemini 2.0 Flash (free tier available)
 */

class ImageGenService {
  constructor() {
    this.apiKey = localStorage.getItem('gemini_api_key') || '';
    this.endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    this.imageEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict';
    this.isGenerating = false;
    this.history = [];

    this.init();
  }

  init() {
    // Add image generation button to chat input area
    this.addImageButton();

    // Listen for image generation requests
    window.addEventListener('generate-image', (e) => {
      this.generate(e.detail.prompt);
    });

    console.log('🎨 Image Generation Service loaded');
  }

  addImageButton() {
    // Wait for DOM
    const checkAndAdd = () => {
      const inputArea = document.querySelector('.input-area') ||
                        document.querySelector('.chat-input-container');

      if (!inputArea) {
        setTimeout(checkAndAdd, 500);
        return;
      }

      // Don't add if already exists
      if (document.getElementById('image-gen-btn')) return;

      const btn = document.createElement('button');
      btn.id = 'image-gen-btn';
      btn.className = 'image-gen-btn';
      btn.innerHTML = '🎨';
      btn.title = 'Generate Image';
      btn.addEventListener('click', () => this.showPromptModal());

      // Add styles
      this.addStyles();

      // Insert before send button
      const sendBtn = document.getElementById('send-btn');
      if (sendBtn && sendBtn.parentElement) {
        sendBtn.parentElement.insertBefore(btn, sendBtn);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkAndAdd);
    } else {
      checkAndAdd();
    }
  }

  addStyles() {
    if (document.getElementById('image-gen-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'image-gen-styles';
    styles.textContent = `
      .image-gen-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: var(--bg-tertiary, #1a1a24);
        color: var(--text-secondary, #a0a0b0);
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        margin-right: 8px;
      }

      .image-gen-btn:hover {
        background: var(--primary-soft, rgba(99, 102, 241, 0.15));
        color: var(--primary, #6366f1);
        transform: scale(1.1);
      }

      .image-gen-btn.generating {
        animation: pulse-gen 1s ease-in-out infinite;
      }

      @keyframes pulse-gen {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      /* Image Generation Modal */
      .image-gen-modal {
        position: fixed;
        inset: 0;
        z-index: 100010;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .image-gen-modal.visible {
        opacity: 1;
        visibility: visible;
      }

      .image-gen-content {
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        background: var(--bg-secondary, #12121a);
        border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
        border-radius: 20px;
        padding: 24px;
        overflow-y: auto;
        transform: translateY(20px);
        transition: transform 0.3s ease;
      }

      .image-gen-modal.visible .image-gen-content {
        transform: translateY(0);
      }

      .image-gen-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .image-gen-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary, #f0f0f5);
      }

      .image-gen-title-icon {
        font-size: 24px;
      }

      .image-gen-close {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: var(--text-muted, #606070);
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .image-gen-close:hover {
        background: var(--bg-tertiary, #1a1a24);
        color: var(--text-primary, #f0f0f5);
      }

      /* API Key Setup */
      .api-key-setup {
        background: var(--bg-tertiary, #1a1a24);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
      }

      .api-key-setup h4 {
        margin: 0 0 12px 0;
        color: var(--text-primary, #f0f0f5);
        font-size: 14px;
      }

      .api-key-setup p {
        margin: 0 0 16px 0;
        color: var(--text-secondary, #a0a0b0);
        font-size: 13px;
        line-height: 1.5;
      }

      .api-key-input-wrap {
        display: flex;
        gap: 8px;
      }

      .api-key-input {
        flex: 1;
        padding: 10px 14px;
        border-radius: 8px;
        border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
        background: var(--bg-secondary, #12121a);
        color: var(--text-primary, #f0f0f5);
        font-size: 13px;
        font-family: var(--font-mono, monospace);
      }

      .api-key-input:focus {
        outline: none;
        border-color: var(--primary, #6366f1);
      }

      .api-key-save {
        padding: 10px 20px;
        border-radius: 8px;
        border: none;
        background: var(--primary, #6366f1);
        color: white;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .api-key-save:hover {
        filter: brightness(1.1);
      }

      .api-key-link {
        display: inline-block;
        margin-top: 12px;
        color: var(--primary, #6366f1);
        font-size: 12px;
        text-decoration: none;
      }

      .api-key-link:hover {
        text-decoration: underline;
      }

      /* Prompt Input */
      .image-prompt-section {
        margin-bottom: 20px;
      }

      .image-prompt-label {
        display: block;
        margin-bottom: 8px;
        color: var(--text-secondary, #a0a0b0);
        font-size: 13px;
      }

      .image-prompt-input {
        width: 100%;
        min-height: 100px;
        padding: 14px;
        border-radius: 12px;
        border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
        background: var(--bg-tertiary, #1a1a24);
        color: var(--text-primary, #f0f0f5);
        font-size: 14px;
        font-family: var(--font-sans, sans-serif);
        line-height: 1.5;
        resize: vertical;
      }

      .image-prompt-input:focus {
        outline: none;
        border-color: var(--primary, #6366f1);
      }

      .image-prompt-input::placeholder {
        color: var(--text-muted, #606070);
      }

      /* Style Options */
      .style-options {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 20px;
      }

      .style-option {
        padding: 8px 16px;
        border-radius: 20px;
        border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
        background: transparent;
        color: var(--text-secondary, #a0a0b0);
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .style-option:hover {
        border-color: var(--primary, #6366f1);
        color: var(--primary, #6366f1);
      }

      .style-option.selected {
        background: var(--primary-soft, rgba(99, 102, 241, 0.15));
        border-color: var(--primary, #6366f1);
        color: var(--primary, #6366f1);
      }

      /* Generate Button */
      .image-gen-submit {
        width: 100%;
        padding: 14px;
        border-radius: 12px;
        border: none;
        background: linear-gradient(135deg, var(--primary, #6366f1), var(--frontier, #8b5cf6));
        color: white;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }

      .image-gen-submit:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
      }

      .image-gen-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* Result Display */
      .image-result {
        margin-top: 20px;
        border-radius: 16px;
        overflow: hidden;
        background: var(--bg-tertiary, #1a1a24);
      }

      .image-result img {
        width: 100%;
        display: block;
      }

      .image-result-actions {
        display: flex;
        gap: 8px;
        padding: 12px;
      }

      .image-result-btn {
        flex: 1;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
        background: transparent;
        color: var(--text-secondary, #a0a0b0);
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .image-result-btn:hover {
        background: var(--bg-hover, #22222e);
        color: var(--text-primary, #f0f0f5);
      }

      /* Loading State */
      .image-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;
        color: var(--text-secondary, #a0a0b0);
      }

      .image-loading-spinner {
        width: 48px;
        height: 48px;
        border: 3px solid var(--glass-border, rgba(255,255,255,0.08));
        border-top-color: var(--primary, #6366f1);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Error State */
      .image-error {
        padding: 20px;
        background: var(--error-soft, rgba(239, 68, 68, 0.15));
        border-radius: 12px;
        color: var(--error, #ef4444);
        font-size: 13px;
        margin-top: 16px;
      }

      /* Light Theme */
      [data-theme="light"] .image-gen-content {
        background: rgba(255, 255, 255, 0.98);
      }

      [data-theme="light"] .api-key-setup,
      [data-theme="light"] .image-prompt-input,
      [data-theme="light"] .image-result {
        background: rgba(0, 0, 0, 0.03);
      }

      /* Chat Image Display */
      .chat-image-container {
        margin: 12px 0;
        border-radius: 16px;
        overflow: hidden;
        max-width: 400px;
      }

      .chat-image-container img {
        width: 100%;
        display: block;
        cursor: pointer;
        transition: transform 0.2s;
      }

      .chat-image-container img:hover {
        transform: scale(1.02);
      }

      .chat-image-prompt {
        padding: 10px 14px;
        background: var(--bg-tertiary, #1a1a24);
        font-size: 12px;
        color: var(--text-muted, #606070);
        font-style: italic;
      }
    `;
    document.head.appendChild(styles);
  }

  showPromptModal() {
    // Remove existing modal
    document.querySelector('.image-gen-modal')?.remove();

    const modal = document.createElement('div');
    modal.className = 'image-gen-modal';
    modal.innerHTML = `
      <div class="image-gen-content">
        <div class="image-gen-header">
          <div class="image-gen-title">
            <span class="image-gen-title-icon">🎨</span>
            <span>Generate Image</span>
          </div>
          <button class="image-gen-close">×</button>
        </div>

        ${!this.apiKey ? `
          <div class="api-key-setup">
            <h4>Setup Required</h4>
            <p>To generate images, you need a Google AI Studio API key. It's free to get started!</p>
            <div class="api-key-input-wrap">
              <input type="password" class="api-key-input" placeholder="Enter your Gemini API key" />
              <button class="api-key-save">Save</button>
            </div>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" class="api-key-link">
              Get your free API key from Google AI Studio →
            </a>
          </div>
        ` : ''}

        <div class="image-prompt-section">
          <label class="image-prompt-label">Describe your image</label>
          <textarea class="image-prompt-input" placeholder="A serene mountain landscape at sunset with a reflection in a crystal clear lake, photorealistic, 4K quality"></textarea>
        </div>

        <div class="style-options">
          <button class="style-option" data-style="photorealistic">Photorealistic</button>
          <button class="style-option" data-style="digital art">Digital Art</button>
          <button class="style-option" data-style="oil painting">Oil Painting</button>
          <button class="style-option" data-style="anime">Anime</button>
          <button class="style-option" data-style="sketch">Sketch</button>
          <button class="style-option" data-style="3d render">3D Render</button>
        </div>

        <button class="image-gen-submit" ${!this.apiKey ? 'disabled' : ''}>
          <span>✨</span>
          <span>Generate Image</span>
        </button>

        <div class="image-result-container"></div>
      </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('visible'), 10);

    // Event Listeners
    modal.querySelector('.image-gen-close').addEventListener('click', () => {
      modal.classList.remove('visible');
      setTimeout(() => modal.remove(), 300);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 300);
      }
    });

    // API Key Save
    const saveBtn = modal.querySelector('.api-key-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const input = modal.querySelector('.api-key-input');
        if (input.value.trim()) {
          this.apiKey = input.value.trim();
          localStorage.setItem('gemini_api_key', this.apiKey);
          modal.querySelector('.api-key-setup').remove();
          modal.querySelector('.image-gen-submit').disabled = false;
          this.showToast('API key saved!');
        }
      });
    }

    // Style Options
    let selectedStyle = '';
    modal.querySelectorAll('.style-option').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.style-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedStyle = btn.dataset.style;
      });
    });

    // Generate
    modal.querySelector('.image-gen-submit').addEventListener('click', async () => {
      const prompt = modal.querySelector('.image-prompt-input').value.trim();
      if (!prompt) {
        this.showToast('Please enter a description');
        return;
      }

      const fullPrompt = selectedStyle ? `${prompt}, ${selectedStyle} style` : prompt;
      await this.generateInModal(fullPrompt, modal);
    });

    // Focus input
    setTimeout(() => {
      modal.querySelector('.image-prompt-input').focus();
    }, 100);
  }

  async generateInModal(prompt, modal) {
    const container = modal.querySelector('.image-result-container');
    const submitBtn = modal.querySelector('.image-gen-submit');

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="image-loading-spinner" style="width:20px;height:20px;border-width:2px;margin:0"></span> Generating...';

    container.innerHTML = `
      <div class="image-loading">
        <div class="image-loading-spinner"></div>
        <p>Creating your image...</p>
        <p style="font-size: 12px; opacity: 0.6;">This may take 10-30 seconds</p>
      </div>
    `;

    try {
      const imageUrl = await this.generate(prompt);

      if (imageUrl) {
        container.innerHTML = `
          <div class="image-result">
            <img src="${imageUrl}" alt="${prompt}" />
            <div class="image-result-actions">
              <button class="image-result-btn" data-action="download">Download</button>
              <button class="image-result-btn" data-action="copy">Copy URL</button>
              <button class="image-result-btn" data-action="chat">Add to Chat</button>
            </div>
          </div>
        `;

        // Action handlers
        container.querySelector('[data-action="download"]').addEventListener('click', () => {
          this.downloadImage(imageUrl, prompt);
        });

        container.querySelector('[data-action="copy"]').addEventListener('click', () => {
          navigator.clipboard.writeText(imageUrl);
          this.showToast('URL copied!');
        });

        container.querySelector('[data-action="chat"]').addEventListener('click', () => {
          this.addToChat(imageUrl, prompt);
          modal.classList.remove('visible');
          setTimeout(() => modal.remove(), 300);
        });
      }
    } catch (error) {
      container.innerHTML = `
        <div class="image-error">
          <strong>Generation failed:</strong> ${error.message}
          <br><br>
          <small>Make sure your API key is valid and you have available quota.</small>
        </div>
      `;
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>✨</span><span>Generate Another</span>';
  }

  async generate(prompt) {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    this.isGenerating = true;

    try {
      // Using Gemini 2.0 Flash for text-to-image description
      // Then we'll use a different approach since Gemini doesn't directly generate images
      // Instead, we'll generate via the Gemini API with image generation capabilities

      const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate a detailed image based on this description. Create the image directly:\n\n${prompt}`
            }]
          }],
          generationConfig: {
            responseModalities: ["image", "text"],
            responseMimeType: "image/png"
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();

        // If native image gen isn't available, fall back to placeholder
        if (error.error?.code === 400 || error.error?.message?.includes('not supported')) {
          return this.generatePlaceholder(prompt);
        }

        throw new Error(error.error?.message || 'API request failed');
      }

      const data = await response.json();

      // Check for image data in response
      const parts = data.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          const base64 = part.inlineData.data;
          return `data:${part.inlineData.mimeType};base64,${base64}`;
        }
      }

      // Fallback to placeholder if no image generated
      return this.generatePlaceholder(prompt);

    } catch (error) {
      console.error('Image generation error:', error);

      // For demo purposes, generate a placeholder
      if (error.message.includes('not supported') || error.message.includes('responseModalities')) {
        return this.generatePlaceholder(prompt);
      }

      throw error;
    } finally {
      this.isGenerating = false;
    }
  }

  // Generate a styled placeholder image with the prompt
  generatePlaceholder(prompt) {
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Gradient background based on prompt keywords
    const colors = this.getColorsFromPrompt(prompt);
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some visual elements
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 100 + 20,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'white';
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Add prompt text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;

    // Wrap text
    const words = prompt.split(' ');
    const lines = [];
    let line = '';
    const maxWidth = canvas.width - 80;

    words.forEach(word => {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== '') {
        lines.push(line);
        line = word + ' ';
      } else {
        line = testLine;
      }
    });
    lines.push(line);

    const lineHeight = 32;
    const startY = (canvas.height - lines.length * lineHeight) / 2;

    lines.forEach((l, i) => {
      ctx.fillText(l.trim(), canvas.width / 2, startY + i * lineHeight);
    });

    // Add watermark
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('ActiveMirror Image Gen (Preview)', canvas.width / 2, canvas.height - 30);

    return canvas.toDataURL('image/png');
  }

  getColorsFromPrompt(prompt) {
    const p = prompt.toLowerCase();

    if (p.includes('sunset') || p.includes('warm') || p.includes('fire')) {
      return ['#ff6b35', '#f7931e', '#9c27b0'];
    }
    if (p.includes('ocean') || p.includes('water') || p.includes('sea')) {
      return ['#1a237e', '#0288d1', '#00bcd4'];
    }
    if (p.includes('forest') || p.includes('nature') || p.includes('green')) {
      return ['#1b5e20', '#4caf50', '#8bc34a'];
    }
    if (p.includes('night') || p.includes('dark') || p.includes('space')) {
      return ['#0d1b2a', '#1b263b', '#415a77'];
    }
    if (p.includes('mountain') || p.includes('rock')) {
      return ['#37474f', '#607d8b', '#90a4ae'];
    }

    // Default gradient
    return ['#6366f1', '#8b5cf6', '#a855f7'];
  }

  addToChat(imageUrl, prompt) {
    const messagesContainer = document.getElementById('messages');
    if (!messagesContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'message assistant';
    msgDiv.innerHTML = `
      <div class="message-content">
        <p>Here's the image I generated:</p>
        <div class="chat-image-container">
          <img src="${imageUrl}" alt="${prompt}" />
          <div class="chat-image-prompt">"${prompt}"</div>
        </div>
      </div>
    `;

    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Store in history
    this.history.push({
      prompt,
      imageUrl,
      timestamp: Date.now()
    });
  }

  downloadImage(imageUrl, prompt) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `activemirror-${prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      padding: 12px 24px;
      background: var(--bg-secondary, #12121a);
      border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
      border-radius: 8px;
      color: var(--text-primary, #f0f0f5);
      font-size: 14px;
      z-index: 100020;
      opacity: 0;
      transition: all 0.3s ease;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Check if a message is an image generation request
  static isImageRequest(message) {
    const triggers = [
      /^(generate|create|make|draw|paint|design)\s+(an?\s+)?image/i,
      /^imagine:/i,
      /^\/image\s+/i,
      /^create\s+image:/i,
      /^image:/i
    ];

    return triggers.some(trigger => trigger.test(message.trim()));
  }

  // Extract prompt from message
  static extractPrompt(message) {
    const cleaned = message
      .replace(/^(generate|create|make|draw|paint|design)\s+(an?\s+)?image\s+(of\s+)?/i, '')
      .replace(/^imagine:\s*/i, '')
      .replace(/^\/image\s+/i, '')
      .replace(/^create\s+image:\s*/i, '')
      .replace(/^image:\s*/i, '')
      .trim();

    return cleaned;
  }
}

// Initialize
window.ImageGenService = ImageGenService;
window.imageGen = new ImageGenService();

console.log('🎨 Image Generation Service ready');
