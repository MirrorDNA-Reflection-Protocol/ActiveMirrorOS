# API Reference

## Core Classes

### ActiveMirror

Main entry point for ActiveMirrorOS.

```python
class ActiveMirror:
    """
    Main ActiveMirror instance for managing sessions and memory.

    Args:
        config: Optional configuration object
        storage: Optional storage backend
        identity: Optional identity connector
        dialogue_engine: Optional dialogue engine
    """

    def __init__(
        self,
        config: Optional[Config] = None,
        storage: Optional[StorageBackend] = None,
        identity: Optional[IdentityConnector] = None,
        dialogue_engine: Optional[DialogueEngine] = None,
        **kwargs
    ):
        ...

    @classmethod
    def from_config(cls, config_path: str) -> "ActiveMirror":
        """Load ActiveMirror from configuration file."""
        ...

    def create_session(
        self,
        title: Optional[str] = None,
        parent_session_id: Optional[str] = None,
        **kwargs
    ) -> Session:
        """Create a new conversation session."""
        ...

    def load_session(self, session_id: str) -> Session:
        """Load an existing session by ID."""
        ...

    def list_sessions(
        self,
        user_id: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[SessionMetadata]:
        """List available sessions."""
        ...

    def delete_session(self, session_id: str) -> bool:
        """Delete a session permanently."""
        ...

    @property
    def semantic_memory(self) -> SemanticMemory:
        """Access semantic memory interface."""
        ...
```

### Session

Represents a conversation session.

```python
class Session:
    """
    A conversation session with persistent memory.

    Attributes:
        id: Unique session identifier
        title: Session title
        created_at: Creation timestamp
        updated_at: Last update timestamp
        user_id: Associated user identifier
        parent_session_id: Parent session for continuity
    """

    @property
    def id(self) -> str:
        """Session unique identifier."""
        ...

    @property
    def title(self) -> str:
        """Session title."""
        ...

    def send(self, message: str, **kwargs) -> Response:
        """
        Send a message and get a response.

        Args:
            message: User message content
            **kwargs: Additional parameters (role, metadata, etc.)

        Returns:
            Response object with AI reply

        Raises:
            ContextOverflowError: If context exceeds limits
            StorageError: If persistence fails
        """
        ...

    def send_streaming(self, message: str, **kwargs) -> Iterator[ResponseChunk]:
        """
        Send a message and stream the response.

        Args:
            message: User message content
            **kwargs: Additional parameters

        Yields:
            ResponseChunk objects as response is generated
        """
        ...

    def get_messages(
        self,
        limit: Optional[int] = None,
        offset: int = 0
    ) -> List[Message]:
        """Retrieve session messages."""
        ...

    def add_context(
        self,
        content: str,
        context_type: str = "system",
        **kwargs
    ) -> None:
        """Manually add context to the session."""
        ...

    def save(self) -> str:
        """Save session to storage. Returns session ID."""
        ...

    def close(self) -> None:
        """Close and save session."""
        ...

    def export(self, format: str = "json") -> str:
        """
        Export session data.

        Args:
            format: Export format (json, markdown, txt)

        Returns:
            Exported session data as string
        """
        ...
```

### Message

Represents a single message in a conversation.

```python
class Message:
    """
    A message in a conversation.

    Attributes:
        id: Message unique identifier
        session_id: Parent session ID
        role: Message role (user, assistant, system)
        content: Message content
        timestamp: When message was created
        metadata: Additional metadata
    """

    id: str
    session_id: str
    role: str  # "user", "assistant", "system"
    content: str
    timestamp: datetime
    metadata: Dict[str, Any]

    def to_dict(self) -> Dict[str, Any]:
        """Convert message to dictionary."""
        ...

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Message":
        """Create message from dictionary."""
        ...
```

### Response

AI response to a user message.

```python
class Response:
    """
    AI response to a user message.

    Attributes:
        content: Response text content
        timestamp: When response was generated
        metadata: Additional response metadata
        tokens_used: Number of tokens consumed
    """

    content: str
    timestamp: datetime
    metadata: Dict[str, Any]
    tokens_used: Optional[int]

    def to_message(self, session_id: str) -> Message:
        """Convert response to a Message object."""
        ...
```

## Storage

### StorageBackend

Abstract base class for storage implementations.

