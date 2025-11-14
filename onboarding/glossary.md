# ActiveMirrorOS Glossary

A comprehensive reference for terms, concepts, and components in the ActiveMirrorOS ecosystem.

---

## Core Concepts

### ActiveMirrorOS
The product-layer SDK and apps for building AI applications with persistent memory, context preservation, and reflective dialogue. The main repository and user-facing product.

**Example:** "ActiveMirrorOS is where you build apps, while MirrorDNA-Standard defines how they should work."

---

### Session
A persistent conversation or interaction thread with a unique identifier. Sessions can span minutes, days, or years while maintaining full context.

**Technical:** A collection of messages with metadata, stored persistently.

**Example:**
```python
session = mirror.create_session("my-project-planning")
session.add_message("user", "Let's plan the MVP")
# Days later...
loaded = mirror.load_session("my-project-planning")  # Full context restored
```

---

### Mirror
The core abstraction representing an AI's persistent memory system. A mirror manages sessions, storage, and retrieval.

**Analogy:** Like a database connection, but for conversational memory.

**Example:**
```python
mirror = ActiveMirror(storage_type="sqlite", db_path="memory.db")
```

---

### Message
A single turn in a conversation, with a role (user/assistant/system) and content.

**Structure:**
```python
{
    "role": "user",           # or "assistant", "system"
    "content": "Hello!",      # The message text
    "timestamp": "2025-01-14T10:00:00Z",
    "metadata": {...}         # Optional extra data
}
```

---

### Context
The full conversation history within a session, used to maintain continuity.

**Example:**
```python
context = session.get_context()  # Returns all messages in chronological order
```

---

### Persistence
The ability for data (sessions, messages) to survive application restarts, device changes, or time.

**Contrast:**
- **Ephemeral:** Lost on restart (e.g., standard ChatGPT)
- **Persistent:** Saved forever (e.g., ActiveMirrorOS)

---

## Storage

### Storage Backend
The underlying system where sessions and messages are persisted.

**Options:**
- **SQLite** — Relational database (recommended for production)
- **JSON** — File-based storage (simple, human-readable)
- **Memory** — RAM only (testing, temporary)

**Example:**
```python
mirror = ActiveMirror(storage_type="sqlite", db_path="memory.db")
```

---

### Vault
An encrypted storage layer for sensitive data, using AES-256-GCM encryption.

**Use cases:**
- Passwords, API keys
- Personal information
- Confidential conversations

**Example:**
```python
from activemirror import VaultMemory

vault = VaultMemory(password="your-secure-password")
vault.store("api_key", "sk-...")
api_key = vault.retrieve("api_key")
```

---

### Export
Converting a session to a different format (Markdown, JSON, plain text).

**Example:**
```python
mirror.export_session("my-session", format="markdown")
# Generates: my-session.md
```

---

## Reflection & Dialogue

### LingOS
The full reflective AI dialogue framework. Provides advanced reflection, uncertainty marking, and adaptive communication.

**Tiers:**
- **LingOS Lite:** Free, included with ActiveMirrorOS
- **LingOS Pro:** Advanced features (coming soon)

---

### LingOS Lite
The lightweight, free version of LingOS included with ActiveMirrorOS.

**Features:**
- 4 dialogue modes
- Basic uncertainty markers
- Simple meta-cognition
- Session-level patterns

---

### Reflection
The AI's ability to think about its own reasoning, mark uncertainty, and adapt its responses.

**Example:** Instead of "Use microservices" → "This depends on your scale [Uncertainty: high]"

---

### Uncertainty Marker
An explicit statement of confidence level in a response.

**Format:** `[Uncertainty: low/medium/high/very high]`

**Example:**
```
Should you use Kubernetes?

[Uncertainty: high — Need more context about team size and scale]

Questions first:
- Team size?
- Current infrastructure?
```

---

### Dialogue Mode
A communication style the AI adopts based on the conversation type.

**LingOS Lite Modes:**
1. **Exploratory** — Open-ended, no premature conclusions
2. **Analytical** — Systematic, structured problem-solving
3. **Creative** — Divergent thinking, brainstorming
4. **Strategic** — Long-term planning, trade-off analysis

**Example:**
```python
client = ReflectiveClient(mode='analytical')
```

---

### Meta-Cognition
The AI's ability to think about its own thinking process and make it explicit.

**Example:**
```
[Meta-cognitive moment]

You asked why I keep asking questions instead of giving direct answers.

My reasoning:
1. Many questions are context-dependent
2. Asking clarifies before advising
3. Helps you access your own knowledge
```

---

### Pattern Recognition
The ability to notice trends, recurring themes, or behaviors across conversations.

**Example:**
```
Pattern observation: This is the third time this month you've
asked about changing jobs. The pattern suggests exploration
rather than urgency.
```

---

## Ecosystem

### MirrorDNA-Standard
The core protocol specification that defines how reflective AI systems should work.

**Role:** Architecture layer (defines the standard)

