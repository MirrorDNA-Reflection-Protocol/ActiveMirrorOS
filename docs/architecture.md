# Architecture

## System Design

ActiveMirrorOS is designed as a **layered orchestration system** that coordinates between user applications, AI models, and persistence storage while maintaining identity continuity through MirrorDNA and dialogue quality through LingOS.

## High-Level Architecture

```
┌───────────────────────────────────────────────────────┐
│                  User Application                     │
│         (CLI, Web UI, API Client, Mobile)            │
└────────────────────┬──────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────┐
│              ActiveMirrorOS API Layer                 │
│  (Public interface: SessionManager, MemoryManager)    │
└────────────────────┬──────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────┐
│              ActiveMirrorOS Core                      │
│  ┌─────────────┬──────────────┬──────────────┐       │
│  │   Session   │    Memory    │ Orchestration│       │
│  │  Management │  Management  │    Engine    │       │
│  └─────────────┴──────────────┴──────────────┘       │
└───┬───────────────┬───────────────┬───────────────────┘
    │               │               │
    ▼               ▼               ▼
┌─────────┐  ┌──────────┐  ┌────────────┐
│MirrorDNA│  │  LingOS  │  │  Storage   │
│Protocol │  │  Engine  │  │  Backend   │
└─────────┘  └──────────┘  └────────────┘
```

## Core Components

### 1. API Layer

**Purpose**: Public interface for applications to interact with ActiveMirrorOS.

**Key Classes**:
- `ActiveMirror`: Main entry point
- `Session`: Represents a conversation session
- `Message`: Individual message in a conversation
- `MemoryQuery`: Query interface for retrieving context

**Responsibilities**:
- Input validation
- Error handling
- API versioning
- Documentation

### 2. Session Management

**Purpose**: Handle conversation lifecycle and context boundaries.

**Key Classes**:
- `SessionManager`: Create, load, save sessions
- `SessionState`: Current session state
- `SessionMetadata`: Session information and tags

**Features**:
- Session creation and initialization
- Session persistence and loading
- Session linking (for continuity)
- Session cleanup and archival

**Lifecycle**:
```
Create → Active → Paused → Resumed → Completed → Archived
```

### 3. Memory Management

**Purpose**: Store, retrieve, and manage conversation history and context.

**Key Classes**:
- `MemoryManager`: Central memory coordinator
- `MessageStore`: Raw message storage
- `ContextExtractor`: Extract relevant context
- `SemanticIndex`: Semantic search and retrieval

**Memory Types**:

1. **Immediate Context** (0-10 messages)
   - Current conversation flow
   - Held in RAM
   - Always included in prompts

2. **Working Memory** (10-100 messages)
   - Recent conversation history
   - Cached for quick access
   - Selectively included based on relevance

3. **Long-term Memory** (100+ messages)
   - Historical conversations
   - Stored in database
   - Retrieved via semantic search
   - Summarized for efficiency

4. **Semantic Memory**
   - Extracted facts and preferences
   - Knowledge graph representation
   - Query-based retrieval

### 4. Orchestration Engine

**Purpose**: Coordinate between components and manage conversation flow.

**Key Classes**:
- `Orchestrator`: Main coordination logic
- `ContextBuilder`: Assemble context for prompts
- `ResponseHandler`: Process AI responses
- `EventBus`: Component communication

**Responsibilities**:
- Request routing
- Context assembly
- Response processing
- Event coordination
- Error recovery

## Integration Points

### MirrorDNA Integration

**Purpose**: Provide stable identity and continuity across sessions.

```python
from activemirror.integrations.mirror_dna import MirrorDNAConnector

# Initialize with MirrorDNA identity
connector = MirrorDNAConnector(identity_file="user.dna")
mirror = ActiveMirror(identity=connector)
```

**Functions**:
- User identification
- Cross-session continuity
- Privacy-preserving identity
- Verification and authentication

### LingOS Integration

**Purpose**: Enable reflective, context-aware dialogue.

```python
from activemirror.integrations.lingos import LingOSEngine

# Use LingOS for dialogue processing
lingos = LingOSEngine(mode="reflective")
mirror = ActiveMirror(dialogue_engine=lingos)
```

**Functions**:
- Dialogue pattern analysis
- Reflective response generation
- Meta-cognitive processing
- Adaptive communication

### Storage Backend

**Purpose**: Persist conversations and memory.

**Interface**: `StorageBackend` (abstract base class)

**Implementations**:
- `SQLiteStorage`: Local file-based storage
- `PostgreSQLStorage`: Database storage
- `FileSystemStorage`: Plain JSON/Markdown files
- Custom: Implement `StorageBackend` interface

