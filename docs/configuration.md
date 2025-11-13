# Configuration Guide

## Overview

ActiveMirrorOS can be configured through:
1. Configuration files (YAML or JSON)
2. Environment variables
3. Programmatic configuration

## Configuration File

### YAML Configuration

Create `activemirror.yaml`:

```yaml
# General Settings
app:
  name: "My ActiveMirror Application"
  version: "1.0.0"
  debug: false

# Storage Configuration
storage:
  type: sqlite  # Options: sqlite, postgresql, filesystem, custom

  # SQLite specific
  db_path: ./data/memories.db
  enable_wal: true

  # PostgreSQL specific (when type: postgresql)
  # connection_string: postgresql://user:pass@localhost/activemirror
  # pool_size: 20
  # max_overflow: 10

  # FileSystem specific (when type: filesystem)
  # base_path: ./conversations
  # format: json  # Options: json, markdown

# Memory Management
memory:
  max_context_messages: 50
  enable_semantic_memory: true
  context_window_size: 4096
  context_strategy: recent_and_relevant  # Options: recent, relevant, recent_and_relevant

  # Semantic memory settings
  semantic_memory:
    enabled: true
    extraction_threshold: 0.7
    max_facts_per_session: 100

  # Context caching
  cache:
    enabled: true
    ttl: 3600
    max_size: 1000

# Identity Configuration
identity:
  type: mirror_dna  # Options: mirror_dna, anonymous, custom
  identity_file: ./data/user.dna
  create_if_missing: true

  # Privacy settings
  privacy:
    anonymize_exports: false
    encryption_enabled: true
    encryption_key_file: ./data/encryption.key

# Dialogue Engine
dialogue:
  engine: lingos  # Options: lingos, basic, custom
  mode: reflective  # Options: reflective, conversational, analytical

  # LingOS specific settings
  lingos:
    enable_meta_cognition: true
    reflection_depth: 2
    adaptive_style: true

# LLM Provider Configuration
llm:
  provider: openai  # Options: openai, anthropic, local, custom
  model: gpt-4
  temperature: 0.7
  max_tokens: 2000

  # Rate limiting
  rate_limit:
    requests_per_minute: 60
    tokens_per_minute: 90000

  # Fallback configuration
  fallback:
    enabled: true
    fallback_model: gpt-3.5-turbo

# Session Configuration
sessions:
  default_title: "Untitled Conversation"
  auto_save: true
  auto_save_interval: 300  # seconds
  max_session_length: 10000  # messages

  # Session cleanup
  cleanup:
    enabled: true
    archive_after_days: 90
    delete_after_days: 365

# Logging
logging:
  level: INFO  # Options: DEBUG, INFO, WARNING, ERROR
  file: ./logs/activemirror.log
  format: "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

  # Audit logging
  audit:
    enabled: true
    file: ./logs/audit.log
    log_all_messages: false  # Only log metadata, not content

# Performance
performance:
  async_enabled: true
  worker_threads: 4
  connection_timeout: 30
  request_timeout: 120

  # Optimization
  optimize_for: balanced  # Options: latency, throughput, balanced

# Security
security:
  encryption_at_rest: true
  encryption_in_transit: true

  # Access control
  access_control:
    enabled: false
    require_authentication: false
    allowed_users: []

  # Data retention
  retention:
    default_retention_days: 365
    minimum_retention_days: 30
    user_controllable: true

# Extensions
extensions:
  enabled: []
  # - name: custom_processor
  #   config: {}

# Hooks
hooks:
  on_message_received: []
  on_message_sent: []
  on_session_created: []
  on_session_ended: []
```

### JSON Configuration

Alternatively, use `activemirror.json`:

```json
{
  "storage": {
    "type": "sqlite",
    "db_path": "./data/memories.db"
  },
  "memory": {
    "max_context_messages": 50,
    "enable_semantic_memory": true
  },
  "identity": {
    "type": "mirror_dna",
    "identity_file": "./data/user.dna"
  }
}
```

## Environment Variables

All configuration options can be set via environment variables using the prefix `ACTIVEMIRROR_`:

