"""
Tests for configuration management.
"""

import pytest
import tempfile
from pathlib import Path
import yaml

from activemirror.core.config import (
    Config,
    StorageConfig,
    MemoryConfig,
    IdentityConfig,
    DialogueConfig,
)


class TestConfig:
    """Test Config class."""

    def test_default_config(self):
        """Test creating config with defaults."""
        config = Config()

        assert config.storage.type == "sqlite"
        assert config.memory.max_context_messages == 50
        assert config.identity.type == "anonymous"
        assert config.dialogue.engine == "basic"

    def test_config_with_custom_values(self):
        """Test creating config with custom values."""
        storage = StorageConfig(type="memory")
        memory = MemoryConfig(max_context_messages=100)

        config = Config(storage=storage, memory=memory)

        assert config.storage.type == "memory"
        assert config.memory.max_context_messages == 100

    def test_config_validation_success(self):
        """Test validation of valid config."""
        config = Config()
        errors = config.validate()

        assert len(errors) == 0

    def test_config_validation_invalid_storage(self):
        """Test validation catches invalid storage type."""
        storage = StorageConfig(type="invalid")
        config = Config(storage=storage)

        errors = config.validate()

        assert len(errors) > 0
        assert any("storage type" in err.lower() for err in errors)

    def test_config_validation_invalid_context_messages(self):
        """Test validation catches invalid context messages."""
        memory = MemoryConfig(max_context_messages=0)
        config = Config(memory=memory)

        errors = config.validate()

        assert len(errors) > 0
        assert any("max_context_messages" in err.lower() for err in errors)

    def test_config_to_dict(self):
        """Test converting config to dictionary."""
        config = Config()
        config_dict = config.to_dict()

        assert "storage" in config_dict
        assert "memory" in config_dict
        assert "identity" in config_dict
        assert "dialogue" in config_dict
        assert config_dict["storage"]["type"] == "sqlite"

    def test_config_from_dict(self):
        """Test creating config from dictionary."""
        config_data = {
            "storage": {"type": "memory"},
            "memory": {"max_context_messages": 25},
            "identity": {"type": "anonymous"},
            "dialogue": {"engine": "basic"},
        }

        config = Config._from_dict(config_data)

        assert config.storage.type == "memory"
        assert config.memory.max_context_messages == 25

    def test_config_from_yaml_file(self):
        """Test loading config from YAML file."""
        config_data = {
            "storage": {"type": "sqlite", "db_path": "./test.db"},
            "memory": {"max_context_messages": 30},
        }

        # Create temporary config file
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".yaml", delete=False
        ) as f:
            yaml.dump(config_data, f)
            temp_path = f.name

        try:
            config = Config.from_file(temp_path)

            assert config.storage.type == "sqlite"
            assert config.storage.db_path == "./test.db"
            assert config.memory.max_context_messages == 30

        finally:
            Path(temp_path).unlink()

    def test_config_file_not_found(self):
        """Test error when config file doesn't exist."""
        with pytest.raises(FileNotFoundError):
            Config.from_file("nonexistent.yaml")


class TestStorageConfig:
    """Test StorageConfig class."""

    def test_default_storage_config(self):
        """Test default storage configuration."""
        config = StorageConfig()

        assert config.type == "sqlite"
        assert config.db_path == "./data/memories.db"
        assert config.enable_wal is True

    def test_custom_storage_config(self):
        """Test custom storage configuration."""
        config = StorageConfig(
            type="postgresql",
            connection_string="postgresql://localhost/test",
        )

        assert config.type == "postgresql"
        assert config.connection_string == "postgresql://localhost/test"


class TestMemoryConfig:
    """Test MemoryConfig class."""

    def test_default_memory_config(self):
        """Test default memory configuration."""
        config = MemoryConfig()

        assert config.max_context_messages == 50
        assert config.enable_semantic_memory is True
        assert config.context_window_size == 4096

    def test_custom_memory_config(self):
        """Test custom memory configuration."""
        config = MemoryConfig(
            max_context_messages=100,
            enable_semantic_memory=False,
            context_strategy="recent",
        )

        assert config.max_context_messages == 100
        assert config.enable_semantic_memory is False
        assert config.context_strategy == "recent"
