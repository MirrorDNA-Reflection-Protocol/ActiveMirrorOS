# Troubleshooting Guide

Common issues and solutions when using ActiveMirrorOS. If you don't find your issue here, check the [FAQ](../docs/faq.md) or open an [issue on GitHub](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues).

---

## Table of Contents

- [Installation Issues](#installation-issues)
- [Session & Storage Issues](#session--storage-issues)
- [Performance Issues](#performance-issues)
- [LingOS Lite Issues](#lingos-lite-issues)
- [Import/Export Issues](#importexport-issues)
- [Platform-Specific Issues](#platform-specific-issues)
- [Error Messages](#error-messages)

---

## Installation Issues

### Python: `ModuleNotFoundError: No module named 'activemirror'`

**Cause:** ActiveMirrorOS SDK not installed.

**Solution:**
```bash
pip install git+https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git#subdirectory=sdk/python
```

**Or install locally:**
```bash
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
cd ActiveMirrorOS/sdk/python
pip install -e .
```

**Verify:**
```bash
python -c "import activemirror; print('✅ Installed successfully')"
```

---

### JavaScript: `Cannot find module 'activemirror'`

**Cause:** ActiveMirrorOS SDK not installed.

**Solution:**
```bash
npm install MirrorDNA-Reflection-Protocol/ActiveMirrorOS#sdk/javascript
```

**Or install locally:**
```bash
git clone https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git
cd ActiveMirrorOS/sdk/javascript
npm install
npm link
```

**Verify:**
```bash
node -e "const {ActiveMirror} = require('activemirror'); console.log('✅ Installed successfully')"
```

---

### Python: `ImportError: cannot import name 'ActiveMirror'`

**Cause:** Old or corrupted installation.

**Solution:**
```bash
# Uninstall and reinstall
pip uninstall activemirror -y
pip install --no-cache-dir git+https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git#subdirectory=sdk/python
```

---

### Tests failing after installation

**Python tests fail:**

**Check Python version:**
```bash
python --version  # Should be 3.8 or higher
```

**Install test dependencies:**
```bash
cd sdk/python
pip install -e ".[dev]"
python -m pytest tests/ -v
```

**JavaScript tests fail:**

**Check Node version:**
```bash
node --version  # Should be 14 or higher
```

**Reinstall dependencies:**
```bash
cd sdk/javascript
rm -rf node_modules package-lock.json
npm install
node --test tests/
```

---

## Session & Storage Issues

### `SessionNotFoundError: Session 'xyz' does not exist`

**Cause:** Trying to load a session that doesn't exist.

**Solution 1:** Check available sessions
```python
mirror = ActiveMirror(storage_type="sqlite", db_path="memory.db")
sessions = mirror.list_sessions()
print(sessions)  # See what sessions exist
```

**Solution 2:** Create the session first
```python
session = mirror.create_session("xyz")  # Create before loading
```

**Solution 3:** Check if you're using the correct database file
```python
# Wrong database
mirror = ActiveMirror(db_path="wrong.db")

# Correct database
mirror = ActiveMirror(db_path="memory.db")
```

---

### Sessions not persisting across restarts

**Cause:** Using memory storage instead of persistent storage.

**Wrong:**
```python
mirror = ActiveMirror(storage_type="memory")  # RAM only, not persistent
```

**Correct:**
```python
mirror = ActiveMirror(storage_type="sqlite", db_path="memory.db")  # Persists
```

**Verify persistence:**
```python
# Create and save
mirror = ActiveMirror(storage_type="sqlite", db_path="test.db")
session = mirror.create_session("test")
session.add_message("user", "This should persist")

# Exit Python, restart, then load
mirror = ActiveMirror(storage_type="sqlite", db_path="test.db")
loaded = mirror.load_session("test")
print(loaded.get_context())  # Should show the message
```

---

### `PermissionError: [Errno 13] Permission denied: 'memory.db'`

**Cause:** No write permissions in the directory.

**Solution 1:** Use a writable directory
```python
import os
db_path = os.path.expanduser("~/Documents/activemirror/memory.db")
mirror = ActiveMirror(storage_type="sqlite", db_path=db_path)
```

**Solution 2:** Fix permissions
```bash
chmod 755 .  # Make current directory writable
```

---

### `sqlite3.OperationalError: database is locked`

**Cause:** Multiple processes accessing the same SQLite database.

**Solution 1:** Use one mirror instance per process
```python
# Good: Single instance
mirror = ActiveMirror(db_path="memory.db")
session = mirror.create_session("abc")

# Bad: Multiple instances simultaneously
mirror1 = ActiveMirror(db_path="memory.db")
mirror2 = ActiveMirror(db_path="memory.db")  # May cause locks
```

**Solution 2:** Use connection pooling or transactions
```python
# Enable WAL mode for better concurrency
mirror = ActiveMirror(db_path="memory.db", wal_mode=True)
```

**Solution 3:** Close previous connections
```python
mirror.close()  # Close before creating new instance
```

---

### Database corruption: `sqlite3.DatabaseError: malformed`

**Cause:** Database file corrupted.

**Solution 1:** Restore from backup
```bash
cp memory-backup.db memory.db
```

**Solution 2:** Export and reimport sessions (if database partially readable)
```python
# Try to export what you can
try:
    mirror = ActiveMirror(db_path="memory.db")
    for session_id in mirror.list_sessions():
        mirror.export_session(session_id, format="json")
except Exception as e:
    print(f"Failed: {e}")

# Create new database and import
mirror_new = ActiveMirror(db_path="memory-new.db")
# Import exported sessions
```

**Prevention:** Regular backups
```python
import shutil
from datetime import datetime

backup_name = f"memory-backup-{datetime.now():%Y%m%d}.db"
shutil.copy("memory.db", backup_name)
```

---

## Performance Issues

### Slow session loading

**Cause:** Large session with thousands of messages.

**Solution 1:** Paginate messages
```python
# Instead of loading entire session
context = session.get_context()  # Slow for 10k+ messages

# Load recent messages only
recent = session.get_recent_messages(limit=100)
```

**Solution 2:** Use summary/compression
```python
# Summarize old messages
summary = session.summarize_history(keep_recent=50)
```

**Solution 3:** Archive old sessions
```python
# Export and remove old sessions
mirror.export_session("old-session", format="json")
mirror.delete_session("old-session")
```

---

### High memory usage

**Cause:** Loading many sessions into memory.

**Solution:** Load sessions on-demand
```python
# Bad: Loading all sessions
sessions = [mirror.load_session(sid) for sid in mirror.list_sessions()]

# Good: Load only when needed
session_id = "current-project"
session = mirror.load_session(session_id)
```

---

### Slow exports

**Cause:** Large sessions with complex formatting.

**Solution:** Use simpler formats
```python
# Slow: Markdown (requires formatting)
mirror.export_session("session", format="markdown")

# Fast: JSON (raw data)
mirror.export_session("session", format="json")
```

---

## LingOS Lite Issues

### `AttributeError: module 'activemirror' has no attribute 'ReflectiveClient'`

**Cause:** Old SDK version without LingOS Lite.

**Solution:**
```bash
pip install --upgrade git+https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git#subdirectory=sdk/python
```

---

### Uncertainty markers not appearing

**Cause:** Threshold too high.

**Solution:** Lower uncertainty threshold
```python
# Current (too high)
client = ReflectiveClient(uncertainty_threshold=0.9)

# Better (more frequent markers)
client = ReflectiveClient(uncertainty_threshold=0.6)
```

---

### Wrong dialogue mode selected

**Cause:** Invalid mode name.

**Supported modes:**
- `exploratory`
- `analytical`
- `creative`
- `strategic`

**Error:**
```python
client = ReflectiveClient(mode='empathetic')  # Not in Lite
```

**Fix:**
```python
client = ReflectiveClient(mode='exploratory')  # Valid Lite mode
```

---

## Import/Export Issues

### `FileNotFoundError: [Errno 2] No such file or directory`

**Cause:** Export directory doesn't exist.

**Solution:** Create directory first
```python
import os

export_dir = "./exports"
os.makedirs(export_dir, exist_ok=True)

mirror.export_session("session", format="markdown", output_dir=export_dir)
```

---

### Exported files not readable

**Cause:** Incorrect format or encoding.

**Solution:** Specify encoding
```python
# Export with UTF-8 encoding
mirror.export_session("session", format="markdown", encoding="utf-8")
```

---

### Import fails: `JSONDecodeError`

**Cause:** Corrupted or invalid JSON file.

**Solution:** Validate JSON first
```python
import json

# Check if valid JSON
try:
    with open("session.json", "r") as f:
        data = json.load(f)
    print("✅ Valid JSON")
except json.JSONDecodeError as e:
    print(f"❌ Invalid JSON: {e}")
```

---

## Platform-Specific Issues

### macOS: `xcrun: error: invalid active developer path`

**Cause:** Missing Xcode command-line tools.

**Solution:**
```bash
xcode-select --install
```

---

### Windows: `'pip' is not recognized`

**Cause:** Python not in PATH.

**Solution:**
```bash
# Use Python launcher
py -m pip install ...

# Or add Python to PATH
# System Properties → Environment Variables → Path → Add Python path
```

---

### Linux: `Permission denied: '/usr/local/lib/python3.x'`

**Cause:** Installing globally without sudo.

**Solution:** Install for user only
```bash
pip install --user git+https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS.git#subdirectory=sdk/python
```

---

## Error Messages

### `ValueError: Storage type 'xyz' is not supported`

**Supported storage types:**
- `sqlite`
- `json`
- `memory`

**Fix:**
```python
# Wrong
mirror = ActiveMirror(storage_type="mysql")

# Correct
mirror = ActiveMirror(storage_type="sqlite", db_path="memory.db")
```

---

### `RuntimeError: Session already exists`

**Cause:** Trying to create a session with an ID that already exists.

**Solution 1:** Load existing session
```python
session = mirror.load_session("existing-session")
```

**Solution 2:** Use a different ID
```python
session = mirror.create_session("new-unique-session")
```

**Solution 3:** Delete old session first
```python
mirror.delete_session("existing-session")
session = mirror.create_session("existing-session")
```

---

### `TypeError: add_message() missing required argument: 'content'`

**Cause:** Missing message content.

**Wrong:**
```python
session.add_message("user")  # Missing content
```

**Correct:**
```python
session.add_message("user", "Hello!")
```

---

### `KeyError: 'role'`

**Cause:** Malformed message structure.

**Correct message structure:**
```python
{
    "role": "user",      # Required
    "content": "Hello",  # Required
    "timestamp": "...",  # Optional
    "metadata": {}       # Optional
}
```

---

## Getting Help

### Self-Diagnosis Steps

1. **Check version:**
```bash
pip show activemirror  # Python
npm list activemirror  # JavaScript
```

2. **Run tests:**
```bash
python -m pytest tests/ -v  # Python
node --test tests/          # JavaScript
```

3. **Enable debug logging:**
```python
import logging
logging.basicConfig(level=logging.DEBUG)

from activemirror import ActiveMirror
# Debug logs will now appear
```

4. **Minimal reproduction:**
```python
# Try simplest possible code
from activemirror import ActiveMirror

mirror = ActiveMirror(storage_type="memory")
session = mirror.create_session("test")
session.add_message("user", "test")
print(session.get_context())
```

---

### Community Support

**GitHub Issues:**
[https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues)

**Before posting:**
- [ ] Search existing issues
- [ ] Include error messages
- [ ] Provide minimal reproduction code
- [ ] Mention Python/Node version
- [ ] Mention OS (Windows/macOS/Linux)

**GitHub Discussions:**
[https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)

---

### Useful Debug Commands

**Python:**
```python
import activemirror
print(activemirror.__version__)  # Check version
print(activemirror.__file__)     # Check installation location

from activemirror import ActiveMirror
mirror = ActiveMirror(storage_type="sqlite", db_path="debug.db")
print(mirror.storage)  # Check storage backend
print(mirror.list_sessions())  # Check available sessions
```

**JavaScript:**
```javascript
const pkg = require('activemirror/package.json');
console.log(pkg.version);  // Check version

const { ActiveMirror } = require('activemirror');
const mirror = new ActiveMirror('./debug-data');
console.log(mirror.listSessions());  // Check available sessions
```

---

## Frequently Encountered Issues

### Issue: "My sessions disappear after I close the app"

**Cause:** Using memory storage.

**Solution:** Use `storage_type="sqlite"` with a persistent file path.

---

### Issue: "I can't find my database file"

**Solution:** Print the full path:
```python
import os
db_path = "memory.db"
print(os.path.abspath(db_path))
```

---

### Issue: "Syncing across devices doesn't work"

**Cause:** ActiveMirrorOS doesn't include auto-sync (local-first by design).

**Solution:** Use cloud storage for the database file:
```python
# Dropbox
db_path = "~/Dropbox/activemirror.db"

# iCloud
db_path = "~/Library/Mobile Documents/com~apple~CloudDocs/activemirror.db"

# Google Drive
db_path = "~/Google Drive/activemirror.db"
```

---

## Still Need Help?

If your issue isn't covered here:

1. Check the [FAQ](../docs/faq.md)
2. Search [GitHub Issues](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues)
3. Ask in [GitHub Discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)
4. Open a [new issue](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues/new) with:
   - Error message
   - Minimal reproduction code
   - Python/Node version
   - Operating system

---

**Troubleshooting Guide Version:** 1.0
**Last Updated:** 2025-01-14
