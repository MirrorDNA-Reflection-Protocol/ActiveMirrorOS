#!/usr/bin/env python3
"""
ActiveMirrorOS - Python Starter Template

A minimal "Hello, ActiveMirrorOS" example to get you started.
Copy this file and modify it for your use case.

Author: ActiveMirrorOS Team
License: MIT
"""

from activemirror import ActiveMirror


def hello_activemirror():
    """
    Simplest possible example: create a session, add messages, retrieve context.
    """
    print("=" * 60)
    print("Hello, ActiveMirrorOS!")
    print("=" * 60)

    # Initialize ActiveMirror with persistent storage
    mirror = ActiveMirror(
        storage_type="sqlite",
        db_path="hello_memory.db"
    )
    print("\n✓ ActiveMirror initialized with SQLite storage")

    # Create a new session (or load existing)
    session_id = "hello-session"
    if session_id in mirror.list_sessions():
        session = mirror.load_session(session_id)
        print(f"✓ Loaded existing session: {session_id}")
    else:
        session = mirror.create_session(session_id)
        print(f"✓ Created new session: {session_id}")

    # Add a message
    session.add_message(
        role="user",
        content="Hello, ActiveMirrorOS! Can you remember this message?"
    )
    session.add_message(
        role="assistant",
        content="Yes! I'll remember this conversation. Unlike traditional AI, "
                "I persist across sessions. Run this script again to see!"
    )
    print(f"✓ Added messages (total: {len(session.messages)})")

    # Display conversation
    print("\n" + "─" * 60)
    print("Conversation:")
    print("─" * 60)
    for msg in session.messages:
        print(f"\n{msg.role.upper()}: {msg.content}")
    print("─" * 60)

    print(f"\n✓ Session saved to: hello_memory.db")
    print(f"✓ Run this script again to see persistent memory in action!")


def example_with_reflective_patterns():
    """
    Example using LingOS Lite reflective patterns.
    """
    from activemirror.reflective_client import ReflectiveClient, ReflectivePattern

    print("\n" + "=" * 60)
    print("Reflective Patterns Example")
    print("=" * 60)

    # Create reflective client
    client = ReflectiveClient(storage_dir="reflective_memory")
    print("\n✓ ReflectiveClient initialized")

    # Create session
    session_id = client.create_session("reflection-demo")
    print(f"✓ Created session: {session_id}")

    # Try different patterns
    patterns = [
        (ReflectivePattern.EXPLORATORY, "What should I build today?"),
        (ReflectivePattern.ANALYTICAL, "Break down the components of a good app."),
        (ReflectivePattern.CREATIVE, "Give me innovative ideas for AI products."),
        (ReflectivePattern.STRATEGIC, "Plan the steps to launch my product.")
    ]

    print("\n" + "─" * 60)
    print("Reflective Responses:")
    print("─" * 60)

    for pattern, user_input in patterns:
        response = client.reflect(
            session_id=session_id,
            user_input=user_input,
            pattern=pattern
        )
        print(f"\n[{pattern.value.upper()}]")
        print(f"You: {user_input}")
        print(f"Reflection: {response.reflection}")

    print("─" * 60)
    print("\n✓ Try different patterns for different thinking modes!")


def example_with_vault():
    """
    Example using encrypted vault for sensitive data.
    """
    from activemirror.vault_memory import VaultMemory, VaultCategory

    print("\n" + "=" * 60)
    print("Encrypted Vault Example")
    print("=" * 60)

    # Create encrypted vault
    vault = VaultMemory(
        vault_path="hello_vault.db",
        password="demo-password-change-in-production"
    )
    print("\n✓ Encrypted vault initialized (AES-256-GCM)")

    # Store sensitive data
    vault.store(
        key="api-key",
        value="sk-super-secret-key-12345",
        category=VaultCategory.CREDENTIALS,
        metadata={"service": "OpenAI", "env": "development"}
    )
    print("✓ Stored encrypted credential")

    vault.store(
        key="user-pii",
        value={"name": "Alice", "email": "alice@example.com"},
        category=VaultCategory.PERSONAL,
        metadata={"user_id": "user_123"}
    )
    print("✓ Stored encrypted personal data")

    # Retrieve data
    api_key = vault.retrieve("api-key")
    print(f"\n✓ Retrieved: api-key = {api_key[:10]}..." )  # Show first 10 chars

    pii = vault.retrieve("user-pii")
    print(f"✓ Retrieved: user-pii = {pii}")

    # List vault contents
    all_keys = vault.list_keys()
    print(f"\n✓ Vault contains {len(all_keys)} entries: {all_keys}")

    print("\n⚠️  Remember: Use strong passwords in production!")


def main():
    """Main entry point with menu."""
    print("\nActiveMirrorOS Python Starter")
    print("Choose an example to run:")
    print("  1. Hello, ActiveMirrorOS (basic)")
    print("  2. Reflective Patterns")
    print("  3. Encrypted Vault")
    print("  4. Run all examples")

    choice = input("\nEnter choice (1-4): ").strip()

    if choice == "1":
        hello_activemirror()
    elif choice == "2":
        example_with_reflective_patterns()
    elif choice == "3":
        example_with_vault()
    elif choice == "4":
        hello_activemirror()
        example_with_reflective_patterns()
        example_with_vault()
    else:
        print("Invalid choice. Running basic example...")
        hello_activemirror()

    print("\n" + "=" * 60)
    print("Next Steps:")
    print("  • Read the docs: ../docs/quickstart.md")
    print("  • Explore examples: python/examples/")
    print("  • Try the demo: ../demo/demo_app.py")
    print("  • Check API reference: ../docs/api-reference.md")
    print("=" * 60)


if __name__ == "__main__":
    # Check if SDK is installed
    try:
        from activemirror import ActiveMirror
    except ImportError:
        print("❌ ActiveMirrorOS SDK not found!")
        print("\nInstall it:")
        print("  cd sdk/python")
        print("  pip install -e .")
        exit(1)

    main()