```bash
# Storage
export ACTIVEMIRROR_STORAGE_TYPE=postgresql
export ACTIVEMIRROR_STORAGE_CONNECTION_STRING=postgresql://...

# Memory
export ACTIVEMIRROR_MEMORY_MAX_CONTEXT_MESSAGES=50
export ACTIVEMIRROR_MEMORY_ENABLE_SEMANTIC_MEMORY=true

# Identity
export ACTIVEMIRROR_IDENTITY_TYPE=mirror_dna
export ACTIVEMIRROR_IDENTITY_FILE=./user.dna

# LLM
export ACTIVEMIRROR_LLM_PROVIDER=openai
export ACTIVEMIRROR_LLM_MODEL=gpt-4
export ACTIVEMIRROR_LLM_API_KEY=sk-...

# Logging
export ACTIVEMIRROR_LOGGING_LEVEL=INFO
```

## Programmatic Configuration

### Basic Configuration

```python
from activemirror import ActiveMirror, Config

config = Config(
    storage_type="sqlite",
    db_path="./memories.db",
    max_context_messages=50,
    enable_semantic_memory=True
)

mirror = ActiveMirror(config=config)
```

### Advanced Configuration

```python
from activemirror import ActiveMirror
from activemirror.config import (
    Config,
    StorageConfig,
    MemoryConfig,
    IdentityConfig,
    DialogueConfig
)
from activemirror.storage import SQLiteStorage
from activemirror.integrations import MirrorDNAConnector, LingOSEngine

# Build configuration piece by piece
storage_config = StorageConfig(
    type="sqlite",
    db_path="./memories.db",
    enable_wal=True
)

memory_config = MemoryConfig(
    max_context_messages=50,
    enable_semantic_memory=True,
    context_window_size=4096,
    context_strategy="recent_and_relevant"
)

identity_config = IdentityConfig(
    type="mirror_dna",
    identity_file="./user.dna",
    create_if_missing=True
)

dialogue_config = DialogueConfig(
    engine="lingos",
    mode="reflective",
    enable_meta_cognition=True
)

# Create main config
config = Config(
    storage=storage_config,
    memory=memory_config,
    identity=identity_config,
    dialogue=dialogue_config
)

# Initialize ActiveMirror
mirror = ActiveMirror(config=config)
```

## Configuration Precedence

Configuration is loaded in the following order (later overrides earlier):

1. Default values
2. Configuration file (if specified)
3. Environment variables
4. Programmatic configuration

```python
# This will use config file, but environment variables override
mirror = ActiveMirror.from_config(
    "activemirror.yaml",
    override_with_env=True
)
```

## Storage Configuration Details

### SQLite

```yaml
storage:
  type: sqlite
  db_path: ./data/memories.db
  enable_wal: true  # Write-Ahead Logging for better concurrency
  timeout: 5.0  # Database lock timeout
  check_same_thread: false  # Allow multi-threaded access
```

### PostgreSQL

```yaml
storage:
  type: postgresql
  connection_string: postgresql://user:pass@localhost:5432/activemirror
  pool_size: 20
  max_overflow: 10
  pool_timeout: 30
  pool_recycle: 3600
```

### File System

```yaml
storage:
  type: filesystem
  base_path: ./conversations
  format: json  # or markdown
  create_index: true  # Create search index
  compress: false  # Compress old conversations
```

## Memory Configuration Details

### Context Strategy Options

1. **recent**: Use only recent messages
   ```yaml
   memory:
     context_strategy: recent
     max_context_messages: 30
   ```

2. **relevant**: Use semantically relevant messages
   ```yaml
   memory:
     context_strategy: relevant
     relevance_threshold: 0.7
     max_context_messages: 30
   ```

3. **recent_and_relevant**: Combine both approaches (recommended)
   ```yaml
   memory:
     context_strategy: recent_and_relevant
     recent_messages: 10
     relevant_messages: 20
     relevance_threshold: 0.7
   ```

### Semantic Memory

```yaml
memory:
  semantic_memory:
    enabled: true
    extraction_threshold: 0.7  # Confidence threshold
    max_facts_per_session: 100
    fact_types:
      - preference
      - knowledge
      - context
    auto_extract: true
    extraction_interval: 5  # Extract every N messages
```

## Identity Configuration Details

### MirrorDNA

```yaml
identity:
  type: mirror_dna
  identity_file: ./data/user.dna
  create_if_missing: true

  # Verification
  require_verification: false
  verification_method: biometric  # or password, key

  # Sync
  enable_sync: false
  sync_endpoint: https://sync.example.com
  sync_interval: 3600
```

