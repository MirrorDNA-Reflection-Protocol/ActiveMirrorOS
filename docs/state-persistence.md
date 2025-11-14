# State Persistence

How ActiveMirrorOS manages memory across sessions, devices, and time.

## Overview

ActiveMirrorOS implements a **three-tier persistence model**:

1. **Session Memory** (RAM) - Active conversation
2. **Persistent Storage** (Disk) - All conversations
3. **Vault Storage** (Encrypted) - Sensitive data

## Session Memory (Tier 1)

**Lifespan**: Current application session
**Storage**: RAM
**Speed**: Instant

```python
# Create session (in memory)
session = mirror.create_session("Daily Planning")

# Send messages (stored in RAM)
session.send("First thought")
session.send("Second thought")

# Not persisted yet - if app crashes, these are lost
```

To persist:

```python
session.save()  # Writes to disk
```

## Persistent Storage (Tier 2)

**Lifespan**: Permanent (until deleted)
**Storage**: SQLite DB or JSON files
**Speed**: Fast (local disk)

### SQLite Backend (Python)

```python
mirror = ActiveMirror(
    storage_type="sqlite",
    db_path="./conversations.db"
)
```

**Schema**:

```sql
sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT,
    created_at TEXT,
    updated_at TEXT,
    status TEXT
)

messages (
    id TEXT PRIMARY KEY,
    session_id TEXT,
    role TEXT,
    content TEXT,
    timestamp TEXT,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
)
```

### JSON Backend (JavaScript)

```javascript
const mirror = new ActiveMirror({
  storagePath: './conversations'
});
```

**File Structure**:

```
conversations/
├── index.json                    # Session index
├── session_123.json              # Session + messages
├── session_456.json
└── ...
```

**Session File Format**:

```json
{
  "id": "session_123",
  "title": "Strategic Planning",
  "userId": "user_001",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T14:30:00Z",
  "messageCount": 24,
  "messages": [
    {
      "id": "msg_1",
      "role": "user",
      "content": "Let's plan Q1",
      "timestamp": "2024-01-15T10:01:00Z"
    }
  ]
}
```

## Vault Storage (Tier 3)

**Lifespan**: Permanent
**Storage**: Encrypted files
**Speed**: Fast
**Security**: AES-256-GCM

```python
vault = VaultMemory(password="your-password")

# Store sensitive data
vault.store("health_goal", "Run marathon in 2024")
vault.store("salary_target", 150000, metadata={
    "category": VaultCategory.PRIVATE
})

# Retrieve
goal = vault.retrieve("health_goal")
```

**File Structure**:

```
vault/
├── .vault_index.enc              # Encrypted index
├── health_goal.vault             # Encrypted entry
├── salary_target.vault
└── ...
```

## State Transitions

### Session Lifecycle

```
[Created] → [Active] → [Saved] → [Loaded] → [Active] → ...
   ↓           ↓          ↓         ↓
  RAM        RAM        Disk      Disk+RAM
```

**Example Flow**:

```python
# 1. Create (in RAM)
session = mirror.create_session("Ideas")

# 2. Active (in RAM)
session.send("Idea 1")
session.send("Idea 2")

# 3. Save (to Disk)
session_id = session.save()

# App closes...
# App reopens...

# 4. Load (Disk → RAM)
session = mirror.load_session(session_id)

# 5. Resume (in RAM)
session.send("Idea 3")

# 6. Save again
session.save()
```

## Continuity Patterns

### Same Device, Multiple Sessions

```python
# Session 1
session1 = mirror.create_session("Morning")
session1.send("Feeling energized")
session1.save()

# Session 2 (links to session 1)
session2 = mirror.create_session(
    "Afternoon",
    parent_session_id=session1.id
)
session2.send("Building on morning momentum")
```

### Cross-Device (Export/Import)

```python
# Device A
session.save()
export_data = session.export(format='json')

# Transfer export_data to Device B (USB, cloud, etc.)

# Device B
from activemirror import import_session

session = import_session(export_data)
session.send("Continuing on different device")
```

### Long-Term Memory

```python
# Store important insights in vault
vault.store("core_insight_2024_01", {
    "insight": "Focus beats multitasking",
    "source_session": session.id,
    "confidence": "high"
}, metadata={
    "category": VaultCategory.KNOWLEDGE,
    "tags": ["productivity", "2024"]
})

# Later, retrieve for context
insights = vault.search("productivity")
```

