"""
ActiveMirrorOS - Intelligence that remembers.

A persistent, reflective AI experience that maintains continuity
across conversations, sessions, and time.
"""

__version__ = "0.2.0"
__api_version__ = "2.0.0"

from activemirror.core.mirror import ActiveMirror
from activemirror.core.session import Session
from activemirror.core.message import Message, Response
from activemirror.core.config import Config
from activemirror.reflective_client import (
    ReflectiveClient,
    ReflectivePattern,
    ReflectivePromptBuilder,
    UncertaintyLevel,
)
from activemirror.vault_memory import VaultMemory, VaultCategory
from activemirror.exceptions import (
    ActiveMirrorError,
    SessionNotFoundError,
    StorageError,
    ContextOverflowError,
    ConfigurationError,
)

__all__ = [
    # Main classes
    "ActiveMirror",
    "Session",
    "Message",
    "Response",
    "Config",
    # Reflective components
    "ReflectiveClient",
    "ReflectivePattern",
    "ReflectivePromptBuilder",
    "UncertaintyLevel",
    # Vault memory
    "VaultMemory",
    "VaultCategory",
    # Exceptions
    "ActiveMirrorError",
    "SessionNotFoundError",
    "StorageError",
    "ContextOverflowError",
    "ConfigurationError",
    # Version info
    "__version__",
    "__api_version__",
]
