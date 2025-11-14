#!/usr/bin/env python3
"""
Generate Demo Package

This script creates a distributable demo package containing:
- Root README.md
- /demo/ folder (complete demo app)
- /onboarding/ documentation
- /sdk/ starter files

Output: dist/active-mirror-demo-kit.zip

Usage:
    python scripts/generate_demo_package.py
    python scripts/generate_demo_package.py --output custom-name.zip
"""

import argparse
import os
import shutil
import sys
from datetime import datetime
from pathlib import Path
import zipfile


class DemoPackageGenerator:
    """Generates a distributable demo package for ActiveMirrorOS."""

    def __init__(self, repo_root, output_dir="dist", output_name=None):
        self.repo_root = Path(repo_root)
        self.output_dir = self.repo_root / output_dir
        self.output_name = output_name or f"active-mirror-demo-kit-{datetime.now().strftime('%Y%m%d')}.zip"
        self.output_path = self.output_dir / self.output_name
        self.temp_dir = self.output_dir / "temp_package"

    def clean_temp(self):
        """Remove temporary directory if it exists."""
        if self.temp_dir.exists():
            shutil.rmtree(self.temp_dir)

    def create_directories(self):
        """Create output and temporary directories."""
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.temp_dir.mkdir(parents=True, exist_ok=True)
        print(f"✓ Created temporary directory: {self.temp_dir}")

    def copy_readme(self):
        """Copy root README.md."""
        src = self.repo_root / "README.md"
        dst = self.temp_dir / "README.md"
        if src.exists():
            shutil.copy2(src, dst)
            print(f"✓ Copied README.md")
        else:
            print(f"⚠ README.md not found at {src}")

    def copy_demo(self):
        """Copy entire demo folder."""
        src = self.repo_root / "demo"
        dst = self.temp_dir / "demo"
        if src.exists():
            shutil.copytree(src, dst, ignore=shutil.ignore_patterns(
                '__pycache__', '*.pyc', 'venv', 'logs', '*.db'
            ))
            print(f"✓ Copied demo/ folder")
        else:
            print(f"⚠ demo/ folder not found at {src}")

    def copy_onboarding(self):
        """Copy entire onboarding folder."""
        src = self.repo_root / "onboarding"
        dst = self.temp_dir / "onboarding"
        if src.exists():
            shutil.copytree(src, dst)
            print(f"✓ Copied onboarding/ folder")
        else:
            print(f"⚠ onboarding/ folder not found at {src}")

    def copy_sdk_starters(self):
        """Copy SDK starter files."""
        sdk_dst = self.temp_dir / "sdk"
        sdk_dst.mkdir(parents=True, exist_ok=True)

        files_to_copy = [
            "python_starter.py",
            "javascript_starter.js",
            "api_examples.md",
            "local_llm_integration.md"
        ]

        for filename in files_to_copy:
            src = self.repo_root / "sdk" / filename
            dst = sdk_dst / filename
            if src.exists():
                shutil.copy2(src, dst)
                print(f"✓ Copied sdk/{filename}")
            else:
                print(f"⚠ sdk/{filename} not found")

    def copy_docs_subset(self):
        """Copy key documentation files."""
        docs_dst = self.temp_dir / "docs"
        docs_dst.mkdir(parents=True, exist_ok=True)

        docs_to_copy = [
            "product_overview.md",
            "quickstart.md",
            "faq.md",
            "troubleshooting.md",
        ]

        for filename in docs_to_copy:
            src = self.repo_root / "docs" / filename
            dst = docs_dst / filename
            if src.exists():
                shutil.copy2(src, dst)
                print(f"✓ Copied docs/{filename}")
            else:
                # Try onboarding folder
                src_alt = self.repo_root / "onboarding" / filename
                if src_alt.exists():
                    shutil.copy2(src_alt, dst)
                    print(f"✓ Copied onboarding/{filename} to docs/")

    def copy_license(self):
        """Copy LICENSE file."""
        src = self.repo_root / "LICENSE"
        dst = self.temp_dir / "LICENSE"
        if src.exists():
            shutil.copy2(src, dst)
            print(f"✓ Copied LICENSE")

    def create_quickstart_guide(self):
        """Create a QUICKSTART.txt with 3-step instructions."""
        content = """
════════════════════════════════════════════════════════════
    ActiveMirrorOS Demo Kit - Quick Start Guide
════════════════════════════════════════════════════════════

Thank you for trying ActiveMirrorOS!

This package contains everything you need to get started in 3 steps:


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: Run the Demo (2 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Navigate to the demo folder:

    cd demo

Create a virtual environment:

    python3 -m venv venv
    source venv/bin/activate       # On Windows: venv\\Scripts\\activate

Install dependencies (just PyYAML):

    pip install -r requirements.txt

Run the demo:

    python demo_app.py

This will show you a working example of reflective AI with
persistent memory. Try interactive mode too:

    python demo_app.py interactive


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2: Read the Documentation (5 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Start here:

1. README.md (in root folder)
   → Product overview and ecosystem context

2. onboarding/getting_started.md
   → Step-by-step tutorial for the full SDK

3. docs/product_overview.md
   → Non-technical introduction

4. docs/faq.md
   → Common questions answered


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3: Try the SDK Starters (15 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For the full SDK experience, clone the repository:

    git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
    cd ActiveMirrorOS

Install the Python SDK:

    cd sdk/python
    pip install -e .

Run SDK starter examples:

    cd ../..
    python sdk/python_starter.py

Or explore JavaScript starter:

    node sdk/javascript_starter.js


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
What's Included
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 README.md               → Product landing page
📁 demo/                   → Working demo application
📁 onboarding/             → Getting started guides
📁 sdk/                    → SDK starter examples
📁 docs/                   → Key documentation
📄 LICENSE                 → MIT License


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Need Help?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• GitHub Issues:
  https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues

• GitHub Discussions:
  https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions

• Documentation:
  See onboarding/ and docs/ folders

• Troubleshooting:
  onboarding/troubleshooting.md


════════════════════════════════════════════════════════════
Built with ❤️ by the MirrorDNA-Reflection-Protocol team
Open Source • MIT License • Community-Driven
════════════════════════════════════════════════════════════
"""
        quickstart_path = self.temp_dir / "QUICKSTART.txt"
        with open(quickstart_path, 'w') as f:
            f.write(content.strip() + '\n')
        print(f"✓ Created QUICKSTART.txt")

    def create_manifest(self):
        """Create MANIFEST.txt with file listing."""
        manifest_path = self.temp_dir / "MANIFEST.txt"

        with open(manifest_path, 'w') as f:
            f.write("ActiveMirrorOS Demo Kit - File Manifest\n")
            f.write("=" * 60 + "\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")

            # Walk temp directory and list all files
            for root, dirs, files in os.walk(self.temp_dir):
                # Skip manifest itself
                if root == str(self.temp_dir) and "MANIFEST.txt" in files:
                    files.remove("MANIFEST.txt")

                level = root.replace(str(self.temp_dir), '').count(os.sep)
                indent = '  ' * level
                rel_path = os.path.relpath(root, self.temp_dir)
                if rel_path != '.':
                    f.write(f"{indent}{os.path.basename(root)}/\n")
                sub_indent = '  ' * (level + 1)
                for file in sorted(files):
                    f.write(f"{sub_indent}{file}\n")

        print(f"✓ Created MANIFEST.txt")

    def create_zip(self):
        """Create ZIP archive of the demo package."""
        if self.output_path.exists():
            self.output_path.unlink()

        with zipfile.ZipFile(self.output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(self.temp_dir):
                for file in files:
                    file_path = Path(root) / file
                    arcname = file_path.relative_to(self.temp_dir)
                    zipf.write(file_path, arcname)

        print(f"\n✅ Created demo package: {self.output_path}")

        # Get file size
        size_mb = self.output_path.stat().st_size / (1024 * 1024)
        print(f"   Size: {size_mb:.2f} MB")

    def generate(self):
        """Main generation workflow."""
        print("=" * 60)
        print("ActiveMirrorOS Demo Package Generator")
        print("=" * 60)
        print()

        try:
            # Clean up previous temp directory
            self.clean_temp()

            # Create directories
            self.create_directories()

            # Copy files
            print("\nCopying files...")
            self.copy_readme()
            self.copy_demo()
            self.copy_onboarding()
            self.copy_sdk_starters()
            self.copy_docs_subset()
            self.copy_license()

            # Create additional files
            print("\nGenerating additional files...")
            self.create_quickstart_guide()
            self.create_manifest()

            # Create ZIP
            print("\nCreating ZIP archive...")
            self.create_zip()

            # Clean up temp directory
            print("\nCleaning up...")
            self.clean_temp()
            print("✓ Removed temporary files")

            print("\n" + "=" * 60)
            print("SUCCESS!")
            print("=" * 60)
            print(f"\nDemo package created at: {self.output_path}")
            print("\nTo test:")
            print(f"  1. unzip {self.output_path.name}")
            print(f"  2. cd {self.output_path.stem}")
            print("  3. cat QUICKSTART.txt")
            print()

            return True

        except Exception as e:
            print(f"\n❌ Error: {e}")
            import traceback
            traceback.print_exc()
            return False


def main():
    parser = argparse.ArgumentParser(
        description='Generate ActiveMirrorOS demo package'
    )
    parser.add_argument(
        '--output',
        help='Output filename (default: active-mirror-demo-kit-YYYYMMDD.zip)',
        default=None
    )
    parser.add_argument(
        '--output-dir',
        help='Output directory (default: dist/)',
        default='dist'
    )

    args = parser.parse_args()

    # Determine repository root (go up from scripts/)
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent

    # Verify we're in the right place
    if not (repo_root / "README.md").exists():
        print("❌ Error: Could not find repository root")
        print(f"   Expected README.md at: {repo_root / 'README.md'}")
        sys.exit(1)

    # Generate package
    generator = DemoPackageGenerator(
        repo_root=repo_root,
        output_dir=args.output_dir,
        output_name=args.output
    )

    success = generator.generate()
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
