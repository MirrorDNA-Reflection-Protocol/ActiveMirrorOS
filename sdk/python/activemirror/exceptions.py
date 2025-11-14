"""
Exceptions for ActiveMirrorOS.
"""


class ActiveMirrorError(Exception):
    """Base exception for all ActiveMirror errors."""
    pass


class SessionNotFoundError(ActiveMirrorError):
    """Raised when a session cannot be found."""
    pass


class StorageError(ActiveMirrorError):
    """Raised when storage operations fail."""
    pass


class ContextOverflowError(ActiveMirrorError):
    """Raised when context exceeds configured limits."""
    pass


class ConfigurationError(ActiveMirrorError):
    """Raised when configuration is invalid."""
    pass


class IntegrationError(ActiveMirrorError):
    """Raised when integration with external systems fails."""
    pass


class ValidationError(ActiveMirrorError):
    """Raised when data validation fails."""
    pass
