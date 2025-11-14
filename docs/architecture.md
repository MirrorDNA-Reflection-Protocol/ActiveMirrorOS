# Architecture

## System Overview

ActiveMirrorOS is a **multi-layer consumer OS** for building persistent, reflective AI experiences. It sits at the top of the MirrorDNA/LingOS ecosystem stack.

```
┌──────────────────────────────────────────────────┐
│         Consumer Applications Layer              │
│   (CLI, Desktop, Mobile, Custom Apps)            │
└────────────────┬─────────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────────┐
│              ActiveMirrorOS                      │
│   ┌──────────────┬─────────────┬──────────────┐ │
│   │ Session Mgmt │ Reflective  │ Vault Memory │ │
│   │              │  Client     │              │ │
│   └──────────────┴─────────────┴──────────────┘ │
└────────────────┬─────────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────────┐
│           Foundation Protocols                    │
│  ┌──────────┬──────────┬──────────┬───────────┐ │
│  │MirrorDNA │ LingOS   │ Storage  │ Glyphs    │ │
│  └──────────┴──────────┴──────────┴───────────┘ │
└──────────────────────────────────────────────────┘
```

## Design Principles

### 1. Local-First Architecture

**All data stays on the user's device by default.**

- Session Memory: SQLite or JSON files
- Vault Storage: Encrypted local files
- No Cloud Dependency
- Optional Sync

### 2. Multi-Language SDK Support

Python and JavaScript SDKs with same capabilities:
- Shared data formats (JSON)
- Compatible storage schemas
- Consistent APIs
- Portable sessions

### 3. Layered Memory Model

```
RAM Layer → Session Memory → Vault Memory
(Active)    (Persistent)    (Encrypted)
```

### 4. Reflective-First Design

Every interaction supports LingOS Lite reflection patterns with uncertainty markers.

## Component Architecture

See [quickstart.md](quickstart.md) for usage and [api-reference.md](api-reference.md) for detailed APIs.

## Security

- AES-256-GCM encryption for vault
- PBKDF2 key derivation (100k iterations)
- Local-first privacy
- No telemetry

## Integration Points

- MirrorDNA (identity/continuity)
- LingOS (reflective dialogue)
- Custom LLM providers
- Storage backends

For complete architectural details, see the expanded architecture documentation in the repository.
