"""
Tests for ActiveMirror main class.
"""

import pytest
import tempfile
from pathlib import Path

from activemirror import ActiveMirror, Config
from activemirror.exceptions import SessionNotFoundError


class TestActiveMirror:
    """Test ActiveMirror class."""

    def test_create_activemirror(self):
        """Test creating ActiveMirror instance."""
        mirror = ActiveMirror(storage_type="memory")

        assert mirror is not None
        assert mirror.config is not None

    def test_create_with_config(self):
        """Test creating ActiveMirror with config."""
        config = Config()
        mirror = ActiveMirror(config=config)

        assert mirror.config == config

    def test_create_session(self):
        """Test creating a session."""
        mirror = ActiveMirror(storage_type="memory")
        session = mirror.create_session(title="Test Session")

        assert session is not None
        assert session.title == "Test Session"
        assert session.id is not None

    def test_load_session(self):
        """Test loading a session."""
        mirror = ActiveMirror(storage_type="memory")

        # Create and save session
        session = mirror.create_session(title="Test")
        session.send("Hello")
        session_id = session.save()

        # Load session
        loaded = mirror.load_session(session_id)

        assert loaded is not None
        assert loaded.id == session_id
        assert loaded.title == "Test"

    def test_load_nonexistent_session(self):
        """Test loading a nonexistent session."""
        mirror = ActiveMirror(storage_type="memory")

        with pytest.raises(SessionNotFoundError):
            mirror.load_session("nonexistent-id")

    def test_list_sessions(self):
        """Test listing sessions."""
        # Use a fresh storage instance for isolation
        from activemirror.storage.memory import InMemoryStorage
        storage = InMemoryStorage()
        mirror = ActiveMirror(storage=storage)

        # Create multiple sessions
        session1 = mirror.create_session(title="Session 1")
        session2 = mirror.create_session(title="Session 2")
        session3 = mirror.create_session(title="Session 3")

        session1.save()
        session2.save()
        session3.save()

        # List sessions
        sessions = mirror.list_sessions()

        assert len(sessions) == 3

    def test_delete_session(self):
        """Test deleting a session."""
        mirror = ActiveMirror(storage_type="memory")

        session = mirror.create_session(title="Delete Me")
        session_id = session.save()

        # Delete
        result = mirror.delete_session(session_id)
        assert result is True

        # Verify deleted
        with pytest.raises(SessionNotFoundError):
            mirror.load_session(session_id)

    def test_session_caching(self):
        """Test that sessions are cached."""
        mirror = ActiveMirror(storage_type="memory")

        session1 = mirror.create_session(title="Cached")
        session_id = session1.save()

        # Load same session twice
        loaded1 = mirror.load_session(session_id)
        loaded2 = mirror.load_session(session_id)

        # Should be same object from cache
        assert loaded1 is loaded2

    def test_from_config_file(self):
        """Test loading ActiveMirror from config file."""
        config_data = {
            "storage": {"type": "memory"},
            "memory": {"max_context_messages": 30},
        }

        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".yaml", delete=False
        ) as f:
            import yaml

            yaml.dump(config_data, f)
            config_path = f.name

        try:
            mirror = ActiveMirror.from_config(config_path)

            assert mirror.config.storage.type == "memory"
            assert mirror.config.memory.max_context_messages == 30

        finally:
            Path(config_path).unlink()

    def test_invalid_config(self):
        """Test that invalid config raises error."""
        config = Config()
        config.storage.type = "invalid"

        with pytest.raises(ValueError):
            ActiveMirror(config=config)
