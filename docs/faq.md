# Frequently Asked Questions

Common questions about ActiveMirrorOS, answered.

---

## General Questions

### What is ActiveMirrorOS?

ActiveMirrorOS is an open-source SDK that adds persistent memory to AI applications. It's the memory layer that sits between your app and any AI model (or no model at all), enabling conversations and context to persist across sessions, days, or months.

Think of it as "persistent RAM for AI"—your AI can finally remember.

### Do I need to pay for an API key?

**No!** ActiveMirrorOS works completely standalone without any external APIs. You can:
- Use it with local LLMs (Ollama, LM Studio)—free
- Use it with cloud LLMs (OpenAI, Claude)—you bring your own key
- Use it without any LLM—just memory and reflective patterns

The SDK itself is free and open source (MIT license).

### Is my data sent to the cloud?

**No, by default.** ActiveMirrorOS is **local-first**:
- Data stored on your device (SQLite or JSON files)
- No telemetry or tracking
- No cloud dependencies
- You control where data lives

Optional: You can add cloud sync yourself, but it's not required or built-in.

### What programming languages are supported?

Currently:
- **Python** 3.8+ (full SDK)
- **JavaScript** / Node.js 16+ (full SDK)

Coming soon:
- TypeScript definitions (Q1 2025)
- Rust SDK (Q3 2025)
- Go SDK (Q4 2025)

### Can I use this in production?

**Yes!** Version 0.2.0 is production-ready:
- 83 passing tests
- Stable API
- Used in real projects
- MIT license (commercial use allowed)

Thousands of messages processed in testing. Battle-tested storage backends.

---

## Technical Questions

### How does memory persistence work?

Three-tier memory model:

1. **RAM**: Active session data (fast access)
2. **Disk**: SQLite/JSON (persistent across restarts)
3. **Vault**: Encrypted storage (AES-256-GCM for sensitive data)

Data flows: App → RAM → Disk automatically. You just use `session.add_message()` and it's saved.

### What's the performance like?

**Fast!**
- Session creation: < 10ms
- Message storage: < 5ms (SQLite), < 2ms (JSON)
- Session loading: < 50ms (typical session)
- Encryption overhead: < 20ms (vault operations)

Tested with:
- Sessions up to 10,000 messages
- 1000+ concurrent sessions
- No significant slowdown

### What storage backends are supported?

Built-in:
- **SQLite**: Production-grade, relational
- **JSON**: Simple, file-based
- **In-Memory**: Testing only (not persistent)

Custom:
- Implement `StorageBackend` interface
- Examples: Redis, PostgreSQL, MongoDB, S3

