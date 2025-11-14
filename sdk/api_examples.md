# API Examples

Complete examples for common ActiveMirrorOS use cases.

---

## Table of Contents

1. [Basic Session Management](#basic-session-management)
2. [Multi-Session Workflows](#multi-session-workflows)
3. [Reflective Patterns](#reflective-patterns)
4. [Encrypted Vault](#encrypted-vault)
5. [LLM Integration](#llm-integration)
6. [Export & Import](#export--import)
7. [Search & Query](#search--query)
8. [Custom Storage](#custom-storage)

---

## Basic Session Management

### Create and Use a Session

**Python**:
```python
from activemirror import ActiveMirror

# Initialize
mirror = ActiveMirror(storage_type="sqlite", db_path="app.db")

# Create session
session = mirror.create_session("chat-001")

# Add messages
session.add_message("user", "What is persistent memory?")
session.add_message(
    "assistant",
    "Persistent memory allows data to survive beyond a single session..."
)

# Get context
context = session.get_context()
print(f"Session has {len(context)} messages")
```

**JavaScript**:
```javascript
const { ActiveMirror } = require('./activemirror');

// Initialize
const mirror = new ActiveMirror('./app_data');

// Create session
const session = mirror.createSession('chat-001');

// Add messages
session.addMessage('user', 'What is persistent memory?');
session.addMessage(
    'assistant',
    'Persistent memory allows data to survive beyond a single session...'
);

// Get context
const context = session.getContext();
console.log(`Session has ${context.length} messages`);
```

### Load Existing Session

**Python**:
```python
# Check if exists
if "chat-001" in mirror.list_sessions():
    session = mirror.load_session("chat-001")
    print(f"Loaded session with {len(session.messages)} messages")
else:
    print("Session not found")
```

**JavaScript**:
```javascript
// Check if exists
const sessions = mirror.listSessions();
if (sessions.includes('chat-001')) {
    const session = mirror.loadSession('chat-001');
    console.log(`Loaded session with ${session.messages.length} messages`);
} else {
    console.log('Session not found');
}
```

### Delete a Session

**Python**:
```python
mirror.delete_session("chat-001")
print("Session deleted")
```

**JavaScript**:
```javascript
mirror.deleteSession('chat-001');
console.log('Session deleted');
```

---

## Multi-Session Workflows

### Managing Multiple Conversations

**Python**:
```python
from activemirror import ActiveMirror

mirror = ActiveMirror(storage_type="sqlite", db_path="multi.db")

# Create multiple sessions
personal = mirror.create_session("personal-journal")
work = mirror.create_session("work-notes")
research = mirror.create_session("research-log")

# Use them independently
personal.add_message("user", "Today I learned...")
work.add_message("user", "Project status update")
research.add_message("user", "Hypothesis about...")

# List all sessions
all_sessions = mirror.list_sessions()
print(f"Managing {len(all_sessions)} sessions: {all_sessions}")
```

### Session Switching

**Python**:
```python
# Switch between sessions
current_session_id = "personal-journal"

# Later...
if user_wants_work_context:
    current_session_id = "work-notes"

session = mirror.load_session(current_session_id)
```

---

## Reflective Patterns

### Using Different Thinking Modes

**Python**:
```python
from activemirror.reflective_client import ReflectiveClient, ReflectivePattern

client = ReflectiveClient(storage_dir="reflective_memory")
session_id = client.create_session("problem-solving")

# Exploratory: for brainstorming
response = client.reflect(
    session_id=session_id,
    user_input="What are the possibilities here?",
    pattern=ReflectivePattern.EXPLORATORY
)
print(f"Exploratory: {response.reflection}")

# Analytical: for structured thinking
response = client.reflect(
    session_id=session_id,
    user_input="Break this down systematically.",
    pattern=ReflectivePattern.ANALYTICAL
)
print(f"Analytical: {response.reflection}")

# Creative: for ideation
response = client.reflect(
    session_id=session_id,
    user_input="Give me innovative approaches.",
    pattern=ReflectivePattern.CREATIVE
)
print(f"Creative: {response.reflection}")

# Strategic: for planning
response = client.reflect(
    session_id=session_id,
    user_input="What's the action plan?",
    pattern=ReflectivePattern.STRATEGIC
)
print(f"Strategic: {response.reflection}")
```

**JavaScript**:
```javascript
const { ReflectiveClient } = require('./reflective-client');

const client = new ReflectiveClient('./reflective_memory');
const sessionId = client.createSession('problem-solving');

// Exploratory
let response = client.reflect({
    sessionId: sessionId,
    userInput: 'What are the possibilities here?',
    pattern: 'exploratory'
});
console.log(`Exploratory: ${response.reflection}`);

// Analytical
response = client.reflect({
    sessionId: sessionId,
    userInput: 'Break this down systematically.',
    pattern: 'analytical'
});
console.log(`Analytical: ${response.reflection}`);
```

### Auto-Pattern Selection

**Python**:
```python
# Let the system choose the best pattern
response = client.auto_reflect(
    session_id=session_id,
    user_input="I'm not sure how to approach this...",
    context=session.get_context()
)

print(f"Auto-selected: {response.pattern}")
print(f"Reflection: {response.reflection}")
```

---

## Encrypted Vault

### Storing Sensitive Data

**Python**:
```python
from activemirror.vault_memory import VaultMemory, VaultCategory

# Create vault with password
vault = VaultMemory(
    vault_path="secure.db",
    password="strong-password-here"
)

# Store API keys
vault.store(
    key="openai_key",
    value="sk-...",
    category=VaultCategory.CREDENTIALS,
    metadata={"service": "OpenAI", "created": "2025-01-14"}
)

# Store personal info
vault.store(
    key="user_profile",
    value={
        "email": "user@example.com",
        "preferences": {"theme": "dark"}
    },
    category=VaultCategory.PERSONAL
)

# Retrieve
api_key = vault.retrieve("openai_key")
profile = vault.retrieve("user_profile")
```

**JavaScript**:
```javascript
const { VaultMemory } = require('./vault');

// Create vault
const vault = new VaultMemory({
    vaultPath: './secure.json',
    password: 'strong-password-here'
});

// Store credentials
vault.store(
    'openai_key',
    'sk-...',
    'credentials',
    { service: 'OpenAI', created: '2025-01-14' }
);

// Retrieve
const apiKey = vault.retrieve('openai_key');
```

### Vault Categories

**Python**:
```python
from activemirror.vault_memory import VaultCategory

# Available categories:
# - VaultCategory.CREDENTIALS: API keys, passwords
# - VaultCategory.PERSONAL: PII, user data
# - VaultCategory.SENSITIVE: Any sensitive information
# - VaultCategory.GENERAL: Default category

# Query by category
credentials = vault.list_by_category(VaultCategory.CREDENTIALS)
print(f"Stored credentials: {credentials}")
```

---

## LLM Integration

### With OpenAI

**Python**:
```python
from activemirror import ActiveMirror
import openai

mirror = ActiveMirror(storage_type="sqlite", db_path="llm_memory.db")
session = mirror.create_session("chat-with-llm")

# Get conversation context
context = session.get_context()

# Build prompt with history
messages = [{"role": msg.role, "content": msg.content} for msg in context]
messages.append({"role": "user", "content": "What did we discuss earlier?"})

# Call OpenAI
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=messages
)

# Store response
assistant_message = response.choices[0].message.content
session.add_message("assistant", assistant_message)

print(assistant_message)
```

### With Anthropic Claude

**Python**:
```python
import anthropic
from activemirror import ActiveMirror

client = anthropic.Anthropic(api_key="...")
mirror = ActiveMirror(storage_type="sqlite", db_path="claude_memory.db")
session = mirror.create_session("claude-chat")

# Prepare context
context = session.get_context()
messages = [{"role": msg.role, "content": msg.content} for msg in context]

# Call Claude
response = client.messages.create(
    model="claude-3-5-sonnet-20250110",
    max_tokens=1024,
    messages=messages
)

# Store response
session.add_message("assistant", response.content[0].text)
```

### With Local LLM (Ollama)

**Python**:
```python
import requests
from activemirror import ActiveMirror

mirror = ActiveMirror(storage_type="sqlite", db_path="local_memory.db")
session = mirror.create_session("local-chat")

# Get context
context = session.get_context()
prompt = "\n".join([f"{msg.role}: {msg.content}" for msg in context])
prompt += "\nassistant:"

# Call Ollama API
response = requests.post("http://localhost:11434/api/generate", json={
    "model": "llama2",
    "prompt": prompt,
    "stream": False
})

# Store response
assistant_message = response.json()["response"]
session.add_message("assistant", assistant_message)
```

See [local_llm_integration.md](local_llm_integration.md) for more details.

---

## Export & Import

### Export Session to JSON

**Python**:
```python
# Export session
mirror.export_session(
    session_id="chat-001",
    format="json",
    output_path="exports/chat-001.json"
)
```

**JavaScript**:
```javascript
// Export session
mirror.exportSession('chat-001', 'json', './exports/chat-001.json');
```

### Export to Markdown

**Python**:
```python
# Create readable markdown file
mirror.export_session(
    session_id="chat-001",
    format="markdown",
    output_path="exports/chat-001.md"
)
```

### Export to MirrorDNA Format

**Python**:
```python
# Export to MirrorDNA standard format
mirror.export_session(
    session_id="chat-001",
    format="mirrordna",
    output_path="exports/chat-001.mirrordna.json"
)
```

### Import Session

**Python**:
```python
# Import from JSON
mirror.import_session(
    input_path="exports/chat-001.json",
    session_id="imported-chat"  # Optional: rename on import
)
```

---

## Search & Query

### Get Recent Messages

**Python**:
```python
# Get last 10 messages
recent = session.get_messages(limit=10)

# Get messages with offset
older = session.get_messages(limit=10, offset=10)
```

### Filter by Role

**Python**:
```python
# Get only user messages
user_messages = [msg for msg in session.messages if msg.role == "user"]

# Get only assistant messages
assistant_messages = [msg for msg in session.messages if msg.role == "assistant"]
```

### Search by Content

**Python**:
```python
# Simple text search
search_term = "memory"
matching = [
    msg for msg in session.messages
    if search_term.lower() in msg.content.lower()
]

print(f"Found {len(matching)} messages containing '{search_term}'")
```

### Query by Date Range

**Python**:
```python
from datetime import datetime, timedelta

# Get messages from last 7 days
week_ago = datetime.now() - timedelta(days=7)
recent = [
    msg for msg in session.messages
    if datetime.fromisoformat(msg.timestamp) > week_ago
]
```

---

## Custom Storage

### Implementing Custom Backend

**Python**:
```python
from activemirror.storage.base import StorageBackend
from activemirror import Session

class RedisStorage(StorageBackend):
    """Custom Redis storage backend."""

    def __init__(self, redis_url):
        import redis
        self.client = redis.from_url(redis_url)

    def save_session(self, session: Session):
        session_data = session.to_dict()
        self.client.set(
            f"session:{session.session_id}",
            json.dumps(session_data)
        )

    def load_session(self, session_id: str) -> Session:
        data = self.client.get(f"session:{session_id}")
        if not data:
            raise ValueError(f"Session {session_id} not found")
        return Session.from_dict(json.loads(data))

    def list_sessions(self):
        keys = self.client.keys("session:*")
        return [key.decode().split(":")[1] for key in keys]

# Use custom storage
storage = RedisStorage("redis://localhost:6379")
mirror = ActiveMirror(storage=storage)
```

---

## Complete Application Example

### Personal Journal with LLM

**Python**:
```python
from activemirror import ActiveMirror
from activemirror.reflective_client import ReflectiveClient, ReflectivePattern
import openai

class JournalApp:
    def __init__(self, openai_key):
        self.mirror = ActiveMirror(storage_type="sqlite", db_path="journal.db")
        self.reflective = ReflectiveClient(storage_dir="journal_reflections")
        openai.api_key = openai_key

    def add_entry(self, entry_text):
        """Add a journal entry with AI reflection."""
        session = self.mirror.load_session("daily-journal")

        # Store user entry
        session.add_message("user", entry_text)

        # Get reflective response
        response = self.reflective.reflect(
            session_id="daily-journal",
            user_input=entry_text,
            pattern=ReflectivePattern.EXPLORATORY
        )

        # Get AI insight
        context = session.get_context()
        messages = [{"role": m.role, "content": m.content} for m in context]

        ai_response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages
        )

        insight = ai_response.choices[0].message.content
        session.add_message("assistant", insight)

        return {
            "reflection": response.reflection,
            "insight": insight
        }

    def get_history(self, days=7):
        """Get journal entries from last N days."""
        session = self.mirror.load_session("daily-journal")
        # ... filter by date ...
        return session.get_messages(limit=days * 2)  # User + assistant per day

# Usage
journal = JournalApp(openai_key="sk-...")
result = journal.add_entry("Today I learned about persistent AI memory")
print(f"Reflection: {result['reflection']}")
print(f"AI Insight: {result['insight']}")
```

---

## Error Handling

### Robust Session Loading

**Python**:
```python
def get_or_create_session(mirror, session_id):
    """Load session if exists, otherwise create."""
    try:
        return mirror.load_session(session_id)
    except ValueError:
        return mirror.create_session(session_id)

# Usage
session = get_or_create_session(mirror, "my-session")
```

### Handling Storage Errors

**Python**:
```python
try:
    session = mirror.load_session("important-session")
except ValueError as e:
    print(f"Session not found: {e}")
    # Fallback: create new
    session = mirror.create_session("important-session")
except Exception as e:
    print(f"Storage error: {e}")
    # Fallback: in-memory
    mirror = ActiveMirror(storage_type="memory")
    session = mirror.create_session("temp-session")
```

---

## Next Steps

- **[API Reference](../docs/api-reference.md)** — Complete SDK documentation
- **[Python Starter](python_starter.py)** — Copy-paste starter template
- **[JavaScript Starter](javascript_starter.js)** — JS starter template
- **[Local LLM Integration](local_llm_integration.md)** — Ollama, LM Studio, etc.
- **[Example Apps](../apps/)** — Full working applications

---

## Contributing Examples

Have a useful example? Submit a PR!

1. Fork the repository
2. Add your example to this file or create a new file in `examples/`
3. Test your code
4. Submit PR with description

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
