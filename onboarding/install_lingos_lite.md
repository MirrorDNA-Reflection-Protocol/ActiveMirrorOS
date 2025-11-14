# Installing LingOS Lite

LingOS Lite is the reflective dialogue framework included with ActiveMirrorOS. It enables uncertainty marking, mode switching, and meta-cognitive responses.

---

## What is LingOS Lite?

**LingOS Lite** is a lightweight implementation of the LingOS reflective AI framework. It provides:

- **Uncertainty Markers** — Explicit confidence levels in responses
- **Dialogue Modes** — Exploratory, Analytical, Creative, Strategic
- **Meta-Cognition** — AI that thinks about its own thinking
- **Pattern Recognition** — Notices trends across conversations

**LingOS vs. LingOS Lite:**

| Feature | LingOS Lite (Free) | LingOS Pro (Coming Soon) |
|---------|-------------------|-------------------------|
| Uncertainty markers | ✅ Basic | ✅ Advanced with calibration |
| Dialogue modes | ✅ 4 modes | ✅ 12+ modes |
| Meta-cognition | ✅ Simple | ✅ Deep introspection |
| Pattern recognition | ✅ Session-level | ✅ Cross-session, long-term |
| Reflection depth | ✅ Surface | ✅ Multi-layer |
| Custom modes | ❌ | ✅ Define your own |

---

## Installation

Good news: **LingOS Lite is already included with ActiveMirrorOS!**

When you install ActiveMirrorOS, LingOS Lite comes pre-installed.

### Verify LingOS Lite

**Python:**
```bash
python << EOF
from activemirror import ReflectiveClient

client = ReflectiveClient(mode='exploratory')
print("✅ LingOS Lite is installed and working!")
print(f"Current mode: {client.mode}")
EOF
```

**JavaScript:**
```bash
node << EOF
const { ReflectiveClient } = require('activemirror');

const client = new ReflectiveClient({ mode: 'exploratory' });
console.log('✅ LingOS Lite is installed and working!');
console.log('Current mode:', client.mode);
EOF
```

---

## Using LingOS Lite

### Basic Reflection

**Python:**
```python
from activemirror import ReflectiveClient

# Create reflective client
client = ReflectiveClient(
    mode='analytical',
    uncertainty_threshold=0.7
)

# Generate reflective response
response = client.reflect(
    prompt="Should I use microservices?",
    context="Building a startup with 3 engineers"
)

print(response)
```

**Output:**
```
[Uncertainty: high — Need more context about scale and complexity]

This depends on your specific situation:

Questions first:
- Expected user scale? (100 vs. 100k matters)
- Current complexity? (Monolith exists or greenfield?)
- Team's distributed systems experience?

General pattern: 3-person teams usually start with monoliths,
microservices later. But your case might differ.

[Mode: Analytical — Systematic problem-solving]
```

### Mode Switching

LingOS Lite supports 4 dialogue modes:

#### 1. Exploratory Mode
For open-ended questions, brainstorming, unclear problems.

```python
client = ReflectiveClient(mode='exploratory')
response = client.reflect("I feel stuck in my career")
```

**Characteristics:**
- Asks open-ended questions
- Avoids premature conclusions
- Explores multiple perspectives
- High uncertainty tolerance

---

#### 2. Analytical Mode
For structured problem-solving, debugging, systematic analysis.

```python
client = ReflectiveClient(mode='analytical')
response = client.reflect("API latency increased from 200ms to 1.5s")
```

**Characteristics:**
- Systematic approach
- Step-by-step debugging
- Structured frameworks
- Data-driven reasoning

---

#### 3. Creative Mode
For naming, brainstorming, divergent thinking.

```python
client = ReflectiveClient(mode='creative')
response = client.reflect("Need a name for a productivity app")
```

**Characteristics:**
- Divergent thinking
- No filtering initially
- Multiple alternatives
- Embraces ambiguity

---

#### 4. Strategic Mode
For long-term planning, trade-off analysis, business decisions.

```python
client = ReflectiveClient(mode='strategic')
response = client.reflect("Should we raise funding or bootstrap?")
```

**Characteristics:**
- Long-term implications
- Trade-off analysis
- Multi-scenario planning
- Risk assessment

---

## Integration with ActiveMirrorOS

LingOS Lite works seamlessly with ActiveMirrorOS sessions:

```python
from activemirror import ActiveMirror, ReflectiveClient

# Create mirror
mirror = ActiveMirror(storage_type="sqlite", db_path="reflection.db")
session = mirror.create_session("strategic-thinking")

# Create reflective client
reflective = ReflectiveClient(mode='strategic')

# Add user message
session.add_message("user", "Should I pivot my product?")

# Generate reflective response
response = reflective.reflect(
    prompt="Should I pivot my product?",
    context=session.get_context()  # Full conversation history
)

# Add reflective response to session
session.add_message("assistant", response)

# Memory persists with reflection
print(session.get_context())
```

