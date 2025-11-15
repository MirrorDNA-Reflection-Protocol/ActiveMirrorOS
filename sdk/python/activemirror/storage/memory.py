# FEU-Enforced Module | Master Citation v15.2 | Fact/Estimate/Unknown Protocol Active
# This module operates under MirrorDNA Reflective AI constraints.
# All outputs must be tagged as Fact, Estimate, or Unknown.
"""
In-memory storage backend (for testing and development).
"""

from typing import Dict, List, Optional

from activemirror.storage.base import StorageBackend
from activemirror.core.message import Message


class InMemoryStorage(StorageBackend):
    """
    In-memory storage backend.

    Useful for testing and development. Data is not persisted.
    """

    def __init__(self):
        """Initialize in-memory storage."""
        self._sessions: Dict[str, dict] = {}
        self._messages: Dict[str, List[Message]] = {}

    def save_session(self, session) -> str:
        """Save a session to memory."""
        session_data = session.to_dict()
        self._sessions[session.id] = session_data

        # Store messages separately
        if session.id not in self._messages:
            self._messages[session.id] = []

        return session.id

    def load_session(self, session_id: str):
        """Load a session from memory."""
        if session_id not in self._sessions:
            return None

        # Import here to avoid circular dependency
        from activemirror.core.session import Session

        session_data = self._sessions[session_id]
        return Session.from_dict(session_data, storage_backend=self)

    def save_message(self, message: Message) -> str:
        """Save a message to memory."""
        if message.session_id not in self._messages:
            self._messages[message.session_id] = []

        self._messages[message.session_id].append(message)
        return message.id

    def get_messages(
        self, session_id: str, limit: Optional[int] = None, offset: int = 0
    ) -> List[Message]:
        """Get messages for a session from memory."""
        if session_id not in self._messages:
            return []

        messages = self._messages[session_id][offset:]
        if limit:
            messages = messages[:limit]

        return messages

    def list_sessions(
        self, user_id: Optional[str] = None, limit: int = 100, offset: int = 0
    ) -> List:
        """List sessions from memory."""
        from activemirror.core.mirror import SessionMetadata

        sessions = []

        for session_data in self._sessions.values():
            # Filter by user_id if provided
            if user_id and session_data.get("user_id") != user_id:
                continue

            metadata = SessionMetadata(
                session_id=session_data["id"],
                title=session_data["title"],
                created_at=session_data["created_at"],
                updated_at=session_data["updated_at"],
                message_count=session_data.get("message_count", 0),
            )
            sessions.append(metadata)

        # Sort by updated_at (most recent first)
        sessions.sort(
            key=lambda s: s.updated_at,
            reverse=True,
        )

        # Apply offset and limit
        sessions = sessions[offset:]
        if limit:
            sessions = sessions[:limit]

        return sessions

    def delete_session(self, session_id: str) -> bool:
        """Delete a session from memory."""
        if session_id in self._sessions:
            del self._sessions[session_id]

        if session_id in self._messages:
            del self._messages[session_id]

        return True
