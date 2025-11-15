# FEU-Enforced Module | Master Citation v15.2 | Fact/Estimate/Unknown Protocol Active
# This module operates under MirrorDNA Reflective AI constraints.
# All outputs must be tagged as Fact, Estimate, or Unknown.
"""
Tests for ReflectiveClient
"""

import pytest
from activemirror import ReflectiveClient, ReflectivePattern, UncertaintyLevel


class TestReflectiveClient:
    """Test ReflectiveClient functionality."""

    def test_create_client(self):
        """Test creating a reflective client."""
        client = ReflectiveClient()
        assert client is not None
        assert client.default_pattern == ReflectivePattern.EXPLORATORY

    def test_reflect_exploratory(self):
        """Test exploratory reflection."""
        client = ReflectiveClient()
        result = client.reflect("What is meaningful work?")

        assert "response" in result
        assert "uncertainty" in result
        assert result["pattern"] == ReflectivePattern.EXPLORATORY.value

    def test_reflect_analytical(self):
        """Test analytical reflection."""
        client = ReflectiveClient()
        result = client.reflect(
            "Remote work is always better",
            pattern=ReflectivePattern.ANALYTICAL
        )

        assert result["pattern"] == ReflectivePattern.ANALYTICAL.value
        assert len(result["response"]) > 0

    def test_uncertainty_detection(self):
        """Test uncertainty marker detection."""
        client = ReflectiveClient()

        # High uncertainty pattern triggers high uncertainty response
        result = client.reflect(
            "Should I make this major life decision?",
            pattern=ReflectivePattern.CREATIVE
        )

        # The stub response for creative contains ⟨⟨high⟩⟩
        assert result["uncertainty"] == UncertaintyLevel.HIGH

    def test_glyph_formatting(self):
        """Test glyph formatting."""
        client = ReflectiveClient()

        formatted = client.format_with_glyphs("Key insight", "insight")
        assert "✦" in formatted
        assert "Key insight" in formatted

    def test_reflection_metadata(self):
        """Test reflection metadata."""
        client = ReflectiveClient()
        result = client.reflect("Test input")

        assert "meta" in result
        assert "has_uncertainty" in result["meta"]
        assert "reflection_depth" in result["meta"]
