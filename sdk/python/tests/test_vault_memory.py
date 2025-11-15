# FEU-Enforced Module | Master Citation v15.2 | Fact/Estimate/Unknown Protocol Active
# This module operates under MirrorDNA Reflective AI constraints.
# All outputs must be tagged as Fact, Estimate, or Unknown.
"""
Tests for VaultMemory
"""

import pytest
import tempfile
import shutil
from pathlib import Path
from activemirror import VaultMemory, VaultCategory


class TestVaultMemory:
    """Test VaultMemory functionality."""

    @pytest.fixture
    def temp_vault(self):
        """Create temporary vault for testing."""
        temp_dir = tempfile.mkdtemp()
        vault = VaultMemory(vault_path=temp_dir, password="test-password")
        yield vault
        shutil.rmtree(temp_dir)

    def test_create_vault(self, temp_vault):
        """Test creating a vault."""
        assert temp_vault is not None
        assert Path(temp_vault.vault_path).exists()

    def test_store_and_retrieve(self, temp_vault):
        """Test storing and retrieving data."""
        # Store
        result = temp_vault.store("test_key", "test_value")
        assert result is True

        # Retrieve
        value = temp_vault.retrieve("test_key")
        assert value == "test_value"

    def test_store_complex_data(self, temp_vault):
        """Test storing complex data structures."""
        data = {
            "goal": "Launch product",
            "timeline": "Q2 2024",
            "milestones": ["MVP", "Beta", "Launch"]
        }

        temp_vault.store("complex_goal", data, metadata={
            "category": VaultCategory.GOALS
        })

        retrieved = temp_vault.retrieve("complex_goal")
        assert retrieved == data
        assert retrieved["goal"] == "Launch product"

    def test_delete_entry(self, temp_vault):
        """Test deleting vault entries."""
        temp_vault.store("delete_me", "temporary")
        assert temp_vault.retrieve("delete_me") == "temporary"

        result = temp_vault.delete("delete_me")
        assert result is True

        assert temp_vault.retrieve("delete_me") is None

    def test_list_entries(self, temp_vault):
        """Test listing vault entries."""
        temp_vault.store("entry1", "value1")
        temp_vault.store("entry2", "value2")
        temp_vault.store("entry3", "value3", metadata={"category": "test"})

        entries = temp_vault.list_entries()
        assert len(entries) >= 3

        # Filter by metadata
        filtered = temp_vault.list_entries(filter_metadata={"category": "test"})
        assert len(filtered) == 1

    def test_search(self, temp_vault):
        """Test searching vault content."""
        temp_vault.store("goal1", "Launch startup in 2024")
        temp_vault.store("goal2", "Build meaningful product")
        temp_vault.store("note", "Random thought")

        results = temp_vault.search("startup")
        assert len(results) >= 1
        assert any("startup" in str(r["value"]).lower() for r in results)

    def test_get_stats(self, temp_vault):
        """Test getting vault statistics."""
        temp_vault.store("item1", "value1")
        temp_vault.store("item2", "value2")

        stats = temp_vault.get_stats()
        assert stats["total_entries"] == 2
        assert stats["total_size_bytes"] > 0

    def test_encryption_key_export(self, temp_vault):
        """Test exporting encryption key."""
        key = temp_vault.export_key()
        assert isinstance(key, str)
        assert len(key) > 0
