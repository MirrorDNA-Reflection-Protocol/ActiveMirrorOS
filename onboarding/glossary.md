# ActiveMirrorOS Glossary

A comprehensive reference for terms, concepts, and acronyms used in the ActiveMirrorOS ecosystem.

---

## Core Concepts

### ActiveMirrorOS
The consumer operating system layer for building AI applications with persistent memory. The product-facing SDK that developers use to build memory-enabled AI apps.

### ActiveMirror
The main orchestration class in the SDK. Creates and manages sessions, handles storage, and coordinates the memory system.

### Session
A container for a conversation or interaction sequence. Sessions maintain context across multiple messages and can be persisted, loaded, and resumed.

### Message
A single unit of communication in a session. Contains role (user/assistant/system), content, timestamp, and optional metadata.

### Persistent Memory
The ability of an AI system to remember information across sessions, interactions, and time. Unlike ephemeral memory (RAM), persistent memory survives process restarts.

---

## Storage & Memory

### Storage Backend
The underlying system used to save session data. ActiveMirrorOS supports:
- **SQLite**: Relational database, best for production
- **JSON**: File-based, best for simple use cases
- **In-Memory**: RAM only, for testing

### Three-Tier Memory
ActiveMirrorOS's memory architecture:
1. **RAM** (active session data)
2. **Disk** (SQLite/JSON persistence)
3. **Vault** (encrypted storage for sensitive data)

### Vault
Encrypted storage layer using AES-256-GCM encryption. Stores sensitive information separately from regular session data with PBKDF2 key derivation.

### Continuity Log
A chronological record of all interactions, maintaining continuity across sessions and enabling context preservation.

### Context Window
The portion of conversation history provided to the AI. Can be limited by token count or message count.

---

## LingOS & Reflective Patterns

### LingOS (Linguistic Operating System)
A protocol for reflective AI dialogue. Defines patterns, glyphs, and meta-cognitive structures for more thoughtful AI interactions.

### LingOS Lite
Simplified reflective pattern library built into ActiveMirrorOS. Provides 4 patterns and basic glyphs without external dependencies.

### LingOS Pro
Full implementation of the LingOS protocol (coming v0.6.0). Includes custom patterns, meta-cognition, and advanced features.

### Reflective Pattern
A mode of thinking/dialogue in LingOS:
- **Exploratory** (🔍): Open-ended questioning
- **Analytical** (🔬): Structured breakdown
- **Creative** (💡): Generative ideation
- **Strategic** (🎯): Goal-oriented planning

### Uncertainty Marker
Symbols indicating confidence level:
- `~` (tilde): Exploratory uncertainty
- `?` (question): Analytical questioning
- `*` (asterisk): Creative possibility
- `!` (exclamation): Strategic emphasis

### Glyph
Unicode symbol used to mark meta-cognitive states:
- 💎 Insight
- 🔗 Continuity
- ~ Uncertainty
- 🪞 Reflection

### Meta-Cognition
Thinking about thinking. In LingOS Pro, the ability to reflect on reflections, creating recursive layers of thought.

---

## MirrorDNA Ecosystem

### MirrorDNA
Universal memory format specification for AI persistence. Defines how memory should be encoded, structured, and transferred across systems.

### MirrorDNA Standard
The formal specification document for MirrorDNA. See: https://github.com/MirrorDNA-Reflection-Protocol/MirrorDNA-Standard

### TrustByDesign
Cryptographic trust and governance layer. Provides security primitives, verification, and provenance tracking. See: https://github.com/MirrorDNA-Reflection-Protocol/TrustByDesign

### Vault Manager
Dedicated system for encrypted memory storage. See: https://github.com/MirrorDNA-Reflection-Protocol/VaultManager

### Glyphtrail
A visual/textual representation of a conversation using glyphs. Part of the MirrorDNA format for encoding meta-cognitive states.

---

## Technical Terms

### SDK (Software Development Kit)
The libraries, tools, and documentation for building with ActiveMirrorOS. Available in Python and JavaScript.

### Session ID
Unique identifier for a session. Used to load, resume, and reference specific conversations.

### Storage Path
Directory or file path where session data is stored. For SQLite: database file path. For JSON: directory containing session files.

### Config Object
Configuration settings for ActiveMirrorOS. Can be loaded from YAML, JSON, or created programmatically.

### Context Preservation
Maintaining relevant information across interactions. ActiveMirrorOS automatically preserves context by storing full session history.

### Local-First
Design philosophy where data is stored on the user's device by default, not in the cloud. Users maintain full control and ownership.

---

## Architecture Terms

### Storage Layer
The persistence mechanism (SQLite, JSON, in-memory). Handles saving and loading of session data.

### Reflective Layer
The LingOS pattern system that provides reflective dialogue capabilities.

### Security Layer
Encryption and vault systems (AES-256-GCM, PBKDF2) for protecting sensitive data.

### API Layer
The public interface developers use. Includes `ActiveMirror`, `Session`, `ReflectiveClient`, etc.

---

## Integration Terms

### LLM (Large Language Model)
AI models like GPT-4, Claude, or local models. ActiveMirrorOS is LLM-agnostic—works with any or none.

### Provider
External service providing LLM capabilities (e.g., OpenAI, Anthropic). ActiveMirrorOS supports pluggable providers.

### Local LLM
AI model running on your own hardware (e.g., Ollama, LM Studio). ActiveMirrorOS can integrate with local models for full privacy.

### Prompt
Text sent to an LLM. In ActiveMirrorOS, prompts can include session context from persistent memory.

