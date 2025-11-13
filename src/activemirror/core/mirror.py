"""
Main ActiveMirror class - entry point for the library.
"""

from pathlib import Path
from typing import List, Optional

from activemirror.core.config import Config
from activemirror.core.session import Session
from activemirror.exceptions import SessionNotFoundError
from activemirror.storage import get_storage_backend


class SessionMetadata:
    """Metadata about a session."""

    def __init__(
        self,
        session_id: str,
        title: str,
        created_at: str,
        updated_at: str,
        message_count: int,
    ):
        self.session_id = session_id
        self.title = title
        self.created_at = created_at
        self.updated_at = updated_at
        self.message_count = message_count


class ActiveMirror:
    """
    Main ActiveMirror instance for managing sessions and memory.

    This is the primary entry point for using ActiveMirrorOS.
    """

    def __init__(
        self,
        config: Optional[Config] = None,
        storage=None,
        identity=None,
        dialogue_engine=None,
        **kwargs,
    ):
        """
        Initialize ActiveMirror.

        Args:
            config: Optional configuration object
            storage: Optional storage backend
            identity: Optional identity connector
            dialogue_engine: Optional dialogue engine
            **kwargs: Additional configuration options
        """
        # Use provided config or create default
        self._config = config or Config()

        # Merge kwargs into config
        if kwargs:
            for key, value in kwargs.items():
                if hasattr(self._config, key):
                    setattr(self._config, key, value)
                elif hasattr(self._config.memory, key):
                    setattr(self._config.memory, key, value)

        # Validate configuration
        errors = self._config.validate()
        if errors:
            raise ValueError(f"Configuration errors: {', '.join(errors)}")

        # Set up storage backend
        self._storage = storage or get_storage_backend(self._config.storage)

        # Set up identity (if provided)
        self._identity = identity

        # Set up dialogue engine (if provided)
        self._dialogue_engine = dialogue_engine

        # Sessions cache
        self._sessions_cache = {}

    @classmethod
    def from_config(cls, config_path: str) -> "ActiveMirror":
        """
        Load ActiveMirror from configuration file.

        Args:
            config_path: Path to configuration file (YAML or JSON)

        Returns:
            ActiveMirror instance
        """
        config = Config.from_file(config_path)
        return cls(config=config)

    def create_session(
        self,
        title: Optional[str] = None,
        parent_session_id: Optional[str] = None,
        **kwargs,
    ) -> Session:
        """
        Create a new conversation session.

        Args:
            title: Session title
            parent_session_id: Parent session for continuity
            **kwargs: Additional session parameters

        Returns:
            New Session object
        """
        user_id = self._identity.user_id if self._identity else None

        session = Session(
            title=title,
            user_id=user_id,
            parent_session_id=parent_session_id,
            max_context_messages=self._config.memory.max_context_messages,
            storage_backend=self._storage,
            **kwargs,
        )

        # Cache the session
        self._sessions_cache[session.id] = session

        return session

    def load_session(self, session_id: str) -> Session:
        """
        Load an existing session by ID.

        Args:
            session_id: Session identifier

        Returns:
            Session object

        Raises:
            SessionNotFoundError: If session doesn't exist
        """
        # Check cache first
        if session_id in self._sessions_cache:
            return self._sessions_cache[session_id]

        # Load from storage
        session = self._storage.load_session(session_id)

        if not session:
            raise SessionNotFoundError(f"Session not found: {session_id}")

        # Cache it
        self._sessions_cache[session_id] = session

        return session

    def list_sessions(
        self, user_id: Optional[str] = None, limit: int = 100, offset: int = 0
    ) -> List[SessionMetadata]:
        """
        List available sessions.

        Args:
            user_id: Optional user filter
            limit: Maximum sessions to return
            offset: Number of sessions to skip

        Returns:
            List of SessionMetadata objects
        """
        # Use identity's user_id if not provided
        if user_id is None and self._identity:
            user_id = self._identity.user_id

        return self._storage.list_sessions(
            user_id=user_id, limit=limit, offset=offset
        )

    def delete_session(self, session_id: str) -> bool:
        """
        Delete a session permanently.

        Args:
            session_id: Session identifier

        Returns:
            True if deleted successfully
        """
        # Remove from cache
        if session_id in self._sessions_cache:
            del self._sessions_cache[session_id]

        # Delete from storage
        return self._storage.delete_session(session_id)

    @property
    def config(self) -> Config:
        """Get current configuration."""
        return self._config

    @property
    def storage(self):
        """Get storage backend."""
        return self._storage
