# FEU-Enforced Module | Master Citation v15.2 | Fact/Estimate/Unknown Protocol Active
# This module operates under MirrorDNA Reflective AI constraints.
# All outputs must be tagged as Fact, Estimate, or Unknown.
"""
Pytest configuration and shared fixtures.
"""

import pytest
from activemirror import ActiveMirror
from activemirror.storage.memory import InMemoryStorage


@pytest.fixture
def memory_storage():
    """Provide an in-memory storage backend."""
    return InMemoryStorage()


@pytest.fixture
def activemirror():
    """Provide an ActiveMirror instance with in-memory storage."""
    return ActiveMirror(storage_type="memory")


@pytest.fixture
def session(activemirror):
    """Provide a session for testing."""
    return activemirror.create_session(title="Test Session")
