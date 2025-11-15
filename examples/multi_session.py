#!/usr/bin/env python3
# FEU-Enforced Module | Master Citation v15.2 | Fact/Estimate/Unknown Protocol Active
# This module operates under MirrorDNA Reflective AI constraints.
# All outputs must be tagged as Fact, Estimate, or Unknown.
"""
Multi-Session Example

This example demonstrates session persistence and continuity:
creating multiple sessions, saving them, and resuming later.
"""

from activemirror import ActiveMirror
from pathlib import Path


def main():
    """Demonstrate multi-session workflow."""
    print("ActiveMirrorOS - Multi-Session Example")
    print("=" * 50)
    print()

    # Use SQLite storage for persistence
    db_path = Path("./data/example_memories.db")
    db_path.parent.mkdir(exist_ok=True)

    mirror = ActiveMirror(storage_type="sqlite", db_path=str(db_path))

    # Create first session
    print("=== Session 1: Initial Discussion ===")
    session1 = mirror.create_session(title="Project Planning")

    response = session1.send("I'm starting a new project on AI memory systems.")
    print(f"User: I'm starting a new project on AI memory systems.")
    print(f"AI: {response.content}")
    print()

    response = session1.send("The project will use Python and SQLite.")
    print(f"User: The project will use Python and SQLite.")
    print(f"AI: {response.content}")
    print()

    # Save first session
    session1_id = session1.save()
    print(f"Saved session 1: {session1_id}")
    print()

    # Create second session linked to first
    print("=== Session 2: Technical Details ===")
    session2 = mirror.create_session(
        title="Technical Implementation", parent_session_id=session1_id
    )

    response = session2.send("Let's discuss the database schema.")
    print(f"User: Let's discuss the database schema.")
    print(f"AI: {response.content}")
    print()

    # Save second session
    session2_id = session2.save()
    print(f"Saved session 2: {session2_id}")
    print()

    # List all sessions
    print("=== All Sessions ===")
    sessions = mirror.list_sessions()
    for i, session_meta in enumerate(sessions, 1):
        print(f"{i}. {session_meta.title}")
        print(f"   ID: {session_meta.session_id}")
        print(f"   Messages: {session_meta.message_count}")
        print(f"   Updated: {session_meta.updated_at}")
        print()

    # Resume first session
    print("=== Resuming Session 1 ===")
    resumed_session = mirror.load_session(session1_id)
    print(f"Loaded session: {resumed_session.title}")
    print(f"Message count: {len(resumed_session.get_messages())}")
    print()

    # Continue conversation
    response = resumed_session.send("Let's continue where we left off.")
    print(f"User: Let's continue where we left off.")
    print(f"AI: {response.content}")
    print()

    # Save updated session
    resumed_session.save()
    print("Session saved with new messages")
    print()

    # Export a session
    print("=== Exporting Session ===")
    export_text = resumed_session.export(format="txt")
    export_path = Path("./data/session_export.txt")
    export_path.write_text(export_text)
    print(f"Exported session to: {export_path}")
    print()

    print("Multi-session workflow complete!")
    print(f"Database location: {db_path}")


if __name__ == "__main__":
    main()