### Anonymous

```yaml
identity:
  type: anonymous
  generate_session_id: true
  preserve_across_restarts: false
```

## Dialogue Configuration Details

### LingOS Engine

```yaml
dialogue:
  engine: lingos
  mode: reflective

  lingos:
    enable_meta_cognition: true
    reflection_depth: 2  # 1-3
    adaptive_style: true

    # Dialogue patterns
    patterns:
      - exploratory
      - analytical
      - creative

    # Response tuning
    conciseness: balanced  # terse, balanced, expansive
    formality: adaptive  # formal, informal, adaptive
```

## LLM Configuration Details

### Provider-Specific Settings

#### OpenAI

```yaml
llm:
  provider: openai
  api_key: sk-...  # Or use OPENAI_API_KEY env var
  model: gpt-4
  temperature: 0.7
  max_tokens: 2000
  top_p: 1.0
  frequency_penalty: 0.0
  presence_penalty: 0.0
```

#### Anthropic

```yaml
llm:
  provider: anthropic
  api_key: sk-ant-...  # Or use ANTHROPIC_API_KEY env var
  model: claude-3-opus-20240229
  temperature: 0.7
  max_tokens: 2000
```

#### Local Model

```yaml
llm:
  provider: local
  model_path: ./models/llama-2-7b
  device: cuda  # or cpu
  max_tokens: 2000
```

## Session Configuration Details

```yaml
sessions:
  default_title: "Untitled Conversation"
  auto_save: true
  auto_save_interval: 300  # Save every 5 minutes

  # Limits
  max_session_length: 10000  # Max messages per session
  max_message_size: 10000  # Max characters per message

  # Cleanup
  cleanup:
    enabled: true
    archive_after_days: 90  # Archive old sessions
    delete_after_days: 365  # Delete very old sessions
    keep_favorites: true  # Never delete favorited sessions
```

## Logging Configuration Details

```yaml
logging:
  level: INFO
  file: ./logs/activemirror.log
  max_file_size: 10485760  # 10MB
  backup_count: 5

  # Console logging
  console:
    enabled: true
    level: WARNING

  # Audit logging
  audit:
    enabled: true
    file: ./logs/audit.log
    log_all_messages: false  # Privacy: log metadata only
    log_access: true
    log_config_changes: true
```

## Performance Configuration Details

```yaml
performance:
  async_enabled: true
  worker_threads: 4

  # Timeouts
  connection_timeout: 30
  request_timeout: 120

  # Optimization
  optimize_for: balanced  # latency, throughput, or balanced

  # Caching
  cache:
    enabled: true
    backend: memory  # memory, redis, memcached
    ttl: 3600
    max_size: 1000
```

## Security Configuration Details

```yaml
security:
  # Encryption
  encryption_at_rest: true
  encryption_algorithm: AES-256
  encryption_key_file: ./data/encryption.key

  # Access control
  access_control:
    enabled: false
    require_authentication: false
    auth_method: api_key  # api_key, oauth, custom

  # Data retention
  retention:
    default_retention_days: 365
    minimum_retention_days: 30
    user_controllable: true

  # Audit
  audit:
    enabled: true
    log_access: true
    log_modifications: true
```

## Validation

Validate your configuration:

```python
from activemirror.config import Config

# Load and validate
config = Config.from_file("activemirror.yaml")
errors = config.validate()

if errors:
    for error in errors:
        print(f"Configuration error: {error}")
else:
    print("Configuration is valid")
```

## Configuration Examples

### Development

```yaml
app:
  debug: true

storage:
  type: sqlite
  db_path: ./dev.db

logging:
  level: DEBUG
  console:
    enabled: true
    level: DEBUG
```

### Production

```yaml
app:
  debug: false

storage:
  type: postgresql
  connection_string: ${DATABASE_URL}
  pool_size: 50

memory:
  cache:
    enabled: true
    backend: redis

security:
  encryption_at_rest: true
  access_control:
    enabled: true

logging:
  level: INFO
  audit:
    enabled: true
```

### Minimal

```yaml
storage:
  type: sqlite
  db_path: ./memories.db

memory:
  max_context_messages: 30
```

## Next Steps

- Review [Integration Guide](integration.md) to use these configurations
- See [Architecture](architecture.md) to understand what these settings affect
- Check [Examples](../examples/) for real-world configuration samples
