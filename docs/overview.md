# Overview

## What is ActiveMirrorOS?

ActiveMirrorOS is a product-layer orchestration system that provides **persistent, context-aware AI interactions**. It solves the fundamental limitation of traditional AI systems: they forget everything after each conversation ends.

### The Problem

Current AI interactions are ephemeral:
- Each conversation starts from scratch
- Context is lost between sessions
- AI can't build on previous discussions
- Users must repeat information constantly
- No sense of continuity or relationship

### The Solution

ActiveMirrorOS creates a **persistent memory layer** that:
- Maintains conversation history across sessions
- Builds cumulative context over time
- Remembers user preferences and patterns
- Enables long-term relationship building
- Provides continuity across different interfaces

## Core Concepts

### Sessions

A **session** is a bounded interaction period with the AI. Sessions can be:
- **Ephemeral**: Temporary, discarded after completion
- **Persistent**: Saved and resumable later
- **Linked**: Connected to previous sessions for continuity

### Memory

**Memory** is the core capability that makes ActiveMirrorOS unique:

1. **Short-term memory**: Current conversation context
2. **Working memory**: Recently accessed information
3. **Long-term memory**: Persistent storage of conversations and insights
4. **Semantic memory**: Extracted knowledge and patterns

### Identity

Powered by **MirrorDNA protocol**, identity provides:
- Stable user identification across sessions
- Privacy-preserving continuity
- User-controlled data sovereignty
- Cross-device synchronization (optional)

### Reflection

Through **LingOS integration**, ActiveMirrorOS enables:
- Self-aware dialogue patterns
- Context-sensitive responses
- Meta-cognitive capabilities
- Adaptive communication styles

## Design Philosophy

### Local-First

- Data stored locally by default
- No required cloud services
- User controls their data
- Optional sync/backup

### Privacy by Design

- End-to-end encryption for sensitive data
- Minimal data collection
- Transparent storage practices
- User-controlled retention policies

### Simplicity

- Clear, understandable APIs
- Minimal configuration required
- Sensible defaults
- Progressive complexity (simple to start, powerful when needed)

### Extensibility

- Plug-in architecture for storage backends
- Custom LLM provider support
- Hook system for extensions
- Open protocol integration

## Use Cases

### Personal AI Assistant

Long-term personal AI that:
- Remembers your preferences
- Tracks ongoing projects
- Maintains context across days/weeks
- Builds understanding over time

### Research & Knowledge Work

Support for:
- Long-term research projects
- Cumulative knowledge building
- Cross-session analysis
- Insight extraction and synthesis

### Customer Support

Enable:
- Customer history awareness
- Conversation continuity
- Context preservation across support sessions
- Personalized service

### Education & Tutoring

Facilitate:
- Long-term learning tracking
- Progressive skill building
- Personalized learning paths
- Student progress monitoring

### Creative Collaboration

Support:
- Long-form writing projects
- Creative brainstorming over time
- Project evolution tracking
- Collaborative iteration

## Technical Approach

### Modular Architecture

ActiveMirrorOS is built from composable components:

```
activemirror/
├── core/           # Session and memory management
├── integrations/   # MirrorDNA, LingOS connections
├── storage/        # Persistence layer
└── api/            # Public interface
```

### Storage Abstraction

Multiple storage backends supported:
- **SQLite**: Simple, local, file-based
- **PostgreSQL**: Robust, scalable database
- **File System**: Plain JSON/Markdown files
- **Custom**: Implement your own backend

### Protocol Integration

Clean separation between:
- **ActiveMirrorOS**: Orchestration and product layer
- **MirrorDNA**: Identity and continuity protocol
- **LingOS**: Dialogue and reflection OS
- **Storage**: Persistence implementation

## Getting Started

1. **Install**: `pip install activemirror`
2. **Initialize**: Create a session manager
3. **Start a session**: Begin a conversation
4. **Interact**: Send messages, receive responses
5. **Persist**: Save the session for later
6. **Resume**: Continue where you left off

See the [Integration Guide](integration.md) for detailed instructions.

## What's Next?

- Explore the [Architecture](architecture.md) to understand system design
- Read the [Integration Guide](integration.md) to use ActiveMirrorOS in your app
- Check out [Examples](../examples/) for practical code samples
- Review the [API Reference](api.md) for detailed interface documentation

## Community & Support

ActiveMirrorOS is part of the broader MirrorDNA ecosystem. Join the community:

- GitHub Issues: Bug reports and feature requests
- Discussions: Design conversations and Q&A
- Examples: Share your use cases and integrations

---

**Remember**: ActiveMirrorOS is in active development. APIs may change, and features are being added iteratively. We welcome your feedback and contributions.
