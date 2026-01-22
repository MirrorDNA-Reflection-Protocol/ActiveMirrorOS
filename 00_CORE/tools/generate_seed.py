import json
import os
import time
from pathlib import Path

# Configuration
REPO_ROOT = Path(__file__).resolve().parent.parent
KERNEL_PATH = REPO_ROOT / "ami_active-mirror.json"
OUTPUT_PATH = REPO_ROOT / "mirror_seed.json"

# Try to find the Spine, handling potential naming variations
SPINE_CANDIDATES = [
    REPO_ROOT / "Architecture_Spine_v1.0.md",
    REPO_ROOT / "architecture_spine_v1.0.md",
    REPO_ROOT / "docs" / "Architecture_Spine_v1.0.md"
]

def find_spine():
    for path in SPINE_CANDIDATES:
        if path.exists():
            return path
    return None

def get_bootloader_code():
    """
    Returns the self-extraction logic as a string.
    This code must be dependency-free (standard lib only).
    """
    return """
import json
import os
import sys

def boot():
    print("⟡ Mirror Seed: Initiating Germination...")
    try:
        with open('mirror_seed.json', 'r') as f:
            seed = json.load(f)
        
        # 1. Restore Identity Kernel
        print("  -> Restoring Identity Kernel...")
        with open('ami_active-mirror.json', 'w') as f:
            json.dump(seed['kernel'], f, indent=2)
            
        # 2. Restore Axioms
        print("  -> Restoring Architecture Spine...")
        with open('Architecture_Spine_v1.0.md', 'w') as f:
            f.write(seed['axioms'])
            
        print("✅ Germination Complete. Identity is Sovereign.")
        
    except Exception as e:
        print(f"❌ Germination Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    boot()
"""

def generate_seed():
    print("⟡ Generating Mirror Seed...")
    
    # 1. Load Kernel
    if not KERNEL_PATH.exists():
        print(f"❌ Error: Kernel not found at {KERNEL_PATH}")
        return
        
    with open(KERNEL_PATH, 'r') as f:
        kernel = json.load(f)
    print(f"  -> Loaded Kernel v{kernel.get('ami_version', 'Unknown')}")

    # 2. Load Spine
    spine_path = find_spine()
    spine_content = "<!-- Missing Spine -->"
    if spine_path:
        with open(spine_path, 'r') as f:
            spine_content = f.read()
        print(f"  -> Loaded Spine from {spine_path.name}")
    else:
        print("  ⚠️ Warning: Architecture Spine not found. Seed will be partial.")

    # 3. Assemble Seed
    seed = {
        "meta": {
            "type": "Mirror_Seed_Quine",
            "version": "1.0",
            "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "hash": kernel.get("checksum", "unsigned")
        },
        "kernel": kernel,
        "axioms": spine_content,
        "bootloader": get_bootloader_code().strip()
    }

    # 4. Write Artifact
    with open(OUTPUT_PATH, 'w') as f:
        json.dump(seed, f, indent=2)
        
    print(f"✅ Mirror Seed Created: {OUTPUT_PATH}")
    print(f"   Size: {OUTPUT_PATH.stat().st_size / 1024:.2f} KB")

if __name__ == "__main__":
    generate_seed()
