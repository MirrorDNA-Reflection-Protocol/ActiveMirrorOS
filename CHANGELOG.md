# Changelog

All notable changes to ActiveMirrorOS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] - 2024-11-14

### Added

**Cross-Language SDK System**:
- JavaScript SDK with full feature parity to Python
- Memory store implementation for JavaScript (JSON-based)
- Reflective client for JavaScript (LingOS Lite patterns)
- Encrypted vault for JavaScript (AES-256-GCM)
- 8 JavaScript tests covering core functionality

**New Python Modules**:
- `reflective_client.py` - LingOS Lite reflective patterns implementation
- `vault_memory.py` - AES-256-GCM encrypted vault storage
- 14 new tests for reflective and vault features

**Example Applications**:
- CLI journaling tool (`apps/example-cli/`) - Standalone, no dependencies
- Desktop chat app (`apps/example-desktop/`) - Electron-based with session history
- Mobile app (`apps/example-mobile/`) - React Native with local persistence

**Documentation**:
- `docs/quickstart.md` - 5-minute getting started guide
- `docs/architecture.md` - System design and components
- `docs/api-reference.md` - Complete API documentation
- `docs/state-persistence.md` - Memory model deep dive
- `docs/reflective-behaviors.md` - LingOS Lite patterns guide

### Changed

- Updated README with comprehensive overview and new structure
- Improved Python SDK with better error handling
- Enhanced session management with better state tracking

### Fixed

- Fixed `storage_type` parameter not being recognized in ActiveMirror
- Fixed PBKDF2 import error (PBKDF2 → PBKDF2HMAC)
- Fixed vault_path attribute naming inconsistency (camelCase → snake_case)

### Security

- Implemented AES-256-GCM encryption for vault memory
- Added PBKDF2 key derivation (100k iterations) for password-based encryption
- Local-first architecture ensures data privacy by default

---

## [0.1.0] - 2024-Q1

### Added

**Initial Release**:
- Python SDK core functionality
- `ActiveMirror` class for orchestration
- `Session` class for conversation management
- `Config` system for flexible configuration
- `Message` models for structured data

**Storage Backends**:
- SQLite storage with WAL mode
- In-memory storage for testing
- Base storage interface for extensibility

**Core Features**:
- Session creation and management
- Message persistence
- Configuration loading (YAML, dict, file)
- MirrorDNA integration stubs
- LingOS integration stubs

**Testing**:
- 61 unit tests covering core functionality
- pytest configuration
- Test fixtures and utilities

**Packaging**:
- `pyproject.toml` for modern Python packaging
- `setup.py` for backwards compatibility
- MIT License
- Basic README and documentation

---

## [Unreleased]

Changes in development but not yet released.

### Planned for v0.3.0

- Full-text search across sessions
- Semantic search using embeddings
- Session tagging and categorization
- Advanced filtering capabilities
- Memory statistics and insights

See [ROADMAP.md](ROADMAP.md) for full planned features.

---

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **Major version** (X.0.0): Breaking changes to public API
- **Minor version** (0.X.0): New features, backwards compatible
- **Patch version** (0.0.X): Bug fixes only, backwards compatible

During v0.x development, minor versions may include breaking changes but will be clearly documented.

---

## Categories

Changes are grouped by category:

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Features that will be removed in future versions
- **Removed**: Features that have been removed
- **Fixed**: Bug fixes
- **Security**: Security-related changes

---

[0.2.0]: https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/releases/tag/v0.1.0
