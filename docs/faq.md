# Frequently Asked Questions

Common questions about ActiveMirrorOS, answered clearly and concisely.

---

## General Questions

### What is ActiveMirrorOS?

ActiveMirrorOS is a memory-first SDK for building AI applications with persistent conversations, reflective dialogue, and local-first privacy. It's infrastructure, not a chatbot.

**Simple answer:** It gives AI the ability to remember forever and think about its own thinking.

---

### Do I need to run an AI model?

**No.** ActiveMirrorOS is a memory/persistence layer, not an AI model itself.

**You provide:** The AI model (OpenAI, Anthropic, local LLM, etc.)
**ActiveMirrorOS provides:** Memory, sessions, reflection patterns, storage

---

### Is ActiveMirrorOS a chatbot?

**No.** It's infrastructure for *building* chatbots (or any AI app needing memory).

**Analogy:** PostgreSQL isn't a web app - it's infrastructure for web apps. ActiveMirrorOS isn't a chatbot - it's infrastructure for AI apps.

---

### Can it work offline?

**Yes.** ActiveMirrorOS stores everything locally.

**Works offline:**
- All session management
- Message storage/retrieval
- Exports, backups
- Reflection patterns (if using local LLM)

**Needs internet:**
- Cloud AI APIs (OpenAI, Anthropic, etc.)
- Device sync (if using cloud storage)

---

## Privacy & Security

### Where is my data stored?

**By default:** On your local device.

**Storage locations:**
- **SQLite:** Local database file (e.g., `memory.db`)
- **JSON:** Local directory with JSON files
- **Vault:** Encrypted local files

You control where the files live (local disk, Dropbox, iCloud, etc.).

---

### Is my data encrypted?

**Regular sessions:** Not encrypted by default (stored in SQLite/JSON).

**Sensitive data:** Use the Vault with AES-256-GCM encryption.

```python
from activemirror import VaultMemory

vault = VaultMemory(password="your-secure-password")
vault.store("api_key", "sk-...")  # Encrypted
```

---

### Does ActiveMirrorOS send my data anywhere?

**No.** ActiveMirrorOS is local-first. Your data never leaves your device unless you explicitly configure sync or call external APIs.

**What ActiveMirrorOS does NOT do:**
- ❌ Send data to cloud servers
- ❌ Track usage
- ❌ Profile users
- ❌ Phone home

---

### Can I sync across devices?

**Yes, but you configure it.** ActiveMirrorOS doesn't include auto-sync (privacy by design).

**Options:**
1. **Cloud storage:** Point database to Dropbox/iCloud/Google Drive
2. **Git repository:** Version-control your sessions
3. **Self-hosted sync:** Run your own sync server
4. **Manual:** Export/import sessions

---

## Technical Questions

### What programming languages are supported?

**Fully supported:**
- Python 3.8+
- JavaScript (Node.js 14+)

Both SDKs have feature parity.

---

### What storage backends are available?

| Backend | Best For | Persistent? |
|---------|----------|-------------|
| **SQLite** | Production apps | ✅ Yes |
| **JSON** | Prototyping, sharing | ✅ Yes |
| **Memory** | Testing | ❌ No (RAM only) |

---

### Can I use it with local LLMs?

**Yes!** ActiveMirrorOS works great with local LLMs.

**Supported:**
- Ollama
- LM Studio
- llama.cpp
- GPT4All
- Hugging Face Transformers

**See:** [Local LLM Integration Guide](../starters/local_llm_integration.md)

---

### Can I use it with cloud AI APIs?

**Yes!** Works with any AI API.

**Compatible:**
- OpenAI (GPT-3.5, GPT-4, etc.)
- Anthropic (Claude)
- Google (Gemini)
- Cohere
- Any custom API

ActiveMirrorOS handles the memory layer; you handle the AI calls.

---

### How do I export conversations?

```python
# Python
mirror.export_session("session-id", format="markdown")

# JavaScript
mirror.exportSession('session-id', 'markdown');
```

**Formats:** Markdown, JSON, plain text

---

### How do I delete sessions?

```python
# Python
mirror.delete_session("session-id")

# JavaScript
mirror.deleteSession('session-id');
```

**Note:** Deletion is permanent. Export first if you want backups.

---

## Product & Ecosystem

### What's the difference between ActiveMirrorOS and MirrorDNA-Standard?

| Component | Purpose | Audience |
|-----------|---------|----------|
| **MirrorDNA-Standard** | Protocol specification | Architects, researchers |
| **ActiveMirrorOS** | SDK & apps (implements standard) | Developers, users |

**Simple:** MirrorDNA-Standard defines *how it should work*. ActiveMirrorOS is the *working implementation*.

---

### What is LingOS?

**LingOS** is the reflective AI dialogue framework.

**LingOS Lite** (free, included with ActiveMirrorOS):
- 4 dialogue modes
- Basic uncertainty markers
- Simple meta-cognition

**LingOS Pro** (coming soon):
- 12+ modes + custom
- Advanced reflection
- Cross-session patterns

---

### What's the relationship with TrustByDesign?

**TrustByDesign** is the privacy and security framework ensuring:
- Local-first architecture
- Encryption standards (AES-256-GCM)
- Data sovereignty
- Ethical AI principles

ActiveMirrorOS implements TrustByDesign principles.

---

## Pricing & Licensing

### How much does ActiveMirrorOS cost?

**Free forever.** MIT License.

---

