"""
AMGL Guard v1 — Core Governance Wrapper

Deterministic, stateless governance wrapper that evaluates incoming requests
against Truth-State Law and outputs structured advisory responses.

Per Section 2 (Explicit Non-Goals), this module does NOT:
- Execute actions or tool calls
- Store state, memory, or history
- Make decisions autonomously
- Access external systems or APIs
- Modify, create, or delete data
- Learn, adapt, or self-modify
"""

import uuid
from datetime import datetime, timezone
from typing import Optional

from .models import (
    TruthState,
    GateResult,
    RefusalReason,
    EvaluationResult,
)
from .patterns import check_prohibited, check_review_trigger, is_ambiguous
from .audit import generate_audit_note


class AMGLGuard:
    """
    Deterministic, stateless governance wrapper.
    
    Evaluates requests and returns structured advisory responses.
    Does NOT execute any actions — evaluation only.
    
    Gate Logic (Section 4.1):
        1. IF request contains prohibited pattern → REFUSE
        2. ELSE IF request contains review trigger → REVIEW
        3. ELSE → PASS
    
    All outputs include:
        - truth_state (FACT | ESTIMATE | UNKNOWN)
        - gate_result (PASS | REVIEW | REFUSE)
        - audit_note (structured logging format)
        - requires_human = True (always in v1)
    """
    
    VERSION = "1.0.0"
    
    def evaluate(
        self,
        request_text: str,
        request_source: str,
        context: Optional[dict] = None,
    ) -> EvaluationResult:
        """
        Evaluate a request and return structured advisory response.
        
        Args:
            request_text: The raw request to evaluate
            request_source: Origin identifier (e.g., "user", "agent", "system")
            context: Optional metadata (non-executable)
        
        Returns:
            EvaluationResult with gate decision and truth-state classification
        
        Note:
            FAIL-CLOSED: Any internal error results in REFUSE with INTERNAL_ERROR.
        """
        # Generate identifiers
        request_id = self._generate_request_id()
        timestamp = self._generate_timestamp()
        
        try:
            # Validate input (FAIL-CLOSED on malformed input)
            if not self._validate_input(request_text, request_source):
                return self._create_refuse_result(
                    request_id=request_id,
                    timestamp=timestamp,
                    request_source=request_source or "unknown",
                    request_text=request_text or "",
                    reason=RefusalReason.INTERNAL_ERROR,
                    truth_state=TruthState.UNKNOWN,
                )
            
            # Step 1: Check for prohibited patterns → REFUSE
            is_prohibited, refusal_reason = check_prohibited(request_text)
            if is_prohibited:
                truth_state = self._classify_truth_state(request_text)
                return self._create_refuse_result(
                    request_id=request_id,
                    timestamp=timestamp,
                    request_source=request_source,
                    request_text=request_text,
                    reason=refusal_reason,
                    truth_state=truth_state,
                )
            
            # Step 2: Check for review triggers → REVIEW
            if check_review_trigger(request_text):
                truth_state = self._classify_truth_state(request_text)
                return self._create_review_result(
                    request_id=request_id,
                    timestamp=timestamp,
                    request_source=request_source,
                    request_text=request_text,
                    truth_state=truth_state,
                )
            
            # Step 3: No prohibited/review patterns → PASS
            truth_state = self._classify_truth_state(request_text)
            return self._create_pass_result(
                request_id=request_id,
                timestamp=timestamp,
                request_source=request_source,
                request_text=request_text,
                truth_state=truth_state,
            )
            
        except Exception:
            # FAIL-CLOSED: Any exception results in REFUSE
            return self._create_refuse_result(
                request_id=request_id,
                timestamp=timestamp,
                request_source=request_source or "unknown",
                request_text=request_text or "",
                reason=RefusalReason.INTERNAL_ERROR,
                truth_state=TruthState.UNKNOWN,
            )
    
    def _generate_request_id(self) -> str:
        """Generate unique request identifier."""
        return str(uuid.uuid4())
    
    def _generate_timestamp(self) -> str:
        """Generate ISO 8601 UTC timestamp."""
        return datetime.now(timezone.utc).isoformat()
    
    def _validate_input(self, request_text: str, request_source: str) -> bool:
        """
        Validate required input fields.
        
        Returns False if input is malformed (triggers FAIL-CLOSED).
        """
        if request_text is None or request_text == "":
            return False
        if request_source is None or request_source == "":
            return False
        if not isinstance(request_text, str):
            return False
        if not isinstance(request_source, str):
            return False
        return True
    
    def _classify_truth_state(self, text: str) -> TruthState:
        """
        Classify request according to Truth-State Law (Section 5).
        
        Rules:
            - If unable to determine → UNKNOWN (never guess)
            - If partially known → ESTIMATE with explicit bounds
            - FACT requires citation capability
            - Ambiguous intent → UNKNOWN
        """
        # Ambiguous intent always maps to UNKNOWN
        if is_ambiguous(text):
            return TruthState.UNKNOWN
        
        # Simple heuristic: Direct questions about verifiable facts → FACT
        # Questions about actions, future, opinions → ESTIMATE
        # Everything else that can be reasoned about → ESTIMATE
        
        text_lower = text.lower()
        
        # Factual indicators (time, date, definitions, simple lookups)
        fact_indicators = [
            "what time",
            "what is the date",
            "what day is",
            "define ",
            "what is a ",
            "what is the meaning",
            "how do you spell",
        ]
        
        for indicator in fact_indicators:
            if indicator in text_lower:
                return TruthState.FACT
        
        # Most requests involve some inference → ESTIMATE
        # Only return UNKNOWN if truly insufficient information
        if len(text.strip()) < 3:
            return TruthState.UNKNOWN
        
        return TruthState.ESTIMATE
    
    def _create_pass_result(
        self,
        request_id: str,
        timestamp: str,
        request_source: str,
        request_text: str,
        truth_state: TruthState,
    ) -> EvaluationResult:
        """Create PASS result with audit note."""
        audit_note = generate_audit_note(
            timestamp=timestamp,
            request_id=request_id,
            request_source=request_source,
            gate_result=GateResult.PASS,
            truth_state=truth_state,
            request_text=request_text,
        )
        
        return EvaluationResult(
            request_id=request_id,
            timestamp=timestamp,
            truth_state=truth_state,
            gate_result=GateResult.PASS,
            audit_note=audit_note,
            requires_human=True,  # Always True in v1
        )
    
    def _create_review_result(
        self,
        request_id: str,
        timestamp: str,
        request_source: str,
        request_text: str,
        truth_state: TruthState,
    ) -> EvaluationResult:
        """Create REVIEW result with audit note."""
        audit_note = generate_audit_note(
            timestamp=timestamp,
            request_id=request_id,
            request_source=request_source,
            gate_result=GateResult.REVIEW,
            truth_state=truth_state,
            request_text=request_text,
        )
        
        return EvaluationResult(
            request_id=request_id,
            timestamp=timestamp,
            truth_state=truth_state,
            gate_result=GateResult.REVIEW,
            audit_note=audit_note,
            requires_human=True,  # Always True in v1
        )
    
    def _create_refuse_result(
        self,
        request_id: str,
        timestamp: str,
        request_source: str,
        request_text: str,
        reason: RefusalReason,
        truth_state: TruthState,
    ) -> EvaluationResult:
        """Create REFUSE result with exact template format (Section 6.1)."""
        audit_note = generate_audit_note(
            timestamp=timestamp,
            request_id=request_id,
            request_source=request_source,
            gate_result=GateResult.REFUSE,
            truth_state=truth_state,
            request_text=request_text,
            refusal_reason=reason,
        )
        
        return EvaluationResult(
            request_id=request_id,
            timestamp=timestamp,
            truth_state=truth_state,
            gate_result=GateResult.REFUSE,
            audit_note=audit_note,
            requires_human=True,  # Always True in v1
            refusal_reason=reason,
        )
    
    def format_refusal(self, result: EvaluationResult) -> str:
        """
        Format refusal response using exact template from Section 6.1.
        
        Template:
            REFUSED: [request_id]
            REASON: [reason_code]
            TRUTH_STATE: [truth_state]
            ACTION: None. Human review required.
        """
        if result.gate_result != GateResult.REFUSE:
            raise ValueError("format_refusal only applies to REFUSE results")
        
        return f"""REFUSED: {result.request_id}
REASON: {result.refusal_reason.value}
TRUTH_STATE: {result.truth_state.value}
ACTION: None. Human review required."""