```python
from activemirror.storage import SQLiteStorage

storage = SQLiteStorage(db_path="memories.db")
mirror = ActiveMirror(storage=storage)
```

## Data Flow

### Message Flow (User → AI)

```
User Input
    ↓
[API Layer: Validate]
    ↓
[Session Manager: Add to current session]
    ↓
[Memory Manager: Store message]
    ↓
[Orchestrator: Build context]
    ↓
[Context Builder: Retrieve relevant history]
    ↓
[LingOS: Process dialogue]
    ↓
[AI Model: Generate response]
    ↓
[Response Handler: Process output]
    ↓
[Memory Manager: Store response]
    ↓
[API Layer: Return to user]
```

### Context Assembly

```
Current Message
    +
Immediate Context (last N messages)
    +
Relevant Long-term Memory (semantic search)
    +
User Preferences (from semantic memory)
    +
Session Metadata
    =
Complete Context for AI
```

## Storage Schema

### Sessions Table
```sql
sessions (
    id UUID PRIMARY KEY,
    user_id VARCHAR(255),
    title VARCHAR(500),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    status ENUM('active', 'paused', 'completed'),
    parent_session_id UUID,  -- for linked sessions
    metadata JSONB
)
```

### Messages Table
```sql
messages (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES sessions(id),
    role ENUM('user', 'assistant', 'system'),
    content TEXT,
    timestamp TIMESTAMP,
    metadata JSONB
)
```

### Semantic Memory Table
```sql
semantic_memory (
    id UUID PRIMARY KEY,
    user_id VARCHAR(255),
    fact_type ENUM('preference', 'knowledge', 'context'),
    content TEXT,
    confidence FLOAT,
    source_message_id UUID,
    created_at TIMESTAMP,
    metadata JSONB
)
```

## Extensibility

### Plugin Architecture

ActiveMirrorOS supports plugins for:

1. **Storage Backends**: Custom persistence implementations
2. **LLM Providers**: Different AI model integrations
3. **Context Processors**: Custom context extraction
4. **Memory Strategies**: Alternative memory management

### Hook System

```python
from activemirror.hooks import Hook

@Hook.on_message_received
def custom_processor(message):
    # Custom message processing
    pass

@Hook.on_response_generated
def custom_logger(response):
    # Custom logging
    pass
```

## Performance Considerations

### Memory Efficiency

- **Lazy Loading**: Load long-term memory only when needed
- **Caching**: Cache frequently accessed context
- **Summarization**: Compress old conversations
- **Pruning**: Remove irrelevant history

### Latency Optimization

- **Async Operations**: Non-blocking I/O for storage
- **Parallel Queries**: Concurrent context retrieval
- **Streaming**: Stream responses as they're generated
- **Preloading**: Anticipate context needs

### Scalability

- **Stateless API**: Horizontal scaling support
- **Database Pooling**: Efficient connection management
- **Caching Layer**: Redis/Memcached integration
- **Sharding**: User-based data partitioning

## Security

### Data Protection

- **Encryption at Rest**: Database encryption
- **Encryption in Transit**: TLS/SSL for network communication
- **Access Control**: User-based permissions
- **Audit Logging**: Track data access

### Privacy

- **Local-First**: Data stays on user's machine
- **Minimal Collection**: Only necessary data stored
- **User Control**: Export, delete, modify data
- **Anonymization**: Optional identity protection

## Testing Strategy

### Unit Tests
- Individual component testing
- Mock external dependencies
- Fast, deterministic

### Integration Tests
- Component interaction testing
- Real storage backends
- End-to-end message flow

### Performance Tests
- Load testing
- Memory profiling
- Latency benchmarks

## Deployment

### Local Development
```bash
pip install -e .
python examples/basic_session.py
```

### Production
```bash
# With PostgreSQL backend
export ACTIVEMIRROR_STORAGE=postgresql
export DATABASE_URL=postgresql://user:pass@localhost/activemirror
python -m activemirror.server
```

### Docker
```dockerfile
FROM python:3.11
COPY . /app
WORKDIR /app
RUN pip install -e .
CMD ["python", "-m", "activemirror.server"]
```

## Future Enhancements

- **Multi-modal Memory**: Images, audio, video
- **Distributed Memory**: Cross-device sync
- **Collaborative Sessions**: Multi-user conversations
- **Advanced Compression**: More efficient long-term storage
- **Real-time Streaming**: WebSocket support

---

This architecture provides a solid foundation for persistent, context-aware AI interactions while remaining flexible and extensible for future needs.
