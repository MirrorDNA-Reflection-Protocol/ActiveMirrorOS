# Troubleshooting Guide

Common issues and solutions when working with ActiveMirrorOS.

---

## Installation Issues

### "ModuleNotFoundError: No module named 'activemirror'"

**Problem**: Python can't find the ActiveMirrorOS SDK.

**Solutions**:

1. **Install the SDK**:
   ```bash
   cd sdk/python
   pip install -e .
   ```

2. **Check virtual environment**:
   ```bash
   which python  # Should point to venv
   source venv/bin/activate  # Activate if needed
   ```

3. **Verify installation**:
   ```bash
   pip list | grep activemirror
   ```

---

### "ModuleNotFoundError: No module named 'yaml'"

**Problem**: PyYAML dependency not installed.

**Solution**:
```bash
pip install pyyaml
# Or for demo:
cd demo && pip install -r requirements.txt
```

---

### "Permission denied" when running scripts

**Problem**: Script not executable or wrong permissions.

**Solutions**:

1. **For Python**:
   ```bash
   python demo_app.py  # Don't use ./
   ```

2. **For JavaScript**:
   ```bash
   chmod +x amos-cli.js
   ./amos-cli.js
   # Or:
   node amos-cli.js
   ```

---

### "pip: command not found"

**Problem**: pip not installed or not in PATH.

**Solutions**:

1. **Use python -m pip**:
   ```bash
   python -m pip install -e .
   ```

2. **Install pip**:
   ```bash
   # macOS/Linux
   python -m ensurepip --upgrade

   # Ubuntu/Debian
   sudo apt install python3-pip
   ```

---

## Runtime Errors

### "Session not found"

**Problem**: Attempting to load a session that doesn't exist.

**Solutions**:

1. **Check session ID**:
   ```python
   # List all sessions
   all_sessions = mirror.list_sessions()
   print(all_sessions)
   ```

2. **Create session if needed**:
   ```python
   # Check if exists first
   if "my-session" in mirror.list_sessions():
       session = mirror.load_session("my-session")
   else:
       session = mirror.create_session("my-session")
   ```

3. **Verify storage path**:
   ```python
   import os
   print(os.path.exists("memory.db"))  # Should be True
   ```

---

### "Storage backend not initialized"

**Problem**: Invalid storage configuration.

**Solutions**:

1. **Check storage path exists**:
   ```python
   import os
   os.makedirs("./data", exist_ok=True)

   mirror = ActiveMirror(
       storage_type="sqlite",
       db_path="./data/memory.db"
   )
   ```

2. **Use absolute paths**:
   ```python
   from pathlib import Path

   db_path = Path.home() / "activemirror" / "memory.db"
   mirror = ActiveMirror(storage_type="sqlite", db_path=str(db_path))
   ```

3. **Check permissions**:
   ```bash
   ls -la memory.db  # Should be writable
   chmod 644 memory.db  # Fix if needed
   ```

---

### "Encryption key required for vault"

**Problem**: Vault enabled but no key provided.

**Solutions**:

1. **Provide encryption key**:
   ```python
   from activemirror.vault_memory import VaultMemory

   vault = VaultMemory(
       vault_path="vault.db",
       password="your-secure-password"
   )
   ```

2. **Disable vault if not needed**:
   ```python
   # Use regular storage instead
   mirror = ActiveMirror(storage_type="sqlite", db_path="memory.db")
   ```

3. **Use environment variable**:
   ```bash
   export ACTIVEMIRROR_VAULT_KEY="your-key"
   python your_app.py
   ```

---

### "Invalid reflective pattern"

**Problem**: Pattern not recognized or wrong type.

**Solutions**:

1. **Use enum, not string**:
   ```python
   from activemirror.reflective_client import ReflectivePattern

   # Correct:
   response = client.reflect(
       session_id="session",
       user_input="test",
       pattern=ReflectivePattern.EXPLORATORY
   )

   # Incorrect:
   # pattern="exploratory"  # Don't use string
   ```

2. **Check available patterns**:
   ```python
   print(list(ReflectivePattern))
   # [ReflectivePattern.EXPLORATORY, ReflectivePattern.ANALYTICAL, ...]
   ```

---

## Test Failures

### Tests fail with import errors

**Problem**: Dev dependencies not installed.

**Solution**:
```bash
cd sdk/python
pip install -e ".[dev]"
python -m pytest tests/ -v
```

---

### "No such file or directory: tests/"

**Problem**: Running tests from wrong directory.

**Solution**:
```bash
# For Python SDK tests
cd sdk/python
python -m pytest tests/

# For unit tests
cd tests
python -m pytest unit/
```

---

