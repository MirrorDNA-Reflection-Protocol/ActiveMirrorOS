# Demo: Reflective AI Dialogue

This demo showcases ActiveMirrorOS's reflective dialogue capabilities, powered by LingOS Lite patterns. The AI demonstrates self-awareness, uncertainty marking, and adaptive communication modes.

---

## What is Reflective AI?

Reflective AI doesn't just respond - it thinks about its own responses, marks uncertainty, and adapts its communication style based on the conversation's needs.

**Core Capabilities:**
- **Uncertainty Markers** — Explicitly states confidence levels
- **Mode Switching** — Adapts between Exploratory, Analytical, Creative, and Strategic modes
- **Meta-Cognition** — Reflects on its own reasoning process
- **Pattern Recognition** — Notices trends in the conversation

---

## Example 1: Uncertainty Markers

### User Query with Ambiguity

**User:**
> "Should I use microservices for my startup?"

**Standard AI (without reflection):**
> Yes, microservices are great for startups! They provide scalability, independent deployment, and technology flexibility. You should definitely use them.

**ActiveMirrorOS (with reflection):**
> This depends heavily on context I don't have yet.
>
> *[Uncertainty: high — Need more information about team size, scale, and current architecture]*
>
> **Questions before I can advise:**
> - Team size? (1-2 people vs. 10+ matters significantly)
> - Current scale? (100 users vs. 100k users)
> - Existing monolith or greenfield project?
> - Technical expertise with distributed systems?
>
> **General pattern:** Startups with <5 engineers usually benefit from monoliths first, microservices later. But your situation might differ.
>
> Can you share more context?

**Why This Matters:**
- Marks high uncertainty explicitly
- Asks clarifying questions before giving advice
- Acknowledges the "it depends" nature honestly
- Provides conditional guidance

---

## Example 2: Mode Switching

ActiveMirrorOS adapts its dialogue mode based on the conversation type.

### Exploratory Mode (Open-Ended Discovery)

**User:**
> "I'm feeling stuck in my career. Not sure what direction to take."

**ActiveMirrorOS:**
> *[Mode: Exploratory — Open-ended discovery, no premature conclusions]*
>
> Let's explore this without rushing to solutions.
>
> **Prompts to consider:**
> - What does "stuck" feel like for you? Bored? Overwhelmed? Unclear?
> - When was the last time you felt unstuck or energized at work?
> - If money weren't a factor, what would you be doing?
>
> There's no right answer yet - just noticing what resonates.
>
> *[Uncertainty: very high — Early exploration, many unknowns]*

---

### Analytical Mode (Structured Problem-Solving)

**User:**
> "Our API response time increased from 200ms to 1.5s after the last deployment. Need to find the root cause."

**ActiveMirrorOS:**
> *[Mode: Analytical — Structured debugging, systematic approach]*
>
> Clear problem: 7.5x latency increase post-deployment. Let's methodically isolate the cause.
>
> **Diagnostic Steps:**
>
> 1. **Compare deployments:**
>    - What changed? (code, dependencies, infrastructure)
>    - APM traces for both versions?
>
> 2. **Check database:**
>    - Query execution times (slow query log)
>    - Connection pool saturation
>    - New N+1 queries introduced
>
> 3. **Examine network:**
>    - Downstream service latencies
>    - DNS resolution times
>    - Load balancer configuration changes
>
> 4. **Profile the code:**
>    - CPU profiling (hot paths)
>    - Memory allocation spikes
>
> *[Uncertainty: low — Standard performance debugging process]*
>
> Which of these can you check first?

---

### Creative Mode (Brainstorming, Divergent Thinking)

**User:**
> "Need a creative name for a productivity app that focuses on deep work and flow states."

**ActiveMirrorOS:**
> *[Mode: Creative — Divergent thinking, no filtering yet]*
>
> Let's generate a wide range and narrow down later.
>
> **Flow State Themes:**
> - FlowForge
> - DeepCurrent
> - ImmersionOS
> - ThresholdApp
> - FlowChannel
>
> **Focus + Depth:**
> - FocusChamber
> - DeepDive
> - CoreTime
> - SilentStream
> - SingleThread
>
> **Abstract/Poetic:**
> - Undercurrent
> - TheQuiet
> - Singularity
> - InwardOS
> - WhiteSpace
>
> *[Uncertainty: very high — Creative naming is highly subjective]*
>
> What feeling are you going for? Calm? Intense? Technical? Approachable?

---

### Strategic Mode (Long-Term Planning)

**User:**
> "We're at $50k MRR. Should we raise a seed round or stay bootstrapped?"