See [api_examples.md](../sdk/api_examples.md#custom-storage) for custom backends.

### How do I backup my data?

**SQLite**:
```bash
# Backup database file
cp memory.db memory.db.backup.$(date +%Y%m%d)

# Or use SQLite backup command
sqlite3 memory.db ".backup memory.db.backup"
```

**JSON**:
```bash
# Backup entire directory
cp -r memory/ memory.backup.$(date +%Y%m%d)/
```

**Export sessions**:
```python
# Export to portable format
mirror.export_session("session-id", format="json", output="backup.json")
```

### Can I search through conversation history?

Basic search is included:
```python
# Filter messages
results = [msg for msg in session.messages if "keyword" in msg.content]
```

Advanced search coming in v0.3.0:
- Full-text search
- Semantic search with embeddings
- Date range queries
- Tag-based filtering

### How big can sessions get?

Tested limits:
- **Messages per session**: 10,000+ (no issues)
- **Session count**: 1,000+ (no slowdown)
- **Database size**: Multi-GB (SQLite handles it)

Practical advice:
- For normal use (chat, journal): No limits
- For massive scale: Consider pagination or archiving old sessions

### Does it work offline?

**Yes!** Everything runs locally:
- Storage: Local files
- Reflective patterns: Built-in logic
- Optional: Use local LLMs (Ollama, LM Studio)

No internet required.

---

## Integration Questions

### Can I use it with OpenAI?

**Yes!** Example:

```python
import openai
from activemirror import ActiveMirror

mirror = ActiveMirror(storage_type="sqlite", db_path="openai_memory.db")
session = mirror.create_session("chat")

# Get context
messages = [{"role": m.role, "content": m.content} for m in session.get_context()]

# Call OpenAI
response = openai.ChatCompletion.create(model="gpt-4", messages=messages)

# Store response
session.add_message("assistant", response.choices[0].message.content)
```

See [api_examples.md](../sdk/api_examples.md#llm-integration) for more.

### Can I use it with local LLMs?

**Absolutely!** Works great with:
- **Ollama** (recommended)
- **LM Studio**
- **llama.cpp**
- **GPT4All**
- **LocalAI**

See [local_llm_integration.md](../sdk/local_llm_integration.md) for full guide.

### Can I use it with LangChain?

**Yes!** ActiveMirrorOS provides memory, LangChain provides orchestration:

```python
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from activemirror import ActiveMirror

# Use ActiveMirrorOS for persistence
mirror = ActiveMirror(storage_type="sqlite", db_path="langchain.db")
session = mirror.create_session("langchain")

# Build LangChain memory from ActiveMirrorOS context
history = session.get_context()
# ... integrate with LangChain ...
```

They complement each other well.

### Can I integrate with vector databases?

**Yes!** Use for semantic search:

```python
from activemirror import ActiveMirror
import chromadb  # or Pinecone, Weaviate, etc.

mirror = ActiveMirror(storage_type="sqlite", db_path="rag.db")
session = mirror.create_session("docs")

# Store in both
chroma_client = chromadb.Client()
collection = chroma_client.create_collection("memories")

for msg in session.messages:
    # Store in vector DB for semantic search
    collection.add(documents=[msg.content], ids=[msg.id])
```

Vector DB = semantic search. ActiveMirrorOS = structured memory.

---

## Reflective Patterns (LingOS)

### What are reflective patterns?

LingOS Lite provides 4 thinking modes:
- **Exploratory** (🔍): Open-ended questioning
- **Analytical** (🔬): Structured breakdown
- **Creative** (💡): Idea generation
- **Strategic** (🎯): Action planning

They add meta-cognitive markers to AI responses.

### Do I need LingOS Pro?

**No!** LingOS Lite (included) is enough for most use cases. Upgrade to Pro (Q4 2025) only if you need:
- Custom patterns
- Meta-cognitive loops
- Pattern composition
- Advanced features

See [upgrade_to_lingos_pro.md](../onboarding/upgrade_to_lingos_pro.md).

### Can I create custom patterns?

Not in LingOS Lite (current). Coming in LingOS Pro (v0.6.0).

Workaround: Extend pattern definitions in your app code.

---

## Security & Privacy

### Is my data encrypted?

**Storage**: Not by default (SQLite/JSON are plaintext). Use Vault for encryption:

```python
from activemirror.vault_memory import VaultMemory

vault = VaultMemory(vault_path="secure.db", password="strong-password")
vault.store("api-key", "sk-...", category="credentials")
```

**Vault uses**: AES-256-GCM + PBKDF2 key derivation.

**Transport**: All local by default (no network). If you add sync, use HTTPS/TLS.

### Can I self-host?

**Yes!** Everything runs locally:
- No external dependencies
- No cloud services
- Deploy anywhere (laptop, server, air-gapped)

### What data does ActiveMirrorOS collect?

**None.** Zero telemetry, no tracking, no analytics.

Open source—you can verify: https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS

### Is it GDPR compliant?

ActiveMirrorOS itself doesn't collect data, so GDPR doesn't apply to the SDK.

For your application:
- Data stays local (user's device)
- User controls their data
- Easy to export/delete (built-in)

Consult a lawyer for your specific use case.

---

## Licensing & Usage

### What's the license?

**MIT License** — very permissive:
- ✓ Commercial use
- ✓ Modification
- ✓ Distribution
- ✓ Private use
- No warranty (use at your own risk)

See [LICENSE](../LICENSE) for full text.

### Can I use it in commercial products?

**Yes!** No restrictions. Build and sell products using ActiveMirrorOS.

Optional: Attribution is appreciated but not required.

### Do I need to open-source my application?

**No!** MIT license doesn't require you to share your code.

You can build closed-source, proprietary, commercial products.

### Can I get support?

**Community support** (free):
- GitHub Issues
- GitHub Discussions
- Documentation

**Premium support** (coming):
- Priority bug fixes
- Custom feature development
- Consulting and training
- SLA guarantees

See [pricing.md](pricing.md).

---

## Comparison Questions

### ActiveMirrorOS vs. ChatGPT Memory feature?

| Feature | ChatGPT Memory | ActiveMirrorOS |
|---------|---------------|----------------|
| **Control** | OpenAI controls | You control |
| **Privacy** | Cloud-based | Local by default |
| **Cost** | Pay per use | Free (open source) |
| **Portability** | Locked to ChatGPT | Works with any LLM |
| **Customization** | Limited | Fully extensible |

### ActiveMirrorOS vs. building it myself?

**Building from scratch**:
- ✓ Tailored to your exact needs
- ✗ Weeks/months of development
- ✗ Testing and edge cases
- ✗ Ongoing maintenance

**Using ActiveMirrorOS**:
- ✓ Production-ready in minutes
- ✓ 83 tests already written
- ✓ Battle-tested code
- ✓ Community support
- ✓ Still fully customizable

**Verdict**: Use ActiveMirrorOS unless you have very unique requirements.

### ActiveMirrorOS vs. simple JSON files?

Simple approach:
```python
import json

# Load
with open("memory.json") as f:
    data = json.load(f)

# Save
with open("memory.json", "w") as f:
    json.dump(data, f)
```

**What you miss**:
- Session management
- Efficient querying (SQLite indexes)
- Encryption for sensitive data
- Reflective patterns
- Export formats
- Error handling
- Type safety

**When to use simple JSON**: Quick prototypes, tiny projects.
**When to use ActiveMirrorOS**: Anything you plan to maintain or scale.

---

## Troubleshooting

### "Session not found" error?

```python
# Check if exists first
if "my-session" in mirror.list_sessions():
    session = mirror.load_session("my-session")
else:
    session = mirror.create_session("my-session")
```

### Sessions not persisting?

**Check**:
1. Are you using "memory" storage? (in-memory only, not persistent)
2. Is the database file writable?
3. Are you calling `session.add_message()` to trigger saves?

**Fix**: Use "sqlite" or "json" storage type.

### Performance is slow?

**Causes**:
- Large session (10,000+ messages) → Use pagination
- Many sessions (1,000+) → Index properly, use SQLite
- Vault operations → Expected (encryption overhead)

**Fixes**:
- Limit context window
- Archive old sessions
- Use SQLite instead of JSON

See [troubleshooting.md](../onboarding/troubleshooting.md) for more.

### Import errors?

```bash
# Ensure SDK is installed
cd sdk/python && pip install -e .

# Verify
python -c "from activemirror import ActiveMirror; print('OK')"
```

---

## Roadmap & Future

### When is v1.0 coming?

**Target: 2026**

Milestones:
- v0.3.0 (Q1 2025): Enhanced search
- v0.4.0 (Q2 2025): LLM integration
- v0.5.0 (Q3 2025): Multi-device sync
- v0.6.0 (Q4 2025): LingOS Pro
- v1.0.0 (2026): Stable release

See [roadmap.md](roadmap.md) for details.

### Will the API change?

**v0.x**: Minor changes possible (we'll document them)
**v1.0+**: API stability guaranteed (semantic versioning)

We try to avoid breaking changes even in v0.x.

### Can I request features?

**Yes!** Two ways:
1. **GitHub Issues**: Feature requests welcome
2. **Pull Requests**: Even better—contribute directly

See [CONTRIBUTING.md](../CONTRIBUTING.md).

### Will ActiveMirrorOS stay free?

**Yes, forever.** MIT license guarantees this.

We may add:
- Optional paid support for enterprises
- Hosted version (optional SaaS)
- Premium extensions

But the core SDK remains free and open source.

---

## Getting Help

### Where do I start?

1. [Getting Started Guide](../onboarding/getting_started.md) — 15 minutes
2. [Demo App](../demo/) — Hands-on example
3. [API Examples](../sdk/api_examples.md) — Copy-paste code

### I'm stuck. What now?

1. Check [Troubleshooting Guide](../onboarding/troubleshooting.md)
2. Search [GitHub Issues](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues)
3. Ask in [GitHub Discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)
4. Open a new issue with:
   - Error message
   - Code to reproduce
   - System info (OS, Python/Node version)

### How can I contribute?

Many ways:
- Try the demo and report bugs
- Improve documentation
- Add examples or tutorials
- Build integrations
- Share your use case
- Contribute code

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

## Still Have Questions?

**Ask the community**:
- [GitHub Discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)

**Report bugs**:
- [GitHub Issues](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues)

**Read more**:
- [Product Overview](product_overview.md) — What ActiveMirrorOS is
- [Architecture](architecture.md) — How it works
- [API Reference](api-reference.md) — Technical details

---

**Question not answered?** Open a discussion and we'll add it to this FAQ!