```python
class StorageBackend(ABC):
    """Abstract storage backend interface."""

    @abstractmethod
    def save_session(self, session: Session) -> str:
        """Save a session. Returns session ID."""
        ...

    @abstractmethod
    def load_session(self, session_id: str) -> Session:
        """Load a session by ID."""
        ...

    @abstractmethod
    def save_message(self, message: Message) -> str:
        """Save a message. Returns message ID."""
        ...

    @abstractmethod
    def get_messages(
        self,
        session_id: str,
        limit: Optional[int] = None,
        offset: int = 0
    ) -> List[Message]:
        """Get messages for a session."""
        ...

    @abstractmethod
    def list_sessions(
        self,
        user_id: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[SessionMetadata]:
        """List sessions."""
        ...

    @abstractmethod
    def delete_session(self, session_id: str) -> bool:
        """Delete a session."""
        ...
```

### SQLiteStorage

SQLite implementation of StorageBackend.

```python
class SQLiteStorage(StorageBackend):
    """SQLite storage backend."""

    def __init__(
        self,
        db_path: str = "./memories.db",
        enable_wal: bool = True,
        timeout: float = 5.0
    ):
        ...
```

### PostgreSQLStorage

PostgreSQL implementation of StorageBackend.

```python
class PostgreSQLStorage(StorageBackend):
    """PostgreSQL storage backend."""

    def __init__(
        self,
        connection_string: str,
        pool_size: int = 20,
        max_overflow: int = 10
    ):
        ...
```

### FileSystemStorage

File system implementation of StorageBackend.

```python
class FileSystemStorage(StorageBackend):
    """File system storage backend."""

    def __init__(
        self,
        base_path: str = "./conversations",
        format: str = "json"  # "json" or "markdown"
    ):
        ...
```

## Memory

### SemanticMemory

Interface for semantic memory operations.

```python
class SemanticMemory:
    """Semantic memory for storing and retrieving facts."""

    def add_fact(
        self,
        content: str,
        fact_type: str,
        user_id: str,
        confidence: float = 1.0,
        **kwargs
    ) -> str:
        """
        Add a fact to semantic memory.

        Args:
            content: Fact content
            fact_type: Type (preference, knowledge, context)
            user_id: Associated user
            confidence: Confidence score (0-1)

        Returns:
            Fact ID
        """
        ...

    def query(
        self,
        user_id: str,
        fact_type: Optional[str] = None,
        query: Optional[str] = None,
        limit: int = 10
    ) -> List[Fact]:
        """
        Query semantic memory.

        Args:
            user_id: User to query for
            fact_type: Optional type filter
            query: Optional semantic search query
            limit: Maximum results

        Returns:
            List of matching facts
        """
        ...

    def delete_fact(self, fact_id: str) -> bool:
        """Delete a fact from semantic memory."""
        ...
```

### Fact

Represents a semantic memory fact.

```python
class Fact:
    """A semantic memory fact."""

    id: str
    user_id: str
    fact_type: str  # "preference", "knowledge", "context"
    content: str
    confidence: float
    created_at: datetime
    source_message_id: Optional[str]
    metadata: Dict[str, Any]
```

## Integrations

### MirrorDNAConnector

Integration with MirrorDNA identity protocol.

```python
class MirrorDNAConnector:
    """MirrorDNA identity connector."""

    def __init__(
        self,
        identity_file: str,
        create_if_missing: bool = False
    ):
        ...

    @property
    def user_id(self) -> str:
        """Get the user ID from MirrorDNA identity."""
        ...

    def verify(self) -> bool:
        """Verify identity integrity."""
        ...

    def export_to_file(self, path: str) -> None:
        """Export identity for transfer."""
        ...

    @classmethod
    def import_from_file(cls, path: str) -> "MirrorDNAConnector":
        """Import identity from file."""
        ...
```

### LingOSEngine

Integration with LingOS dialogue system.

```python
class LingOSEngine:
    """LingOS dialogue engine."""

    def __init__(
        self,
        mode: str = "reflective",
        enable_meta_cognition: bool = True
    ):
        ...

    def process(
        self,
        messages: List[Message],
        context: Dict[str, Any]
    ) -> str:
        """
        Process messages through LingOS.

        Args:
            messages: Conversation messages
            context: Additional context

        Returns:
            Processed prompt for LLM
        """
        ...
```

## Configuration

### Config

Main configuration class.

```python
class Config:
    """ActiveMirror configuration."""

    def __init__(
        self,
        storage: Optional[StorageConfig] = None,
        memory: Optional[MemoryConfig] = None,
        identity: Optional[IdentityConfig] = None,
        dialogue: Optional[DialogueConfig] = None,
        **kwargs
    ):
        ...

    @classmethod
    def from_file(cls, path: str) -> "Config":
        """Load configuration from file."""
        ...

    @classmethod
    def from_env(cls) -> "Config":
        """Load configuration from environment variables."""
        ...

    def validate(self) -> List[str]:
        """
        Validate configuration.

        Returns:
            List of validation errors (empty if valid)
        """
        ...

    def to_dict(self) -> Dict[str, Any]:
        """Convert configuration to dictionary."""
        ...
```

