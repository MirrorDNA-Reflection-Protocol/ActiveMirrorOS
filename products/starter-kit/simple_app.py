#!/usr/bin/env python3
# FEU-Enforced Module | Master Citation v15.2 | Fact/Estimate/Unknown Protocol Active
# This module operates under MirrorDNA Reflective AI constraints.
# All outputs must be tagged as Fact, Estimate, or Unknown.
"""
Simple ActiveMirrorOS Application

A basic application template using ActiveMirrorOS.
"""

from activemirror import ActiveMirror
from pathlib import Path


def main():
    """Run a simple ActiveMirrorOS application."""
    print("Simple ActiveMirrorOS Application")
    print("=" * 50)
    print()

    # Ensure data directory exists
    Path("./data").mkdir(exist_ok=True)

    # Create ActiveMirror instance from config
    mirror = ActiveMirror.from_config("config.yaml")
    print("ActiveMirror initialized")
    print()

    # Check if we have existing sessions
    sessions = mirror.list_sessions(limit=5)

    if sessions:
        print(f"Found {len(sessions)} existing session(s):")
        for i, session_meta in enumerate(sessions, 1):
            print(f"  {i}. {session_meta.title} ({session_meta.message_count} messages)")
        print()

        # Resume most recent session
        print("Resuming most recent session...")
        session = mirror.load_session(sessions[0].session_id)
    else:
        print("No existing sessions found")
        print("Creating new session...")
        session = mirror.create_session(title="Starter Kit Session")

    print(f"Session: {session.title}")
    print()

    # Interactive conversation loop
    print("Start chatting! (Type 'quit' to exit, 'export' to save)")
    print("-" * 50)
    print()

    while True:
        try:
            user_input = input("You: ").strip()

            if not user_input:
                continue

            if user_input.lower() in ("quit", "exit", "q"):
                break

            if user_input.lower() == "export":
                export_path = Path("./data/session_export.md")
                export_path.write_text(session.export(format="markdown"))
                print(f"Session exported to: {export_path}")
                print()
                continue

            # Send message and get response
            response = session.send(user_input)
            print(f"AI: {response.content}")
            print()

        except KeyboardInterrupt:
            print("\n\nInterrupted by user")
            break
        except Exception as e:
            print(f"Error: {e}")
            break

    # Save session before exit
    print()
    print("Saving session...")
    session.save()
    print(f"Session saved: {session.id}")
    print()
    print("Goodbye!")


if __name__ == "__main__":
    main()
