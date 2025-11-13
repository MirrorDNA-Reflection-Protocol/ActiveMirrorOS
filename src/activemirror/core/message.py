"""
Message and Response classes for conversations.
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, Optional
import uuid


@dataclass
class Message:
    """
    A message in a conversation.

    Attributes:
        id: Message unique identifier
        session_id: Parent session ID
        role: Message role (user, assistant, system)
        content: Message content
        timestamp: When message was created
        metadata: Additional metadata
    """

    session_id: str
    role: str
    content: str
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = field(default_factory=datetime.now)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def __post_init__(self):
        """Validate message after initialization."""
        if self.role not in ("user", "assistant", "system"):
            raise ValueError(f"Invalid role: {self.role}")

    def to_dict(self) -> Dict[str, Any]:
        """Convert message to dictionary."""
        return {
            "id": self.id,
            "session_id": self.session_id,
            "role": self.role,
            "content": self.content,
            "timestamp": self.timestamp.isoformat(),
            "metadata": self.metadata,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Message":
        """Create message from dictionary."""
        return cls(
            id=data["id"],
            session_id=data["session_id"],
            role=data["role"],
            content=data["content"],
            timestamp=datetime.fromisoformat(data["timestamp"]),
            metadata=data.get("metadata", {}),
        )


@dataclass
class Response:
    """
    AI response to a user message.

    Attributes:
        content: Response text content
        timestamp: When response was generated
        metadata: Additional response metadata
        tokens_used: Number of tokens consumed
    """

    content: str
    timestamp: datetime = field(default_factory=datetime.now)
    metadata: Dict[str, Any] = field(default_factory=dict)
    tokens_used: Optional[int] = None

    def to_message(self, session_id: str) -> Message:
        """Convert response to a Message object."""
        return Message(
            session_id=session_id,
            role="assistant",
            content=self.content,
            timestamp=self.timestamp,
            metadata=self.metadata,
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert response to dictionary."""
        return {
            "content": self.content,
            "timestamp": self.timestamp.isoformat(),
            "metadata": self.metadata,
            "tokens_used": self.tokens_used,
        }
