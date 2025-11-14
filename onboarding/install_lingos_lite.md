# Installing and Using LingOS Lite

**LingOS Lite** is the built-in reflective dialogue pattern library included with ActiveMirrorOS. It provides 4 thinking modes and uncertainty markers to make AI interactions more thoughtful and context-aware.

This guide shows you how to use LingOS Lite in your applications.

---

## What is LingOS Lite?

LingOS Lite is a simplified version of the full **LingOS** (Linguistic Operating System) protocol. It provides:

- **4 Reflective Patterns**: Exploratory, Analytical, Creative, Strategic
- **Uncertainty Markers**: Indicate confidence levels (~, ?, *, !)
- **Glyph System**: Simple markers for meta-cognitive states
- **Pattern Switching**: Adapt dialogue mode based on context

**Key difference from full LingOS:**
- LingOS Lite = Built-in patterns, no external dependencies
- LingOS Pro = Full protocol with advanced features (coming in v0.6.0)

---

## Prerequisites

- ActiveMirrorOS SDK installed (see [Getting Started](getting_started.md))
- Python 3.8+ or Node.js 16+
- Basic familiarity with the SDK

---

## Installation

**Good news**: LingOS Lite is already included with ActiveMirrorOS! No separate installation needed.

Verify it's available:

### Python
```python
from activemirror.reflective_client import ReflectiveClient, ReflectivePattern

print("LingOS Lite is ready!")
```

### JavaScript
```javascript
const { ReflectiveClient } = require('./activemirror');

console.log("LingOS Lite is ready!");
```

---

## Understanding the 4 Patterns

### 1. Exploratory (🔍)
**When to use**: Open-ended questions, brainstorming, discovery
**Style**: Curious, questioning, non-judgmental
**Uncertainty marker**: `~` (tilde)

**Example:**
```
User: How should I approach this problem?
Exploratory: What aspects of this problem intrigue you most? ~
             What have you already considered? ~
```

### 2. Analytical (🔬)
**When to use**: Breaking down complex topics, structured thinking
**Style**: Logical, systematic, component-based
**Uncertainty marker**: `?` (question mark)

**Example:**
```
User: Explain how memory persistence works.
Analytical: Let's break this into components:
            1. Storage layer (SQLite/JSON) ?
            2. Session management (continuity) ?
            3. Retrieval patterns (context windows) ?
```

### 3. Creative (💡)
**When to use**: Generating ideas, making connections, possibilities
**Style**: Generative, associative, divergent
**Uncertainty marker**: `*` (asterisk)

**Example:**
```
User: What could I build with this?
Creative: Here are some possibilities:
          * Personal journal with AI insights
          * Team memory for shared context
          * Research assistant that remembers your work *
```

### 4. Strategic (🎯)
**When to use**: Goal setting, planning, actionable steps
**Style**: Directive, goal-oriented, sequential
**Uncertainty marker**: `!` (exclamation)

**Example:**
```
User: I want to launch an AI product.
Strategic: Here's a path forward:
           1. Define your core use case !
           2. Build an MVP with ActiveMirrorOS !
           3. Test with 10 users !
           4. Iterate and scale !
```

---

## Python Usage Examples

### Basic Pattern Usage

```python
from activemirror.reflective_client import ReflectiveClient, ReflectivePattern

# Create reflective client
client = ReflectiveClient(storage_dir="memory")

# Create a session
session_id = client.create_session("brainstorm")

# Use exploratory pattern
response = client.reflect(
    session_id=session_id,
    user_input="How do I make my AI more useful?",
    pattern=ReflectivePattern.EXPLORATORY
)

print(response.reflection)
# → "What aspects of usefulness matter most to you? ~"

# Switch to analytical
response = client.reflect(
    session_id=session_id,
    user_input="Break down the components of usefulness.",
    pattern=ReflectivePattern.ANALYTICAL
)

print(response.reflection)
# → "Let's structure this: 1) Relevance, 2) Timeliness, 3) Accuracy ?"
```

### Auto-Pattern Selection

```python
# Let the system choose the best pattern
response = client.auto_reflect(
    session_id=session_id,
    user_input="I need to solve a complex problem but I'm not sure how.",
    context=session.get_context()
)

print(f"Selected pattern: {response.pattern}")
print(f"Reflection: {response.reflection}")
```

### Uncertainty Markers

```python
# Add explicit uncertainty
response = client.reflect(
    session_id=session_id,
    user_input="Is this the right approach?",
    pattern=ReflectivePattern.ANALYTICAL,
    uncertainty_level=0.4  # 40% uncertain
)

print(response.reflection)
# → "Let's evaluate: 1) Pros ?, 2) Cons ?, 3) Alternatives ? (confidence: 60%)"
```

---

## JavaScript Usage Examples

### Basic Pattern Usage

```javascript
const { ReflectiveClient, ReflectivePattern } = require('./activemirror');

// Create client
const client = new ReflectiveClient('./memory');

// Create session
const sessionId = client.createSession('problem-solving');

// Use creative pattern
const response = client.reflect({
  sessionId: sessionId,
  userInput: 'What are some innovative uses for persistent memory?',
  pattern: ReflectivePattern.CREATIVE
});

console.log(response.reflection);
// → "Some possibilities: * AI that learns your preferences..."
```

### Pattern Chaining

