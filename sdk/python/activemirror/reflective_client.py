# FEU-Enforced Module | Master Citation v15.2 | Fact/Estimate/Unknown Protocol Active
# This module operates under MirrorDNA Reflective AI constraints.
# All outputs must be tagged as Fact, Estimate, or Unknown.
"""
Reflective Client - LingOS Lite pattern implementation.

Enforces reflective behaviors, uncertainty markers, and glyph support.
"""

from typing import Optional, Dict, Any, List
import re
from enum import Enum


class UncertaintyLevel(Enum):
    """Uncertainty markers for reflective responses."""
    HIGH = "⟨⟨high⟩⟩"
    MEDIUM = "⟨medium⟩"
    LOW = "⟨low⟩"
    CONFIDENT = ""


class ReflectivePattern(Enum):
    """LingOS Lite reflective patterns."""
    EXPLORATORY = "exploratory"
    ANALYTICAL = "analytical"
    CREATIVE = "creative"
    STRATEGIC = "strategic"


class ReflectiveClient:
    """
    A client that wraps LLM interactions with reflective behaviors.

    Implements LingOS Lite patterns:
    - Uncertainty formatting
    - Glyph markers
    - Meta-cognitive prompting
    - Reflection extraction
    """

    def __init__(
        self,
        llm_provider: Optional[Any] = None,
        default_pattern: ReflectivePattern = ReflectivePattern.EXPLORATORY,
        enable_glyphs: bool = True,
    ):
        """
        Initialize reflective client.

        Args:
            llm_provider: Optional LLM provider (OpenAI, Anthropic, etc.)
            default_pattern: Default reflection pattern
            enable_glyphs: Whether to use glyph markers
        """
        self.llm_provider = llm_provider
        self.default_pattern = default_pattern
        self.enable_glyphs = enable_glyphs

    def reflect(
        self,
        input_text: str,
        pattern: Optional[ReflectivePattern] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Generate a reflective response to input.

        Args:
            input_text: User input to reflect on
            pattern: Reflection pattern to use
            context: Additional context for reflection

        Returns:
            Dict with 'response', 'uncertainty', 'glyphs', 'meta'
        """
        pattern = pattern or self.default_pattern

        # Build reflective prompt
        prompt = self._build_reflective_prompt(input_text, pattern, context)

        # Get response from LLM (stub if no provider)
        if self.llm_provider:
            raw_response = self._call_llm(prompt)
        else:
            raw_response = self._generate_reflective_stub(input_text, pattern)

        # Extract reflection components
        parsed = self._parse_reflection(raw_response)

        return {
            "response": parsed["content"],
            "uncertainty": parsed["uncertainty"],
            "glyphs": parsed["glyphs"] if self.enable_glyphs else [],
            "pattern": pattern.value,
            "meta": parsed["meta"],
        }

    def _build_reflective_prompt(
        self,
        input_text: str,
        pattern: ReflectivePattern,
        context: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Build a LingOS Lite reflective prompt."""
        base_prompt = f"""Reflect on this {pattern.value}ly:

{input_text}

Respond with:
1. Your reflection on the deeper meaning
2. Mark uncertainty with ⟨⟩ brackets where appropriate
3. Note any meta-cognitive observations
"""

        if context:
            base_prompt += f"\n\nContext: {context}\n"

        return base_prompt

    def _call_llm(self, prompt: str) -> str:
        """Call the configured LLM provider."""
        # This would integrate with actual LLM APIs
        # For now, return the prompt to show structure
        return prompt

    def _generate_reflective_stub(
        self,
        input_text: str,
        pattern: ReflectivePattern,
    ) -> str:
        """Generate a reflective response stub (for testing without LLM)."""
        stubs = {
            ReflectivePattern.EXPLORATORY: (
                f"I notice you're exploring: '{input_text}'. "
                f"This suggests ⟨medium⟩ a deeper inquiry into meaning. "
                f"What patterns emerge when you sit with this?"
            ),
            ReflectivePattern.ANALYTICAL: (
                f"Analyzing '{input_text}', I observe several dimensions. "
                f"The core claim appears ⟨low⟩ well-founded, though "
                f"edge cases require consideration."
            ),
            ReflectivePattern.CREATIVE: (
                f"Your thought '{input_text}' opens creative possibilities. "
                f"I'm ⟨⟨high⟩⟩ uncertain which path leads furthest, "
                f"but the generative potential feels significant."
            ),
            ReflectivePattern.STRATEGIC: (
                f"Strategically, '{input_text}' positions us to consider "
                f"second-order effects. The optimal path ⟨medium⟩ likely "
                f"involves staged experiments rather than full commitment."
            ),
        }

        return stubs.get(pattern, input_text)

    def _parse_reflection(self, response: str) -> Dict[str, Any]:
        """Parse uncertainty markers and meta-content from response."""
        # Extract uncertainty markers
        uncertainty_matches = re.findall(r'⟨+([^⟩]+)⟩+', response)

        # Classify uncertainty level
        uncertainty = UncertaintyLevel.CONFIDENT
        if uncertainty_matches:
            if any('high' in m.lower() for m in uncertainty_matches):
                uncertainty = UncertaintyLevel.HIGH
            elif any('medium' in m.lower() for m in uncertainty_matches):
                uncertainty = UncertaintyLevel.MEDIUM
            else:
                uncertainty = UncertaintyLevel.LOW

        # Extract glyphs (markers like ◈, ◊, ⬡, etc.)
        glyphs = re.findall(r'[◈◊⬡⬢◇◆▰▱✦✧★☆]', response)

        # Clean response (remove markers for clean reading)
        clean_content = re.sub(r'⟨+[^⟩]+⟩+', '', response).strip()

        return {
            "content": clean_content,
            "uncertainty": uncertainty,
            "glyphs": list(set(glyphs)),
            "meta": {
                "has_uncertainty": len(uncertainty_matches) > 0,
                "has_glyphs": len(glyphs) > 0,
                "reflection_depth": self._estimate_depth(response),
            },
        }

    def _estimate_depth(self, response: str) -> str:
        """Estimate reflection depth based on content."""
        # Simple heuristic: longer responses with questions = deeper
        word_count = len(response.split())
        question_count = response.count('?')

        if word_count > 100 and question_count > 2:
            return "deep"
        elif word_count > 50 or question_count > 0:
            return "moderate"
        else:
            return "surface"

    def format_with_glyphs(
        self,
        text: str,
        glyph_type: str = "marker"
    ) -> str:
        """Add visual glyph markers to text."""
        glyphs = {
            "marker": "◈",
            "uncertain": "◊",
            "insight": "✦",
            "question": "⬡",
        }

        glyph = glyphs.get(glyph_type, "◈")
        return f"{glyph} {text} {glyph}"


class ReflectivePromptBuilder:
    """Helper for building LingOS Lite prompts."""

    @staticmethod
    def exploratory(topic: str, context: str = "") -> str:
        """Build an exploratory reflection prompt."""
        return f"""Explore this topic with curiosity and openness:

Topic: {topic}
{f'Context: {context}' if context else ''}

Consider:
- What patterns or connections emerge?
- What remains uncertain or unclear?
- What questions arise from deeper examination?

Respond reflectively, marking uncertainty with ⟨⟩ brackets."""

    @staticmethod
    def analytical(claim: str, evidence: str = "") -> str:
        """Build an analytical reflection prompt."""
        return f"""Analyze this claim rigorously:

Claim: {claim}
{f'Evidence: {evidence}' if evidence else ''}

Consider:
- What assumptions underlie this claim?
- What evidence supports or contradicts it?
- What edge cases or exceptions exist?

Mark uncertainty levels clearly."""

    @staticmethod
    def strategic(goal: str, constraints: str = "") -> str:
        """Build a strategic reflection prompt."""
        return f"""Think strategically about this goal:

Goal: {goal}
{f'Constraints: {constraints}' if constraints else ''}

Consider:
- What paths could achieve this goal?
- What second-order effects might arise?
- What experiments would reduce uncertainty?

Provide strategic analysis with uncertainty markers."""
