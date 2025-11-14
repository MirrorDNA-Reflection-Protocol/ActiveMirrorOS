# API Integration Examples

This guide shows how to integrate ActiveMirrorOS into various API architectures, including REST APIs, GraphQL, and WebSockets.

---

## Table of Contents

- [REST API Example (Express.js)](#rest-api-example-expressjs)
- [REST API Example (FastAPI/Python)](#rest-api-example-fastapipython)
- [GraphQL API Example](#graphql-api-example)
- [WebSocket Real-Time Example](#websocket-real-time-example)
- [Authentication & Authorization](#authentication--authorization)

---

## REST API Example (Express.js)

Create a REST API server that exposes ActiveMirrorOS functionality over HTTP.

### Setup

```bash
npm install express activemirror body-parser
```

### Server Implementation

**server.js:**

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const { ActiveMirror } = require('activemirror');

const app = express();
app.use(bodyParser.json());

// Initialize ActiveMirror with persistent storage
const mirror = new ActiveMirror('./api-data');

// Middleware to validate session exists
const validateSession = (req, res, next) => {
    const { sessionId } = req.params;
    try {
        mirror.loadSession(sessionId);
        next();
    } catch (error) {
        res.status(404).json({ error: 'Session not found' });
    }
};

// ============= Session Endpoints =============

// Create a new session
app.post('/api/sessions', (req, res) => {
    try {
        const { session_id, metadata } = req.body;
        const session = mirror.createSession(session_id, metadata);
        res.status(201).json({
            session_id: session.sessionId,
            created_at: session.createdAt,
            metadata: session.metadata
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// List all sessions
app.get('/api/sessions', (req, res) => {
    try {
        const sessions = mirror.listSessions();
        res.json({ sessions, count: sessions.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get session details
app.get('/api/sessions/:sessionId', validateSession, (req, res) => {
    try {
        const session = mirror.loadSession(req.params.sessionId);
        res.json({
            session_id: session.sessionId,
            messages: session.messages,
            metadata: session.metadata,
            created_at: session.createdAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update session metadata
app.patch('/api/sessions/:sessionId', validateSession, (req, res) => {
    try {
        const session = mirror.loadSession(req.params.sessionId);
        session.metadata = { ...session.metadata, ...req.body.metadata };
        mirror.saveSession(session);
        res.json({ session_id: session.sessionId, metadata: session.metadata });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a session
app.delete('/api/sessions/:sessionId', validateSession, (req, res) => {
    try {
        mirror.deleteSession(req.params.sessionId);
        res.json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= Message Endpoints =============

// Add a message to a session
app.post('/api/sessions/:sessionId/messages', validateSession, (req, res) => {
    try {
        const session = mirror.loadSession(req.params.sessionId);
        const { role, content } = req.body;

        session.addMessage(role, content);
        mirror.saveSession(session);

        res.status(201).json({
            message: 'Message added',
            session_id: session.sessionId,
            message_count: session.messages.length
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add multiple messages (batch)
app.post('/api/sessions/:sessionId/messages/batch', validateSession, (req, res) => {
    try {
        const session = mirror.loadSession(req.params.sessionId);
        const { messages } = req.body;

        messages.forEach(({ role, content }) => {
            session.addMessage(role, content);
        });
        mirror.saveSession(session);

        res.status(201).json({
            message: 'Batch messages added',
            session_id: session.sessionId,
            added: messages.length,
            total: session.messages.length
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Search messages in a session
app.get('/api/sessions/:sessionId/search', validateSession, (req, res) => {
    try {
        const session = mirror.loadSession(req.params.sessionId);
        const query = req.query.q || '';

        const results = session.messages.filter(msg =>
            msg.content.toLowerCase().includes(query.toLowerCase())
        );

        res.json({ query, results, count: results.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= Export Endpoints =============

// Export session
app.get('/api/sessions/:sessionId/export', validateSession, (req, res) => {
    try {
        const format = req.query.format || 'json';
        const filename = mirror.exportSession(req.params.sessionId, format);

        if (format === 'markdown') {
            res.setHeader('Content-Type', 'text/markdown');
        } else {
            res.setHeader('Content-Type', 'application/json');
        }

        res.download(filename);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= Statistics Endpoints =============

// Get session statistics
app.get('/api/sessions/:sessionId/stats', validateSession, (req, res) => {
    try {
        const session = mirror.loadSession(req.params.sessionId);

        const stats = {
            session_id: session.sessionId,
            message_count: session.messages.length,
            user_messages: session.messages.filter(m => m.role === 'user').length,
            assistant_messages: session.messages.filter(m => m.role === 'assistant').length,
            created_at: session.createdAt,
            metadata: session.metadata
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= Health Check =============

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'ActiveMirrorOS API',
        version: '1.0.0',
        sessions: mirror.listSessions().length
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ ActiveMirrorOS API running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
    console.log(`   API base: http://localhost:${PORT}/api`);
});
```

### Usage

```bash
# Start the server
node server.js

# Test with cURL (see curl_examples.sh)
curl http://localhost:3000/health
```

---

## REST API Example (FastAPI/Python)

Python REST API using FastAPI framework.

### Setup

```bash
pip install fastapi uvicorn activemirror
```

### Server Implementation

**server.py:**

```python
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional, Dict
from activemirror import ActiveMirror
import os

app = FastAPI(title="ActiveMirrorOS API", version="1.0.0")

# Initialize ActiveMirror
mirror = ActiveMirror(storage_type="sqlite", db_path="api_memory.db")


# ============= Pydantic Models =============

class SessionCreate(BaseModel):
    session_id: str
    metadata: Optional[Dict] = {}


class MessageCreate(BaseModel):
    role: str
    content: str


class MessageBatch(BaseModel):
    messages: List[MessageCreate]


class MetadataUpdate(BaseModel):
    metadata: Dict


# ============= Session Endpoints =============

@app.post("/api/sessions", status_code=201)
async def create_session(session: SessionCreate):
    """Create a new session"""
    try:
        s = mirror.create_session(session.session_id, metadata=session.metadata)
        return {
            "session_id": s.session_id,
            "created_at": s.created_at,
            "metadata": s.metadata
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/sessions")
async def list_sessions():
    """List all sessions"""
    sessions = mirror.list_sessions()
    return {"sessions": sessions, "count": len(sessions)}


@app.get("/api/sessions/{session_id}")
async def get_session(session_id: str):
    """Get session details"""
    try:
        session = mirror.load_session(session_id)
        return {
            "session_id": session.session_id,
            "messages": session.messages,
            "metadata": session.metadata,
            "created_at": session.created_at
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail="Session not found")


@app.patch("/api/sessions/{session_id}")
async def update_session(session_id: str, update: MetadataUpdate):
    """Update session metadata"""
    try:
        session = mirror.load_session(session_id)
        session.metadata.update(update.metadata)
        mirror.save_session(session)
        return {"session_id": session.session_id, "metadata": session.metadata}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Session not found")


@app.delete("/api/sessions/{session_id}")
async def delete_session(session_id: str):
    """Delete a session"""
    try:
        mirror.delete_session(session_id)
        return {"message": "Session deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Session not found")


# ============= Message Endpoints =============

@app.post("/api/sessions/{session_id}/messages", status_code=201)
async def add_message(session_id: str, message: MessageCreate):
    """Add a message to a session"""
    try:
        session = mirror.load_session(session_id)
        session.add_message(message.role, message.content)
        mirror.save_session(session)
        return {
            "message": "Message added",
            "session_id": session.session_id,
            "message_count": len(session.messages)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/sessions/{session_id}/messages/batch", status_code=201)
async def add_messages_batch(session_id: str, batch: MessageBatch):
    """Add multiple messages at once"""
    try:
        session = mirror.load_session(session_id)
        for msg in batch.messages:
            session.add_message(msg.role, msg.content)
        mirror.save_session(session)
        return {
            "message": "Batch messages added",
            "session_id": session.session_id,
            "added": len(batch.messages),
            "total": len(session.messages)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/sessions/{session_id}/search")
async def search_messages(session_id: str, q: str = Query(..., min_length=1)):
    """Search messages in a session"""
    try:
        session = mirror.load_session(session_id)
        results = [
            msg for msg in session.messages
            if q.lower() in msg['content'].lower()
        ]
        return {"query": q, "results": results, "count": len(results)}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Session not found")


# ============= Export Endpoints =============

@app.get("/api/sessions/{session_id}/export")
async def export_session(session_id: str, format: str = "json"):
    """Export session to file"""
    try:
        filename = mirror.export_session(session_id, format=format)
        return FileResponse(
            path=filename,
            media_type="application/octet-stream",
            filename=os.path.basename(filename)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============= Statistics Endpoints =============

@app.get("/api/sessions/{session_id}/stats")
async def get_stats(session_id: str):
    """Get session statistics"""
    try:
        session = mirror.load_session(session_id)
        user_msgs = [m for m in session.messages if m['role'] == 'user']
        assistant_msgs = [m for m in session.messages if m['role'] == 'assistant']

        return {
            "session_id": session.session_id,
            "message_count": len(session.messages),
            "user_messages": len(user_msgs),
            "assistant_messages": len(assistant_msgs),
            "created_at": session.created_at,
            "metadata": session.metadata
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail="Session not found")


# ============= Health Check =============

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ActiveMirrorOS API",
        "version": "1.0.0",
        "sessions": len(mirror.list_sessions())
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Usage

```bash
# Start the server
python server.py

# Or with uvicorn directly
uvicorn server:app --reload

# Test
curl http://localhost:8000/health

# Interactive docs
open http://localhost:8000/docs
```

---

## GraphQL API Example

Coming soon - GraphQL implementation for ActiveMirrorOS.

---

## WebSocket Real-Time Example

Coming soon - Real-time updates via WebSockets.

---

## Authentication & Authorization

### Add JWT Authentication

**Express.js example:**

```javascript
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

// Apply to all API routes
app.use('/api/*', authenticateJWT);
```

### Add User-Scoped Sessions

```javascript
// Create session scoped to authenticated user
app.post('/api/sessions', authenticateJWT, (req, res) => {
    const userId = req.user.id;
    const sessionId = `${userId}-${Date.now()}`;

    const session = mirror.createSession(sessionId, {
        user_id: userId,
        ...req.body.metadata
    });

    res.status(201).json(session);
});
```

---

## Next Steps

- Review [curl_examples.sh](curl_examples.sh) for testing
- Add rate limiting (express-rate-limit, slowapi)
- Implement caching (Redis)
- Add monitoring (Prometheus, DataDog)
- Deploy to production (Docker, Kubernetes)

---

**API Examples** — Integrate ActiveMirrorOS anywhere.