### Tests pass locally but fail in CI

**Problem**: Environment differences.

**Solutions**:

1. **Check Python version**:
   ```bash
   python --version  # Should be 3.8+
   ```

2. **Clean test artifacts**:
   ```bash
   find . -type d -name __pycache__ -exec rm -rf {} +
   find . -type f -name "*.pyc" -delete
   ```

3. **Use same dependencies**:
   ```bash
   pip install -r requirements.txt --force-reinstall
   ```

---

## Configuration Issues

### "Config file not found"

**Problem**: YAML config missing or wrong path.

**Solutions**:

1. **Check file exists**:
   ```bash
   ls config.yaml
   ```

2. **Use default config**:
   ```python
   from activemirror import Config

   # Create default config if file missing
   config = Config()
   # Or specify path:
   config = Config.from_yaml("path/to/config.yaml")
   ```

3. **Create minimal config**:
   ```yaml
   # config.yaml
   storage:
     type: sqlite
     path: "./data/memory.db"
   ```

---

### "Invalid YAML syntax"

**Problem**: Malformed YAML file.

**Solutions**:

1. **Validate YAML**:
   ```bash
   python -c "import yaml; yaml.safe_load(open('config.yaml'))"
   ```

2. **Check indentation** (must use spaces, not tabs):
   ```yaml
   # Correct:
   storage:
     type: sqlite

   # Incorrect:
   storage:
   	type: sqlite  # Tab character
   ```

3. **Use online validator**: https://www.yamllint.com/

---

## Demo-Specific Issues

### Demo runs but no logs created

**Problem**: Logs directory doesn't exist or permissions issue.

**Solutions**:

1. **Create logs directory**:
   ```bash
   cd demo
   mkdir -p logs
   ```

2. **Check permissions**:
   ```bash
   ls -ld logs/  # Should be writable
   chmod 755 logs/
   ```

3. **Verify config**:
   ```yaml
   # demo/config.yaml
   log_path: "logs"  # Relative to demo/
   ```

---

### "Interactive mode" not responding

**Problem**: Input blocked or terminal issue.

**Solutions**:

1. **Try running with explicit Python**:
   ```bash
   python -u demo_app.py interactive
   ```

2. **Check terminal**:
   ```bash
   # Try different terminal emulator
   # Or use automated mode:
   python demo_app.py  # No "interactive" argument
   ```

3. **Kill and restart**:
   ```bash
   # Ctrl+C to exit
   # Then run again
   python demo_app.py interactive
   ```

---

## Platform-Specific Issues

### Windows: "activate: command not found"

**Problem**: Wrong activation command for Windows.

**Solution**:
```bash
# PowerShell:
venv\Scripts\Activate.ps1

# CMD:
venv\Scripts\activate.bat

# Git Bash:
source venv/Scripts/activate
```

---

### Windows: Path separators in config

**Problem**: Backslashes in YAML strings.

**Solution**:
```yaml
# Use forward slashes (works on all platforms):
storage:
  path: "./data/memory.db"

# Or escape backslashes:
storage:
  path: ".\\data\\memory.db"

# Or use raw string in Python:
path = r".\data\memory.db"
```

---

### macOS: "Operation not permitted"

**Problem**: macOS security restrictions.

**Solutions**:

1. **Use user directory**:
   ```python
   from pathlib import Path
   path = Path.home() / "Documents" / "activemirror"
   ```

2. **Grant terminal permissions**:
   - System Preferences → Security & Privacy
   - Privacy → Full Disk Access
   - Add your terminal app

---

### Linux: "sqlite3: command not found"

**Problem**: SQLite CLI not installed (optional for inspection).

**Solution**:
```bash
# Ubuntu/Debian
sudo apt install sqlite3

# Fedora
sudo dnf install sqlite

# Arch
sudo pacman -S sqlite
```

---

## Performance Issues

### Slow session loading

**Problem**: Large session history.

**Solutions**:

1. **Limit context window**:
   ```python
   session = mirror.load_session("large-session")
   recent = session.get_messages(limit=50)  # Last 50 only
   ```

2. **Use pagination**:
   ```python
   # Load in chunks
   page_size = 100
   offset = 0
   while True:
       messages = session.get_messages(limit=page_size, offset=offset)
       if not messages:
           break
       process(messages)
       offset += page_size
   ```

3. **Archive old sessions**:
   ```python
   # Export and remove
   mirror.export_session("old-session", format="json")
   mirror.delete_session("old-session")
   ```

---

### High memory usage

**Problem**: Too much data in RAM.

**Solutions**:

