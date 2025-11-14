# Contributing to ActiveMirrorOS

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to ActiveMirrorOS.

---

## Quick Links

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment.

**Expected Behavior**:
- Be respectful and considerate
- Welcome newcomers and help them learn
- Focus on what's best for the community
- Show empathy towards others

**Unacceptable Behavior**:
- Harassment, discrimination, or exclusion
- Trolling, insulting comments, or personal attacks
- Publishing others' private information
- Other conduct inappropriate in a professional setting

**Reporting**: If you experience or witness unacceptable behavior, please open a confidential issue or contact the maintainers directly.

---

## How to Contribute

### 1. Report Bugs

**Before reporting**:
- Search existing issues to avoid duplicates
- Try to reproduce on the latest version
- Gather relevant information (OS, Python/Node version, error messages)

**When reporting**:
- Use the issue template if provided
- Provide clear steps to reproduce
- Include error messages and logs
- Describe expected vs actual behavior

### 2. Suggest Features

**Before suggesting**:
- Check the [ROADMAP.md](ROADMAP.md) to see if it's already planned
- Search existing issues for similar suggestions
- Consider if it fits the project's scope and philosophy

**When suggesting**:
- Describe the problem you're trying to solve
- Explain why existing features don't address it
- Provide examples of how it would be used
- Consider implementation complexity

### 3. Contribute Code

**Good first contributions**:
- Fix typos in documentation
- Improve error messages
- Add tests for existing features
- Resolve issues tagged `good-first-issue`

**Larger contributions**:
- Discuss in an issue before starting
- Follow the pull request process below
- Keep changes focused and atomic
- Update tests and documentation

### 4. Improve Documentation

Documentation contributions are highly valued!

**Areas to improve**:
- Fix typos, grammar, or clarity issues
- Add examples and use cases
- Improve API documentation
- Create tutorials or guides
- Translate documentation (future)

---

## Development Setup

### Prerequisites

**Python Development**:
- Python 3.8 or higher
- pip for package management

**JavaScript Development**:
- Node.js 16 or higher
- npm for package management

**General**:
- Git for version control
- Text editor or IDE (VS Code, PyCharm, etc.)

### Clone Repository

```bash
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
cd ActiveMirrorOS
```

### Python SDK Setup

```bash
cd sdk/python

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install in editable mode with dev dependencies
pip install -e ".[dev]"

# Run tests to verify setup
python -m pytest tests/ -v
```

### JavaScript SDK Setup

```bash
cd sdk/javascript

# Install dependencies
npm install

# Run tests to verify setup
node --test tests/
```

### Running Example Apps

**CLI**:
```bash
cd apps/example-cli
npm install
./amos-cli.js write "Test message"
```

**Desktop**:
```bash
cd apps/example-desktop
npm install
npm start
```

**Mobile**:
```bash
cd apps/example-mobile
npm install
npm start
```

---

## Code Style

### Python

We follow PEP 8 with some modifications:

- Line length: 88 characters (Black default)
- Use type hints where practical
- Docstrings for public APIs (Google style)
- Imports organized with isort

**Tools**:
```bash
# Format code
black .

# Check style
ruff check .

# Type checking
mypy sdk/python/activemirror
```

**Example**:
```python
from typing import Optional

def create_session(
    session_id: str,
    config: Optional[dict] = None
) -> Session:
    """Create a new session with the given ID.

    Args:
        session_id: Unique identifier for the session
        config: Optional configuration dictionary

    Returns:
        New Session instance

    Raises:
        ValueError: If session_id is empty or invalid
    """
    if not session_id:
        raise ValueError("session_id cannot be empty")
    return Session(session_id, config)
```

### JavaScript

We follow common JavaScript/Node.js conventions:

- Use modern ES6+ features
- 2-space indentation
- Semicolons required
- JSDoc comments for public APIs
- Descriptive variable names

**Example**:
```javascript
/**
 * Create a new session with the given ID.
 *
 * @param {string} sessionId - Unique identifier for the session
 * @param {Object} [config={}] - Optional configuration object
 * @returns {Session} New Session instance
 * @throws {Error} If sessionId is empty or invalid
 */
function createSession(sessionId, config = {}) {
  if (!sessionId) {
    throw new Error('sessionId cannot be empty');
  }
  return new Session(sessionId, config);
}
```

### General Principles

- **Clarity over cleverness**: Readable code beats clever code
- **Simple over complex**: Avoid unnecessary abstractions
- **Documented over obvious**: When in doubt, add a comment
- **Tested over trusted**: Write tests for new functionality
- **Consistent over perfect**: Follow existing patterns in the codebase

---

## Testing

### Test Requirements