## Data Portability

### Export Formats

**JSON (Machine-Readable)**:

```python
export = session.export(format='json')
# Full structured data for import
```

**Markdown (Human-Readable)**:

```python
export = session.export(format='markdown')
# Readable in any text editor
```

**Text (Plain)**:

```python
export = session.export(format='txt')
# Simple transcript
```

### Backup Strategy

```python
# Backup all sessions
sessions = mirror.list_sessions()
for session_meta in sessions:
    session = mirror.load_session(session_meta.session_id)
    backup = session.export('json')
    save_to_backup_location(session.id, backup)

# Backup vault
vault_key = vault.export_key()
# Store vault_key securely - needed to decrypt vault
```

## Performance Optimization

### Lazy Loading

```python
# Only loads session metadata, not all messages
sessions = mirror.list_sessions()

# Messages loaded on demand
session = mirror.load_session(session_id)
recent = session.get_messages(limit=10)
```

### Message Pagination

```python
# Get recent messages
recent = session.get_messages(limit=20)

# Get older messages
older = session.get_messages(limit=20, offset=20)
```

### Context Management

```python
# Limit active context
session = mirror.create_session(
    "Limited Context",
    max_context_messages=30
)

# Older messages still saved, but not in active context
```

## Storage Quotas

### Recommended Limits

**Per Session**:
- Messages: Up to 10,000
- Size: Up to 10MB

**Total**:
- Sessions: Thousands supported
- Storage: Limited only by disk space

**Vault**:
- Entries: Unlimited
- Size: Depends on disk space

### Cleanup

```python
# Delete old sessions
old_sessions = [s for s in mirror.list_sessions()
                if s.created_at < one_year_ago]

for s in old_sessions:
    mirror.delete_session(s.session_id)

# Clear vault entries
vault.delete("old_goal")
```

## Sync (Future)

**Planned integration with MirrorDNA**:

```python
# Automatic cross-device sync
mirror = ActiveMirror(
    identity=mirror_dna_identity,
    sync_enabled=True
)

# Changes sync via MirrorDNA protocol
session.send("Available on all my devices")
```

## Data Privacy

### Local-First

- All data stored locally by default
- No cloud services required
- User has full control

### Encryption

```python
# Vault data encrypted at rest
vault = VaultMemory(password="strong-password")

# Encryption key derivation
# PBKDF2, 100k iterations, SHA-256
```

### User Control

```python
# Export everything
all_data = export_all_data(mirror, vault)

# Delete everything
delete_all_data(mirror, vault)
```

## Best Practices

### 1. Save Frequently

```python
# After important exchanges
session.send("Key decision made")
session.save()  # Don't wait
```

### 2. Use Vault for Sensitive Data

```python
# Don't store sensitive data in regular sessions
vault.store("api_key", key)  # Encrypted

# Instead of:
session.send(f"My API key is {key}")  # Unencrypted
```

### 3. Link Related Sessions

```python
# Create session families
parent = mirror.create_session("Project Alpha")
sprint1 = mirror.create_session("Sprint 1", parent.id)
sprint2 = mirror.create_session("Sprint 2", parent.id)
```

### 4. Export Critical Sessions

```python
# Backup important conversations
critical_session = mirror.load_session("important_id")
backup = critical_session.export('json')
save_to_secure_location(backup)
```

### 5. Clean Up Regularly

```python
# Archive or delete old sessions
# Keep storage lean and performant
```

## Troubleshooting

### "Session not found"

```python
# Verify session was saved
session_id = session.save()  # Note the ID

# Check it exists
sessions = mirror.list_sessions()
exists = any(s.session_id == session_id for s in sessions)
```

### "Storage error"

```python
# Check disk space
# Check write permissions
# Check db_path exists
```

### "Vault decrypt failed"

```python
# Verify password is correct
# Check vault files not corrupted
# Ensure encryption key matches
```

## Summary

ActiveMirrorOS provides **three tiers of persistence**:

1. **RAM** - Active session (fast, temporary)
2. **Disk** - All conversations (fast, permanent)
3. **Vault** - Encrypted sensitive data (secure, permanent)

All storage is **local-first**, giving users full control over their data while maintaining privacy and performance.
