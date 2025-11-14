#!/usr/bin/env python3
"""
ActiveMirrorOS Demo - Reflective Conversation Flow

This demo showcases the core concepts of ActiveMirrorOS:
- Reflective dialogue patterns
- Persistent memory across sessions
- Continuity logging
- Simple but powerful interaction patterns
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path
import yaml


class ReflectionLayer:
    """Implements simple reflective dialogue patterns."""

    PATTERNS = {
        'exploratory': {
            'prefix': '🔍 Exploring:',
            'uncertainty_marker': '~',
            'style': 'open-ended questioning'
        },
        'analytical': {
            'prefix': '🔬 Analyzing:',
            'uncertainty_marker': '?',
            'style': 'structured breakdown'
        },
        'creative': {
            'prefix': '💡 Creating:',
            'uncertainty_marker': '*',
            'style': 'generative thinking'
        },
        'strategic': {
            'prefix': '🎯 Strategizing:',
            'uncertainty_marker': '!',
            'style': 'goal-oriented planning'
        }
    }

    def __init__(self, mode='exploratory'):
        self.mode = mode
        self.pattern = self.PATTERNS.get(mode, self.PATTERNS['exploratory'])

    def reflect(self, user_input):
        """Generate a reflection based on user input."""
        prefix = self.pattern['prefix']
        marker = self.pattern['uncertainty_marker']

        # Simple reflection logic
        reflections = {
            'exploratory': f"What aspects of '{user_input}' are most meaningful to you? {marker}",
            'analytical': f"Let's break down '{user_input}' into components: 1) Core concept, 2) Context, 3) Implications {marker}",
            'creative': f"'{user_input}' sparks these connections: patterns, possibilities, potential paths forward {marker}",
            'strategic': f"Considering '{user_input}', here's a path: clarify → plan → act → reflect {marker}"
        }

        return f"{prefix} {reflections.get(self.mode, reflections['exploratory'])}"


class ContinuityLogger:
    """Logs interactions to maintain continuity across sessions."""

    def __init__(self, log_dir):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self.current_session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.log_file = self.log_dir / f"session_{self.current_session_id}.json"
        self.entries = []

    def log_interaction(self, user_input, reflection, metadata=None):
        """Log a single interaction."""
        entry = {
            'timestamp': datetime.now().isoformat(),
            'session_id': self.current_session_id,
            'user_input': user_input,
            'reflection': reflection,
            'metadata': metadata or {}
        }
        self.entries.append(entry)
        self._save()

    def _save(self):
        """Save entries to JSON file."""
        with open(self.log_file, 'w') as f:
            json.dump({
                'session_id': self.current_session_id,
                'entries': self.entries,
                'created_at': self.entries[0]['timestamp'] if self.entries else None,
                'updated_at': datetime.now().isoformat()
            }, f, indent=2)

    def get_history(self):
        """Retrieve all entries from current session."""
        return self.entries

    def load_previous_sessions(self):
        """Load all previous session files."""
        sessions = []
        for log_file in sorted(self.log_dir.glob("session_*.json")):
            if log_file != self.log_file:
                with open(log_file, 'r') as f:
                    sessions.append(json.load(f))
        return sessions


class DemoApp:
    """Main demo application orchestrator."""

    def __init__(self, config_path='config.yaml'):
        self.config = self._load_config(config_path)
        self.reflection_layer = ReflectionLayer(mode=self.config.get('mode', 'exploratory'))
        self.logger = ContinuityLogger(self.config.get('log_path', 'logs'))
        self.user_name = self.config.get('user_name', 'User')

    def _load_config(self, config_path):
        """Load configuration from YAML file."""
        config_file = Path(__file__).parent / config_path
        if config_file.exists():
            with open(config_file, 'r') as f:
                return yaml.safe_load(f)
        return {}

    def display_header(self):
        """Display welcome header."""
        print("=" * 60)
        print("🪞 ActiveMirrorOS - Reflective Conversation Demo")
        print("=" * 60)
        print(f"\nWelcome, {self.user_name}!")
        print(f"Mode: {self.reflection_layer.mode.title()}")
        print(f"Session ID: {self.logger.current_session_id}")
        print("\nThis demo showcases:")
        print("  ✓ Reflective dialogue patterns")
        print("  ✓ Persistent memory (logs saved to ./logs/)")
        print("  ✓ Continuity across sessions")
        print("\nType 'exit' to quit, 'history' to see your interactions")
        print("=" * 60)
        print()

    def display_previous_sessions(self):
        """Show summary of previous sessions."""
        previous = self.logger.load_previous_sessions()
        if previous:
            print(f"\n📚 Found {len(previous)} previous session(s):")
            for session in previous[-3:]:  # Show last 3
                entry_count = len(session.get('entries', []))
                created = session.get('created_at', 'Unknown')
                print(f"  • Session {session['session_id']}: {entry_count} interactions at {created}")
            print()

    def run_interactive(self):
        """Run interactive demo mode."""
        self.display_header()
        self.display_previous_sessions()

        while True:
            try:
                user_input = input(f"\n{self.user_name}: ").strip()

                if not user_input:
                    continue

                if user_input.lower() == 'exit':
                    print("\n👋 Goodbye! Your session has been saved to:")
                    print(f"   {self.logger.log_file}")
                    break

                if user_input.lower() == 'history':
                    self._show_history()
                    continue

                # Generate reflection
                reflection = self.reflection_layer.reflect(user_input)

                # Log the interaction
                self.logger.log_interaction(
                    user_input=user_input,
                    reflection=reflection,
                    metadata={'mode': self.reflection_layer.mode}
                )

                # Display reflection
                print(f"\n{reflection}")
                print(f"\n💾 Logged to continuity store")

            except KeyboardInterrupt:
                print("\n\n👋 Interrupted. Session saved.")
                break
            except Exception as e:
                print(f"\n⚠️ Error: {e}")
                continue

    def _show_history(self):
        """Display interaction history."""
        history = self.logger.get_history()
        if not history:
            print("\n📭 No interactions yet in this session.")
            return

        print("\n📜 Session History:")
        print("-" * 60)
        for i, entry in enumerate(history, 1):
            timestamp = entry['timestamp'].split('T')[1].split('.')[0]
            print(f"\n{i}. [{timestamp}] {self.user_name}: {entry['user_input']}")
            print(f"   → {entry['reflection']}")
        print("-" * 60)

    def run_demo_sequence(self):
        """Run a pre-programmed demo sequence."""
        self.display_header()

        demo_inputs = [
            "I want to build an AI that remembers our conversations",
            "How do I handle sensitive information securely?",
            "What's the best way to start with ActiveMirrorOS?"
        ]

        print("🎬 Running demo sequence with 3 example interactions...\n")

        for i, user_input in enumerate(demo_inputs, 1):
            print(f"\n{'─' * 60}")
            print(f"Example {i}/3")
            print(f"{'─' * 60}")
            print(f"\n{self.user_name}: {user_input}")

            # Generate reflection
            reflection = self.reflection_layer.reflect(user_input)

            # Log the interaction
            self.logger.log_interaction(
                user_input=user_input,
                reflection=reflection,
                metadata={'mode': self.reflection_layer.mode, 'demo': True}
            )

            # Display reflection
            print(f"\n{reflection}")
            print(f"\n💾 Logged to: {self.logger.log_file.name}")

            if i < len(demo_inputs):
                input("\nPress Enter to continue...")

        print(f"\n\n{'=' * 60}")
        print("✅ Demo sequence complete!")
        print(f"\nYour session has been saved to:")
        print(f"   {self.logger.log_file}")
        print(f"\nView the log file to see the full JSON structure.")
        print(f"Run '{sys.argv[0]} interactive' to try it yourself!")
        print("=" * 60)


def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(
        description='ActiveMirrorOS Demo - Reflective Conversation Flow'
    )
    parser.add_argument(
        'mode',
        nargs='?',
        default='demo',
        choices=['demo', 'interactive'],
        help='Run mode: "demo" for automated sequence, "interactive" for manual input'
    )
    parser.add_argument(
        '--config',
        default='config.yaml',
        help='Path to config file (default: config.yaml)'
    )

    args = parser.parse_args()

    app = DemoApp(config_path=args.config)

    if args.mode == 'interactive':
        app.run_interactive()
    else:
        app.run_demo_sequence()


if __name__ == '__main__':
    main()
