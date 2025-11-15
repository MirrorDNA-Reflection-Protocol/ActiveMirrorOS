# FEU-Enforced Module | Master Citation v15.2 | Fact/Estimate/Unknown Protocol Active
# This module operates under MirrorDNA Reflective AI constraints.
# All outputs must be tagged as Fact, Estimate, or Unknown.
"""
Tests for Message and Response classes.
"""

import pytest
from datetime import datetime
from activemirror.core.message import Message, Response


class TestMessage:
    """Test Message class."""

    def test_create_message(self):
        """Test creating a message."""
        msg = Message(
            session_id="test-session",
            role="user",
            content="Hello world",
        )

        assert msg.session_id == "test-session"
        assert msg.role == "user"
        assert msg.content == "Hello world"
        assert msg.id is not None
        assert isinstance(msg.timestamp, datetime)

    def test_message_roles(self):
        """Test valid message roles."""
        for role in ("user", "assistant", "system"):
            msg = Message(
                session_id="test",
                role=role,
                content="test",
            )
            assert msg.role == role

    def test_invalid_role(self):
        """Test that invalid roles raise error."""
        with pytest.raises(ValueError):
            Message(
                session_id="test",
                role="invalid",
                content="test",
            )

    def test_message_to_dict(self):
        """Test converting message to dictionary."""
        msg = Message(
            session_id="test-session",
            role="user",
            content="Hello",
        )

        msg_dict = msg.to_dict()

        assert msg_dict["id"] == msg.id
        assert msg_dict["session_id"] == "test-session"
        assert msg_dict["role"] == "user"
        assert msg_dict["content"] == "Hello"
        assert "timestamp" in msg_dict

    def test_message_from_dict(self):
        """Test creating message from dictionary."""
        msg_dict = {
            "id": "msg-123",
            "session_id": "session-123",
            "role": "assistant",
            "content": "Response",
            "timestamp": datetime.now().isoformat(),
            "metadata": {"test": "value"},
        }

        msg = Message.from_dict(msg_dict)

        assert msg.id == "msg-123"
        assert msg.session_id == "session-123"
        assert msg.role == "assistant"
        assert msg.content == "Response"
        assert msg.metadata["test"] == "value"

    def test_message_metadata(self):
        """Test message metadata."""
        msg = Message(
            session_id="test",
            role="user",
            content="test",
            metadata={"key": "value"},
        )

        assert msg.metadata["key"] == "value"


class TestResponse:
    """Test Response class."""

    def test_create_response(self):
        """Test creating a response."""
        response = Response(content="Hello back!")

        assert response.content == "Hello back!"
        assert isinstance(response.timestamp, datetime)
        assert response.tokens_used is None

    def test_response_with_tokens(self):
        """Test response with token count."""
        response = Response(
            content="Response",
            tokens_used=150,
        )

        assert response.tokens_used == 150

    def test_response_to_message(self):
        """Test converting response to message."""
        response = Response(content="AI response")

        msg = response.to_message(session_id="test-session")

        assert isinstance(msg, Message)
        assert msg.role == "assistant"
        assert msg.content == "AI response"
        assert msg.session_id == "test-session"

    def test_response_to_dict(self):
        """Test converting response to dictionary."""
        response = Response(
            content="Test response",
            tokens_used=100,
            metadata={"model": "test-model"},
        )

        response_dict = response.to_dict()

        assert response_dict["content"] == "Test response"
        assert response_dict["tokens_used"] == 100
        assert response_dict["metadata"]["model"] == "test-model"
        assert "timestamp" in response_dict
