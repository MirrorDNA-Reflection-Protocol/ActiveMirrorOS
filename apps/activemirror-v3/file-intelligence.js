/**
 * ⟡ FILE INTELLIGENCE
 *
 * Drop any file. Get understanding.
 *
 * - Images → OCR text extraction + visual description
 * - PDFs → Text extraction + structure analysis
 * - Documents → Content + summary
 * - Code → Syntax highlighting + explanation
 * - Audio → Transcription (when available)
 * - Video → Frame extraction + transcription
 * - Data files → Structure + insights
 *
 * No format gatekeeping. If you have a file, we'll try to understand it.
 */

class FileIntelligence {
  constructor() {
    this.supportedFormats = {
      // Images (OCR + vision)
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'heic'],
      // Documents
      document: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'md', 'html'],
      // Spreadsheets
      spreadsheet: ['csv', 'xlsx', 'xls', 'tsv', 'ods'],
      // Code
      code: ['js', 'ts', 'py', 'rb', 'go', 'rs', 'java', 'c', 'cpp', 'h', 'css', 'scss', 'json', 'yaml', 'yml', 'xml', 'sql', 'sh', 'bash', 'php', 'swift', 'kt'],
      // Audio (future)
      audio: ['mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac'],
      // Video (future)
      video: ['mp4', 'mov', 'avi', 'webm', 'mkv'],
      // Archives
      archive: ['zip', 'tar', 'gz', 'rar', '7z'],
      // Data
      data: ['json', 'xml', 'yaml', 'toml', 'ini', 'env']
    };

    this.processingQueue = [];
    this.results = new Map();

    this.setupDropZone();
    this.setupPasteHandler();
  }

  // ============================================
  // DROP ZONE
  // ============================================

  setupDropZone() {
    // Create global drop zone overlay
    const dropZone = document.createElement('div');
    dropZone.id = 'file-drop-zone';
    dropZone.className = 'file-drop-zone';
    dropZone.innerHTML = `
      <div class="drop-content">
        <div class="drop-icon">📄</div>
        <h3>Drop any file</h3>
        <p>Images, PDFs, documents, code, data files...</p>
        <p class="drop-formats">We'll try to understand it.</p>
      </div>
    `;
    document.body.appendChild(dropZone);

    // Global drag events
    let dragCounter = 0;

    document.addEventListener('dragenter', (e) => {
      e.preventDefault();
      dragCounter++;
      if (dragCounter === 1) {
        dropZone.classList.add('active');
      }
    });

    document.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        dropZone.classList.remove('active');
      }
    });

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    document.addEventListener('drop', async (e) => {
      e.preventDefault();
      dragCounter = 0;
      dropZone.classList.remove('active');

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        await this.processFiles(files);
      }
    });
  }

  setupPasteHandler() {
    // Handle clipboard paste (images, files)
    document.addEventListener('paste', async (e) => {
      const items = Array.from(e.clipboardData?.items || []);
      const files = [];

      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }

      if (files.length > 0) {
        e.preventDefault();
        await this.processFiles(files);
      }
    });
  }

  // ============================================
  // FILE PROCESSING
  // ============================================

  async processFiles(files) {
    for (const file of files) {
      await this.processFile(file);
    }
  }

  async processFile(file) {
    const fileType = this.getFileType(file);
    const fileId = this.generateId();

    // Show processing indicator
    this.showProcessingIndicator(file.name, fileId);

    try {
      let result;

      switch (fileType.category) {
        case 'image':
          result = await this.processImage(file);
          break;
        case 'document':
          result = await this.processDocument(file);
          break;
        case 'spreadsheet':
          result = await this.processSpreadsheet(file);
          break;
        case 'code':
          result = await this.processCode(file);
          break;
        case 'data':
          result = await this.processData(file);
          break;
        case 'audio':
          result = await this.processAudio(file);
          break;
        default:
          result = await this.processFallback(file);
      }

      this.results.set(fileId, {
        file: file.name,
        type: fileType,
        result,
        timestamp: Date.now()
      });

      this.showResult(fileId, file.name, result);

    } catch (error) {
      console.error('File processing error:', error);
      this.showError(fileId, file.name, error.message);
    }
  }

  getFileType(file) {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const mimeType = file.type;

    for (const [category, extensions] of Object.entries(this.supportedFormats)) {
      if (extensions.includes(extension)) {
        return { category, extension, mimeType };
      }
    }

    // Fallback to mime type
    if (mimeType.startsWith('image/')) return { category: 'image', extension, mimeType };
    if (mimeType.startsWith('audio/')) return { category: 'audio', extension, mimeType };
    if (mimeType.startsWith('video/')) return { category: 'video', extension, mimeType };
    if (mimeType.startsWith('text/')) return { category: 'document', extension, mimeType };

    return { category: 'unknown', extension, mimeType };
  }

  // ============================================
  // IMAGE PROCESSING (OCR + Vision)
  // ============================================

  async processImage(file) {
    const result = {
      type: 'image',
      dimensions: null,
      ocr: null,
      description: null,
      preview: null
    };

    // Create preview
    result.preview = await this.createImagePreview(file);

    // Get dimensions
    result.dimensions = await this.getImageDimensions(file);

    // OCR using Tesseract.js (if available) or API
    result.ocr = await this.performOCR(file);

    // Vision description (would use API)
    result.description = await this.describeImage(file);

    return result;
  }

  async createImagePreview(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  async getImageDimensions(file) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  async performOCR(file) {
    // Check if Tesseract is available
    if (typeof Tesseract !== 'undefined') {
      try {
        const result = await Tesseract.recognize(file, 'eng', {
          logger: m => console.log(m)
        });
        return {
          text: result.data.text,
          confidence: result.data.confidence,
          words: result.data.words?.length || 0
        };
      } catch (error) {
        console.warn('Tesseract OCR failed:', error);
      }
    }

    // Fallback: Use Canvas-based simple OCR approach
    // Or indicate OCR not available locally
    return {
      text: null,
      note: 'OCR requires Tesseract.js or API connection',
      canProcess: false
    };
  }

  async describeImage(file) {
    // Would use vision API (OpenAI, local model, etc.)
    // For now, return placeholder
    return {
      available: false,
      note: 'Image description requires vision API'
    };
  }

  // ============================================
  // DOCUMENT PROCESSING
  // ============================================

  async processDocument(file) {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
      return await this.processPDF(file);
    } else if (extension === 'txt' || extension === 'md') {
      return await this.processTextFile(file);
    } else if (extension === 'html') {
      return await this.processHTML(file);
    } else {
      return await this.processGenericDocument(file);
    }
  }

  async processPDF(file) {
    const result = {
      type: 'pdf',
      pages: null,
      text: null,
      summary: null
    };

    // Check if PDF.js is available
    if (typeof pdfjsLib !== 'undefined') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        result.pages = pdf.numPages;

        // Extract text from all pages
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n\n';
        }
        result.text = fullText.trim();

        // Generate summary
        result.summary = this.generateSummary(result.text);

      } catch (error) {
        console.warn('PDF.js processing failed:', error);
        result.error = 'Could not process PDF';
      }
    } else {
      result.note = 'PDF processing requires PDF.js library';
    }

    return result;
  }

  async processTextFile(file) {
    const text = await file.text();
    return {
      type: 'text',
      content: text,
      lines: text.split('\n').length,
      words: text.split(/\s+/).length,
      characters: text.length,
      summary: this.generateSummary(text)
    };
  }

  async processHTML(file) {
    const html = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract text content
    const text = doc.body?.textContent || '';

    return {
      type: 'html',
      title: doc.title || null,
      text: text.trim(),
      links: Array.from(doc.querySelectorAll('a')).map(a => ({
        text: a.textContent,
        href: a.href
      })).slice(0, 20),
      images: doc.querySelectorAll('img').length,
      summary: this.generateSummary(text)
    };
  }

  async processGenericDocument(file) {
    // For doc, docx, rtf - would need library or API
    return {
      type: 'document',
      name: file.name,
      size: this.formatFileSize(file.size),
      note: 'Document parsing requires additional library (mammoth.js for docx)',
      canProcess: false
    };
  }

  // ============================================
  // SPREADSHEET PROCESSING
  // ============================================

  async processSpreadsheet(file) {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv' || extension === 'tsv') {
      return await this.processCSV(file, extension === 'tsv' ? '\t' : ',');
    } else {
      // xlsx, xls would need SheetJS
      return {
        type: 'spreadsheet',
        name: file.name,
        note: 'Excel processing requires SheetJS library',
        canProcess: false
      };
    }
  }

  async processCSV(file, delimiter = ',') {
    const text = await file.text();
    const lines = text.trim().split('\n');
    const headers = lines[0]?.split(delimiter).map(h => h.trim()) || [];
    const rows = lines.slice(1).map(line => line.split(delimiter).map(cell => cell.trim()));

    // Basic stats
    const columnTypes = this.inferColumnTypes(headers, rows);

    return {
      type: 'csv',
      headers,
      rowCount: rows.length,
      columnCount: headers.length,
      columnTypes,
      preview: rows.slice(0, 5),
      insights: this.generateDataInsights(headers, rows, columnTypes)
    };
  }

  inferColumnTypes(headers, rows) {
    const types = {};
    const sampleSize = Math.min(rows.length, 100);

    headers.forEach((header, index) => {
      const values = rows.slice(0, sampleSize).map(row => row[index]).filter(v => v);

      if (values.every(v => !isNaN(Number(v)))) {
        types[header] = 'number';
      } else if (values.every(v => /^\d{4}-\d{2}-\d{2}/.test(v))) {
        types[header] = 'date';
      } else if (values.every(v => ['true', 'false', 'yes', 'no', '1', '0'].includes(v?.toLowerCase()))) {
        types[header] = 'boolean';
      } else {
        types[header] = 'text';
      }
    });

    return types;
  }

  generateDataInsights(headers, rows, columnTypes) {
    const insights = [];

    // Row count
    insights.push(`${rows.length} rows, ${headers.length} columns`);

    // Numeric column stats
    headers.forEach((header, index) => {
      if (columnTypes[header] === 'number') {
        const values = rows.map(r => Number(r[index])).filter(v => !isNaN(v));
        if (values.length > 0) {
          const sum = values.reduce((a, b) => a + b, 0);
          const avg = sum / values.length;
          const min = Math.min(...values);
          const max = Math.max(...values);
          insights.push(`${header}: avg ${avg.toFixed(2)}, range ${min}-${max}`);
        }
      }
    });

    return insights.slice(0, 5);
  }

  // ============================================
  // CODE PROCESSING
  // ============================================

  async processCode(file) {
    const text = await file.text();
    const extension = file.name.split('.').pop()?.toLowerCase();

    return {
      type: 'code',
      language: this.detectLanguage(extension),
      content: text,
      lines: text.split('\n').length,
      functions: this.extractFunctions(text, extension),
      imports: this.extractImports(text, extension),
      comments: this.countComments(text, extension),
      summary: `${this.detectLanguage(extension)} file with ${text.split('\n').length} lines`
    };
  }

  detectLanguage(extension) {
    const languages = {
      js: 'JavaScript', ts: 'TypeScript', py: 'Python',
      rb: 'Ruby', go: 'Go', rs: 'Rust', java: 'Java',
      c: 'C', cpp: 'C++', h: 'C Header', css: 'CSS',
      scss: 'SCSS', json: 'JSON', yaml: 'YAML', yml: 'YAML',
      xml: 'XML', sql: 'SQL', sh: 'Shell', bash: 'Bash',
      php: 'PHP', swift: 'Swift', kt: 'Kotlin'
    };
    return languages[extension] || extension.toUpperCase();
  }

  extractFunctions(text, extension) {
    const patterns = {
      js: /(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s*)?\(|(\w+)\s*:\s*(?:async\s*)?\()/g,
      ts: /(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s*)?\(|(\w+)\s*:\s*(?:async\s*)?\()/g,
      py: /def\s+(\w+)\s*\(/g,
      java: /(?:public|private|protected)?\s*(?:static)?\s*\w+\s+(\w+)\s*\(/g
    };

    const pattern = patterns[extension];
    if (!pattern) return [];

    const matches = [...text.matchAll(pattern)];
    return matches.map(m => m[1] || m[2] || m[3]).filter(Boolean).slice(0, 20);
  }

  extractImports(text, extension) {
    const patterns = {
      js: /import\s+.*?from\s+['"](.+?)['"]/g,
      ts: /import\s+.*?from\s+['"](.+?)['"]/g,
      py: /(?:from\s+(\S+)\s+import|import\s+(\S+))/g,
      java: /import\s+([\w.]+)/g
    };

    const pattern = patterns[extension];
    if (!pattern) return [];

    const matches = [...text.matchAll(pattern)];
    return matches.map(m => m[1] || m[2]).filter(Boolean).slice(0, 20);
  }

  countComments(text, extension) {
    const singleLine = (text.match(/\/\/.*$/gm) || []).length;
    const multiLine = (text.match(/\/\*[\s\S]*?\*\//g) || []).length;
    const hashComments = (text.match(/^#.*$/gm) || []).length;

    if (['py', 'rb', 'sh', 'bash', 'yaml', 'yml'].includes(extension)) {
      return hashComments;
    }
    return singleLine + multiLine;
  }

  // ============================================
  // DATA FILE PROCESSING
  // ============================================

  async processData(file) {
    const text = await file.text();
    const extension = file.name.split('.').pop()?.toLowerCase();

    try {
      if (extension === 'json') {
        const data = JSON.parse(text);
        return {
          type: 'json',
          structure: this.describeStructure(data),
          preview: JSON.stringify(data, null, 2).slice(0, 1000),
          keys: this.getTopLevelKeys(data)
        };
      } else if (extension === 'yaml' || extension === 'yml') {
        // Would need js-yaml library
        return {
          type: 'yaml',
          content: text,
          lines: text.split('\n').length,
          note: 'YAML parsing requires js-yaml library'
        };
      } else {
        return {
          type: 'data',
          content: text,
          lines: text.split('\n').length
        };
      }
    } catch (error) {
      return {
        type: 'data',
        error: 'Could not parse file',
        content: text.slice(0, 500)
      };
    }
  }

  describeStructure(data, depth = 0) {
    if (depth > 3) return '...';

    if (Array.isArray(data)) {
      if (data.length === 0) return 'empty array';
      return `array[${data.length}] of ${this.describeStructure(data[0], depth + 1)}`;
    } else if (typeof data === 'object' && data !== null) {
      const keys = Object.keys(data);
      if (keys.length === 0) return 'empty object';
      if (keys.length <= 5) {
        return `{ ${keys.join(', ')} }`;
      }
      return `object with ${keys.length} keys`;
    } else {
      return typeof data;
    }
  }

  getTopLevelKeys(data) {
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
      return Object.keys(data[0]);
    } else if (typeof data === 'object' && data !== null) {
      return Object.keys(data);
    }
    return [];
  }

  // ============================================
  // AUDIO PROCESSING
  // ============================================

  async processAudio(file) {
    // Would need Web Audio API or transcription service
    return {
      type: 'audio',
      name: file.name,
      size: this.formatFileSize(file.size),
      duration: await this.getAudioDuration(file),
      note: 'Transcription requires Whisper API or similar',
      canTranscribe: false
    };
  }

  async getAudioDuration(file) {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        resolve(Math.round(audio.duration));
        URL.revokeObjectURL(audio.src);
      };
      audio.onerror = () => resolve(null);
      audio.src = URL.createObjectURL(file);
    });
  }

  // ============================================
  // FALLBACK PROCESSING
  // ============================================

  async processFallback(file) {
    // Try to read as text
    try {
      const text = await file.text();
      return {
        type: 'unknown',
        name: file.name,
        size: this.formatFileSize(file.size),
        mimeType: file.type,
        couldReadAsText: true,
        preview: text.slice(0, 500),
        lines: text.split('\n').length
      };
    } catch {
      return {
        type: 'binary',
        name: file.name,
        size: this.formatFileSize(file.size),
        mimeType: file.type,
        couldReadAsText: false
      };
    }
  }

  // ============================================
  // SUMMARY GENERATION
  // ============================================

  generateSummary(text, maxSentences = 3) {
    if (!text || text.length < 100) return null;

    // Simple extractive summary
    const sentences = text
      .replace(/\s+/g, ' ')
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20 && s.length < 300);

    if (sentences.length === 0) return null;

    // Return first few sentences as summary
    return sentences.slice(0, maxSentences).join('. ') + '.';
  }

  // ============================================
  // UI
  // ============================================

  showProcessingIndicator(fileName, fileId) {
    const indicator = document.createElement('div');
    indicator.className = 'file-processing-indicator';
    indicator.id = `file-${fileId}`;
    indicator.innerHTML = `
      <div class="fpi-content">
        <div class="fpi-spinner"></div>
        <span class="fpi-name">${this.truncateFileName(fileName)}</span>
        <span class="fpi-status">Processing...</span>
      </div>
    `;

    this.getResultsContainer().appendChild(indicator);
  }

  showResult(fileId, fileName, result) {
    const indicator = document.getElementById(`file-${fileId}`);
    if (!indicator) return;

    indicator.classList.add('complete');
    indicator.innerHTML = `
      <div class="file-result">
        <div class="fr-header">
          <span class="fr-icon">${this.getFileIcon(result.type)}</span>
          <span class="fr-name">${this.truncateFileName(fileName)}</span>
          <button class="fr-expand" title="Expand">↓</button>
          <button class="fr-close" title="Dismiss">×</button>
        </div>
        <div class="fr-preview">
          ${this.renderResultPreview(result)}
        </div>
        <div class="fr-details hidden">
          ${this.renderResultDetails(result)}
        </div>
        <div class="fr-actions">
          <button class="fr-action" data-action="chat">Add to chat</button>
          <button class="fr-action" data-action="summarize">Summarize</button>
          <button class="fr-action" data-action="reflect">Reflect</button>
        </div>
      </div>
    `;

    // Event handlers
    indicator.querySelector('.fr-expand').addEventListener('click', () => {
      indicator.querySelector('.fr-details').classList.toggle('hidden');
      indicator.querySelector('.fr-expand').textContent =
        indicator.querySelector('.fr-details').classList.contains('hidden') ? '↓' : '↑';
    });

    indicator.querySelector('.fr-close').addEventListener('click', () => {
      indicator.remove();
    });

    indicator.querySelectorAll('.fr-action').forEach(btn => {
      btn.addEventListener('click', () => {
        this.handleAction(btn.dataset.action, fileId, result);
      });
    });
  }

  showError(fileId, fileName, error) {
    const indicator = document.getElementById(`file-${fileId}`);
    if (!indicator) return;

    indicator.classList.add('error');
    indicator.innerHTML = `
      <div class="file-error">
        <span class="fe-icon">⚠️</span>
        <span class="fe-name">${this.truncateFileName(fileName)}</span>
        <span class="fe-message">${error}</span>
        <button class="fe-close">×</button>
      </div>
    `;

    indicator.querySelector('.fe-close').addEventListener('click', () => {
      indicator.remove();
    });
  }

  getResultsContainer() {
    let container = document.getElementById('file-results-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'file-results-container';
      container.className = 'file-results-container';
      document.body.appendChild(container);
    }
    return container;
  }

  renderResultPreview(result) {
    switch (result.type) {
      case 'image':
        return `
          ${result.preview ? `<img src="${result.preview}" class="fr-image-preview" alt="Preview">` : ''}
          ${result.ocr?.text ? `<p class="fr-ocr-preview">"${result.ocr.text.slice(0, 100)}..."</p>` : ''}
        `;
      case 'pdf':
        return `<p>${result.pages} pages. ${result.summary || ''}</p>`;
      case 'text':
        return `<p>${result.words} words. ${result.summary || ''}</p>`;
      case 'csv':
        return `<p>${result.rowCount} rows × ${result.columnCount} columns</p>`;
      case 'code':
        return `<p>${result.language}: ${result.lines} lines, ${result.functions.length} functions</p>`;
      case 'json':
        return `<p>${result.structure}</p>`;
      default:
        return `<p>${result.note || 'File processed'}</p>`;
    }
  }

  renderResultDetails(result) {
    switch (result.type) {
      case 'image':
        return `
          ${result.dimensions ? `<p>Dimensions: ${result.dimensions.width}×${result.dimensions.height}</p>` : ''}
          ${result.ocr?.text ? `<div class="fr-ocr-full"><h5>Extracted Text:</h5><pre>${result.ocr.text}</pre></div>` : ''}
        `;
      case 'pdf':
      case 'text':
        return `<div class="fr-text-content"><pre>${(result.text || result.content || '').slice(0, 2000)}</pre></div>`;
      case 'csv':
        return `
          <p><strong>Columns:</strong> ${result.headers.join(', ')}</p>
          <p><strong>Insights:</strong></p>
          <ul>${result.insights.map(i => `<li>${i}</li>`).join('')}</ul>
        `;
      case 'code':
        return `
          <p><strong>Functions:</strong> ${result.functions.join(', ') || 'None detected'}</p>
          <p><strong>Imports:</strong> ${result.imports.join(', ') || 'None detected'}</p>
          <p><strong>Comments:</strong> ${result.comments}</p>
        `;
      case 'json':
        return `
          <p><strong>Keys:</strong> ${result.keys.join(', ')}</p>
          <pre>${result.preview}</pre>
        `;
      default:
        return `<pre>${JSON.stringify(result, null, 2)}</pre>`;
    }
  }

  handleAction(action, fileId, result) {
    const data = this.results.get(fileId);
    if (!data) return;

    switch (action) {
      case 'chat':
        this.addToChat(data);
        break;
      case 'summarize':
        this.requestSummary(data);
        break;
      case 'reflect':
        this.requestReflection(data);
        break;
    }
  }

  addToChat(data) {
    const input = document.getElementById('message-input');
    if (!input) return;

    let context = `[File: ${data.file}]\n`;

    if (data.result.text) {
      context += data.result.text.slice(0, 2000);
    } else if (data.result.content) {
      context += data.result.content.slice(0, 2000);
    } else if (data.result.ocr?.text) {
      context += 'OCR Text: ' + data.result.ocr.text.slice(0, 2000);
    }

    input.value = context + '\n\n';
    input.focus();
  }

  requestSummary(data) {
    const input = document.getElementById('message-input');
    if (!input) return;

    let content = data.result.text || data.result.content || data.result.ocr?.text || '';
    input.value = `Please summarize this:\n\n${content.slice(0, 3000)}`;
    input.focus();

    // Trigger send if auto-send is desired
    // document.getElementById('send-btn')?.click();
  }

  requestReflection(data) {
    const input = document.getElementById('message-input');
    if (!input) return;

    let content = data.result.text || data.result.content || data.result.ocr?.text || '';
    input.value = `Help me reflect on this. What patterns do you see? What should I pay attention to?\n\n${content.slice(0, 3000)}`;
    input.focus();
  }

  // ============================================
  // UTILITIES
  // ============================================

  getFileIcon(type) {
    const icons = {
      image: '🖼️',
      pdf: '📕',
      text: '📄',
      html: '🌐',
      document: '📝',
      csv: '📊',
      spreadsheet: '📈',
      code: '💻',
      json: '{}',
      yaml: '📋',
      data: '📦',
      audio: '🎵',
      video: '🎬',
      unknown: '📎',
      binary: '💾'
    };
    return icons[type] || '📄';
  }

  truncateFileName(name, maxLength = 30) {
    if (name.length <= maxLength) return name;
    const ext = name.split('.').pop();
    const base = name.slice(0, -(ext.length + 1));
    const truncated = base.slice(0, maxLength - ext.length - 4) + '...';
    return truncated + '.' + ext;
  }

  formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  generateId() {
    return 'file_' + Math.random().toString(36).substr(2, 9);
  }
}

// ============================================
// STYLES
// ============================================

const fileIntelligenceStyles = `
  .file-drop-zone {
    position: fixed;
    inset: 0;
    background: rgba(10, 10, 15, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  .file-drop-zone.active {
    opacity: 1;
    pointer-events: auto;
  }

  .drop-content {
    text-align: center;
    padding: 60px;
    border: 3px dashed rgba(139, 92, 246, 0.5);
    border-radius: 20px;
    background: rgba(139, 92, 246, 0.1);
  }

  .drop-icon {
    font-size: 4rem;
    margin-bottom: 20px;
  }

  .drop-content h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  .drop-content p {
    color: var(--text-secondary);
    margin: 5px 0;
  }

  .drop-formats {
    font-size: 0.85rem;
    opacity: 0.7;
  }

  .file-results-container {
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 350px;
    max-height: 60vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 900;
  }

  .file-processing-indicator,
  .file-result,
  .file-error {
    background: rgba(20, 20, 28, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 15px;
    backdrop-filter: blur(10px);
  }

  .fpi-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .fpi-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(139, 92, 246, 0.3);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .fpi-name {
    flex: 1;
    font-size: 0.9rem;
  }

  .fpi-status {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .fr-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  .fr-icon { font-size: 1.2rem; }

  .fr-name {
    flex: 1;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .fr-expand, .fr-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px 8px;
    font-size: 0.9rem;
  }

  .fr-expand:hover, .fr-close:hover {
    color: var(--text-primary);
  }

  .fr-preview {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 10px;
  }

  .fr-preview p {
    margin: 0;
  }

  .fr-image-preview {
    max-width: 100%;
    max-height: 150px;
    border-radius: 8px;
    margin-bottom: 8px;
  }

  .fr-ocr-preview {
    font-style: italic;
    font-size: 0.8rem;
  }

  .fr-details {
    margin-bottom: 10px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    font-size: 0.8rem;
  }

  .fr-details.hidden {
    display: none;
  }

  .fr-details pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 200px;
    overflow-y: auto;
  }

  .fr-actions {
    display: flex;
    gap: 8px;
  }

  .fr-action {
    flex: 1;
    padding: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: var(--text-secondary);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .fr-action:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: var(--primary);
    color: var(--text-primary);
  }

  .file-error {
    display: flex;
    align-items: center;
    gap: 10px;
    border-color: rgba(239, 68, 68, 0.5);
  }

  .fe-message {
    flex: 1;
    font-size: 0.8rem;
    color: #ef4444;
  }

  .fe-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = fileIntelligenceStyles;
document.head.appendChild(styleSheet);

// ============================================
// INITIALIZE
// ============================================

window.FileIntelligence = FileIntelligence;
window.fileIntelligence = new FileIntelligence();

console.log('📄 File Intelligence loaded — drop any file to understand it');