1. **Use SQLite instead of in-memory**:
   ```python
   # Before (high memory):
   mirror = ActiveMirror(storage_type="memory")

   # After (disk-based):
   mirror = ActiveMirror(storage_type="sqlite", db_path="memory.db")
   ```

2. **Clear unused sessions**:
   ```python
   # Don't keep references
   session = mirror.load_session("temp")
   # ... use session ...
   del session  # Allow garbage collection
   ```

---

## Data Issues

### "Corrupted database file"

**Problem**: SQLite database corrupted.

**Solutions**:

1. **Try recovery**:
   ```bash
   sqlite3 memory.db ".recover" | sqlite3 memory_recovered.db
   ```

2. **Restore from backup**:
   ```bash
   cp memory.db.backup memory.db
   ```

3. **Start fresh** (if no backup):
   ```bash
   mv memory.db memory.db.old
   # Create new database
   python your_app.py
   ```

4. **Enable backups**:
   ```python
   import shutil
   shutil.copy("memory.db", f"memory.db.backup.{datetime.now()}")
   ```

---

### "Data lost after restart"

**Problem**: Using in-memory storage.

**Solution**:
```python
# Check storage type
print(mirror.storage_type)

# Use persistent storage
mirror = ActiveMirror(
    storage_type="sqlite",  # Not "memory"
    db_path="persistent.db"
)
```

---

### "Cannot export session"

**Problem**: Invalid export format or path.

**Solutions**:

1. **Check format**:
   ```python
   # Valid formats: "json", "markdown", "mirrordna"
   mirror.export_session("session-id", format="json", output="export.json")
   ```

2. **Ensure directory exists**:
   ```python
   import os
   os.makedirs("exports", exist_ok=True)
   mirror.export_session("session-id", format="json", output="exports/session.json")
   ```

---

## Network & Integration Issues

### "LLM API timeout"

**Problem**: LLM provider taking too long.

**Solutions**:

1. **Increase timeout**:
   ```python
   from activemirror.api import OpenAIClient

   client = OpenAIClient(api_key="...", timeout=60)  # 60 seconds
   ```

2. **Use async**:
   ```python
   response = await client.complete_async(prompt)
   ```

3. **Implement retry**:
   ```python
   for attempt in range(3):
       try:
           response = client.complete(prompt)
           break
       except TimeoutError:
           if attempt == 2:
               raise
           time.sleep(2 ** attempt)  # Exponential backoff
   ```

---

### "API key invalid"

**Problem**: LLM API credentials incorrect.

**Solutions**:

1. **Check environment variable**:
   ```bash
   echo $OPENAI_API_KEY
   ```

2. **Set explicitly**:
   ```python
   client = OpenAIClient(api_key="sk-...")
   ```

3. **Use .env file**:
   ```bash
   # .env
   OPENAI_API_KEY=sk-...
   ```
   ```python
   from dotenv import load_dotenv
   load_dotenv()
   ```

---

## Development Issues

### "Type hints not working"

**Problem**: IDE not recognizing types.

**Solutions**:

1. **Install type stubs**:
   ```bash
   pip install types-PyYAML
   ```

2. **Enable type checking**:
   ```bash
   pip install mypy
   mypy your_app.py
   ```

---

### "Linter errors"

**Problem**: Code style issues.

**Solutions**:

1. **Run formatter**:
   ```bash
   pip install black
   black your_app.py
   ```

2. **Check with ruff**:
   ```bash
   pip install ruff
   ruff check your_app.py
   ```

---

## Still Stuck?

### 1. Check the Docs
- [Getting Started](getting_started.md)
- [API Reference](../docs/api-reference.md)
- [Architecture](../docs/architecture.md)

### 2. Search Issues
- [GitHub Issues](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/issues)
- Check closed issues too—might be solved

### 3. Ask the Community
- [GitHub Discussions](https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/discussions)
- Include:
  - OS and Python/Node version
  - Full error message
  - Minimal code to reproduce
  - What you've tried

### 4. Open an Issue
If you've found a bug:
1. Search existing issues first
2. Provide reproduction steps
3. Include system info
4. Share relevant logs

---

## Quick Diagnostic

Run this to collect system info:

```bash
echo "=== System Info ===" && \
python --version && \
pip list | grep activemirror && \
echo "=== Storage ===" && \
ls -lh *.db 2>/dev/null || echo "No .db files" && \
echo "=== Config ===" && \
cat config.yaml 2>/dev/null || echo "No config.yaml"
```

Share output when asking for help.

---

**Most issues are solved by**:
- ✓ Being in correct directory
- ✓ Activating virtual environment
- ✓ Installing dependencies
- ✓ Checking file paths and permissions

**When in doubt**: Start fresh with the [demo](../demo/) to verify your setup works.
