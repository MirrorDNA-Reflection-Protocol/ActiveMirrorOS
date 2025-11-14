"""
Session management for conversations.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
import uuid

from activemirror.core.message import Message, Response
from activemirror.exceptions import ContextOverflowError


class Session:
    """
    A conversation session with persistent memory.

    Sessions represent bounded conversation periods that can be
    saved, loaded, and resumed later.
    """

    def __init__(
        self,
        title: Optional[str] = None,
        user_id: Optional[str] = None,
        parent_session_id: Optional[str] = None,
        session_id: Optional[str] = None,
        max_context_messages: int = 50,
        storage_backend=None,
    ):
        """
        Initialize a conversation session.

        Args:
            title: Session title
            user_id: Associated user identifier
            parent_session_id: Parent session for continuity
            session_id: Explicit session ID (or generate new)
            max_context_messages: Maximum messages in context
            storage_backend: Storage backend for persistence
        """
        self._id = session_id or str(uuid.uuid4())
        self._title = title or "Untitled Conversation"
        self._user_id = user_id or "anonymous"
        self._parent_session_id = parent_session_id
        self._created_at = datetime.now()
        self._updated_at = datetime.now()
        self._status = "active"
        self._max_context_messages = max_context_messages
        self._storage = storage_backend
        self._messages: List[Message] = []
        self._metadata: Dict[str, Any] = {}

    @property
    def id(self) -> str:
        """Session unique identifier."""
        return self._id

    @property
    def title(self) -> str:
        """Session title."""
        return self._title

    @property
    def user_id(self) -> str:
        """User identifier."""
        return self._user_id

    @property
    def created_at(self) -> datetime:
        """Session creation timestamp."""
        return self._created_at

    @property
    def updated_at(self) -> datetime:
        """Last update timestamp."""
        return self._updated_at

    @property
    def status(self) -> str:
        """Session status (active, paused, completed)."""
        return self._status

    def send(self, message: str, role: str = "user", **kwargs) -> Response:
        """
        Send a message and get a response.

        Args:
            message: Message content
            role: Message role (default: user)
            **kwargs: Additional parameters

        Returns:
            Response object with AI reply

        Raises:
            ContextOverflowError: If context exceeds limits
        """
        # Create user message
        msg = Message(
            session_id=self._id,
            role=role,
            content=message,
            metadata=kwargs,
        )

        # Add to session
        self._messages.append(msg)
        self._updated_at = datetime.now()

        # Check context limits
        if len(self._messages) > self._max_context_messages * 2:
            raise ContextOverflowError(
                f"Session has {len(self._messages)} messages, "
                f"exceeding limit of {self._max_context_messages * 2}"
            )

        # Save message if storage available
        if self._storage:
            self._storage.save_message(msg)

        # Generate response (stub - would call LLM in real implementation)
        response_content = self._generate_response(message)

        # Create response
        response = Response(
            content=response_content,
            metadata={"model": "stub", "session_id": self._id},
        )

        # Convert response to message and add to session
        response_msg = response.to_message(self._id)
        self._messages.append(response_msg)

        # Save response message
        if self._storage:
            self._storage.save_message(response_msg)

        return response

    def _generate_response(self, message: str) -> str:
        """
        Generate a response to the message.

        This is a stub implementation. In production, this would:
        1. Build context from message history
        2. Call LLM with context
        3. Process and return response

        Args:
            message: User message

        Returns:
            Response content
        """
        # Simple echo response for testing
        return (
            f"I received your message: '{message}'. "
            f"This is a stub response. In production, this would use "
            f"an LLM to generate context-aware replies."
        )

    def get_messages(
        self, limit: Optional[int] = None, offset: int = 0
    ) -> List[Message]:
        """
        Retrieve session messages.

        Args:
            limit: Maximum number of messages to return
            offset: Number of messages to skip

        Returns:
            List of messages
        """
        messages = self._messages[offset:]
        if limit:
            messages = messages[:limit]
        return messages

    def add_context(
        self, content: str, context_type: str = "system", **kwargs
    ) -> None:
        """
        Manually add context to the session.

        Args:
            content: Context content
            context_type: Type of context (system, preference, etc.)
            **kwargs: Additional metadata
        """
        msg = Message(
            session_id=self._id,
            role="system",
            content=content,
            metadata={"context_type": context_type, **kwargs},
        )
        self._messages.append(msg)

        if self._storage:
            self._storage.save_message(msg)

    def save(self) -> str:
        """
        Save session to storage.

        Returns:
            Session ID

        Raises:
            StorageError: If save fails
        """
        if self._storage:
            self._storage.save_session(self)
        return self._id

    def close(self) -> None:
        """Close and save session."""
        self._status = "completed"
        self._updated_at = datetime.now()
        self.save()

    def export(self, format: str = "json") -> str:
        """
        Export session data.

        Args:
            format: Export format (json, markdown, txt)

        Returns:
            Exported session data as string
        """
        if format == "json":
            import json

            return json.dumps(self.to_dict(), indent=2, default=str)

        elif format == "markdown":
            lines = [
                f"# {self._title}",
                f"",
                f"**Session ID**: {self._id}",
                f"**Created**: {self._created_at.isoformat()}",
                f"**Updated**: {self._updated_at.isoformat()}",
                f"**Status**: {self._status}",
                f"",
                "## Messages",
                f"",
            ]

            for msg in self._messages:
                role_emoji = {
                    "user": "👤",
                    "assistant": "🤖",
                    "system": "⚙️",
                }.get(msg.role, "❓")

                lines.append(f"### {role_emoji} {msg.role.title()}")
                lines.append(f"")
                lines.append(msg.content)
                lines.append(f"")
                lines.append(f"*{msg.timestamp.isoformat()}*")
                lines.append(f"")

            return "\n".join(lines)

        elif format == "txt":
            lines = [
                f"Session: {self._title}",
                f"ID: {self._id}",
                f"Created: {self._created_at.isoformat()}",
                f"",
                "=" * 60,
                f"",
            ]

            for msg in self._messages:
                lines.append(f"[{msg.role.upper()}] {msg.timestamp.isoformat()}")
                lines.append(msg.content)
                lines.append(f"")
                lines.append("-" * 60)
                lines.append(f"")

            return "\n".join(lines)

        else:
            raise ValueError(f"Unsupported export format: {format}")

    def to_dict(self) -> Dict[str, Any]:
        """Convert session to dictionary."""
        return {
            "id": self._id,
            "title": self._title,
            "user_id": self._user_id,
            "parent_session_id": self._parent_session_id,
            "created_at": self._created_at.isoformat(),
            "updated_at": self._updated_at.isoformat(),
            "status": self._status,
            "message_count": len(self._messages),
            "messages": [msg.to_dict() for msg in self._messages],
            "metadata": self._metadata,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any], storage_backend=None) -> "Session":
        """Create session from dictionary."""
        session = cls(
            session_id=data["id"],
            title=data["title"],
            user_id=data["user_id"],
            parent_session_id=data.get("parent_session_id"),
            storage_backend=storage_backend,
        )

        session._created_at = datetime.fromisoformat(data["created_at"])
        session._updated_at = datetime.fromisoformat(data["updated_at"])
        session._status = data["status"]
        session._metadata = data.get("metadata", {})

        # Load messages
        for msg_data in data.get("messages", []):
            msg = Message.from_dict(msg_data)
            session._messages.append(msg)

        return session
