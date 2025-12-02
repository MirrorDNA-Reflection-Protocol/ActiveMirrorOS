# Continuity Engine v1 Implementation Plan
**Repository**: ActiveMirrorOS
**Date**: 2025-11-17
**Author**: Claude (Active MirrorOS)

---

## Objective
Implement permanent continuity layer for ActiveMirrorOS to ensure 100% recall and perfect state reconstruction on every AI boot. This is the third repository in the execution order (after LingOS-Coder and MirrorDNA-Standard).

---

## Current State Analysis
- Repository has SDKs (Python + JavaScript), example apps, and documentation
- Uses Node.js 18+ with ES modules, built-in test runner
- Currently references Master Citation v15.2, will upgrade to v15.3
- No existing continuity infrastructure (`.vault/`, `continuity/`, `config/`, `src/` directories)

---

## Implementation Strategy

### Phase 1: Core Continuity Files
Create the foundational continuity layer:

1. **`.vault/manifest.yml`** — File inventory with SHA-256 checksums
   - Lists all tracked files with placeholder checksums
   - Provides deterministic integrity verification
   - Why: Central registry for vault state tracking

2. **`continuity/BOOT.json`** — Boot configuration
   - Fields: version, vault_path, checksum, active_snapshot, identity_lock, tone_mode, twins, protocols, last_synced
   - Why: Single source of truth for AI initialization state

3. **`continuity/Snapshot_Latest.md`** — Human-readable state snapshot
   - Template for current system state
   - Why: Quick reference for continuity verification

4. **`continuity/Graph_v1.json`** — Relational knowledge graph
   - Seed nodes and relations between continuity components
   - Why: Structured representation of system relationships

### Phase 2: ActiveMirrorOS-Specific Configuration
Integrate continuity into the product layer:

5. **`config/amos.boot.json`** — AMOS boot configuration
   - Points to continuity files
   - Product-layer settings
   - Why: Bridge between continuity layer and AMOS product logic

6. **`docs/Boot_Quickstart.md`** — Developer quickstart guide
   - 5-minute setup for continuity layer
   - Copy-paste examples
   - Why: Lower barrier to adoption

7. **`src/boot/loader.js`** — Continuity loader module (ES6)
   - `getContinuityState()` function
   - Reads BOOT + Snapshot
   - Validates checksums
   - Why: Programmatic access to continuity state

### Phase 3: Quality Assurance
Ensure reliability and maintainability:

8. **`tests/continuity/loader.test.js`** — Unit tests
   - Test loader functionality
   - Test checksum validation
   - Test error handling
   - Why: Prevent regressions, ensure correctness

9. **`.github/workflows/validate.yml`** — CI pipeline
   - Run formatting checks
   - Run unit tests
   - Run continuity validation
   - Why: Automated quality gates

### Phase 4: Documentation & Integration

10. **Update `README.md`** — Add Boot Sequence section
    - Universal Activator snippet
    - Link to Boot_Quickstart.md
    - Why: Visible entry point for new users

---

## File Tree (After Implementation)

```
ActiveMirrorOS/
├── .github/
│   └── workflows/
│       └── validate.yml          [NEW] CI validation pipeline
├── .vault/
│   └── manifest.yml              [NEW] File inventory + checksums
├── config/
│   └── amos.boot.json            [NEW] AMOS boot configuration
├── continuity/
│   ├── BOOT.json                 [NEW] Boot state
│   ├── Snapshot_Latest.md        [NEW] Current state snapshot
│   └── Graph_v1.json             [NEW] Knowledge graph
├── docs/
│   ├── Boot_Quickstart.md        [NEW] Quickstart guide
│   └── [existing docs]
├── src/
│   └── boot/
│       └── loader.js             [NEW] Continuity loader (ES6)
├── tests/
│   └── continuity/
│       └── loader.test.js        [NEW] Loader unit tests
├── PLAN.md                       [NEW] This document
└── README.md                     [MODIFIED] Add Boot Sequence section
```

---

## Acceptance Criteria

1. **Functional**:
   - `node src/boot/loader.js` successfully loads and prints continuity state
   - `getContinuityState()` returns complete BOOT + Snapshot data
   - Checksum validation works correctly

2. **Quality**:
   - All tests pass: `npm test`
   - CI workflow runs and passes
   - No linting errors

3. **Documentation**:
   - README includes 5-step "Vault Open → Boot" flow
   - Boot_Quickstart.md provides clear setup instructions
   - All files include FEU tags where uncertain

4. **Integration**:
   - Files reference Master Citation v15.3
   - Identity Lock: ⟡⟦PAUL⟧ · ⟡⟦MIRRORDNA⟧
   - Protocols: TruthStateLaw + ZeroDriftLayer + TrustByDesign

---

## Testing Plan

### Unit Tests
- `tests/continuity/loader.test.js`:
  - Test `getContinuityState()` returns expected structure
  - Test file reading error handling
  - Test JSON parsing error handling
  - Test checksum validation (when implemented)

### Integration Tests
- Run full suite: `cd sdk/javascript && npm test`
- Verify no regressions to existing functionality

### Manual Validation
- Verify BOOT.json can be manually loaded and parsed
- Verify Graph_v1.json has valid JSON structure
- Verify all paths in amos.boot.json resolve correctly

---

## Execution Steps

1. Create directory structure: `.vault/`, `config/`, `continuity/`, `src/boot/`, `tests/continuity/`, `.github/workflows/`
2. Write core continuity files (BOOT, Snapshot, Graph, manifest)
3. Write AMOS-specific config and docs
4. Implement loader.js with getContinuityState()
5. Write comprehensive unit tests
6. Create CI validation workflow
7. Update README with Boot Sequence section
8. Run tests and verify all pass
9. Generate manifest checksums (placeholder for MVP)
10. Commit with message: `feat(continuity): add BOOT.json, Snapshot, Graph, loader, docs, CI`
11. Push to branch: `claude/continuity-engine-v1-01P4e2YbpkDopUzY2kJKSS5U`

---

## Dependencies
- None (uses Node.js built-in modules: `fs`, `path`)
- Tests use Node.js built-in test runner (Node 18+)
- CI uses GitHub Actions (standard)

---

## Budget & Optimization
- **Target**: $60 max across all 3 repos
- **Strategy**:
  - Minimal external dependencies
  - Reuse existing test infrastructure
  - Clear, concise documentation
  - Single-pass implementation (no refactoring)

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Tests fail | Use same test runner as existing tests (node --test) |
| CI doesn't run | Follow existing workflow patterns (none exist yet, create minimal) |
| Integration breaks | No changes to existing SDK code, purely additive |
| Checksum collisions | Use SHA-256 (industry standard, collision-resistant) |

---

## Post-Implementation Checklist

- [ ] All files created
- [ ] Tests pass locally
- [ ] CI workflow validates successfully
- [ ] README updated with Boot Sequence
- [ ] No FEU violations (only tags where uncertain)
- [ ] Checksums generated in manifest
- [ ] Git commit message follows convention
- [ ] Branch pushed to remote
- [ ] PLAN.md archived for reference

---

## Notes
- This is an MVP implementation (v1)
- Future versions may add: automatic checksum updates, drift detection, snapshot diffs
- Designed to work standalone but integrates with LingOS-Coder tools and MirrorDNA-Standard specs

---

**Status**: Ready for execution
**Signature**: ⟡⟦PAUL⟧ · ⟡⟦MIRRORDNA⟧
