"""
ActiveMirrorOS - Intelligence that remembers.

A persistent, reflective AI experience that maintains continuity
across conversations, sessions, and time.
"""

__version__ = "0.1.0"
__api_version__ = "1.0.0"

from activemirror.core.mirror import ActiveMirror
from activemirror.core.session import Session
from activemirror.core.message import Message, Response
from activemirror.core.config import Config
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
