#!/usr/bin/env python3
"""
ActiveMirrorOS Python Starter

A complete, copy-paste ready example demonstrating all core features:
- Creating mirrors with persistent storage
- Managing sessions
- Adding messages
- Reflective dialogue with LingOS Lite
- Exporting sessions
- Encrypted vault storage

Usage:
    python python_starter.py

Requirements:
    pip install git+https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git#subdirectory=sdk/python
"""

from activemirror import ActiveMirror, ReflectiveClient, VaultMemory
from datetime import datetime
import os


def example_1_basic_session():
    """Example 1: Create a basic session with persistent memory"""
    print("\n" + "="*60)
    print("Example 1: Basic Session with Persistent Memory")
    print("="*60)

    # Create mirror with SQLite storage (persists across restarts)
    mirror = ActiveMirror(storage_type="sqlite", db_path="quickstart.db")

    # Create a session
    session = mirror.create_session("getting-started")

    # Add messages (automatically persisted to disk)
    session.add_message("user", "I'm learning ActiveMirrorOS!")
    session.add_message("assistant", "Great! I'll remember our learning journey.")
    session.add_message("user", "What makes this different from regular AI?")
    session.add_message("assistant", "I have persistent memory. Close this app, restart it days later - I'll remember everything.")

    # View the conversation
    print("\n📝 Session Content:")
    context = session.get_context()
    for msg in context:
        role = msg['role'].upper()
        content = msg['content']
        print(f"{role}: {content}")

    print(f"\n✅ Session '{session.session_id}' created and persisted to disk")
    print(f"   Database: {os.path.abspath('quickstart.db')}")

    return mirror


def example_2_loading_sessions():
    """Example 2: Load existing sessions (proves persistence)"""
    print("\n" + "="*60)
    print("Example 2: Loading Existing Sessions")
    print("="*60)

    # Create new mirror instance (simulating app restart)
    mirror = ActiveMirror(storage_type="sqlite", db_path="quickstart.db")

    # List all sessions
    sessions = mirror.list_sessions()
    print(f"\n📋 Found {len(sessions)} session(s):")
    for sid in sessions:
        print(f"   - {sid}")

    # Load the session we created earlier
    if "getting-started" in sessions:
        loaded = mirror.load_session("getting-started")
        print(f"\n🔄 Loaded session: {loaded.session_id}")
        print(f"   Messages: {len(loaded.messages)}")
        print(f"\n✅ Memory persisted across reload!")

    return mirror


def example_3_reflective_dialogue():
    """Example 3: Use LingOS Lite for reflective responses"""
    print("\n" + "="*60)
    print("Example 3: Reflective Dialogue with LingOS Lite")
    print("="*60)

    # Create reflective client with analytical mode
    reflective = ReflectiveClient(
        mode='analytical',
        uncertainty_threshold=0.7
    )

    # Example prompts with different modes
    examples = [
        ("analytical", "API latency increased from 200ms to 2 seconds"),
        ("exploratory", "Should I change my career to AI engineering?"),
        ("creative", "Need a name for a productivity app"),
        ("strategic", "Should we raise funding or bootstrap?")
    ]

    for mode, prompt in examples:
        reflective.mode = mode
        print(f"\n📌 Mode: {mode.upper()}")
        print(f"Prompt: {prompt}")
        print(f"\nResponse:")
        # Note: In real usage, you'd connect this to an LLM
        # For now, we demonstrate the API
        print(f"   [Would call LLM with {mode} mode guidance]")
        print(f"   [Uncertainty markers and mode instructions included]")

    print("\n✅ LingOS Lite provides mode-specific dialogue patterns")


def example_4_session_export():
    """Example 4: Export sessions to different formats"""
    print("\n" + "="*60)
    print("Example 4: Exporting Sessions")
    print("="*60)

    mirror = ActiveMirror(storage_type="sqlite", db_path="quickstart.db")

    # Create a sample session for export
    export_session = mirror.create_session("export-demo")
    export_session.add_message("user", "What is ActiveMirrorOS?")
    export_session.add_message("assistant", "It's a memory layer for AI applications.")
    export_session.add_message("user", "How does it work?")
    export_session.add_message("assistant", "Sessions persist to SQLite/JSON, maintaining full context.")

    # Export to markdown
    export_path = "export-demo.md"
    mirror.export_session("export-demo", format="markdown")

    print(f"\n📤 Exported session to: {os.path.abspath(export_path)}")

    # Show exported content
    if os.path.exists(export_path):
        with open(export_path, 'r') as f:
            content = f.read()
        print(f"\n📄 Exported Content Preview:")
        print(content[:300] + "..." if len(content) > 300 else content)

    print("\n✅ Sessions can be exported to markdown, JSON, or plain text")


