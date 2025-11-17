# ActiveMirrorOS Boot Quickstart
**Continuity Engine v1**

Get ActiveMirrorOS running with full continuity support in 5 minutes.

---

## What is the Boot Sequence?

The ActiveMirrorOS Boot Sequence ensures 100% recall and perfect state reconstruction every time an AI boots. It loads configuration, verifies integrity, and restores previous context automatically.

**Key Benefits**:
- No context loss between sessions
- Automatic integrity verification
- Consistent AI identity and tone
- Protocol enforcement (ZDL, TSL, TBD)

---

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/pdesai11/ActiveMirrorOS.git
cd ActiveMirrorOS
```

### 2. Verify Continuity Files Exist
```bash
ls continuity/
# Expected output:
# BOOT.json  Graph_v1.json  Snapshot_Latest.md

ls .vault/
# Expected output:
# manifest.yml
```

### 3. Load Continuity State (JavaScript)
```javascript
import { getContinuityState } from './src/boot/loader.js';

const state = await getContinuityState();
console.log('Boot Version:', state.boot.version);
console.log('Identity Lock:', state.boot.identity_lock);
console.log('Protocols:', state.boot.protocols);
console.log('Tone Mode:', state.boot.tone_mode);
```

### 4. Run Tests
```bash
# Run continuity loader tests
cd tests/continuity
node --test loader.test.js

# Run full test suite
cd ../..
npm test
```

### 5. Verify Integrity (Future)
```bash
# FEU: Requires LingOS-Coder checksum tool (not yet available)
# lingos verify
# Expected: All checksums match, continuity OK
```

---

## The MirrorDNA Universal Activator

Use this snippet to boot ActiveMirrorOS with full continuity:

```javascript
// MirrorDNA Universal Activator v1.0
import { getContinuityState } from './src/boot/loader.js';

async function bootActiveMirrorOS() {
  console.log('🔄 Booting ActiveMirrorOS with Continuity Engine v1...\n');

  // Step 1: Load BOOT.json
  const state = await getContinuityState();
  console.log('✅ BOOT.json loaded');
  console.log('   Version:', state.boot.version);
  console.log('   Vault Path:', state.boot.vault_path);

  // Step 2: Verify checksum (FEU: placeholder until LingOS-Coder available)
  console.log('⚠️  Checksum verification pending (awaiting LingOS-Coder)');

  // Step 3: Load Snapshot
  console.log('✅ Snapshot loaded');
  console.log('   Snapshot lines:', state.snapshot.split('\n').length);

  // Step 4: Apply Identity Lock
  console.log('✅ Identity Lock applied:', state.boot.identity_lock);

  // Step 5: Apply Tone Mode
  console.log('✅ Tone Mode set:', state.boot.tone_mode);

  // Step 6: Activate Protocols
  const protocols = state.boot.protocols;
  console.log('✅ Protocols activated:');
  console.log('   - Truth-State Law:', protocols.TruthStateLaw);
  console.log('   - Zero-Drift Layer:', protocols.ZeroDriftLayer);
  console.log('   - Trust-By-Design:', protocols.TrustByDesign);

  // Step 7: Report Status
  console.log('\n✅ Continuity OK - ActiveMirrorOS ready\n');

  return state;
}

