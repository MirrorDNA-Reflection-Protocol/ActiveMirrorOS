# ActiveMirrorOS Tests

This directory contains integration and unit tests for ActiveMirrorOS.

## Running Tests

### Option 1: Install SDK First (Recommended)

```bash
# Install the Python SDK
cd sdk/python
pip install -e ".[dev]"

# Return to root and run tests
cd ../..
python -m pytest tests/ -v
```

### Option 2: Run SDK Tests Directly

```bash
# Python SDK tests (75 tests)
cd sdk/python
python -m pytest tests/ -v

# JavaScript SDK tests (8 tests)
cd sdk/javascript
node --test tests/
```

## Test Organization

```
tests/
├── unit/              # Unit tests for core functionality
│   ├── test_config.py
│   ├── test_message.py
│   ├── test_mirror.py
│   ├── test_session.py
│   └── test_storage.py
└── README.md          # This file
```

**Note**: The unit tests in `tests/unit/` require the `activemirror` package to be installed. Install it from `sdk/python/` before running these tests.

## Writing Tests

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on writing tests.

### Test Requirements

- All new features must include tests
- Maintain or improve test coverage
- Tests must pass before merging
- Follow existing test patterns

### Example Test

```python
import pytest
from activemirror import ActiveMirror

def test_create_session():
    """Test that sessions can be created."""
    mirror = ActiveMirror(storage_type="memory")
    session = mirror.create_session("test-session")

    assert session.session_id == "test-session"
    assert len(session.messages) == 0
```

## Test Coverage

Current test coverage (as of v0.2.0):
- **Python**: 75 tests covering core SDK, reflective client, and vault
- **JavaScript**: 8 tests covering memory store and session management
- **Total**: 83 tests, all passing

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Release tags

See `.github/workflows/` for CI configuration (if present).
