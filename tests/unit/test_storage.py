"""
Tests for storage backends.
"""

import pytest
import tempfile
from pathlib import Path

from activemirror.storage.memory import InMemoryStorage
from activemirror.storage.sqlite import SQLiteStorage
from activemirror.core.session import Session
from activemirror.core.message import Message


class TestInMemoryStorage:
    """Test InMemoryStorage backend."""

    def test_save_and_load_session(self):
        """Test saving and loading a session."""
        storage = InMemoryStorage()
        session = Session(title="Test Session", storage_backend=storage)
        session.send("Hello")

        # Save session
        session_id = storage.save_session(session)

        # Load session
        loaded = storage.load_session(session_id)

        assert loaded is not None
        assert loaded.id == session.id
        assert loaded.title == "Test Session"

    def test_load_nonexistent_session(self):
        """Test loading a nonexistent session."""
        storage = InMemoryStorage()
        loaded = storage.load_session("nonexistent")

        assert loaded is None

    def test_save_message(self):
        """Test saving a message."""
        storage = InMemoryStorage()
        msg = Message(
            session_id="test-session",
            role="user",
            content="Test message",
        )

        msg_id = storage.save_message(msg)

        assert msg_id == msg.id

    def test_get_messages(self):
        """Test getting messages for a session."""
        storage = InMemoryStorage()
        session = Session(title="Test", storage_backend=storage)

        session.send("Message 1")
        session.send("Message 2")

        messages = storage.get_messages(session.id)

        assert len(messages) == 4  # 2 user + 2 assistant

    def test_list_sessions(self):
        """Test listing sessions."""
        storage = InMemoryStorage()

        session1 = Session(title="Session 1", user_id="user-1", storage_backend=storage)
        session2 = Session(title="Session 2", user_id="user-1", storage_backend=storage)
        session3 = Session(title="Session 3", user_id="user-2", storage_backend=storage)

        storage.save_session(session1)
        storage.save_session(session2)
        storage.save_session(session3)

        # List all sessions
        all_sessions = storage.list_sessions()
        assert len(all_sessions) == 3

        # List sessions for specific user
        user1_sessions = storage.list_sessions(user_id="user-1")
        assert len(user1_sessions) == 2

    def test_delete_session(self):
        """Test deleting a session."""
        storage = InMemoryStorage()
        session = Session(title="Test", storage_backend=storage)
        session_id = storage.save_session(session)

        # Delete session
        result = storage.delete_session(session_id)
        assert result is True

        # Verify deleted
        loaded = storage.load_session(session_id)
        assert loaded is None


class TestSQLiteStorage:
    """Test SQLiteStorage backend."""

    def test_save_and_load_session(self):
        """Test saving and loading a session with SQLite."""
        with tempfile.TemporaryDirectory() as tmpdir:
            db_path = Path(tmpdir) / "test.db"
            storage = SQLiteStorage(db_path=str(db_path))

            session = Session(title="Test Session", storage_backend=storage)
            session.send("Hello")

            # Save session
            session_id = storage.save_session(session)

            # Load session
            loaded = storage.load_session(session_id)

            assert loaded is not None
            assert loaded.id == session.id
            assert loaded.title == "Test Session"

    def test_save_message(self):
        """Test saving a message with SQLite."""
        with tempfile.TemporaryDirectory() as tmpdir:
            db_path = Path(tmpdir) / "test.db"
            storage = SQLiteStorage(db_path=str(db_path))

            msg = Message(
                session_id="test-session",
                role="user",
                content="Test message",
            )

            msg_id = storage.save_message(msg)
            assert msg_id == msg.id

    def test_get_messages(self):
        """Test getting messages with SQLite."""
        with tempfile.TemporaryDirectory() as tmpdir:
            db_path = Path(tmpdir) / "test.db"
            storage = SQLiteStorage(db_path=str(db_path))

            session = Session(title="Test", storage_backend=storage)
            session.send("Message 1")
            session.send("Message 2")

            storage.save_session(session)

            messages = storage.get_messages(session.id)
            assert len(messages) == 4  # 2 user + 2 assistant

    def test_list_sessions(self):
        """Test listing sessions with SQLite."""
        with tempfile.TemporaryDirectory() as tmpdir:
            db_path = Path(tmpdir) / "test.db"
            storage = SQLiteStorage(db_path=str(db_path))

            session1 = Session(title="Session 1", user_id="user-1", storage_backend=storage)
            session2 = Session(title="Session 2", user_id="user-1", storage_backend=storage)

            storage.save_session(session1)
            storage.save_session(session2)

            sessions = storage.list_sessions(user_id="user-1")
            assert len(sessions) == 2

    def test_delete_session(self):
        """Test deleting a session with SQLite."""
        with tempfile.TemporaryDirectory() as tmpdir:
            db_path = Path(tmpdir) / "test.db"
            storage = SQLiteStorage(db_path=str(db_path))

            session = Session(title="Test", storage_backend=storage)
            session_id = storage.save_session(session)

            # Delete
            result = storage.delete_session(session_id)
            assert result is True

            # Verify deleted
            loaded = storage.load_session(session_id)
            assert loaded is None

    def test_persistence_across_instances(self):
        """Test that data persists across storage instances."""
        with tempfile.TemporaryDirectory() as tmpdir:
            db_path = Path(tmpdir) / "test.db"

            # Create and save with first instance
            storage1 = SQLiteStorage(db_path=str(db_path))
            session = Session(title="Persistent", storage_backend=storage1)
            session.send("Test persistence")
            session_id = storage1.save_session(session)

            # Load with second instance
            storage2 = SQLiteStorage(db_path=str(db_path))
            loaded = storage2.load_session(session_id)

            assert loaded is not None
            assert loaded.title == "Persistent"
            assert len(loaded.get_messages()) > 0
