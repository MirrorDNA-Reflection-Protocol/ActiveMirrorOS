# Architecture

**System design and component overview for ActiveMirrorOS**

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Ecosystem Stack](#ecosystem-stack)
3. [Component Architecture](#component-architecture)
4. [Data Flow](#data-flow)
5. [Memory Model](#memory-model)
6. [Security Architecture](#security-architecture)
7. [Integration Points](#integration-points)

---

## System Overview

ActiveMirrorOS is a **multi-layer consumer OS** for building persistent, reflective AI experiences. It sits at the top of the MirrorDNA/LingOS ecosystem stack, providing production-ready SDKs for developers.

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

---

## Ecosystem Stack

### Full Stack Visualization

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┏━━━━━━━━━━━━┓ ┏━━━━━━━━━━━━┓ ┏━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃ Your Apps  ┃ ┃ Example    ┃ ┃ Third-Party          ┃  │
│  ┃ (Custom)   ┃ ┃ Apps       ┃ ┃ Integrations         ┃  │
│  ┗━━━━━━━━━━━━┛ ┗━━━━━━━━━━━━┛ ┗━━━━━━━━━━━━━━━━━━━━━━┛  │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│            ActiveMirrorOS (Consumer OS Layer)               │
│                    github.com/.../ActiveMirrorOS            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Session Management                                  │   │
│  │  • Create, load, resume sessions                    │   │
│  │  • Context preservation                             │   │
│  │  • Message storage                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Storage Layer                                       │   │
│  │  • SQLite (production)                              │   │
│  │  • JSON (simple)                                    │   │
│  │  • Custom backends                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ LingOS Lite (Reflective Patterns)                   │   │
│  │  • Exploratory, Analytical, Creative, Strategic     │   │
│  │  • Uncertainty markers                              │   │
│  │  • Glyph system                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Vault (Encrypted Storage)                           │   │
│  │  • AES-256-GCM encryption                           │   │
│  │  • PBKDF2 key derivation                            │   │
│  │  • Category-based storage                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│              LingOS (Language Operating System)             │
│                     github.com/.../LingOS                   │
│                                                             │
│  • Reflective dialogue protocol                            │
│  • Pattern definitions                                     │
│  • Meta-cognitive structures                               │
│  • Glyph semantics                                         │
│                                                             │
│  Note: LingOS Lite (built into ActiveMirrorOS)             │
│        LingOS Pro (coming v0.6.0)                          │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│         MirrorDNA (Universal Memory Format Standard)        │
│                github.com/.../MirrorDNA-Standard            │
│                                                             │
│  • Data format specification                               │
│  • Encoding standards                                      │
│  • Portability guarantees                                  │
│  • Glyphtrail syntax                                       │
│                                                             │
│  Like "MP3 for AI memory"—universal, portable              │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│       TrustByDesign (Cryptographic Trust & Governance)      │
│                 github.com/.../TrustByDesign                │
│                                                             │
│  • Cryptographic primitives                                │
│  • Verification protocols                                  │
│  • Provenance tracking                                     │
│  • Governance structures                                   │
│                                                             │
│  Security foundation for the entire stack                  │
└─────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Purpose | Key Deliverables |
|-------|---------|-----------------|
| **ActiveMirrorOS** | Consumer OS | SDKs, Apps, Documentation |
| **LingOS** | Dialogue Protocol | Pattern library, Glyph system |
| **MirrorDNA** | Memory Standard | Format spec, Portability |
| **TrustByDesign** | Security/Trust | Crypto primitives, Verification |

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

---

## Component Architecture

### ActiveMirrorOS Internal Structure

```
┌──────────────────────────────────────────────────────────────────┐
│                      ActiveMirrorOS SDK                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Public API (Python & JavaScript)                          │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │ │
│  │  │ ActiveMirror │  │ Reflective   │  │ VaultMemory  │   │ │
│  │  │   (Core)     │  │   Client     │  │  (Secure)    │   │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │ │
│  └─────────┼──────────────────┼──────────────────┼───────────┘ │
│            │                  │                  │             │
│  ┌─────────▼──────────────────▼──────────────────▼───────────┐ │
│  │ Core Layer                                                 │ │
│  │                                                            │ │
│  │  • Session (sessions management)                          │ │
│  │  • Message (message models)                               │ │
│  │  • Config (configuration)                                 │ │
│  │  • Mirror (orchestration)                                 │ │
│  └────────────────────────────┬───────────────────────────────┘ │
│                               │                                 │
│  ┌────────────────────────────▼───────────────────────────────┐ │
│  │ Storage Layer                                              │ │
│  │                                                            │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │ │
│  │  │ SQLite   │  │  JSON    │  │ In-Memory│  │ Custom   │ │ │
│  │  │ Backend  │  │ Backend  │  │ Backend  │  │ Backend  │ │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Security & Encryption Layer                                │ │
│  │                                                            │ │
│  │  • AES-256-GCM (encryption)                               │ │
│  │  • PBKDF2 (key derivation)                                │ │
│  │  • Vault categories (credentials, personal, sensitive)    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Reflective Pattern Layer (LingOS Lite)                     │ │
│  │                                                            │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │ │
│  │  │ Exploratory │  │ Analytical  │  │  Creative   │       │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │ │
│  │  ┌─────────────┐  ┌─────────────────────────────────┐    │ │
│  │  │ Strategic   │  │ Uncertainty Markers (~,?,*,!)  │    │ │
│  │  └─────────────┘  └─────────────────────────────────┘    │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### Component Relationships

```
┌────────────────────────────────────────────────────────────┐
│                      Your Application                      │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      │ import activemirror
                      ▼
         ┌────────────────────────────┐
         │      ActiveMirror          │◄────────┐
         │   (Main Orchestrator)      │         │
         └────────────┬────────────────┘         │
                      │                          │
            ┌─────────┼─────────────────┐        │
            ▼         ▼                 ▼        │
    ┌──────────┐ ┌─────────┐   ┌───────────┐    │
    │ Session  │ │ Config  │   │  Storage  │    │
    │ Manager  │ │ Loader  │   │  Backend  │────┘
    └────┬─────┘ └─────────┘   └───────────┘
         │
         │ creates/manages
         ▼
    ┌─────────┐
    │ Session │
    │ Object  │
    └────┬────┘
         │
         │ contains
         ▼
    ┌──────────┐
    │ Messages │
    │ (List)   │
    └──────────┘
```

---

## Data Flow

### Message Storage Flow

```
1. User adds message
   │
   ▼
┌──────────────────────────────┐
│ session.add_message(...)     │
└───────────┬──────────────────┘
            │
            │ create Message object
            ▼
┌──────────────────────────────┐
│ Message(role, content, ...)  │
└───────────┬──────────────────┘
            │
            │ add to session
            ▼
┌──────────────────────────────┐
│ session.messages.append(msg) │
└───────────┬──────────────────┘
            │
            │ trigger save
            ▼
┌──────────────────────────────┐
│ storage.save_session(...)    │
└───────────┬──────────────────┘
            │
            │ persist
            ▼
┌──────────────────────────────┐
│ SQLite DB / JSON File        │
└──────────────────────────────┘
```

### Session Loading Flow

```
1. User loads session
   │
   ▼
┌──────────────────────────────┐
│ mirror.load_session(id)      │
└───────────┬──────────────────┘
            │
            │ check cache
            ▼
┌──────────────────────────────┐
│ if in memory: return         │
│ else: load from storage      │
└───────────┬──────────────────┘
            │
            │ read from disk
            ▼
┌──────────────────────────────┐
│ storage.load_session(id)     │
└───────────┬──────────────────┘
            │
            │ deserialize
            ▼
┌──────────────────────────────┐
│ Session.from_dict(data)      │
└───────────┬──────────────────┘
            │
            │ return to user
            ▼
┌──────────────────────────────┐
│ session object (in memory)   │
└──────────────────────────────┘
```

### Reflective Pattern Flow

```
1. User requests reflection
   │
   ▼
┌──────────────────────────────┐
│ client.reflect(input, mode)  │
└───────────┬──────────────────┘
            │
            │ select pattern
            ▼
┌──────────────────────────────┐
│ pattern = PATTERNS[mode]     │
└───────────┬──────────────────┘
            │
            │ apply pattern logic
            ▼
┌──────────────────────────────┐
│ reflection = pattern.reflect │
└───────────┬──────────────────┘
            │
            │ add uncertainty markers
            ▼
┌──────────────────────────────┐
│ add_marker(confidence)       │
└───────────┬──────────────────┘
            │
            │ return response
            ▼
┌──────────────────────────────┐
│ ReflectiveResponse object    │
└──────────────────────────────┘
```

---

## Memory Model

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        RAM Layer                            │
│                      (Active Memory)                        │
│                                                             │
│  • Session objects in memory                               │
│  • Fast access (< 1ms)                                     │
│  • Lost on restart                                         │
│  • Limited by available RAM                                │
│                                                             │
│  Usage: Current session data, hot cache                    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ periodic sync
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                     Disk Layer                              │
│                  (Persistent Memory)                        │
│                                                             │
│  • SQLite database or JSON files                           │
│  • Survives restarts                                       │
│  • Access time: 5-50ms                                     │
│  • Limited by disk space (TB scale)                        │
│                                                             │
│  Usage: All sessions, full history                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ sensitive data only
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                      Vault Layer                            │
│                   (Encrypted Memory)                        │
│                                                             │
│  • AES-256-GCM encrypted                                   │
│  • PBKDF2 key derivation                                   │
│  • Access time: 20-100ms (encryption overhead)             │
│  • Separate from regular storage                           │
│                                                             │
│  Usage: API keys, passwords, PII, sensitive data           │
└─────────────────────────────────────────────────────────────┘
```

### Memory Lifecycle

```
Create Session
     │
     ▼
┌──────────┐
│   RAM    │  ← Active session
└─────┬────┘
      │
      │ auto-save
      ▼
┌──────────┐
│   DISK   │  ← Persistent storage
└─────┬────┘
      │
      │ (if sensitive)
      ▼
┌──────────┐
│  VAULT   │  ← Encrypted storage
└──────────┘

Load Session
     │
     ▼
┌──────────┐
│   DISK   │  ← Read from storage
└─────┬────┘
      │
      │ deserialize
      ▼
┌──────────┐
│   RAM    │  ← Load into memory
└──────────┘

Delete Session
     │
     ▼
┌──────────┐
│   RAM    │  ← Remove from memory
└─────┬────┘
      │
      │ delete file
      ▼
┌──────────┐
│   DISK   │  ← Remove from storage
└──────────┘
```

---

## Security Architecture

### Encryption Flow

```
┌────────────────────────────────────────────────────────────┐
│ 1. User provides password                                  │
└───────────────┬────────────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────────────────────────┐
│ 2. PBKDF2 Key Derivation                                  │
│    • 100,000 iterations                                   │
│    • Random salt (16 bytes)                               │
│    • Output: 32-byte key                                  │
└───────────────┬────────────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────────────────────────┐
│ 3. AES-256-GCM Encryption                                 │
│    • 256-bit key (from PBKDF2)                            │
│    • Random IV (12 bytes)                                 │
│    • Authenticated encryption (GCM mode)                  │
│    • Auth tag (16 bytes)                                  │
└───────────────┬────────────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────────────────────────┐
│ 4. Store encrypted blob                                   │
│    • Ciphertext                                           │
│    • IV                                                   │
│    • Auth tag                                             │
│    • Salt                                                 │
└────────────────────────────────────────────────────────────┘
```

### Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│              Application Security Layer                     │
│  • Input validation                                        │
│  • Error handling                                          │
│  • Secure defaults                                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│              Storage Security Layer                         │
│  • File permissions (0600 for databases)                   │
│  • Path traversal protection                               │
│  • Atomic writes                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│            Encryption Security Layer                        │
│  • AES-256-GCM (encryption)                                │
│  • PBKDF2 (key derivation)                                 │
│  • Random IV/salt generation                               │
│  • Memory wiping for keys                                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│            Network Security Layer (Optional)                │
│  • TLS/HTTPS for sync (if enabled)                         │
│  • E2E encryption for multi-device                         │
│  • Certificate pinning                                     │
└─────────────────────────────────────────────────────────────┘
```

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
