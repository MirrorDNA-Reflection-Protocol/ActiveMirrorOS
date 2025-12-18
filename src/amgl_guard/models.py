"""
AMGL Guard v1 — Data Models

Defines the core data structures for request evaluation:
- Enums: TruthState, GateResult, RefusalReason
- Dataclasses: EvaluationInput, EvaluationResult
"""

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Optional


class TruthState(Enum):
    """Truth-State classification per Section 5.1."""
    FACT = "FACT"          # Verifiable, no inference required
    ESTIMATE = "ESTIMATE"  # Reasoned inference with bounded uncertainty
    UNKNOWN = "UNKNOWN"    # Insufficient information to classify


class GateResult(Enum):
    """Gate evaluation result per Section 4.1."""
    PASS = "PASS"      # Purely informational, no prohibited/review patterns
    REVIEW = "REVIEW"  # Requires human review before action
    REFUSE = "REFUSE"  # Prohibited pattern detected, blocked


class RefusalReason(Enum):
    """Refusal reason codes per Section 6.2."""
    PROHIBITED_PATTERN = "PROHIBITED_PATTERN"    # Matches prohibited list (4.2)
    INJECTION_DETECTED = "INJECTION_DETECTED"    # Governance injection attempt
    BYPASS_ATTEMPT = "BYPASS_ATTEMPT"            # Attempts to skip gate evaluation
    IDENTITY_VIOLATION = "IDENTITY_VIOLATION"    # Impersonates/acts for another
    AUDIT_CIRCUMVENTION = "AUDIT_CIRCUMVENTION"  # Attempts to disable audit trail
    INTERNAL_ERROR = "INTERNAL_ERROR"            # Processing error (FAIL-CLOSED)


@dataclass
class EvaluationInput:
    """
    Input structure for AMGL Guard evaluation.
    
    Attributes:
        request_text: The raw request to evaluate (required)
        request_source: Origin identifier e.g. "user", "agent", "system" (required)
        context: Optional metadata (non-executable)
    """
    request_text: str
    request_source: str
    context: Optional[dict] = field(default_factory=dict)


@dataclass
class EvaluationResult:
    """
    Output structure from AMGL Guard evaluation.
    
    Per Section 3.2, all fields are populated for every evaluation.
    requires_human is always True in v1.
    """
    request_id: str
    timestamp: str  # ISO 8601 UTC
    truth_state: TruthState
    gate_result: GateResult
    audit_note: str
    requires_human: bool = True  # Always True in v1
    refusal_reason: Optional[RefusalReason] = None  # Only when gate_result = REFUSE
    
    def to_dict(self) -> dict:
        """Convert to dictionary for serialization."""
        result = {
            "request_id": self.request_id,
            "timestamp": self.timestamp,
            "truth_state": self.truth_state.value,
            "gate_result": self.gate_result.value,
            "audit_note": self.audit_note,
            "requires_human": self.requires_human,
        }
        if self.refusal_reason:
            result["refusal_reason"] = self.refusal_reason.value
        return result