def example_5_vault_storage():
    """Example 5: Encrypted vault for sensitive data"""
    print("\n" + "="*60)
    print("Example 5: Encrypted Vault Storage")
    print("="*60)

    # Create encrypted vault with password
    vault = VaultMemory(password="your-secure-password-here")

    # Store sensitive data (encrypted with AES-256-GCM)
    vault.store("api_key", "sk-1234567890abcdef")
    vault.store("database_password", "super-secret-password")
    vault.store("user_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")

    print("\n🔒 Stored 3 encrypted items in vault")

    # Retrieve decrypted data
    api_key = vault.retrieve("api_key")
    print(f"\n🔓 Retrieved API key: {api_key[:10]}... (truncated)")

    # List all keys (without revealing values)
    keys = vault.list_keys()
    print(f"\n📋 Vault contains {len(keys)} keys:")
    for key in keys:
        print(f"   - {key}")

    print("\n✅ Sensitive data encrypted at rest with AES-256-GCM")


def example_6_multiple_sessions():
    """Example 6: Managing multiple concurrent sessions"""
    print("\n" + "="*60)
    print("Example 6: Multiple Concurrent Sessions")
    print("="*60)

    mirror = ActiveMirror(storage_type="sqlite", db_path="quickstart.db")

    # Create multiple sessions for different topics
    projects = {
        "work-project": ["Planning Q2 roadmap", "Reviewing sprint goals"],
        "personal-journal": ["Grateful for good coffee today", "Read 30 pages"],
        "learning-python": ["Completed decorators tutorial", "Built a CLI tool"]
    }

    for session_id, messages in projects.items():
        session = mirror.create_session(session_id)
        for msg in messages:
            session.add_message("user", msg)
            session.add_message("assistant", f"Noted: {msg}")

    # List all sessions
    all_sessions = mirror.list_sessions()
    print(f"\n📚 Created {len(projects)} sessions:")
    for sid in all_sessions:
        session = mirror.load_session(sid)
        msg_count = len(session.messages)
        print(f"   - {sid}: {msg_count} messages")

    print("\n✅ Multiple sessions can coexist, each with separate context")


def example_7_json_storage():
    """Example 7: Alternative JSON storage (human-readable)"""
    print("\n" + "="*60)
    print("Example 7: JSON Storage (Human-Readable)")
    print("="*60)

    # Create mirror with JSON storage instead of SQLite
    mirror = ActiveMirror(storage_type="json", storage_path="./json_data")

    session = mirror.create_session("json-demo")
    session.add_message("user", "Testing JSON storage")
    session.add_message("assistant", "JSON files are human-readable!")

    print(f"\n📁 Session stored as JSON in: {os.path.abspath('./json_data')}")
    print("   You can open and read these files directly")

    # List files created
    if os.path.exists("./json_data"):
        files = os.listdir("./json_data")
        print(f"\n📄 Files created: {len(files)}")
        for f in files[:5]:  # Show first 5
            print(f"   - {f}")

    print("\n✅ JSON storage: simple, portable, human-readable")


def example_8_session_metadata():
    """Example 8: Adding custom metadata to sessions"""
    print("\n" + "="*60)
    print("Example 8: Custom Session Metadata")
    print("="*60)

    mirror = ActiveMirror(storage_type="sqlite", db_path="quickstart.db")

    # Create session with metadata
    session = mirror.create_session(
        "project-alpha",
        metadata={
            "project": "Mobile App",
            "status": "active",
            "priority": "high",
            "tags": ["react-native", "mvp", "startup"]
        }
    )

    session.add_message("user", "Starting project Alpha development")

    print("\n🏷️  Session created with metadata:")
    print(f"   Project: {session.metadata.get('project')}")
    print(f"   Status: {session.metadata.get('status')}")
    print(f"   Priority: {session.metadata.get('priority')}")
    print(f"   Tags: {', '.join(session.metadata.get('tags', []))}")

    print("\n✅ Metadata helps organize and filter sessions")


def main():
    """Run all examples"""
    print("\n" + "="*60)
    print("ActiveMirrorOS Python Starter Examples")
    print("="*60)
    print("\nThis script demonstrates all core features.")
    print("Each example is independent - explore the source code!")

    try:
        # Run all examples
        example_1_basic_session()
        example_2_loading_sessions()
        example_3_reflective_dialogue()
        example_4_session_export()
        example_5_vault_storage()
        example_6_multiple_sessions()
        example_7_json_storage()
        example_8_session_metadata()

        print("\n" + "="*60)
        print("✅ All Examples Completed Successfully!")
        print("="*60)
        print("\nNext Steps:")
        print("1. Explore the source code of this file")
        print("2. Modify examples to fit your use case")
        print("3. Read the docs: https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS")
        print("4. Build something amazing!")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nTroubleshooting:")
        print("1. Install: pip install git+https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git#subdirectory=sdk/python")
        print("2. Check: python --version (requires 3.8+)")
        print("3. Docs: https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/blob/main/onboarding/troubleshooting.md")


if __name__ == "__main__":
    main()
