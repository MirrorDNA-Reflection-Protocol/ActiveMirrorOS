# Integration Guide

## Getting Started

This guide walks through integrating ActiveMirrorOS into your application.

## Installation

### From PyPI (when published)
```bash
pip install activemirror
```

### From Source
```bash
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
cd ActiveMirrorOS
pip install -e .
```

### Development Installation
```bash
pip install -e ".[dev]"
```

## Basic Usage

### Simple Conversation

```python
from activemirror import ActiveMirror, Message

# Create an ActiveMirror instance
mirror = ActiveMirror()

# Start a new session
session = mirror.create_session(title="My First Conversation")

# Send a message
response = session.send("Hello! Can you remember my name is Alice?")
print(response.content)

# Continue the conversation
response = session.send("What's my name?")
print(response.content)  # Should remember "Alice"

# Save the session
session.save()
```

### Persistent Sessions

```python
from activemirror import ActiveMirror

mirror = ActiveMirror()

# Create and save a session
session = mirror.create_session(title="Project Planning")
session.send("Let's plan the Q1 roadmap")
session_id = session.save()

# Later... resume the session
session = mirror.load_session(session_id)
session.send("Let's continue planning where we left off")
```

## Configuration

### Basic Configuration

```python
from activemirror import ActiveMirror
from activemirror.storage import SQLiteStorage

# Configure storage
storage = SQLiteStorage(db_path="./my_memories.db")

# Create instance with custom storage
mirror = ActiveMirror(
    storage=storage,
    max_context_messages=50,
    enable_semantic_memory=True
)
```

### Configuration File

Create `activemirror.yaml`:

```yaml
storage:
  type: sqlite
  db_path: ./memories.db

memory:
  max_context_messages: 50
  enable_semantic_memory: true
  context_window_size: 4096

identity:
  type: mirror_dna
  identity_file: ./user.dna

dialogue:
  engine: lingos
  mode: reflective
```

Load configuration:

```python
from activemirror import ActiveMirror

mirror = ActiveMirror.from_config("activemirror.yaml")
```

## MirrorDNA Integration

MirrorDNA provides stable identity and continuity.

```python
from activemirror import ActiveMirror
from activemirror.integrations.mirror_dna import MirrorDNAConnector

# Initialize MirrorDNA identity
identity = MirrorDNAConnector(
    identity_file="user.dna",
    create_if_missing=True
)

# Create ActiveMirror with identity
mirror = ActiveMirror(identity=identity)

# All sessions now tied to this identity
session = mirror.create_session(title="Identified Session")
```

### Cross-Device Continuity

```python
# On Device A
identity = MirrorDNAConnector(identity_file="user.dna")
mirror = ActiveMirror(identity=identity)
session = mirror.create_session()
session.send("Remember this on all my devices")

# Export identity
identity.export_to_file("user_identity_export.dna")

# On Device B
identity = MirrorDNAConnector.import_from_file("user_identity_export.dna")
mirror = ActiveMirror(identity=identity)

# Access same memory
sessions = mirror.list_sessions()
```

## LingOS Integration

LingOS provides reflective dialogue capabilities.

```python
from activemirror import ActiveMirror
from activemirror.integrations.lingos import LingOSEngine

# Configure LingOS
lingos = LingOSEngine(
    mode="reflective",
    enable_meta_cognition=True
)

# Create ActiveMirror with LingOS
mirror = ActiveMirror(dialogue_engine=lingos)

session = mirror.create_session()
response = session.send("Let's think deeply about this problem")
# LingOS enables more reflective, thoughtful responses
```

## Storage Backends

### SQLite (Default)

```python
from activemirror.storage import SQLiteStorage

storage = SQLiteStorage(
    db_path="./memories.db",
    enable_wal=True  # Better concurrency
)
```

### PostgreSQL

```python
from activemirror.storage import PostgreSQLStorage

storage = PostgreSQLStorage(
    connection_string="postgresql://user:pass@localhost/activemirror"
)
```

### File System

```python
from activemirror.storage import FileSystemStorage

storage = FileSystemStorage(
    base_path="./conversations",
    format="json"  # or "markdown"
)
```

### Custom Storage Backend

```python
from activemirror.storage import StorageBackend
from typing import List, Optional
import uuid

class CustomStorage(StorageBackend):
    def save_session(self, session) -> str:
        # Your implementation
        return str(uuid.uuid4())

    def load_session(self, session_id: str):
        # Your implementation
        pass

    def save_message(self, message):
        # Your implementation
        pass

    def get_messages(self, session_id: str, limit: int = 100) -> List:
        # Your implementation
        return []

# Use custom storage
storage = CustomStorage()
mirror = ActiveMirror(storage=storage)
```

## Advanced Features

### Semantic Memory

```python
from activemirror import ActiveMirror

mirror = ActiveMirror(enable_semantic_memory=True)
session = mirror.create_session()

# Conversation builds semantic memory
session.send("I prefer dark mode interfaces")
session.send("My favorite programming language is Python")

# Later, semantic memory is automatically used
session.send("What UI preferences did I mention?")
# Will recall dark mode preference

# Query semantic memory directly
facts = mirror.semantic_memory.query(
    user_id=session.user_id,
    fact_type="preference"
)
```

### Session Linking

Create connected sessions for continuity:

```python
# Parent session
session1 = mirror.create_session(title="Initial Discussion")
session1.send("Let's explore this topic")
session1.save()

# Child session continues from parent
session2 = mirror.create_session(
    title="Deep Dive",
    parent_session_id=session1.id
)
# Automatically inherits context from parent
session2.send("Let's go deeper on what we discussed")
```

