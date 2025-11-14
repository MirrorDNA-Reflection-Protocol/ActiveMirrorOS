# Reflective Behaviors

**At a Glance**: Learn how ActiveMirrorOS implements LingOS Lite patterns for thoughtful, uncertainty-aware dialogue. This doc covers uncertainty markers, reflective patterns, and meta-cognitive awareness in AI interactions.

---

How ActiveMirrorOS implements LingOS Lite patterns for thoughtful, uncertainty-aware dialogue.

## Overview

ActiveMirrorOS uses **LingOS Lite** - a simplified version of the LingOS reflective dialogue protocol. It brings **meta-cognitive awareness** and **epistemic humility** to AI interactions.

**LingOS** is a standalone project in the MirrorDNA ecosystem that defines reflective dialogue patterns for AI systems. ActiveMirrorOS implements a practical subset of LingOS (called "LingOS Lite") focused on production use cases.

## Core Principles

### 1. Uncertainty is Explicit

Traditional AI:
```
User: "Should I quit my job?"
AI: "Yes, you should quit your job and pursue entrepreneurship."
```

ActiveMirrorOS (LingOS Lite):
```
User: "Should I quit my job?"
AI: "This is ⟨⟨high⟩⟩ a deeply personal decision with many unknowns.
     What ⟨medium⟩ feels most aligned with your long-term vision?
     ◊ Consider: What experiments could reduce uncertainty?"
```

### 2. Patterns Over Prompts

Four reflective patterns for different thinking modes:

- **◊ Exploratory** - Open inquiry, pattern recognition
- **✦ Analytical** - Rigorous examination, edge cases
- **★ Creative** - Generative thinking, possibilities
- **⬢ Strategic** - Long-term planning, second-order effects

### 3. Meta-Cognitive Awareness

The AI reflects on its own reasoning:

```
"I notice ⟨low⟩ I'm pattern-matching to similar situations.
 What makes this case unique?"
```

## Uncertainty Markers

### Syntax

```
⟨low⟩       - Minor uncertainty
⟨medium⟩    - Moderate uncertainty
⟨⟨high⟩⟩    - Significant uncertainty
```

### Usage

```python
from activemirror import ReflectiveClient

client = ReflectiveClient()
reflection = client.reflect("Is now the right time to launch?")

print(reflection['uncertainty'])  # UncertaintyLevel.MEDIUM
print(reflection['response'])
# "Timing is ⟨medium⟩ uncertain without market validation..."
```

### Interpretation

| Level | Meaning | Action |
|-------|---------|--------|
| None | Confident | Act with clarity |
| ⟨low⟩ | Minor doubt | Proceed with minor adjustments |
| ⟨medium⟩ | Moderate | Gather more information |
| ⟨⟨high⟩⟩ | Significant | Experiments needed before decision |

## Reflective Patterns

### Exploratory Pattern (◊)

**When to use**: Open-ended questions, sense-making, understanding

**Characteristics**:
- Open inquiry
- Pattern recognition
- Multiple perspectives
- Emergent insights

**Example**:

```python
client.reflect(
    "What does meaningful work mean to me?",
    pattern=ReflectivePattern.EXPLORATORY
)

# Response:
# "◊ Let's explore this together. What patterns emerge when
#  you recall moments that felt most meaningful? ⟨low⟩ I notice
#  you might be seeking connection between impact and autonomy.
#  What other dimensions feel relevant?"
```

**Prompt Template**:

```python
ReflectivePromptBuilder.exploratory(
    topic="Meaningful work",
    context="Career transition"
)
```

### Analytical Pattern (✦)

**When to use**: Evaluating claims, rigorous thinking, finding edge cases

**Characteristics**:
- Logical examination
- Assumption surfacing
- Evidence evaluation
- Edge case identification

**Example**:

```python
client.reflect(
    "Remote work is always more productive",
    pattern=ReflectivePattern.ANALYTICAL
)

# Response:
# "✦ Let's examine this claim carefully. This assumes ⟨medium⟩
#  productivity means the same thing across contexts. What about
#  collaborative work requiring real-time feedback? Or creative
#  work benefiting from serendipitous connections? The claim
#  ⟨low⟩ may hold for focused individual work but not universally."
```

