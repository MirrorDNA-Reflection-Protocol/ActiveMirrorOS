#!/usr/bin/env python3
"""
ActiveMirrorOS Demo Package Generator

Generates a complete demo kit with documentation, samples, and starter code.
Perfect for sharing with new users, workshops, or onboarding.

Usage:
    python scripts/generate_demo_package.py
    python scripts/generate_demo_package.py --output ./my-demo-kit
    python scripts/generate_demo_package.py --format zip
    python scripts/generate_demo_package.py --include-examples
"""

import os
import shutil
import zipfile
import tarfile
import json
import argparse
from pathlib import Path
from datetime import datetime


class DemoPackageGenerator:
    """Generates comprehensive demo packages for ActiveMirrorOS"""

    def __init__(self, output_dir="demo_kit", format="directory"):
        self.output_dir = Path(output_dir)
        self.format = format
        self.repo_root = Path(__file__).parent.parent
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    def generate(self, include_examples=False):
        """Generate the complete demo package"""
        print("=" * 60)
        print("ActiveMirrorOS Demo Package Generator")
        print("=" * 60)
        print()

        # Create output directory
        demo_dir = self.output_dir / f"activemirror_demo_{self.timestamp}"
        demo_dir.mkdir(parents=True, exist_ok=True)

        print(f"📦 Creating demo package in: {demo_dir}")
        print()

        # Generate sections
        self._create_readme(demo_dir)
        self._copy_documentation(demo_dir)
        self._copy_demos(demo_dir)
        self._copy_onboarding(demo_dir)
        self._copy_starters(demo_dir)

        if include_examples:
            self._copy_examples(demo_dir)

        self._create_quickstart(demo_dir)
        self._create_manifest(demo_dir)

        # Package if needed
        if self.format != "directory":
            archive_path = self._create_archive(demo_dir)
            print(f"\n✅ Demo package created: {archive_path}")
            print(f"   Size: {self._get_size(archive_path)}")
        else:
            print(f"\n✅ Demo package created: {demo_dir}")
            print(f"   Size: {self._get_directory_size(demo_dir)}")

        print()
        self._print_summary(demo_dir)

    def _create_readme(self, demo_dir):
        """Create main README for the demo package"""
        print("📄 Creating README...")

        content = f"""# ActiveMirrorOS Demo Kit

**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
**Version:** 0.2.0

Welcome to the ActiveMirrorOS demo kit! This package contains everything you need to get started with ActiveMirrorOS.

---

## What's Included

### Documentation
- **Product Overview** — What is ActiveMirrorOS and why use it?
- **Getting Started** — Install and run your first session in 10 minutes
- **API Reference** — Complete SDK documentation
- **FAQ** — Common questions answered
- **Troubleshooting** — Solutions to common issues

### Demos
- **Conversation Demo** — Week-long journaling example
- **Reflective AI Demo** — LingOS Lite showcase
- **Continuity Demo** — Year-long product development journey

### Starter Code
- **Python Starter** — Complete examples in Python
- **JavaScript Starter** — Complete examples in JavaScript
- **API Examples** — REST API integration patterns
- **Local LLM Integration** — Use with Ollama, LM Studio, etc.
- **cURL Examples** — HTTP API testing

### Quick Start Guide
- **QUICKSTART.md** — 5-minute getting started guide

---

## Quick Start (2 Minutes)

### Python
```bash
# Install
pip install git+https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git#subdirectory=sdk/python

# Try it
python starters/python_starter.py
```

### JavaScript
```bash
# Install
npm install MirrorDNA-Reflection-Protocol/ActiveMirrorOS#sdk/javascript

# Try it
node starters/javascript_starter.js
```

---

## Directory Structure

```
activemirror_demo_{self.timestamp}/
├── README.md                   # This file
├── QUICKSTART.md               # 5-minute guide
├── manifest.json               # Package metadata
├── docs/                       # Complete documentation
│   ├── product_overview.md
│   ├── api-reference.md
│   ├── faq.md
│   ├── architecture.md
│   ├── roadmap.md
│   └── pricing.md
├── demo/                       # Demo conversations
│   ├── demo_conversation.md
│   ├── demo_reflective_ai.md
│   └── demo_continuity_showcase.md
├── onboarding/                 # Getting started guides
│   ├── getting_started.md
│   ├── install_lingos_lite.md
│   ├── upgrade_to_lingos_pro.md
│   ├── glossary.md
│   └── troubleshooting.md
└── starters/                   # Starter code
    ├── python_starter.py
    ├── javascript_starter.js
    ├── api_examples.md
    ├── local_llm_integration.md
    └── curl_examples.sh
```

---

## Next Steps

1. **Read the Quickstart:** Open `QUICKSTART.md`
2. **Install the SDK:** Choose Python or JavaScript
3. **Run starter code:** `python starters/python_starter.py`
4. **Explore demos:** Read `demo/demo_conversation.md`
5. **Read the docs:** Browse `docs/product_overview.md`

---

## Resources

- **GitHub:** https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS
- **Issues:** https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues
- **Discussions:** https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions

---

## Support

**Community Support:**
- GitHub Discussions (free)
- GitHub Issues (bug reports)

**Documentation:**
- `docs/` folder in this kit
- Online: https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS

---

**ActiveMirrorOS** — AI that remembers. AI that grows. AI that's yours.

Copyright © 2025 MirrorDNA-Reflection-Protocol | MIT License
"""

        (demo_dir / "README.md").write_text(content)

    def _create_quickstart(self, demo_dir):
        """Create quickstart guide"""
        print("⚡ Creating QUICKSTART...")

        content = """# ActiveMirrorOS 5-Minute Quickstart

Get up and running with ActiveMirrorOS in 5 minutes.

---

## Step 1: Install (1 minute)

**Python:**
```bash
pip install git+https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git#subdirectory=sdk/python
```

**JavaScript:**
```bash
npm install MirrorDNA-Reflection-Protocol/ActiveMirrorOS#sdk/javascript
```

---

## Step 2: Create Your First Session (2 minutes)

**Python:**
```python
from activemirror import ActiveMirror

# Create mirror
mirror = ActiveMirror(storage_type="sqlite", db_path="quickstart.db")

# Create session
session = mirror.create_session("my-first-session")

# Add messages
session.add_message("user", "Hello ActiveMirrorOS!")
session.add_message("assistant", "Hi! I'll remember this conversation.")

# View context
print(session.get_context())
```

**JavaScript:**
```javascript
const { ActiveMirror } = require('activemirror');

// Create mirror
const mirror = new ActiveMirror('./quickstart-data');

// Create session
const session = mirror.createSession('my-first-session');

// Add messages
session.addMessage('user', 'Hello ActiveMirrorOS!');
session.addMessage('assistant', 'Hi! I will remember this conversation.');

// View context
console.log(session.messages);
```

---

## Step 3: Verify Persistence (1 minute)

Close your Python/Node session and restart, then:

**Python:**
```python
from activemirror import ActiveMirror

mirror = ActiveMirror(storage_type="sqlite", db_path="quickstart.db")
session = mirror.load_session("my-first-session")
print(session.get_context())  # Your messages are still there!
```

**JavaScript:**
```javascript
const { ActiveMirror } = require('activemirror');

const mirror = new ActiveMirror('./quickstart-data');
const session = mirror.loadSession('my-first-session');
console.log(session.messages);  // Your messages are still there!
```

---

## Step 4: Explore (1 minute)

**Try the starter examples:**
```bash
# Python
python starters/python_starter.py

# JavaScript
node starters/javascript_starter.js
```

**Read the demos:**
- `demo/demo_conversation.md` — Week-long journaling
- `demo/demo_reflective_ai.md` — Reflective dialogue
- `demo/demo_continuity_showcase.md` — Year-long journey

---

## Next Steps

1. **Read:** `docs/product_overview.md`
2. **Learn:** `onboarding/getting_started.md`
3. **Build:** Use `starters/` as templates
4. **Integrate:** See `starters/api_examples.md`
5. **Local LLM:** Read `starters/local_llm_integration.md`

---

**Congratulations!** You just created persistent AI memory in 5 minutes.

**ActiveMirrorOS** — Memory that never forgets.
"""

        (demo_dir / "QUICKSTART.md").write_text(content)

    def _copy_documentation(self, demo_dir):
        """Copy documentation files"""
        print("📚 Copying documentation...")

        docs_src = self.repo_root / "docs"
        docs_dst = demo_dir / "docs"
        docs_dst.mkdir(exist_ok=True)

        docs_to_copy = [
            "product_overview.md",
            "api-reference.md",
            "faq.md",
            "architecture.md",
            "roadmap.md",
            "pricing.md",
            "quickstart.md",
            "state-persistence.md",
            "reflective-behaviors.md"
        ]

        for doc in docs_to_copy:
            src = docs_src / doc
            if src.exists():
                shutil.copy2(src, docs_dst / doc)

    def _copy_demos(self, demo_dir):
        """Copy demo files"""
        print("🎭 Copying demos...")

        demo_src = self.repo_root / "demo"
        demo_dst = demo_dir / "demo"

        if demo_src.exists():
            shutil.copytree(demo_src, demo_dst, dirs_exist_ok=True)

    def _copy_onboarding(self, demo_dir):
        """Copy onboarding guides"""
        print("🚀 Copying onboarding guides...")

        onboarding_src = self.repo_root / "onboarding"
        onboarding_dst = demo_dir / "onboarding"

        if onboarding_src.exists():
            shutil.copytree(onboarding_src, onboarding_dst, dirs_exist_ok=True)

    def _copy_starters(self, demo_dir):
        """Copy starter code"""
        print("💻 Copying starter code...")

        starters_src = self.repo_root / "starters"
        starters_dst = demo_dir / "starters"

        if starters_src.exists():
            shutil.copytree(starters_src, starters_dst, dirs_exist_ok=True)

    def _copy_examples(self, demo_dir):
        """Copy example code"""
        print("📝 Copying examples...")

        examples_src = self.repo_root / "examples"
        examples_dst = demo_dir / "examples"

        if examples_src.exists():
            shutil.copytree(examples_src, examples_dst, dirs_exist_ok=True)

    def _create_manifest(self, demo_dir):
        """Create package manifest"""
        print("📋 Creating manifest...")

        manifest = {
            "name": "ActiveMirrorOS Demo Kit",
            "version": "0.2.0",
            "generated": datetime.now().isoformat(),
            "description": "Complete demo package for ActiveMirrorOS",
            "contents": {
                "documentation": [
                    "docs/product_overview.md",
                    "docs/api-reference.md",
                    "docs/faq.md",
                    "docs/architecture.md"
                ],
                "demos": [
                    "demo/demo_conversation.md",
                    "demo/demo_reflective_ai.md",
                    "demo/demo_continuity_showcase.md"
                ],
                "starters": [
                    "starters/python_starter.py",
                    "starters/javascript_starter.js",
                    "starters/api_examples.md"
                ],
                "onboarding": [
                    "onboarding/getting_started.md",
                    "onboarding/troubleshooting.md"
                ]
            },
            "quick_start": {
                "python": "pip install git+https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git#subdirectory=sdk/python",
                "javascript": "npm install MirrorDNA-Reflection-Protocol/ActiveMirrorOS#sdk/javascript"
            },
            "links": {
                "github": "https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS",
                "issues": "https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues",
                "discussions": "https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions"
            }
        }

        (demo_dir / "manifest.json").write_text(json.dumps(manifest, indent=2))

    def _create_archive(self, demo_dir):
        """Create zip or tar archive"""
        base_name = demo_dir.name

        if self.format == "zip":
            archive_path = demo_dir.parent / f"{base_name}.zip"
            print(f"\n📦 Creating ZIP archive...")

            with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as zf:
                for root, dirs, files in os.walk(demo_dir):
                    for file in files:
                        file_path = Path(root) / file
                        arcname = file_path.relative_to(demo_dir.parent)
                        zf.write(file_path, arcname)

            # Remove directory after archiving
            shutil.rmtree(demo_dir)
            return archive_path

        elif self.format == "tar.gz":
            archive_path = demo_dir.parent / f"{base_name}.tar.gz"
            print(f"\n📦 Creating TAR.GZ archive...")

            with tarfile.open(archive_path, 'w:gz') as tf:
                tf.add(demo_dir, arcname=demo_dir.name)

            # Remove directory after archiving
            shutil.rmtree(demo_dir)
            return archive_path

        return demo_dir

    def _get_size(self, path):
        """Get human-readable file size"""
        size = path.stat().st_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"

    def _get_directory_size(self, path):
        """Get human-readable directory size"""
        total = sum(f.stat().st_size for f in path.rglob('*') if f.is_file())
        for unit in ['B', 'KB', 'MB', 'GB']:
            if total < 1024.0:
                return f"{total:.1f} {unit}"
            total /= 1024.0
        return f"{total:.1f} TB"

    def _print_summary(self, demo_dir):
        """Print generation summary"""
        file_count = sum(1 for _ in demo_dir.rglob('*') if _.is_file())

        print("=" * 60)
        print("Summary")
        print("=" * 60)
        print(f"Files created: {file_count}")
        print(f"Format: {self.format}")
        print()
        print("Contents:")
        print("  ✅ README.md (main documentation)")
        print("  ✅ QUICKSTART.md (5-minute guide)")
        print("  ✅ docs/ (complete documentation)")
        print("  ✅ demo/ (example conversations)")
        print("  ✅ onboarding/ (getting started guides)")
        print("  ✅ starters/ (starter code)")
        print("  ✅ manifest.json (package metadata)")
        print()
        print("Next steps:")
        print("  1. Share this package with new users")
        print("  2. Use in workshops or tutorials")
        print("  3. Include in onboarding materials")
        print("  4. Distribute at conferences or events")
        print()


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Generate ActiveMirrorOS demo package")
    parser.add_argument(
        "--output",
        default="demo_kit",
        help="Output directory (default: demo_kit)"
    )
    parser.add_argument(
        "--format",
        choices=["directory", "zip", "tar.gz"],
        default="zip",
        help="Output format (default: zip)"
    )
    parser.add_argument(
        "--include-examples",
        action="store_true",
        help="Include code examples from examples/ folder"
    )

    args = parser.parse_args()

    generator = DemoPackageGenerator(
        output_dir=args.output,
        format=args.format
    )

    try:
        generator.generate(include_examples=args.include_examples)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