**Link:** [MirrorDNA-Standard Repository](https://github.com/MirrorDNA-Reflection-Protocol/MirrorDNA-Standard)

---

### TrustByDesign
The privacy and security framework ensuring data sovereignty and ethical AI.

**Principles:**
- Local-first by default
- Encryption for sensitive data
- User owns their data
- No tracking or profiling

---

### MirrorDNA Reflection Protocol
The overarching ecosystem combining MirrorDNA-Standard, ActiveMirrorOS, LingOS, and TrustByDesign.

**Layers:**
```
MirrorDNA-Standard (Protocol)
    ↓
LingOS + TrustByDesign (Capabilities)
    ↓
ActiveMirrorOS (Product)
```

---

## Technical Components

### SDK (Software Development Kit)
Pre-built libraries for Python and JavaScript that implement ActiveMirrorOS functionality.

**Python SDK:** `sdk/python/`
**JavaScript SDK:** `sdk/javascript/`

**Install:**
```bash
pip install git+https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git#subdirectory=sdk/python
```

---

### CLI (Command-Line Interface)
An interactive terminal application for journaling and conversing with ActiveMirrorOS.

**Location:** `apps/example-cli/`

**Usage:**
```bash
./amos-cli.js write "What did I learn today?"
```

---

### API (Application Programming Interface)
The set of functions and methods provided by the SDK.

**Core APIs:**
- `ActiveMirror` — Main class for memory management
- `Session` — Conversation management
- `ReflectiveClient` — Reflective dialogue
- `VaultMemory` — Encrypted storage

**Docs:** [API Reference](../docs/api-reference.md)

---

## Application Concepts

### Local-First
A design philosophy where data is stored on the user's device by default, with optional cloud sync.

**Benefits:**
- Privacy (data doesn't leave your device)
- Offline capability
- No vendor lock-in
- Faster access

---

### Cross-Platform
Software that runs on multiple operating systems (Windows, macOS, Linux, iOS, Android).

**ActiveMirrorOS SDKs:**
- Python SDK → Windows, macOS, Linux
- JavaScript SDK → Node.js (all platforms), browsers

**ActiveMirrorOS Apps:**
- CLI → Terminal (all platforms)
- Desktop → Electron (Windows, macOS, Linux)
- Mobile → React Native (iOS, Android)

---

### State Persistence
Maintaining application state (data, sessions) across restarts and sessions.

**Example:** Close the app, reopen it days later — all conversations intact.

**Technical:** Using SQLite or JSON files for durable storage.

---

## Workflow Terms

### Onboarding
The process of getting started with ActiveMirrorOS, from installation to first app.

**Guide:** [Getting Started](getting_started.md)

---

### Export/Import
Moving sessions between systems or converting to different formats.

**Export:**
```python
mirror.export_session("session-id", format="markdown")
```

**Import:**
```python
mirror.import_session("path/to/session.json")
```

---

### Backup
Creating copies of your data for safety and recovery.

**Manual backup:**
```bash
cp memory.db memory-backup-2025-01-14.db
```

**Automated backup:**
```python
import shutil
from datetime import datetime

backup_name = f"memory-backup-{datetime.now():%Y%m%d}.db"
shutil.copy("memory.db", backup_name)
```

---

## Comparisons

### ActiveMirrorOS vs. Traditional AI

| Aspect | Traditional AI | ActiveMirrorOS |
|--------|----------------|----------------|
| **Memory** | Ephemeral | Persistent |
| **Context** | Single conversation | Unlimited timeline |
| **Privacy** | Cloud-based | Local-first |
| **Continuity** | Breaks on new session | Seamless across time |
| **Reflection** | None | Built-in with LingOS |

---

### Session vs. Conversation

**Conversation:** Generic term for back-and-forth dialogue.

**Session:** Persistent, identified conversation with full context preservation.

**Example:**
```
Conversation: "Hi, how are you?" → "I'm good!"
Session: Identified conversation ("project-planning-2025")
         that persists across days, weeks, months.
```

---

## Acronyms

| Acronym | Full Term | Meaning |
|---------|-----------|---------|
| **OS** | Operating System | Software managing resources (ActiveMirrorOS = memory OS) |
| **SDK** | Software Development Kit | Pre-built libraries for developers |
| **API** | Application Programming Interface | Functions/methods for interacting with software |
| **CLI** | Command-Line Interface | Text-based terminal application |
| **JSON** | JavaScript Object Notation | Human-readable data format |
| **SQL** | Structured Query Language | Database query language (SQLite uses SQL) |
| **AES** | Advanced Encryption Standard | Encryption algorithm (AES-256-GCM) |
| **PBKDF2** | Password-Based Key Derivation Function 2 | Secure password hashing |
| **MRR** | Monthly Recurring Revenue | Business metric (used in demos) |
| **MVP** | Minimum Viable Product | Simplest version of a product |

---

## Common Confusion

### "Do I need to run an AI model?"

**No.** ActiveMirrorOS is a memory/persistence layer, not an AI model itself.

**You provide:** The AI model (OpenAI, Anthropic, local LLM, etc.)
**ActiveMirrorOS provides:** Memory, sessions, reflection patterns

**Example workflow:**
1. User sends message
2. ActiveMirrorOS stores it in session
3. You call your AI model (GPT-4, Claude, etc.)
4. AI responds
5. ActiveMirrorOS stores response
6. Context persists forever

---

### "Is this a chatbot?"

**No.** ActiveMirrorOS is infrastructure for building chatbots (or any AI app needing memory).

**Analogy:**
- Database (PostgreSQL) : Data storage :: ActiveMirrorOS : Conversation storage
- You wouldn't call PostgreSQL "a web app" — it's infrastructure for web apps
- Similarly, ActiveMirrorOS is infrastructure for AI apps

---

### "Can it work offline?"

**Yes.** ActiveMirrorOS stores everything locally.

**What works offline:**
- All session management
- Message storage/retrieval
- Exports, backups
- Reflection patterns (if model is local)

**What needs internet:**
- Calling cloud AI APIs (OpenAI, Anthropic, etc.)
- Syncing across devices (if using cloud storage)

---

## Next Steps

- [Getting Started](getting_started.md)
- [Install LingOS Lite](install_lingos_lite.md)
- [Read the FAQ](../docs/faq.md)
- [View Demos](../demo/)

---

**Glossary Version:** 1.0
**Last Updated:** 2025-01-14