---

## Configuration Options

### Uncertainty Threshold

Control when uncertainty markers appear:

```python
# Mark uncertainty when confidence < 0.7
client = ReflectiveClient(uncertainty_threshold=0.7)

# Mark uncertainty when confidence < 0.5 (less frequent)
client = ReflectiveClient(uncertainty_threshold=0.5)

# Always mark uncertainty
client = ReflectiveClient(uncertainty_threshold=1.0)
```

### Meta-Cognition Toggle

Enable/disable thinking-about-thinking:

```python
# Enable meta-cognition (default)
client = ReflectiveClient(meta_cognition=True)

# Disable meta-cognition
client = ReflectiveClient(meta_cognition=False)
```

### Custom Reflection Depth

```python
# Surface reflection (fast)
client.reflect(prompt, reflection_level='low')

# Medium reflection (balanced)
client.reflect(prompt, reflection_level='medium')

# Deep reflection (thorough)
client.reflect(prompt, reflection_level='high')
```

---

## Examples

### Example 1: Career Advice

```python
from activemirror import ReflectiveClient

client = ReflectiveClient(mode='exploratory')
response = client.reflect("I'm thinking about changing careers to AI engineering")

print(response)
```

**Output:**
```
[Mode: Exploratory — Open-ended discovery]

Let's explore this without rushing to conclusions.

Questions to sit with:
- What draws you to AI engineering specifically?
- What would you be leaving behind in your current career?
- Have you tried any AI projects yet? How did they feel?
- Is this about the technology, the impact, or something else?

[Uncertainty: very high — Early exploration, many unknowns]

No right answer yet - just noticing what resonates.
```

---

### Example 2: Technical Debugging

```python
client = ReflectiveClient(mode='analytical')
response = client.reflect("Database queries are slow after deployment")

print(response)
```

**Output:**
```
[Mode: Analytical — Systematic debugging]

Clear problem: Performance regression post-deployment.

Diagnostic approach:

1. Compare deployments:
   - What changed in code/queries?
   - Check migration logs

2. Database metrics:
   - Slow query log
   - Connection pool usage
   - Query execution plans

3. Infrastructure:
   - Database server resources
   - Network latency
   - Index health

[Uncertainty: low — Standard performance investigation]

Which can you check first?
```

---

### Example 3: Product Naming

```python
client = ReflectiveClient(mode='creative')
response = client.reflect("Need a name for a developer tool that tracks technical debt")

print(response)
```

**Output:**
```
[Mode: Creative — Divergent generation]

Let's generate broadly, filter later:

Technical/Direct:
- DebtTracker
- CodeDebt
- TechDebtOS
- DebtRadar

Metaphorical:
- CodeWeight
- DebtEase
- TechLedger
- BalanceSheet

Abstract/Evocative:
- Clarity
- Tidy
- Conscience
- Refactor

[Uncertainty: very high — Naming is subjective]

What feeling do you want the name to evoke?
```

---

## Performance

LingOS Lite is designed for speed:

- **Latency:** < 100ms overhead per reflection
- **Memory:** < 50MB RAM usage
- **Storage:** Minimal (metadata only)
- **Dependencies:** Zero external API calls

---

## Limitations (Lite vs. Pro)

**LingOS Lite limitations:**

- 4 modes only (Pro has 12+)
- Basic uncertainty calibration (Pro has advanced)
- Session-level patterns (Pro has cross-session)
- No custom mode creation (Pro allows)
- Surface reflection depth (Pro has multi-layer)

**When to upgrade to Pro:**
- Need custom dialogue modes
- Require deep multi-layer reflection
- Want cross-session pattern analysis
- Building production conversational AI
- Need uncertainty calibration tuning

See [upgrade_to_lingos_pro.md](upgrade_to_lingos_pro.md) for details.

---

## Troubleshooting

### LingOS Lite not found

**Error:** `ModuleNotFoundError: No module named 'activemirror.reflective_client'`

**Solution:**
```bash
# Reinstall ActiveMirrorOS
pip install --upgrade git+https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git#subdirectory=sdk/python
```

### Mode not recognized

**Error:** `Invalid mode: 'invalid_mode'`

**Solution:** Use one of the 4 supported modes:
- `exploratory`
- `analytical`
- `creative`
- `strategic`

### Uncertainty markers not appearing

Check your threshold:
```python
# Lower threshold = more frequent markers
client = ReflectiveClient(uncertainty_threshold=0.6)
```

---

## Next Steps

- [Getting Started Guide](getting_started.md)
- [Upgrade to LingOS Pro](upgrade_to_lingos_pro.md)
- [See Reflective AI Demo](../demo/demo_reflective_ai.md)
- [Read Full Documentation](../docs/reflective-behaviors.md)

---

**LingOS Lite** — Reflection without complexity.
