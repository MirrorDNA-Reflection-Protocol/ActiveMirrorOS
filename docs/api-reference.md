# API Reference

Complete API documentation for ActiveMirrorOS SDKs.

## Python SDK

### ActiveMirror

```python
from activemirror import ActiveMirror

mirror = ActiveMirror(
    storage_type="sqlite",  # or "memory"
    db_path="./memory.db",
    user_id="optional-user-id"
)
```

**Methods**:

- `create_session(title, parent_session_id=None) -> Session`
- `load_session(session_id) -> Session`
- `list_sessions(user_id=None, limit=100) -> List[SessionMetadata]`
- `delete_session(session_id) -> bool`

### Session

```python
session = mirror.create_session("My Session")
```

**Methods**:

- `send(message, metadata={}) -> Response`
- `get_messages(limit=None, offset=0) -> List[Message]`
- `add_context(content, context_type="system") -> None`
- `save() -> str`  # Returns session_id
- `export(format="json") -> str`  # "json", "markdown", "txt"

**Properties**:

- `id: str`
- `title: str`
- `user_id: str`
- `created_at: datetime`
- `updated_at: datetime`

### ReflectiveClient

```python
from activemirror import ReflectiveClient, ReflectivePattern

client = ReflectiveClient(
    llm_provider=None,  # Optional LLM function
    default_pattern=ReflectivePattern.EXPLORATORY,
    enable_glyphs=True
)

reflection = client.reflect(
    "Your input text",
    pattern=ReflectivePattern.STRATEGIC,
    context={"key": "value"}
)
```

**Returns**:
```python
{
    "response": str,
    "uncertainty": UncertaintyLevel,
    "glyphs": List[str],
    "pattern": str,
    "meta": dict
}
```

**Patterns**:
- `ReflectivePattern.EXPLORATORY`
- `ReflectivePattern.ANALYTICAL`
- `ReflectivePattern.CREATIVE`
- `ReflectivePattern.STRATEGIC`

**Uncertainty Levels**:
- `UncertaintyLevel.CONFIDENT`
- `UncertaintyLevel.LOW`
- `UncertaintyLevel.MEDIUM`
- `UncertaintyLevel.HIGH`

### VaultMemory

```python
from activemirror import VaultMemory, VaultCategory

vault = VaultMemory(
    vault_path="./vault",
    password="your-password"  # or encryption_key
)
```

**Methods**:

- `store(key, value, metadata={}) -> bool`
- `retrieve(key) -> Any`
- `delete(key) -> bool`
- `list_entries(filter_metadata=None) -> List[dict]`
- `search(query) -> List[dict]`
- `export_key() -> str`  # For backup
- `get_stats() -> dict`

**Categories**:
- `VaultCategory.GOALS`
- `VaultCategory.REFLECTIONS`
- `VaultCategory.PREFERENCES`
- `VaultCategory.PRIVATE`
- `VaultCategory.KNOWLEDGE`
- `VaultCategory.RELATIONSHIPS`

### Message & Response

```python
from activemirror import Message, Response

# Message
msg = Message(
    session_id="session_123",
    role="user",  # "user", "assistant", "system"
    content="Message text",
    metadata={}
)

# Response
response = Response(
    content="Response text",
    tokens_used=150
)
```

## JavaScript SDK

### ActiveMirror

```javascript
import { ActiveMirror } from '@activemirror/sdk';

const mirror = new ActiveMirror({
  storagePath: './memory',
  userId: 'optional-user-id'
});

await mirror.initialize();
```

**Methods**:

- `async createSession(title, userId?) -> Session`
- `async loadSession(sessionId) -> Session`
- `async listSessions(userId?) -> Array<SessionMetadata>`
- `async deleteSession(sessionId) -> boolean`

### Session

```javascript
const session = await mirror.createSession('My Session');
```

**Methods**:

- `async send(message, metadata={}) -> Response`
- `getMessages(limit?) -> Array<Message>`
- `async save() -> string`  // Returns session_id
- `async export(format='json') -> string`

**Properties**:

- `id: string`
- `title: string`
- `userId: string`
- `createdAt: string`
- `updatedAt: string`

### ReflectiveClient

```javascript
import { ReflectiveClient, ReflectivePattern } from '@activemirror/sdk';

const client = new ReflectiveClient({
  llmProvider: null,  // Optional async function
  defaultPattern: ReflectivePattern.EXPLORATORY,
  enableGlyphs: true
});

const reflection = await client.reflect(inputText, {
  pattern: ReflectivePattern.STRATEGIC,
  context: {}
});
```

**Returns**:
```javascript
{
  response: string,
  uncertainty: string,
  glyphs: string[],
  pattern: string,
  meta: object
}
```

### VaultMemory

```javascript
import { VaultMemory, VaultCategory } from '@activemirror/sdk';

const vault = new VaultMemory({
  vaultPath: './vault',
  password: 'your-password'  // or encryptionKey
});

await vault.initialize();
```

**Methods**:

- `async store(key, value, metadata={}) -> boolean`
- `async retrieve(key) -> any`
- `async delete(key) -> boolean`
- `async listEntries(filterMetadata?) -> Array<object>`
- `async search(query) -> Array<object>`
- `exportKey() -> string`
- `async getStats() -> object`

## CLI Commands

```bash
# Journaling
amos write "Entry content"
amos reflect "Topic to reflect on"
amos list [limit]
amos show <entry-id>

# Vault
amos vault store <key> <value>
amos vault get <key>
amos vault list
```

## Storage Backends

### SQLiteStorage (Python)

```python
from activemirror.storage import SQLiteStorage

storage = SQLiteStorage(
    db_path="./memory.db",
    enable_wal=True
)
```

### InMemoryStorage (Python)

```python
from activemirror.storage import InMemoryStorage

storage = InMemoryStorage()
```

### MemoryStore (JavaScript)

```javascript
import { MemoryStore } from '@activemirror/sdk';

const store = new MemoryStore('./memory');
await store.initialize();
```

## Configuration

### Python

```yaml
# activemirror.yaml
storage:
  type: sqlite
  db_path: ./memory.db

memory:
  max_context_messages: 50
  enable_semantic_memory: true
```

```python
mirror = ActiveMirror.from_config("activemirror.yaml")
```

### JavaScript

```json
{
  "storagePath": "./memory",
  "maxContextMessages": 50
}
```

## Error Handling

### Python

```python
from activemirror.exceptions import (
    ActiveMirrorError,
    SessionNotFoundError,
    StorageError,
    ContextOverflowError
)

try:
    session = mirror.load_session("invalid-id")
except SessionNotFoundError:
    print("Session not found")
except ActiveMirrorError as e:
    print(f"Error: {e}")
```

### JavaScript

```javascript
try {
  const session = await mirror.loadSession('invalid-id');
} catch (error) {
  console.error('Error:', error.message);
}
```

## Examples

See [examples/](../examples/) directory for complete working examples.

## Next Steps

- [Quickstart](quickstart.md) - Get up and running
- [Architecture](architecture.md) - System design
- [State Persistence](state-persistence.md) - Memory management
- [Reflective Behaviors](reflective-behaviors.md) - LingOS Lite patterns
