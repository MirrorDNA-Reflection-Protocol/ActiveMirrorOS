# FEU-Enforced Module | Master Citation v15.2 | Fact/Estimate/Unknown Protocol Active
# This module operates under MirrorDNA Reflective AI constraints.
# All outputs must be tagged as Fact, Estimate, or Unknown.
"""
Abstract base class for storage backends.
"""

from abc import ABC, abstractmethod
from typing import List, Optional


class StorageBackend(ABC):
    """
    Abstract storage backend interface.

    All storage implementations must inherit from this class
    and implement its methods.
    """

    @abstractmethod
    def save_session(self, session) -> str:
        """
        Save a session.

        Args:
            session: Session object to save

        Returns:
            Session ID

        Raises:
            StorageError: If save fails
        """
        pass

    @abstractmethod
    def load_session(self, session_id: str):
        """
        Load a session by ID.

        Args:
            session_id: Session identifier

        Returns:
            Session object or None if not found

        Raises:
            StorageError: If load fails
        """
        pass

    @abstractmethod
    def save_message(self, message) -> str:
        """
        Save a message.

        Args:
            message: Message object to save

        Returns:
            Message ID

        Raises:
            StorageError: If save fails
        """
        pass

    @abstractmethod
    def get_messages(
        self, session_id: str, limit: Optional[int] = None, offset: int = 0
    ) -> List:
        """
        Get messages for a session.

        Args:
            session_id: Session identifier
            limit: Maximum messages to return
            offset: Number of messages to skip

        Returns:
            List of Message objects

        Raises:
            StorageError: If retrieval fails
        """
        pass

    @abstractmethod
    def list_sessions(
        self, user_id: Optional[str] = None, limit: int = 100, offset: int = 0
    ) -> List:
        """
        List sessions.

        Args:
            user_id: Optional user filter
            limit: Maximum sessions to return
            offset: Number of sessions to skip

        Returns:
            List of SessionMetadata objects

        Raises:
            StorageError: If listing fails
        """
        pass

    @abstractmethod
    def delete_session(self, session_id: str) -> bool:
        """
        Delete a session.

        Args:
            session_id: Session identifier

        Returns:
            True if deleted successfully

        Raises:
            StorageError: If deletion fails
        """
        pass