---

## Development Terms

### Example App
Ready-to-run application demonstrating ActiveMirrorOS features:
- **CLI**: Command-line journaling tool
- **Desktop**: Electron-based chat app
- **Mobile**: React Native app

### Demo
Simplified working example in `/demo/` showing core concepts without full SDK complexity.

### Test Suite
Collection of automated tests (83 total) verifying SDK functionality. Uses pytest (Python) and Node.js test runner (JavaScript).

---

## Operations & Deployment

### Production-Ready
Software that is stable, tested, and suitable for real-world use. ActiveMirrorOS v0.2.0 is production-ready.

### Migration
Moving data from one storage backend to another, or upgrading between versions.

### Export
Converting session data to a portable format (JSON, Markdown, MirrorDNA).

### Import
Loading session data from an external file or system.

### Sync
Keeping data consistent across multiple devices (coming in v0.5.0).

---

## Licensing & Community

### MIT License
Open source license allowing free use, modification, and distribution, including commercial use.

### Contribution
Adding code, documentation, or features to the project. See CONTRIBUTING.md.

### Issue
Bug report or feature request on GitHub.

### Pull Request (PR)
Proposed code change submitted for review and inclusion in the project.

---

## Acronyms

- **AMOS**: ActiveMirrorOS
- **LLM**: Large Language Model
- **SDK**: Software Development Kit
- **API**: Application Programming Interface
- **JSON**: JavaScript Object Notation
- **YAML**: YAML Ain't Markup Language
- **SQLite**: SQL Database Engine (file-based)
- **AES**: Advanced Encryption Standard
- **GCM**: Galois/Counter Mode (encryption mode)
- **PBKDF2**: Password-Based Key Derivation Function 2
- **E2E**: End-to-End (encryption)
- **CLI**: Command-Line Interface
- **GUI**: Graphical User Interface
- **RAM**: Random Access Memory
- **DB**: Database
- **OSS**: Open Source Software

---

## Version Numbers

### v0.2.0 (Current)
Production-ready release with Python & JavaScript SDKs, example apps, encryption, and LingOS Lite.

### v0.3.0 (Q1 2025)
Enhanced memory search and tagging.

### v0.4.0 (Q2 2025)
Real LLM integration with multiple providers.

### v0.5.0 (Q3 2025)
Multi-device sync with E2E encryption.

### v0.6.0 (Q4 2025)
LingOS Pro launch with custom patterns and meta-cognition.

### v1.0.0 (2026)
Stable API with enterprise features and performance optimization.

---

## Common Phrases

### "Persistent Memory"
Memory that survives beyond a single session or process lifetime.

### "Local-First Architecture"
Data stored on user's device by default, not in the cloud.

### "Context Preservation"
Maintaining relevant conversation history across interactions.

### "Reflective Dialogue"
Conversation style that includes meta-cognitive markers and thoughtful patterns.

### "LLM-Agnostic"
Works with any LLM provider or no LLM at all.

### "Production-Ready"
Stable, tested, and suitable for real-world deployment.

### "Zero Dependencies"
No external libraries required (for core features).

### "Cross-Platform"
Works on multiple operating systems (Windows, macOS, Linux).

---

## Related Projects

### Ollama
Local LLM runtime. Can integrate with ActiveMirrorOS for fully private AI.

### LM Studio
Desktop app for running local LLMs. Compatible with ActiveMirrorOS.

### LangChain
LLM framework. Can be used alongside ActiveMirrorOS for chaining operations.

### Pinecone / Weaviate
Vector databases. Can integrate for semantic search (coming in v0.3.0).

---

## File Extensions

- `.py` — Python source code
- `.js` — JavaScript source code
- `.md` — Markdown documentation
- `.yaml` / `.yml` — YAML configuration file
- `.json` — JSON data file
- `.db` — SQLite database file
- `.ipynb` — Jupyter notebook

---

## Directory Names

- `sdk/` — Software Development Kits
- `apps/` — Example applications
- `demo/` — Working demo
- `docs/` — Documentation
- `onboarding/` — Getting started guides
- `tests/` — Test suite
- `examples/` — Code examples
- `scripts/` — Utility scripts

---

## Environment Variables

### `ACTIVEMIRROR_STORAGE_PATH`
Override default storage location.

### `ACTIVEMIRROR_LOG_LEVEL`
Set logging verbosity (DEBUG, INFO, WARNING, ERROR).

### `ACTIVEMIRROR_CONFIG`
Path to custom config file.

---

## Configuration Keys

From `config.yaml`:

```yaml
storage:
  type: sqlite | json | memory
  path: "./data"

reflective:
  default_pattern: exploratory | analytical | creative | strategic
  auto_switch: true | false

security:
  vault_enabled: true | false
  encryption_key: "..."

session:
  default_context_limit: 100
```

---

## Error Messages

### "Session not found"
Attempted to load a session that doesn't exist. Check session ID.

### "Storage backend not initialized"
Storage path or configuration invalid. Verify config.

### "Encryption key required"
Vault enabled but no encryption key provided.

### "Invalid pattern"
Reflective pattern not recognized. Use `ReflectivePattern` enum.

---

## Questions?

- **[Getting Started](getting_started.md)** — Begin here
- **[Troubleshooting](troubleshooting.md)** — Common problems
- **[API Reference](../docs/api-reference.md)** — Technical details
- **[GitHub Discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)** — Ask anything

---

**Term not listed?** Open an issue or discussion to request an addition!