**All pull requests must**:
- Include tests for new functionality
- Maintain or improve existing test coverage
- Pass all existing tests
- Not introduce flaky tests

### Writing Tests

**Python** (using pytest):
```python
import pytest
from activemirror import ActiveMirror

def test_create_session():
    """Test that sessions can be created."""
    mirror = ActiveMirror(storage_type="memory")
    session = mirror.create_session("test-session")

    assert session.session_id == "test-session"
    assert len(session.messages) == 0

def test_session_persistence():
    """Test that sessions persist across instances."""
    mirror1 = ActiveMirror(storage_type="sqlite", db_path=":memory:")
    session1 = mirror1.create_session("persistent")
    session1.add_message("user", "Hello")

    mirror2 = ActiveMirror(storage_type="sqlite", db_path=":memory:")
    session2 = mirror2.load_session("persistent")

    assert len(session2.messages) == 1
```

**JavaScript** (using Node.js test runner):
```javascript
const { test, describe } = require('node:test');
const assert = require('node:assert');
const { ActiveMirror } = require('../activemirror');

describe('Session creation', () => {
  test('creates session with ID', () => {
    const mirror = new ActiveMirror('./test-data');
    const session = mirror.createSession('test-session');

    assert.strictEqual(session.sessionId, 'test-session');
    assert.strictEqual(session.messages.length, 0);
  });
});
```

### Running Tests

**Python**:
```bash
# All tests
cd sdk/python && python -m pytest tests/ -v

# Specific test file
python -m pytest tests/test_mirror.py -v

# With coverage
python -m pytest tests/ --cov=activemirror --cov-report=html
```

**JavaScript**:
```bash
# All tests
cd sdk/javascript && node --test tests/

# Specific test file
node --test tests/test_memory.js
```

---

## Pull Request Process

### 1. Before You Start

- **Check existing issues**: See if someone's already working on it
- **Create an issue**: Discuss the change before implementing
- **Get feedback**: Especially for large changes

### 2. Make Your Changes

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... edit files ...

# Add tests
# ... write tests ...

# Run tests locally
cd sdk/python && python -m pytest tests/ -v
cd sdk/javascript && node --test tests/

# Commit with clear messages
git add .
git commit -m "Add feature: brief description"
```

### 3. Commit Messages

**Format**:
```
<type>: <short summary>

<detailed description>

<footer>
```

**Types**:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Adding or updating tests
- `refactor:` Code refactoring
- `style:` Code style changes (formatting, etc.)
- `chore:` Maintenance tasks

**Examples**:
```
feat: add session export to markdown format

Implement markdown export functionality that generates
a readable conversation history with timestamps.

Closes #123
```

```
fix: resolve storage_type parameter handling

The storage_type parameter was not being properly passed
to the config system. Added parameter alias handling.

Fixes #456
```

### 4. Submit Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Open a pull request on GitHub
# - Use a clear, descriptive title
# - Reference related issues
# - Describe what changed and why
# - Include testing instructions
```

### 5. Pull Request Review

**What reviewers look for**:
- Code quality and clarity
- Test coverage
- Documentation updates
- Adherence to code style
- No breaking changes (or clearly documented)

**During review**:
- Be responsive to feedback
- Make requested changes promptly
- Ask questions if unclear
- Be open to suggestions

### 6. After Merge

- Delete your feature branch
- Update your local main branch
- Celebrate your contribution!

---

## Release Process

(For maintainers)

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **Major** (v1.0.0): Breaking changes
- **Minor** (v0.1.0): New features, backwards compatible
- **Patch** (v0.0.1): Bug fixes only

### Creating a Release

1. Update `CHANGELOG.md` with changes
2. Bump version in `pyproject.toml` and `package.json`
3. Create git tag: `git tag -a v0.3.0 -m "Release v0.3.0"`
4. Push tag: `git push origin v0.3.0`
5. Create GitHub release with changelog
6. Publish to PyPI (Python) and npm (JavaScript)

---

## Getting Help

**Stuck? Have questions?**

- **Documentation**: Check [docs/](docs/) first
- **Issues**: Search existing issues for similar questions
- **Discussions**: Ask in GitHub Discussions
- **Examples**: Look at [examples/](examples/) for usage patterns

**Don't be shy**: If you're unsure about something, ask! We're here to help.

---

## Recognition

Contributors will be:
- Listed in release notes
- Credited in `CONTRIBUTORS.md` (if we create one)
- Thanked in announcement posts

Significant contributions may be highlighted in blog posts or documentation.

---

## License

By contributing to ActiveMirrorOS, you agree that your contributions will be licensed under the MIT License.

See [LICENSE](LICENSE) for the full license text.

---

**Thank you for contributing to ActiveMirrorOS!**

Your work helps build better, more persistent AI experiences for everyone.
