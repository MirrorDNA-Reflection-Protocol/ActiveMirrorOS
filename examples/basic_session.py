#!/usr/bin/env python3
"""
Basic Session Example

This example demonstrates the simplest use of ActiveMirrorOS:
creating a session and having a conversation with memory.
"""

from activemirror import ActiveMirror


def main():
    """Run a basic conversation session."""
    print("ActiveMirrorOS - Basic Session Example")
    print("=" * 50)
    print()

    # Create an ActiveMirror instance with in-memory storage
    mirror = ActiveMirror(storage_type="memory")

    # Create a new session
    session = mirror.create_session(title="Getting Started")
    print(f"Created session: {session.id}")
    print(f"Title: {session.title}")
    print()

    # Send first message
    print("User: Hello! My name is Alice.")
    response = session.send("Hello! My name is Alice.")
    print(f"AI: {response.content}")
    print()

    # Send second message - AI should remember the name
    print("User: What's my name?")
    response = session.send("What's my name?")
    print(f"AI: {response.content}")
    print()

    # Send third message
    print("User: I work on AI research.")
    response = session.send("I work on AI research.")
    print(f"AI: {response.content}")
    print()

    # Review message history
    messages = session.get_messages()
    print(f"\nSession has {len(messages)} messages")
    print()

    # Export session
    print("Exporting session to markdown...")
    markdown = session.export(format="markdown")
    print(f"Exported {len(markdown)} characters")
    print()

    # Show summary
    print("Session Summary:")
    print(f"  ID: {session.id}")
    print(f"  Title: {session.title}")
    print(f"  Messages: {len(messages)}")
    print(f"  Created: {session.created_at}")
    print()


if __name__ == "__main__":
    main()