### Context Control

```python
# Fine-tune context retrieval
session = mirror.create_session(
    max_context_messages=30,
    include_semantic_memory=True,
    context_strategy="recent_and_relevant"
)

# Manual context injection
session.add_context(
    content="Important: User prefers concise answers",
    context_type="preference"
)
```

### Streaming Responses

```python
session = mirror.create_session()

# Stream response as it's generated
for chunk in session.send_streaming("Write a long story"):
    print(chunk.content, end="", flush=True)
```

## Web API Integration

### Flask Example

```python
from flask import Flask, request, jsonify
from activemirror import ActiveMirror

app = Flask(__name__)
mirror = ActiveMirror()

@app.route("/session", methods=["POST"])
def create_session():
    session = mirror.create_session()
    return jsonify({"session_id": session.id})

@app.route("/session/<session_id>/message", methods=["POST"])
def send_message(session_id):
    data = request.json
    session = mirror.load_session(session_id)
    response = session.send(data["message"])
    return jsonify({
        "response": response.content,
        "timestamp": response.timestamp.isoformat()
    })

if __name__ == "__main__":
    app.run()
```

### FastAPI Example

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from activemirror import ActiveMirror

app = FastAPI()
mirror = ActiveMirror()

class MessageRequest(BaseModel):
    message: str

class MessageResponse(BaseModel):
    response: str
    session_id: str

@app.post("/session")
async def create_session():
    session = mirror.create_session()
    return {"session_id": session.id}

@app.post("/session/{session_id}/message", response_model=MessageResponse)
async def send_message(session_id: str, request: MessageRequest):
    try:
        session = mirror.load_session(session_id)
        response = session.send(request.message)
        return MessageResponse(
            response=response.content,
            session_id=session.id
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
```

## CLI Integration

```python
import click
from activemirror import ActiveMirror

@click.group()
def cli():
    """ActiveMirror CLI"""
    pass

@cli.command()
@click.option("--title", default="CLI Session")
def start(title):
    """Start an interactive session"""
    mirror = ActiveMirror()
    session = mirror.create_session(title=title)

    click.echo(f"Session started: {session.id}")

    while True:
        message = click.prompt("You")
        if message.lower() in ["exit", "quit"]:
            session.save()
            click.echo("Session saved. Goodbye!")
            break

        response = session.send(message)
        click.echo(f"AI: {response.content}")

if __name__ == "__main__":
    cli()
```

## Error Handling

```python
from activemirror import ActiveMirror, ActiveMirrorError
from activemirror.exceptions import (
    SessionNotFoundError,
    StorageError,
    ContextOverflowError
)

mirror = ActiveMirror()

try:
    session = mirror.load_session("invalid-id")
except SessionNotFoundError:
    print("Session not found, creating new one")
    session = mirror.create_session()

try:
    response = session.send("Very long message...")
except ContextOverflowError as e:
    print(f"Context too large: {e}")
    # Handle by summarizing or splitting

except ActiveMirrorError as e:
    print(f"General error: {e}")
```

## Performance Optimization

### Connection Pooling

```python
from activemirror import ActiveMirror
from activemirror.storage import PostgreSQLStorage

storage = PostgreSQLStorage(
    connection_string="postgresql://...",
    pool_size=20,
    max_overflow=10
)

mirror = ActiveMirror(storage=storage)
```

### Caching

```python
from activemirror import ActiveMirror
from activemirror.cache import RedisCache

cache = RedisCache(
    host="localhost",
    port=6379,
    ttl=3600
)

mirror = ActiveMirror(
    cache=cache,
    cache_strategy="aggressive"
)
```

### Async Support

```python
from activemirror import AsyncActiveMirror

async def main():
    mirror = AsyncActiveMirror()
    session = await mirror.create_session()
    response = await session.send("Hello")
    print(response.content)

import asyncio
asyncio.run(main())
```

## Testing Your Integration

```python
import pytest
from activemirror import ActiveMirror
from activemirror.storage import InMemoryStorage

@pytest.fixture
def mirror():
    # Use in-memory storage for tests
    storage = InMemoryStorage()
    return ActiveMirror(storage=storage)

def test_basic_conversation(mirror):
    session = mirror.create_session()
    response = session.send("Hello")
    assert response.content is not None
    assert len(response.content) > 0

def test_session_persistence(mirror):
    session = mirror.create_session(title="Test")
    session.send("Remember this")
    session_id = session.save()

    # Reload session
    loaded = mirror.load_session(session_id)
    assert loaded.title == "Test"
    assert len(loaded.get_messages()) > 0
```

## Best Practices

1. **Session Management**
   - Save sessions regularly
   - Use descriptive titles
   - Link related sessions

2. **Memory Efficiency**
   - Limit context window size
   - Use semantic memory for long-term facts
   - Prune old sessions

3. **Error Handling**
   - Always handle exceptions
   - Implement retry logic for transient errors
   - Log errors for debugging

4. **Security**
   - Use encryption for sensitive data
   - Validate user input
   - Implement access control

5. **Performance**
   - Use caching for frequently accessed data
   - Enable connection pooling
   - Consider async for high concurrency

## Next Steps

- Explore [Examples](../examples/) for complete code samples
- Review [API Reference](api.md) for detailed interface docs
- Check [Configuration](configuration.md) for advanced options
- Read [Architecture](architecture.md) to understand internals

## Support

- GitHub Issues: Bug reports and questions
- Discussions: Design and integration help
- Examples: Share your integration patterns