### Creative Pattern (★)

**When to use**: Brainstorming, ideation, exploring possibilities

**Characteristics**:
- Generative thinking
- Possibility space expansion
- Unconventional connections
- Playful exploration

**Example**:

```python
client.reflect(
    "New ways to build community online",
    pattern=ReflectivePattern.CREATIVE
)

# Response:
# "★ What if we inverted the model? Instead of platforms hosting
#  communities, communities hosting micro-platforms? ⟨⟨high⟩⟩
#  I'm uncertain how this scales, but the autonomy dimension
#  feels generative. Or: async-first spaces with 'thought gardens'
#  that evolve over weeks rather than real-time chat?"
```

### Strategic Pattern (⬢)

**When to use**: Planning, decision-making, long-term thinking

**Characteristics**:
- Second-order effects
- Scenario planning
- Risk/reward analysis
- Staged experimentation

**Example**:

```python
client.reflect(
    "Launch product now or wait 3 months?",
    pattern=ReflectivePattern.STRATEGIC,
    context={"runway": "12 months", "team_size": 2}
)

# Response:
# "⬢ Strategically, consider the learning value of each path.
#  Launching now (⟨medium⟩ uncertainty on reception) gives 12
#  months of market feedback with current runway. Waiting 3 months
#  (⟨low⟩ more polished) leaves 9 months for iteration. Given
#  2-person team, rapid iteration ⟨low⟩ likely outweighs polish.
#  What small experiment could test core value prop in 2 weeks?"
```

## Glyph System

**Visual markers for cognitive modes:**

| Glyph | Meaning | Usage |
|-------|---------|-------|
| ◊ | Exploratory | Open inquiry |
| ✦ | Analytical | Rigorous thinking |
| ★ | Creative | Generative ideas |
| ⬢ | Strategic | Long-term planning |
| ◈ | Marker | General emphasis |
| ⬡ | Question | Deeper inquiry |

```python
client.format_with_glyphs(
    "This is a key insight",
    glyph_type="insight"
)
# "✦ This is a key insight ✦"
```

## Meta-Cognitive Responses

### Self-Awareness

```
"I notice ⟨low⟩ I'm defaulting to optimization language.
 Is efficiency the right frame here, or does this call for
 exploration?"
```

### Reasoning Transparency

```
"My reasoning: [1] You mentioned time pressure, suggesting
 ⟨medium⟩ this is about prioritization, not capability.
 [2] The word 'should' implies external expectations.
 [3] What would emerge if we reframed as 'what do I want'?"
```

### Acknowledging Limits

```
"This question ⟨⟨high⟩⟩ requires domain expertise in
 quantum computing I don't possess. What I can offer:
 general reasoning frameworks. What would help most?"
```

## Implementation

### Python

```python
from activemirror import ReflectiveClient, ReflectivePattern

client = ReflectiveClient(
    default_pattern=ReflectivePattern.EXPLORATORY,
    enable_glyphs=True
)

reflection = client.reflect(
    input_text="Your question or topic",
    pattern=ReflectivePattern.STRATEGIC,
    context={"key": "value"}
)

# Returns:
{
    "response": "The reflected response with markers",
    "uncertainty": UncertaintyLevel.MEDIUM,
    "glyphs": ["◊", "✦"],
    "pattern": "strategic",
    "meta": {
        "has_uncertainty": True,
        "has_glyphs": True,
        "reflection_depth": "deep"
    }
}
```

### JavaScript

```javascript
import { ReflectiveClient, ReflectivePattern } from '@activemirror/sdk';

const client = new ReflectiveClient({
  defaultPattern: ReflectivePattern.EXPLORATORY,
  enableGlyphs: true
});

const reflection = await client.reflect(inputText, {
  pattern: ReflectivePattern.STRATEGIC,
  context: {}
});

console.log(reflection.response);
console.log(reflection.uncertainty);
```

### Connecting Real LLMs