### How much does LingOS Lite cost?

**Free.** Included with ActiveMirrorOS.

---

### What about LingOS Pro?

**Coming soon.** Pricing TBA.

**Estimated:**
- Personal tier: Low cost
- Pro tier: Moderate
- Enterprise: Custom pricing

**See:** [pricing.md](pricing.md)

---

### Can I use ActiveMirrorOS commercially?

**Yes.** MIT License allows commercial use without restrictions.

**You can:**
- Build commercial products
- Sell apps using ActiveMirrorOS
- Offer services based on it
- Modify and distribute

**No fees, no attribution required** (though appreciated).

---

## Usage & Development

### How long does it take to integrate?

**Simple integration:** 10-30 minutes
**Production app:** 1-2 days
**Full customization:** 1-2 weeks

**Most developers ship their first integration in under an hour.**

---

### Are there code examples?

**Yes! Lots.**

- [Python Starter](../starters/python_starter.py)
- [JavaScript Starter](../starters/javascript_starter.js)
- [API Examples](../starters/api_examples.md)
- [Local LLM Integration](../starters/local_llm_integration.md)
- [Demo Conversations](../demo/)

---

### Is there a REST API?

**Not built-in**, but you can wrap the SDK easily.

**See:** [api_examples.md](../starters/api_examples.md) for Express.js and FastAPI implementations.

---

### Can I contribute?

**Yes!** We welcome contributions.

**How to contribute:**
1. Read [CONTRIBUTING.md](../CONTRIBUTING.md)
2. Check [open issues](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues)
3. Submit pull requests
4. Join [discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)

---

## Troubleshooting

### Installation fails - what do I do?

**Python:**
```bash
pip install --upgrade pip
pip install --no-cache-dir git+https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git#subdirectory=sdk/python
```

**JavaScript:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**See:** [Troubleshooting Guide](../onboarding/troubleshooting.md)

---

### Sessions not persisting - why?

**Common cause:** Using `storage_type="memory"` instead of `"sqlite"`.

**Fix:**
```python
# Wrong (RAM only, not persistent)
mirror = ActiveMirror(storage_type="memory")

# Correct (persists to disk)
mirror = ActiveMirror(storage_type="sqlite", db_path="memory.db")
```

---

### Tests failing - what's wrong?

**Check versions:**
```bash
python --version  # Should be 3.8+
node --version    # Should be 14+
```

**Reinstall:**
```bash
# Python
cd sdk/python && pip install -e ".[dev]"

# JavaScript
cd sdk/javascript && npm install
```

**See:** [Troubleshooting Guide](../onboarding/troubleshooting.md)

---

## Performance

### How many messages can a session hold?

**Technical limit:** Millions (SQLite can handle it)
**Practical limit:** Depends on context window of your LLM

**Best practice:** Use recent messages + summaries for very long sessions.

---

### How fast is it?

**Typical operations:**
- Create session: <1ms
- Add message: <5ms
- Load session (100 messages): <10ms
- Load session (10k messages): <100ms
- Export markdown: <100ms

**Bottleneck:** Usually the LLM API call, not ActiveMirrorOS.

---

### Does it scale to production?

**Yes.** v0.2.0 is production-ready.

**Proven at:**
- Thousands of sessions
- Millions of messages
- Multi-tenant applications
- High-concurrency scenarios

---

## Comparison Questions

### ActiveMirrorOS vs. LangChain?

**LangChain:** Framework for chaining LLM calls, agents, tools
**ActiveMirrorOS:** Persistent memory and reflection layer

**They're complementary.** Use both:
- LangChain for orchestration
- ActiveMirrorOS for memory persistence

---

### ActiveMirrorOS vs. Vector Databases?

**Vector DB (Pinecone, Weaviate):** Semantic search, RAG
**ActiveMirrorOS:** Full conversation memory

**Different use cases:**
- Vector DB: "Find similar documents"
- ActiveMirrorOS: "Remember our conversation"

**Can combine:**
- ActiveMirrorOS for dialogue memory
- Vector DB for knowledge retrieval

---

### ActiveMirrorOS vs. Redis?

**Redis:** Fast in-memory cache
**ActiveMirrorOS:** Persistent conversation storage

**Redis:** Temporary, fast, loses data on restart
**ActiveMirrorOS:** Permanent, disk-based, survives restarts

---

## Future Plans

### What's on the roadmap?

**v0.3.0** (Q1 2025):
- Enhanced search (semantic + full-text)
- Real-time sync
- Plugin architecture

**v0.4.0** (Q2 2025):
- Mobile SDKs (iOS, Android)
- GraphQL API
- Advanced analytics

**See:** [Full Roadmap](roadmap.md)

---

### Will there be more languages?

**Planned:**
- Go SDK
- Rust SDK
- Swift SDK (native iOS)
- Kotlin SDK (native Android)

**Timeline:** 2025

---

### When is LingOS Pro launching?

**Target:** Q2 2025

**Beta access:** Q1 2025 (sign up on GitHub Discussions)

---

## Still Have Questions?

**Documentation:**
- [Getting Started](../onboarding/getting_started.md)
- [Product Overview](product_overview.md)
- [Troubleshooting](../onboarding/troubleshooting.md)

**Community:**
- [GitHub Discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)
- [GitHub Issues](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues)

**Can't find your answer?** [Ask on GitHub Discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)

---

**FAQ Version:** 1.0
**Last Updated:** 2025-01-14