## Exceptions

### ActiveMirrorError

Base exception for all ActiveMirror errors.

```python
class ActiveMirrorError(Exception):
    """Base exception for ActiveMirror."""
    pass
```

### SessionNotFoundError

Raised when a session cannot be found.

```python
class SessionNotFoundError(ActiveMirrorError):
    """Session not found."""
    pass
```

### StorageError

Raised when storage operations fail.

```python
class StorageError(ActiveMirrorError):
    """Storage operation failed."""
    pass
```

### ContextOverflowError

Raised when context exceeds limits.

```python
class ContextOverflowError(ActiveMirrorError):
    """Context exceeds configured limits."""
    pass
```

### ConfigurationError

Raised when configuration is invalid.

```python
class ConfigurationError(ActiveMirrorError):
    """Configuration is invalid."""
    pass
```

## Async API

### AsyncActiveMirror

Async version of ActiveMirror.

```python
class AsyncActiveMirror:
    """Async ActiveMirror for concurrent operations."""

    async def create_session(self, **kwargs) -> Session:
        """Create a session asynchronously."""
        ...

    async def load_session(self, session_id: str) -> Session:
        """Load a session asynchronously."""
        ...

    async def list_sessions(self, **kwargs) -> List[SessionMetadata]:
        """List sessions asynchronously."""
        ...
```

### AsyncSession

Async version of Session.

```python
class AsyncSession:
    """Async session for concurrent message handling."""

    async def send(self, message: str, **kwargs) -> Response:
        """Send message asynchronously."""
        ...

    async def send_streaming(
        self,
        message: str,
        **kwargs
    ) -> AsyncIterator[ResponseChunk]:
        """Send message and stream response asynchronously."""
        ...

    async def get_messages(self, **kwargs) -> List[Message]:
        """Get messages asynchronously."""
        ...
```

## Utilities

### Export/Import

```python
def export_session(
    session: Session,
    format: str = "json",
    output_path: Optional[str] = None
) -> str:
    """
    Export a session to various formats.

    Args:
        session: Session to export
        format: Export format (json, markdown, txt, html)
        output_path: Optional file path to write to

    Returns:
        Exported content as string
    """
    ...

def import_session(
    data: str,
    format: str = "json",
    mirror: Optional[ActiveMirror] = None
) -> Session:
    """
    Import a session from exported data.

    Args:
        data: Exported session data
        format: Data format
        mirror: Optional ActiveMirror instance

    Returns:
        Imported Session object
    """
    ...
```

### Logging

```python
def configure_logging(
    level: str = "INFO",
    file: Optional[str] = None,
    format: Optional[str] = None
) -> None:
    """
    Configure ActiveMirror logging.

    Args:
        level: Logging level (DEBUG, INFO, WARNING, ERROR)
        file: Optional log file path
        format: Optional log format string
    """
    ...
```

## Type Hints

Common type aliases used throughout the API:

```python
from typing import TypeAlias, Dict, Any, List, Optional

MessageDict: TypeAlias = Dict[str, Any]
SessionDict: TypeAlias = Dict[str, Any]
ContextDict: TypeAlias = Dict[str, Any]
MetadataDict: TypeAlias = Dict[str, Any]
```

## Examples

### Basic Usage

```python
from activemirror import ActiveMirror

# Create instance
mirror = ActiveMirror()

# Create session
session = mirror.create_session(title="My Conversation")

# Send message
response = session.send("Hello!")
print(response.content)

# Save session
session.save()
```

### With Configuration

```python
from activemirror import ActiveMirror, Config
from activemirror.storage import PostgreSQLStorage

# Create config
config = Config.from_file("config.yaml")

# Create mirror
mirror = ActiveMirror(config=config)

# Use mirror
session = mirror.create_session()
response = session.send("Hello with config!")
```

### Async Usage

```python
from activemirror import AsyncActiveMirror

async def main():
    mirror = AsyncActiveMirror()
    session = await mirror.create_session()
    response = await session.send("Hello async!")
    print(response.content)

import asyncio
asyncio.run(main())
```

## Version Information

```python
from activemirror import __version__, __api_version__

print(f"ActiveMirror version: {__version__}")
print(f"API version: {__api_version__}")
```

## Next Steps

- See [Integration Guide](integration.md) for usage examples
- Review [Configuration](configuration.md) for setup options
- Check [Examples](../examples/) for complete code samples
- Read [Architecture](architecture.md) to understand internals
