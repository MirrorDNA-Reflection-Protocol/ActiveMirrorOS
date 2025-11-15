#!/usr/bin/env python3
# FEU-Enforced Module | Master Citation v15.2 | Fact/Estimate/Unknown Protocol Active
# This module operates under MirrorDNA Reflective AI constraints.
# All outputs must be tagged as Fact, Estimate, or Unknown.
"""
Configuration Example

This example demonstrates how to use configuration files
to customize ActiveMirrorOS behavior.
"""

from activemirror import ActiveMirror, Config
from activemirror.core.config import StorageConfig, MemoryConfig
from pathlib import Path
import yaml


def create_config_file():
    """Create an example configuration file."""
    config_data = {
        "storage": {
            "type": "sqlite",
            "db_path": "./data/configured_memories.db",
            "enable_wal": True,
        },
        "memory": {
            "max_context_messages": 30,
            "enable_semantic_memory": True,
            "context_window_size": 4096,
            "context_strategy": "recent_and_relevant",
        },
        "identity": {"type": "anonymous"},
        "dialogue": {"engine": "basic", "mode": "conversational"},
        "debug": False,
    }

    config_path = Path("./data/activemirror_example.yaml")
    config_path.parent.mkdir(exist_ok=True)

    with open(config_path, "w") as f:
        yaml.dump(config_data, f, default_flow_style=False)

    return config_path


def example_programmatic_config():
    """Example: Create config programmatically."""
    print("=== Programmatic Configuration ===")
    print()

    storage_config = StorageConfig(type="memory")

    memory_config = MemoryConfig(
        max_context_messages=25, enable_semantic_memory=False
    )

    config = Config(storage=storage_config, memory=memory_config)

    # Validate configuration
    errors = config.validate()
    if errors:
        print("Configuration errors:")
        for error in errors:
            print(f"  - {error}")
    else:
        print("Configuration is valid")

    # Create ActiveMirror with config
    mirror = ActiveMirror(config=config)
    print(f"Created ActiveMirror with {config.storage.type} storage")
    print(f"Max context messages: {config.memory.max_context_messages}")
    print()

    return mirror


def example_file_config():
    """Example: Load config from file."""
    print("=== File-based Configuration ===")
    print()

    # Create example config file
    config_path = create_config_file()
    print(f"Created config file: {config_path}")
    print()

    # Load from file
    mirror = ActiveMirror.from_config(str(config_path))
    print(f"Loaded ActiveMirror from config file")
    print(f"Storage type: {mirror.config.storage.type}")
    print(f"Database path: {mirror.config.storage.db_path}")
    print(f"Max context: {mirror.config.memory.max_context_messages}")
    print()

    return mirror


def example_env_config():
    """Example: Show environment variable configuration."""
    print("=== Environment Variable Configuration ===")
    print()
    print("You can set configuration via environment variables:")
    print()
    print("  export ACTIVEMIRROR_STORAGE_TYPE=sqlite")
    print("  export ACTIVEMIRROR_STORAGE_DB_PATH=./memories.db")
    print("  export ACTIVEMIRROR_MEMORY_MAX_CONTEXT_MESSAGES=50")
    print("  export ACTIVEMIRROR_MEMORY_ENABLE_SEMANTIC_MEMORY=true")
    print()
    print("Then load with:")
    print("  config = Config.from_env()")
    print("  mirror = ActiveMirror(config=config)")
    print()


def main():
    """Run configuration examples."""
    print("ActiveMirrorOS - Configuration Example")
    print("=" * 50)
    print()

    # Example 1: Programmatic configuration
    mirror1 = example_programmatic_config()

    # Test it works
    session = mirror1.create_session(title="Config Test")
    response = session.send("Testing configured instance")
    print(f"Test message sent: {len(response.content)} chars in response")
    print()

    # Example 2: File-based configuration
    mirror2 = example_file_config()

    # Test it works
    session2 = mirror2.create_session(title="File Config Test")
    response2 = session2.send("Testing file-configured instance")
    session2.save()
    print(f"Test message sent and session saved")
    print()

    # Example 3: Environment variables (informational)
    example_env_config()

    print("Configuration examples complete!")


if __name__ == "__main__":
    main()
