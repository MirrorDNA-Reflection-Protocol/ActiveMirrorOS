#!/usr/bin/env python3
"""
ActiveMirrorOS CLI Demo

A simple command-line demonstration of:
- Reflective interaction (shows thinking before responding)
- Continuity (logs all interactions to JSON)
- Local-first storage (everything saved to logs/)

Usage: python demo_cli.py
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path


class ActiveMirrorCLI:
    """Simple CLI demo showing ActiveMirrorOS concepts."""

    def __init__(self, logs_dir="logs"):
        self.logs_dir = Path(__file__).parent / logs_dir
        self.logs_dir.mkdir(exist_ok=True)

        self.session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.log_file = self.logs_dir / f"session_{self.session_id}.json"

        self.interactions = []
        self.interaction_count = 0

        # Initialize session log
        self._init_session_log()

    def _init_session_log(self):
        """Initialize the session log file."""
        session_data = {
            "session_id": self.session_id,
            "started_at": datetime.now().isoformat(),
            "interactions": []
        }
        self._save_log(session_data)

    def _save_log(self, data):
        """Save session data to JSON log file."""
        with open(self.log_file, 'w') as f:
            json.dump(data, f, indent=2, default=str)

    def _load_log(self):
        """Load current session data."""
        if self.log_file.exists():
            with open(self.log_file, 'r') as f:
                return json.load(f)
        return {"interactions": []}

    def reflect(self, user_input):
        """Generate a reflection before responding (shows thinking)."""
        reflections = [
            f"Considering your input: '{self._truncate(user_input, 40)}'...",
            f"Reflecting on interaction #{self.interaction_count + 1}...",
            "Processing with awareness of our conversation history...",
            "Examining this in context of what you've shared...",
            "Thinking about patterns and continuity...",
        ]

        # Context-aware reflections
        if "what" in user_input.lower() and "?" in user_input:
            return f"✦ Analyzing your question..."

        if self.interaction_count > 2:
            return f"✦ Drawing on our {self.interaction_count} previous interactions..."

        import random
        return "✦ " + random.choice(reflections)

    def respond(self, user_input):
        """Generate a response based on user input."""
        lower = user_input.lower()

        # Check for memory/recall questions
        if any(word in lower for word in ["told", "said", "remember", "history"]):
            if self.interaction_count == 0:
                return "This is our first interaction. I'm starting to build continuity now."

            topics = ", ".join([f"'{self._truncate(i['user_input'], 30)}'"
                              for i in self.interactions[-3:]])
            return (f"Based on our {self.interaction_count} interactions, "
                   f"you've discussed: {topics}. Check {self.log_file.name} for full history.")

        # Check for pattern questions
        if any(word in lower for word in ["pattern", "notice", "trend"]):
            if self.interaction_count < 2:
                return "We're building context. As we interact more, patterns will emerge."
            return (f"I notice continuity in our {self.interaction_count} exchanges. "
                   f"Each interaction is logged in {self.log_file.name}.")

        # Explain demo
        if any(word in lower for word in ["what", "how", "explain"]):
            return (
                "This demo shows ActiveMirrorOS concepts:\n"
                "  1. Reflective Interaction - I show my 'thinking' before responding\n"
                "  2. Continuity - Every interaction is logged to JSON\n"
                "  3. Local-First - All data stays on your machine\n\n"
                f"Your session is saved to: {self.log_file}"
            )

        # Default acknowledgment
        responses = [
            f"Noted. This is interaction #{self.interaction_count + 1}. What would you like to explore?",
            f"I hear you. This adds to our continuity. Check {self.log_file.name} to see the log.",
            f"Thank you for sharing. Our conversation history is building. What's next?",
            "Interesting. I'm tracking this in our session log. Continue?",
        ]

        import random
        return random.choice(responses)

    def process_interaction(self, user_input):
        """Process a single interaction with reflection and response."""
        self.interaction_count += 1

        # Show reflection (thinking)
        reflection = self.reflect(user_input)
        print(f"\n{reflection}")

        # Small delay to show "thinking"
        import time
        time.sleep(0.5)

        # Generate response
        response = self.respond(user_input)

        # Log interaction
        interaction = {
            "id": self.interaction_count,
            "timestamp": datetime.now().isoformat(),
            "user_input": user_input,
            "reflection": reflection,
            "response": response
        }
        self.interactions.append(interaction)

        # Save to file
        session_data = self._load_log()
        session_data["interactions"].append(interaction)
        session_data["interaction_count"] = self.interaction_count
        session_data["last_updated"] = datetime.now().isoformat()
        self._save_log(session_data)

        # Display response
        print(f"\n🪞 ActiveMirror: {response}\n")

    def show_stats(self):
        """Display session statistics."""
        print(f"\n{'='*60}")
        print(f"Session: {self.session_id}")
        print(f"Interactions: {self.interaction_count}")
        print(f"Log file: {self.log_file}")
        print(f"{'='*60}\n")

    def _truncate(self, text, length):
        """Truncate text to specified length."""
        return text[:length] + "..." if len(text) > length else text

    def run(self):
        """Main CLI loop."""
        print("╔" + "="*58 + "╗")
        print("║" + " "*15 + "✦ ActiveMirrorOS CLI Demo" + " "*18 + "║")
        print("╚" + "="*58 + "╝")
        print("\nDemonstrating: Reflective Interaction | Continuity | Local-First")
        print("\nType your messages below. Commands:")
        print("  - 'stats' : Show session statistics")
        print("  - 'exit' or 'quit' : End session")
        print("  - 'help' : Show help message\n")

        self.show_stats()

        try:
            while True:
                # Get user input
                user_input = input("You: ").strip()

                if not user_input:
                    continue

                # Handle commands
                if user_input.lower() in ["exit", "quit", "q"]:
                    print("\n👋 Session ended. Your conversation is saved to:")
                    print(f"   {self.log_file}\n")
                    break

                if user_input.lower() == "stats":
                    self.show_stats()
                    continue

                if user_input.lower() == "help":
                    print("\nThis demo shows three core concepts:")
                    print("  1. Reflective Interaction - See the 'thinking' step")
                    print("  2. Continuity - All interactions logged to JSON")
                    print("  3. Local-First - Data stays on your machine")
                    print("\nTry asking:")
                    print("  - What have I told you?")
                    print("  - What patterns do you notice?")
                    print("  - Explain how this works\n")
                    continue

                # Process interaction
                self.process_interaction(user_input)

        except KeyboardInterrupt:
            print("\n\n⚠ Interrupted. Session saved to:")
            print(f"   {self.log_file}\n")
        except Exception as e:
            print(f"\n❌ Error: {e}\n")
            sys.exit(1)


def main():
    """Entry point for CLI demo."""
    demo = ActiveMirrorCLI()
    demo.run()


if __name__ == "__main__":
    main()