**ActiveMirrorOS:**
> *[Mode: Strategic — Long-term implications, trade-off analysis]*
>
> This is a defining decision with multi-year consequences. Let's map the paths.
>
> **Bootstrap Path:**
> - ✅ Maintain control and equity
> - ✅ Forced profitability discipline
> - ⚠️ Slower growth pace
> - ⚠️ Competitive risk if market moves fast
>
> **Seed Round Path:**
> - ✅ Accelerated hiring and growth
> - ✅ Expand runway for experimentation
> - ⚠️ Dilution (15-25% typical)
> - ⚠️ Investor expectations and board dynamics
>
> **Key Questions:**
> - Market timing: Is this a winner-take-most market?
> - Growth rate: Can you reach $100k MRR in 12 months bootstrapped?
> - Personal goals: Lifestyle business or unicorn attempt?
> - Competitive landscape: Are funded competitors outpacing you?
>
> *[Uncertainty: medium — Depends heavily on market dynamics and personal goals]*
>
> What's your gut instinct right now?

---

## Example 3: Meta-Cognition (Thinking About Thinking)

**User:**
> "You keep asking me questions instead of just giving me answers. Why?"

**ActiveMirrorOS:**
> *[Meta-cognitive moment — Reflecting on my own process]*
>
> Good observation. Let me make my reasoning explicit.
>
> **Why I ask questions first:**
>
> 1. **Avoid premature advice:** Many questions (like "should I use microservices?") are context-dependent. Giving advice without context often does more harm than good.
>
> 2. **Surface your own knowledge:** You usually know more about your situation than you realize. Questions help you access that knowledge.
>
> 3. **Uncertainty honesty:** When I don't have enough information, asking questions is more honest than pretending certainty.
>
> **When I give direct answers:**
> - Factual questions ("What's the syntax for X?")
> - Well-defined technical problems ("How do I fix error Y?")
> - When you explicitly ask for an opinion
>
> **Pattern I'm noticing:** You seem to prefer more direct guidance. Should I adjust and be more prescriptive in my responses?
>
> *[Uncertainty: medium — Adapting communication style to your preference]*

---

## Example 4: Pattern Recognition Across Sessions

**Session 1 (Monday):**

**User:**
> "I'm trying to decide between PostgreSQL and MongoDB for my project."

**ActiveMirrorOS:**
> Let's think through your data model first...
> *[Asks clarifying questions, user chooses PostgreSQL]*

---

**Session 2 (Wednesday):**

**User:**
> "Now choosing between REST and GraphQL for the API."

**ActiveMirrorOS:**
> *[Recognizes pattern from previous session]*
>
> **Pattern observation:** This is the second architectural choice this week (PostgreSQL vs. MongoDB, now REST vs. GraphQL).
>
> I'm noticing you're in the early architectural decision phase. Instead of deciding these one-by-one, would it help to sketch the full architecture first? That way choices inform each other.
>
> For example:
> - PostgreSQL (relational) + GraphQL = excellent fit
> - PostgreSQL + REST = also great, simpler
>
> Your database choice influences your API choice.
>
> *[Uncertainty: low — Common architectural pattern]*
>
> Want to do a quick architecture sketch together?

---

## Key Reflection Features

| Feature | Description | Example |
|---------|-------------|---------|
| **Uncertainty Markers** | Explicit confidence levels | `[Uncertainty: high]` |
| **Mode Declarations** | Clear communication style | `[Mode: Analytical]` |
| **Meta-Cognition** | Explaining own reasoning | "Let me make my reasoning explicit..." |
| **Pattern Recognition** | Noticing trends across sessions | "This is the second architectural choice..." |
| **Adaptive Responses** | Adjusting based on user feedback | "Should I be more direct?" |

---

## Technical Implementation

Reflective dialogue is enabled through LingOS Lite integration:

```python
from activemirror import ReflectiveClient

# Create reflective client with mode support
client = ReflectiveClient(
    mode="exploratory",  # or analytical, creative, strategic
    uncertainty_threshold=0.7,  # Mark uncertainty when confidence < 0.7
    meta_cognition=True  # Enable thinking-about-thinking
)

# Generate reflective response
response = client.generate_response(
    prompt="Should I use microservices?",
    context=session.get_context(),
    reflection_level="high"
)

# Response includes:
# - uncertainty markers
# - mode declaration
# - clarifying questions
# - reasoning transparency
```

---

## Try Reflective AI

**Quick Start:**
```bash
cd sdk/python
pip install -e .

python -c "
from activemirror import ReflectiveClient
client = ReflectiveClient(mode='exploratory')
print(client.reflect('Should I change careers?'))
"
```

---

## Comparison: Standard vs. Reflective AI

| Scenario | Standard AI | Reflective AI |
|----------|-------------|---------------|
| Ambiguous question | Gives generic answer | Marks uncertainty, asks clarifying questions |
| Complex problem | One-size-fits-all solution | Adapts mode (exploratory/analytical/creative/strategic) |
| Reasoning process | Hidden | Explicit meta-cognition |
| Confidence | Implied certainty | Marked uncertainty levels |
| Pattern recognition | None across sessions | Notices trends, suggests connections |

---

**Next Steps:**
- [Try the Conversation Demo](demo_conversation.md)
- [See Continuity Showcase](demo_continuity_showcase.md)
- [Install LingOS Lite](../onboarding/install_lingos_lite.md)