```javascript
// Start exploratory
let response = client.reflect({
  sessionId: sessionId,
  userInput: 'I want to build something new.',
  pattern: ReflectivePattern.EXPLORATORY
});

console.log('Exploratory:', response.reflection);

// Move to creative
response = client.reflect({
  sessionId: sessionId,
  userInput: 'Give me some ideas.',
  pattern: ReflectivePattern.CREATIVE
});

console.log('Creative:', response.reflection);

// End with strategic
response = client.reflect({
  sessionId: sessionId,
  userInput: 'How do I get started?',
  pattern: ReflectivePattern.STRATEGIC
});

console.log('Strategic:', response.reflection);
```

---

## Configuration

### Pattern Defaults

Set default pattern in your config:

**Python** (`config.yaml`):
```yaml
reflective:
  default_pattern: exploratory
  auto_switch: true
  uncertainty_threshold: 0.3
```

**Load config:**
```python
from activemirror import Config

config = Config.from_yaml("config.yaml")
client = ReflectiveClient(config=config)
```

### Custom Pattern Behavior

```python
# Override pattern behavior
client.set_pattern_style(
    pattern=ReflectivePattern.EXPLORATORY,
    prefix="🤔 Wondering:",
    uncertainty_marker="⚡"
)
```

---

## Real-World Use Cases

### 1. Personal Journal
```python
# Morning: Exploratory
client.reflect(
    session_id="daily-journal",
    user_input="What am I feeling this morning?",
    pattern=ReflectivePattern.EXPLORATORY
)

# Evening: Analytical
client.reflect(
    session_id="daily-journal",
    user_input="What did I accomplish today?",
    pattern=ReflectivePattern.ANALYTICAL
)
```

### 2. Team Brainstorming
```javascript
// Start creative
client.reflect({
  sessionId: 'team-brainstorm',
  userInput: 'Ideas for our next product feature?',
  pattern: ReflectivePattern.CREATIVE
});

// Then strategic
client.reflect({
  sessionId: 'team-brainstorm',
  userInput: 'Which idea should we prioritize?',
  pattern: ReflectivePattern.STRATEGIC
});
```

### 3. Research Assistant
```python
# Exploratory phase
client.reflect(
    session_id="research",
    user_input="What questions should I ask about this topic?",
    pattern=ReflectivePattern.EXPLORATORY
)

# Analytical phase
client.reflect(
    session_id="research",
    user_input="Organize what I've learned.",
    pattern=ReflectivePattern.ANALYTICAL
)
```

---

## Advanced Features

### Glyph System

Use glyphs for meta-cognitive markers:

```python
from activemirror.reflective_client import Glyph

# Add glyphs to messages
session.add_message(
    role="assistant",
    content="This is an important insight.",
    glyphs=[Glyph.INSIGHT, Glyph.CONTINUITY]
)

# Query by glyph
insights = session.get_messages_by_glyph(Glyph.INSIGHT)
```

**Available glyphs:**
- `INSIGHT` (💎) — Key realizations
- `CONTINUITY` (🔗) — Connections to past
- `UNCERTAINTY` (~) — Low confidence
- `REFLECTION` (🪞) — Meta-cognitive markers

### Context-Aware Patterns

```python
# Pattern selection based on conversation history
history = session.get_context(limit=10)
pattern = client.suggest_pattern(history)

response = client.reflect(
    session_id=session_id,
    user_input=user_message,
    pattern=pattern
)
```

---

## Troubleshooting

### "ReflectiveClient not found"
- **Solution**: Make sure you have ActiveMirrorOS v0.2.0+
- **Check**: `pip list | grep activemirror`

### Patterns not working as expected
- **Solution**: Check that you're passing `ReflectivePattern` enum, not a string
- **Correct**: `pattern=ReflectivePattern.EXPLORATORY`
- **Incorrect**: `pattern="exploratory"`

### Uncertainty markers not showing
- **Solution**: Set `uncertainty_level` explicitly or enable in config
- **Example**: `uncertainty_level=0.3`

---

## Upgrading to LingOS Pro

When LingOS Pro becomes available (v0.6.0), you'll get:
- Advanced pattern composition
- Custom pattern creation
- Meta-cognitive feedback loops
- Full protocol compliance with MirrorDNA

See [Upgrade to LingOS Pro](upgrade_to_lingos_pro.md) for details.

---

## Next Steps

- **[API Reference](../docs/api-reference.md)** — Full SDK documentation
- **[Reflective Behaviors Guide](../docs/reflective-behaviors.md)** — Deep dive into patterns
- **[Example Apps](../apps/)** — See patterns in action
- **[Troubleshooting](troubleshooting.md)** — Common issues

---

## Summary

LingOS Lite gives you:
- ✅ 4 reflective patterns out of the box
- ✅ Uncertainty markers for meta-cognition
- ✅ Zero additional setup
- ✅ Production-ready patterns
- ✅ Foundation for LingOS Pro upgrade

**Start using reflective patterns today!**

```python
from activemirror.reflective_client import ReflectiveClient, ReflectivePattern

client = ReflectiveClient(storage_dir="my_memory")
session_id = client.create_session("explore")

response = client.reflect(
    session_id=session_id,
    user_input="What should I build?",
    pattern=ReflectivePattern.EXPLORATORY
)

print(response.reflection)
```

**Happy reflecting!** 🪞
