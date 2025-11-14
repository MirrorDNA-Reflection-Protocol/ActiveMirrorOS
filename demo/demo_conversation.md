# Demo: CLI Journaling Conversation

This demo showcases a realistic journaling session using the ActiveMirrorOS CLI app. The conversation demonstrates persistent memory, context preservation, and reflective dialogue patterns.

---

## Session Setup

```bash
cd apps/example-cli
npm install
./amos-cli.js write "Starting my first journal entry"
```

---

## Conversation Flow

### Day 1 - Monday Morning

**User:**
> "I'm thinking about starting a new project - a mobile app for tracking daily habits. I'm excited but also feeling overwhelmed."

**ActiveMirrorOS:**
> I hear both the excitement and the overwhelm. Let me help you unpack this. You're embarking on a mobile app for habit tracking - that's a meaningful space.
>
> What's making you feel overwhelmed specifically? Is it:
> - The technical scope (choosing frameworks, architecture)?
> - The feature complexity (what to include/exclude)?
> - The time commitment alongside other responsibilities?
>
> *[Uncertainty: medium — I'm inferring from your statement, but want to understand your specific concerns]*

---

**User:**
> "Mostly the technical scope. I know Python well, but mobile development is new to me. Should I go native or React Native?"

**ActiveMirrorOS:**
> Great clarity - technical scope is concrete and solvable.
>
> Given your Python background, here's a practical perspective:
>
> **React Native:**
> - ✅ Single codebase, cross-platform (iOS + Android)
> - ✅ JavaScript/TypeScript - transferable skills
> - ✅ Rich ecosystem (navigation, state management)
> - ⚠️ Learning curve for React paradigm
>
> **Native (Swift/Kotlin):**
> - ✅ Best performance and platform integration
> - ✅ Complete platform control
> - ⚠️ Two codebases, two languages to learn
> - ⚠️ Longer development time
>
> **My recommendation:** Start with React Native. Ship faster, validate your idea, iterate. You can always go native later if needed.
>
> *[Uncertainty: low — This is standard advice for developers new to mobile]*
>
> Would you like me to remember this as your chosen direction?

---

**User:**
> "Yes, React Native it is. I'll start learning this week."

**ActiveMirrorOS:**
> ✓ **Remembered:** Project = Habit tracking app, Stack = React Native
>
> Excellent. Break it down into small wins this week:
>
> **Week 1 Goals:**
> 1. Setup: Install React Native CLI, run "Hello World"
> 2. Learning: Complete one tutorial (Expo or React Native docs)
> 3. Planning: Sketch 3 core screens (add habit, view habits, stats)
>
> Does this feel manageable alongside your other commitments?

---

### Day 3 - Wednesday Evening

**User:**
> "Quick update: I got React Native running! Built the Hello World app. Feels good."

**ActiveMirrorOS:**
> 🎉 That's fantastic progress! Two days in and you've already crossed the first milestone.
>
> **Context from Monday:** You were feeling overwhelmed about technical scope, chose React Native, planned Week 1 goals.
>
> **Progress:**
> - ✅ Setup complete
> - 🔄 Tutorial in progress
> - ⏳ Screen sketches pending
>
> How are you feeling about the learning curve now compared to Monday?

---

**User:**
> "Much better. The overwhelm is gone. I'm actually enjoying it."

**ActiveMirrorOS:**
> That's a meaningful shift - from "overwhelmed" to "enjoying" in 48 hours. That's the power of starting small.
>
> **Pattern I'm noticing:** You respond well to breaking things down into concrete, achievable steps. This might be useful for future projects too.
>
> Ready to sketch those 3 screens this weekend?

---

### Day 7 - Sunday Night

**User:**
> "I sketched the screens and even started building the first one - the habit list view. But I'm stuck on state management. Redux? Context API? Something else?"

**ActiveMirrorOS:**
> You're moving fast! Screen sketches ✓, first component started ✓. Now hitting the classic React question.
>
> **For a habit tracker (small-to-medium complexity):**
>
> **Context API + useReducer:**
> - ✅ Built into React, zero dependencies
> - ✅ Perfect for app-level state (habits, settings)
> - ✅ Simpler than Redux for your scope
> - Use case: 5-10 pieces of global state
>
> **Redux Toolkit:**
> - ✅ Industry standard, great DevTools
> - ✅ Better for complex state interactions
> - ⚠️ More boilerplate, steeper learning curve
> - Use case: 10+ pieces of state, complex workflows
>
> **My advice:** Start with Context API. If you hit pain points, migrate to Redux later. Don't over-engineer early.
>
> *[Uncertainty: low — This is well-established guidance]*
>
> Want me to remember Context API as your state management choice?

---

**User:**
> "Yes, Context API. And thank you - this has been really helpful."

**ActiveMirrorOS:**
> You're very welcome.
>
> **Your Journey (One Week Summary):**
> - Started: Excited but overwhelmed
> - Decided: React Native for habit tracker app
> - Accomplished: Dev environment setup, Hello World, tutorials, screen sketches, first component
> - Chose: Context API for state management
> - Current state: Confident and enjoying the process
>
> This is excellent momentum. Keep this rhythm and you'll have an MVP in a few weeks.
>
> *I'll remember all of this. Come back anytime - I'll have the full context.*

---

## Key Features Demonstrated

### 1. Persistent Memory
- The AI remembers decisions from Day 1 (React Native choice)
- Recalls emotional states ("overwhelmed" → "enjoying")
- Tracks progress across multiple sessions

### 2. Reflective Dialogue
- Uses uncertainty markers (`[Uncertainty: medium]`)
- Asks clarifying questions before giving advice
- Provides structured, actionable recommendations

### 3. Context Awareness
- References previous conversations naturally
- Builds on earlier decisions (Context API follows from React Native)
- Recognizes patterns in user behavior

### 4. Continuity Across Time
- Picks up conversations days apart without confusion
- Summarizes journey at the end
- Maintains narrative coherence throughout the week

---

## Technical Implementation

This conversation is powered by:

```python
from activemirror import ActiveMirror

# Initialize with persistent storage
mirror = ActiveMirror(storage_type="sqlite", db_path="journal.db")

# Each day's entry is part of the same session
session = mirror.create_session("habit-app-project")

# Messages are automatically persisted
session.add_message("user", "I'm thinking about starting a new project...")
session.add_message("assistant", "I hear both the excitement...")

# Days later, full context is preserved
loaded_session = mirror.load_session("habit-app-project")
context = loaded_session.get_context()  # Complete conversation history
```

---

## Try It Yourself

1. Install the CLI:
```bash
cd apps/example-cli
npm install
```

2. Start journaling:
```bash
./amos-cli.js write "Your first thought..."
```

3. Continue the conversation across days, weeks, or months - ActiveMirrorOS remembers it all.

---

**Next Steps:**
- [Try the Reflective AI Demo](demo_reflective_ai.md)
- [See Continuity Showcase](demo_continuity_showcase.md)
- [Get Started Guide](../onboarding/getting_started.md)
