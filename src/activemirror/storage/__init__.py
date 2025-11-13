"""
Storage backends for ActiveMirrorOS.
"""

from activemirror.storage.base import StorageBackend
from activemirror.storage.memory import InMemoryStorage
from activemirror.storage.sqlite import SQLiteStorage


def get_storage_backend(config) -> StorageBackend:
    """
    Get storage backend based on configuration.

    Args:
        config: Storage configuration object

    Returns:
        Configured storage backend

    Raises:
        ValueError: If storage type is unsupported
    """
    if config.type == "memory":
        return InMemoryStorage()
    elif config.type == "sqlite":
        return SQLiteStorage(
            db_path=config.db_path, enable_wal=config.enable_wal
        )
    else:
        raise ValueError(f"Unsupported storage type: {config.type}")


__all__ = [
    "StorageBackend",
    "InMemoryStorage",
    "SQLiteStorage",
    "get_storage_backend",
]