```python
import openai

def openai_provider(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

client = ReflectiveClient(llm_provider=openai_provider)

# Now uses GPT-4 with reflective prompting
reflection = client.reflect("Your deep question")
```

## Prompt Engineering

### Building Reflective Prompts

```python
from activemirror import ReflectivePromptBuilder

# Exploratory
prompt = ReflectivePromptBuilder.exploratory(
    topic="Meaningful work",
    context="Mid-career transition"
)

# Analytical
prompt = ReflectivePromptBuilder.analytical(
    claim="AI will replace most knowledge work",
    evidence="Recent GPT-4 benchmarks"
)

# Strategic
prompt = ReflectivePromptBuilder.strategic(
    goal="Launch SaaS product",
    constraints="6 month runway, solo founder"
)
```

### Custom Patterns

```python
def contemplative_pattern(question, context=""):
    return f"""Contemplate this question with patience:

Question: {question}
{f'Context: {context}' if context else ''}

Respond slowly, as if thinking aloud:
- What draws attention when sitting with this?
- What remains unclear or unformed?
- What gentle questions arise?

Use uncertainty markers ⟨⟩ freely."""

client = ReflectiveClient(llm_provider=your_llm)
prompt = contemplative_pattern("What am I avoiding?")
response = await client.llm_provider(prompt)
```

## Best Practices

### 1. Match Pattern to Intent

```python
# Exploring a topic
ReflectivePattern.EXPLORATORY

# Evaluating a decision
ReflectivePattern.ANALYTICAL

# Generating options
ReflectivePattern.CREATIVE

# Planning action
ReflectivePattern.STRATEGIC
```

### 2. Provide Context

```python
client.reflect(
    "Should I pivot?",
    context={
        "current_path": "B2B SaaS",
        "considering": "Developer tools",
        "runway": "8 months"
    }
)
```

### 3. Honor Uncertainty

Don't treat ⟨⟨high⟩⟩ uncertainty as a bug:

```
User: "Should I invest in crypto?"
AI: "⟨⟨high⟩⟩ This requires predicting market dynamics
     I cannot reliably forecast. What I can offer:
     frameworks for thinking about risk tolerance and
     speculation vs. investment."
```

This IS the feature - honest uncertainty.

### 4. Iterate on Reflections

```python
# First pass
r1 = client.reflect("Career change?")

# Dig deeper based on response
r2 = client.reflect(
    f"You mentioned '{key_phrase}'. Tell me more.",
    pattern=ReflectivePattern.EXPLORATORY
)
```

## Use Cases

### Personal Journaling

```python
# Reflective prompts for journaling
journal_entry = "Feeling stuck on this project"

reflection = client.reflect(
    journal_entry,
    pattern=ReflectivePattern.EXPLORATORY
)

# Helps surfacewhat's beneath "stuck"
```

### Strategic Planning

```python
strategy = client.reflect(
    "Expand to enterprise or double down on SMB?",
    pattern=ReflectivePattern.STRATEGIC,
    context={"current_mrr": "50k", "team": "8 people"}
)

# Surfaces second-order effects and experiments
```

### Learning & Research

```python
analysis = client.reflect(
    "What are the limits of transformer architectures?",
    pattern=ReflectivePattern.ANALYTICAL
)

# Examines assumptions, edge cases, recent developments
```

### Difficult Conversations

```python
preparation = client.reflect(
    "How to give critical feedback to a teammate?",
    pattern=ReflectivePattern.EXPLORATORY,
    context={"relationship": "peer", "topic": "missed deadlines"}
)

# Explores multiple perspectives, potential reactions
```

## Summary

**LingOS Lite** in ActiveMirrorOS provides:

✦ **Four reflective patterns** for different thinking modes
◊ **Uncertainty markers** for epistemic humility
★ **Glyph system** for visual cognitive cues
⬢ **Meta-cognitive awareness** for transparent reasoning

This creates AI interactions that are **thoughtful, humble, and genuinely helpful** rather than overconfident and shallow.

---

For implementation details, see [api-reference.md](api-reference.md).
For architectural context, see [architecture.md](architecture.md).
