# Architecture

**At a Glance**: ActiveMirrorOS is a multi-layer consumer OS that sits atop the MirrorDNA/LingOS ecosystem. This document explains the system design, component architecture, and how the pieces fit together.

---

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

ActiveMirrorOS integrates with:

- **MirrorDNA** — Core identity and continuity protocols for persistent AI agents
- **LingOS** — Reflective dialogue framework providing uncertainty markers and patterns
- **Custom LLM providers** — Plug in OpenAI, Anthropic, local models, or custom providers
- **Storage backends** — Extend with PostgreSQL, MongoDB, or custom storage systems

## Ecosystem Context

ActiveMirrorOS is part of the broader MirrorDNA ecosystem:

- **MirrorDNA** — Foundation for AI identity and memory continuity
- **LingOS** — Reflective dialogue protocols with uncertainty awareness
- **ActiveMirrorOS** (this project) — Consumer-facing SDK and OS layer
- **Glyphtrail** — Visual language for AI communication patterns
- **TrustByDesign** — Security and privacy frameworks

These projects work together to enable trustworthy, persistent AI experiences.

---

For complete architectural details, see the expanded architecture documentation in the repository.
