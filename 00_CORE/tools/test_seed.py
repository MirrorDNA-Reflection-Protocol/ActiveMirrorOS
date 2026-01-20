import json
import os
import hashlib
import shutil
from pathlib import Path

# Configuration
REPO_ROOT = Path(__file__).resolve().parent.parent
SEED_PATH = REPO_ROOT / "mirror_seed.json"
TEST_DIR = REPO_ROOT / "temp_germination_test"

# Allowed bootloader operations (restrict dangerous builtins)
SAFE_BUILTINS = {
    'print': print,
    'open': open,
    'str': str,
    'int': int,
    'len': len,
    'range': range,
    'dict': dict,
    'list': list,
    'True': True,
    'False': False,
    'None': None,
}

# Known safe bootloader hashes (add verified hashes here)
TRUSTED_BOOTLOADER_HASHES = set()


def validate_bootloader(code: str) -> bool:
    """Validate bootloader code before execution."""
    # Check hash against known-good versions
    code_hash = hashlib.sha256(code.encode()).hexdigest()

    if TRUSTED_BOOTLOADER_HASHES and code_hash not in TRUSTED_BOOTLOADER_HASHES:
        print(f"  ⚠ WARNING: Bootloader hash not in trusted set: {code_hash[:16]}...")
        # In strict mode, return False here

    # Block dangerous patterns
    dangerous_patterns = [
        'import subprocess',
        'import socket',
        '__import__',
        'eval(',
        'compile(',
        'globals(',
        'locals(',
        'getattr(',
        'setattr(',
        'delattr(',
        '__builtins__',
        'os.system',
        'os.popen',
        'os.exec',
    ]

    for pattern in dangerous_patterns:
        if pattern in code:
            print(f"  ❌ BLOCKED: Dangerous pattern detected: {pattern}")
            return False

    return True


def test_germination():
    print("⟡ Verifying Mirror Seed Germination...")

    if not SEED_PATH.exists():
        print(f"❌ Error: Seed not found at {SEED_PATH}")
        return

    # 1. Setup Test Environment
    if TEST_DIR.exists():
        shutil.rmtree(TEST_DIR)
    TEST_DIR.mkdir()

    # Copy seed to test dir
    shutil.copy(SEED_PATH, TEST_DIR / "mirror_seed.json")

    os.chdir(TEST_DIR)
    print(f"  -> Environment: {TEST_DIR}")

    # 2. Extract and Validate Bootloader
    with open('mirror_seed.json', 'r') as f:
        seed = json.load(f)

    bootloader_code = seed.get('bootloader')
    if not bootloader_code:
        print("❌ Error: No bootloader found in seed!")
        return

    # Security: Validate before execution
    if not validate_bootloader(bootloader_code):
        print("❌ Error: Bootloader failed security validation!")
        return

    print("  -> Executing Bootloader (sandboxed)...")
    try:
        # Execute in restricted namespace
        exec(bootloader_code, {"__builtins__": SAFE_BUILTINS}, {})
    except Exception as e:
        print(f"❌ Bootloader Crashed: {e}")
        return

    # 3. Verify Files
    kernel_ok = Path("ami_active-mirror.json").exists()
    spine_ok = Path("Architecture_Spine_v1.0.md").exists()
    
    if kernel_ok and spine_ok:
        print("\n✅ VERIFICATION PASSED: Quine successfully replicated.")
        print("   - Kernel: OK")
        print("   - Spine: OK")
    else:
        print("\n❌ VERIFICATION FAILED: Missing files.")
    
    # Cleanup
    # shutil.rmtree(TEST_DIR) # Commented out to allow inspection if needed

if __name__ == "__main__":
    test_germination()
