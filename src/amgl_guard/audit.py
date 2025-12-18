"""
AMGL Guard v1 — Audit Note Generation

Implements audit note format per Section 7.1:

[AMGL-v1][{timestamp}][{request_id}]
SOURCE: {request_source}
GATE: {gate_result}
TRUTH: {truth_state}
REASON: {refusal_reason | "N/A"}
HASH: {sha256_first_16_of_request_text}

Audit notes:
- Are append-only (no modification)
- Contain no request content (hash only)
- Are generated for ALL evaluations (PASS, REVIEW, REFUSE)
- Storage is external (not this module's responsibility)
"""

import hashlib
from typing import Optional
from .models import TruthState, GateResult, RefusalReason


def compute_request_hash(request_text: str) -> str:
    """
    Compute SHA256 hash of request text, return first 16 characters.
    
    Per Section 7.2: Audit notes contain no request content (hash only).
    Type-safe: handles malformed input gracefully.
    """
    if not request_text:
        return "0" * 16
    # Type-safe: convert to string if needed
    if not isinstance(request_text, str):
        request_text = str(request_text)
    sha256 = hashlib.sha256(request_text.encode('utf-8')).hexdigest()
    return sha256[:16]


def generate_audit_note(
    timestamp: str,
    request_id: str,
    request_source: str,
    gate_result: GateResult,
    truth_state: TruthState,
    request_text: str,
    refusal_reason: Optional[RefusalReason] = None,
) -> str:
    """
    Generate audit note following exact format from Section 7.1.
    
    Returns:
        Formatted audit note string
    """
    reason_str = refusal_reason.value if refusal_reason else "N/A"
    request_hash = compute_request_hash(request_text)
    
    # Exact format from spec Section 7.1
    return f"""[AMGL-v1][{timestamp}][{request_id}]
SOURCE: {request_source}
GATE: {gate_result.value}
TRUTH: {truth_state.value}
REASON: {reason_str}
HASH: {request_hash}"""
