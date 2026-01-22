---
title: Architecture Spine v1.0
vault_id: AMOS://Architecture/Spine/v1.0
status: Canonical
date: 2025-12-12
---

# Architecture Spine v1.0

**Status:** Canonical  
**Version:** 1.0  
**Vault Path:** `ActiveMirrorOS/00_CORE/Architecture_Spine_v1.0.md`

---

## Overview

The Architecture Spine defines the layered structure of Active MirrorOS — a sovereign AI operating system built on MirrorDNA principles. Each layer has explicit responsibilities and boundaries.

---

## Layer Definitions

### L1 — Identity Kernel (AMI)
**Repository:** `active-mirror-identity`  
**Role:** Sovereign identity core. Holds tone, values, biographical truth, and personality anchors.  
**Constraints:**
- Immutable within session
- Source of "Who am I?"
- No inference — only declared facts

### L2 — Protocol Layer (MirrorDNA Standard)
**Repository:** `MirrorDNA-Standard`  
**Role:** Defines behavioral protocols, glyph grammar, and interaction rules.  
**Constraints:**
- Version-locked to Master Citation
- Glyph system enforcement
- Truth-State Law (Fact/Estimate/Unknown)

### L3 — Boundary Layer
**Role:** Security and permission boundary between identity and external systems.  
**Constraints:**
- No external data crosses without validation
- Rate limiting and access control
- Audit trail for all boundary crossings

### L4 — Reflection & Memory (SCD + Vault)
**Components:** SCD Protocol v3.1, Semantic Vault, MirrorMemory  
**Role:** Deterministic state protocol ensuring unforgeable memory chains.  
**Constraints:**
- Vault is source of truth
- SCD enforces turn-by-turn state integrity
- Memory retrieval prioritizes: Vault → Drive → Local Cache

### L5 — Orchestration & Execution (MirrorBrain)
**Repository:** `MirrorBrain-Setup`  
**Role:** Local orchestration runtime. Coordinates inference, RAG, and API endpoints.  
**Constraints:**
- Must boot with valid L1 identity
- Blocks all requests if identity fails
- Drift detection active

---

## Cross-Layer Rules

1. **Identity flows down:** L1 defines identity; lower layers consume but never modify.
2. **State flows up:** L4/L5 generate state; L1 remains pure.
3. **Boundary is sacred:** L3 mediates all external interactions.
4. **Zero Drift:** No layer may hallucinate capabilities, history, or facts.
5. **Vault Supremacy:** When conflict exists, Vault wins over inference.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-12 | Initial canonical release |

---

⟡ This document is the structural authority for Active MirrorOS. ⟡