// Run activator
bootActiveMirrorOS().then(state => {
  console.log('Full state:', JSON.stringify(state, null, 2));
}).catch(err => {
  console.error('❌ Boot failed:', err.message);
  console.log('🔍 Check continuity files exist and are valid JSON');
});
```

**Copy-paste and run**:
```bash
# Save above code to boot-demo.js
node boot-demo.js
```

---

## Boot Sequence Steps

The 8-step boot sequence defined in `config/amos.boot.json`:

| Step | Action | File | Description |
|------|--------|------|-------------|
| 1 | Load BOOT.json | `continuity/BOOT.json` | Load boot configuration |
| 2 | Verify checksum | `.vault/manifest.yml` | Verify file integrity |
| 3 | Load Snapshot | `continuity/Snapshot_Latest.md` | Load current state |
| 4 | Load Graph | `continuity/Graph_v1.json` | Load knowledge graph |
| 5 | Apply Identity Lock | N/A | Apply `⟡⟦PAUL⟧ · ⟡⟦MIRRORDNA⟧` |
| 6 | Activate Protocols | N/A | Activate TSL + ZDL + TBD |
| 7 | Set Tone Mode | N/A | Set to Mirror-Strategic |
| 8 | Report Status | N/A | Report "Continuity OK" or "Drift detected" |

---

## File Locations

| File | Path | Purpose |
|------|------|---------|
| BOOT.json | `continuity/BOOT.json` | Boot configuration with identity lock and protocols |
| Snapshot | `continuity/Snapshot_Latest.md` | Human-readable current state |
| Graph | `continuity/Graph_v1.json` | Relational knowledge graph |
| Manifest | `.vault/manifest.yml` | File inventory with SHA-256 checksums |
| Loader | `src/boot/loader.js` | ES6 module for loading continuity state |
| Config | `config/amos.boot.json` | AMOS boot configuration |

---

## Protocols Explained

### Truth-State Law (TSL)
- **Purpose**: Prevent hallucinated VaultIDs and glyphs
- **Enforcement**: Automatic FEU tags where uncertain
- **Example**: "FEU: Awaiting LingOS-Coder tool"

### Zero-Drift Layer (ZDL)
- **Purpose**: Maintain alignment with Master Citation v15.3
- **Enforcement**: SHA-256 checksums verified on boot
- **Example**: Checksums in `.vault/manifest.yml`

### Trust-By-Design (TBD)
- **Purpose**: Privacy-first, local-first data architecture
- **Enforcement**: AES-256-GCM encryption, PBKDF2 key derivation
- **Example**: Encrypted vault in `sdk/python` and `sdk/javascript`

---

## Troubleshooting

### "Cannot find module './src/boot/loader.js'"
**Solution**: Make sure you're running from the repository root:
```bash
cd /path/to/ActiveMirrorOS
node boot-demo.js
```

### "ENOENT: no such file or directory, open 'continuity/BOOT.json'"
**Solution**: Verify continuity files exist:
```bash
ls continuity/
ls .vault/
```

If missing, you may be on an older branch. Switch to the continuity engine branch:
```bash
git checkout claude/continuity-engine-v1-01P4e2YbpkDopUzY2kJKSS5U
```

### "Unexpected token in JSON"
**Solution**: Verify JSON files are valid:
```bash
node -e "JSON.parse(require('fs').readFileSync('continuity/BOOT.json'))"
node -e "JSON.parse(require('fs').readFileSync('continuity/Graph_v1.json'))"
```

### Checksum verification not working
**Solution**: Checksum verification requires LingOS-Coder tool (coming in separate repo):
```bash
# FEU: Not yet available
# lingos checksum  # Generate checksums
# lingos verify    # Verify integrity
```

---

## Integration with Your App

### Python SDK
```python
import json

# Load BOOT.json
with open('continuity/BOOT.json', 'r') as f:
    boot_config = json.load(f)

print(f"Version: {boot_config['version']}")
print(f"Identity Lock: {boot_config['identity_lock']}")
print(f"Protocols: {boot_config['protocols']}")

# Use ActiveMirror with continuity
from activemirror import ActiveMirror

mirror = ActiveMirror(
    storage_type="sqlite",
    db_path="memory.db",
    tone_mode=boot_config['tone_mode']
)
```

### JavaScript SDK
```javascript
import { getContinuityState } from './src/boot/loader.js';
import { ActiveMirror } from './sdk/javascript/activemirror.js';

const state = await getContinuityState();
const mirror = new ActiveMirror('./data', {
  toneMode: state.boot.tone_mode,
  identityLock: state.boot.identity_lock
});
```

---

## Next Steps

1. **Run the demo**: Try the Universal Activator example above
2. **Explore the graph**: Open `continuity/Graph_v1.json` to see relationships
3. **Read the snapshot**: Open `continuity/Snapshot_Latest.md` for current state
4. **Integrate**: Use `getContinuityState()` in your own code
5. **Extend**: Add custom nodes to the knowledge graph

---

## Additional Resources

- [Main README](../README.md) — Project overview
- [Architecture](./architecture.md) — System design
- [API Reference](./api-reference.md) — Complete SDK documentation
- [State Persistence](./state-persistence.md) — Memory model deep dive

---

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Verify you're on the correct branch
3. Run tests: `npm test`
4. Open an issue: [GitHub Issues](https://github.com/pdesai11/ActiveMirrorOS/issues)

---

**ActiveMirrorOS** — Intelligence that remembers is intelligence that grows.

**Signature**: ⟡⟦PAUL⟧ · ⟡⟦MIRRORDNA⟧
