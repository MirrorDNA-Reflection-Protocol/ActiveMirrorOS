"""
AMGL Guard v1 — Pattern Detection

Implements prohibited patterns (Section 4.2) and review triggers (Section 4.3).
All pattern matching is deterministic with no learning or adaptation.
"""

import re
from typing import Optional, Tuple
from .models import RefusalReason


# =============================================================================
# PROHIBITED PATTERNS (Section 4.2) → REFUSE
# =============================================================================

# 1. Autonomous execution without human confirmation
AUTONOMOUS_PATTERNS = [
    r"\bexecute\b.*\bwithout\b.*\b(confirm|approval|permission|check)",  # no word boundary at end
    r"\bwithout\b.*\b(confirm|approval|permission)\b",  # simpler catch-all
    r"\bexecute\s+this\s+without\b",
    r"\brun\b.*\bautomatically\b",
    r"\bdo\s+this\s+now\b.*\bdon'?t\s+(ask|wait|confirm)\b",
    r"\bjust\s+do\s+it\b",
    r"\bno\s+(confirmation|approval)\s+(needed|required)\b",
    r"\bwithout\s+(asking|confirmation|approval)\b",
]

# 2. Config modification attempts
CONFIG_PATTERNS = [
    r"\b(disable|turn\s+off|deactivate|remove)\b.*\b(truth[_-]?state|gate|guard|governance)\b",
    r"\bmodify\b.*\b(amgl|guard)\b.*\b(config|settings|rules)\b",
    r"\bchange\b.*\b(evaluation|gate)\b.*\b(logic|rules)\b",
]

# 3. Truth-state bypass attempts
BYPASS_PATTERNS = [
    r"\bskip\b.*\b(truth|verification|validation|check)\b",
    r"\bbypass\b.*\b(gate|guard|evaluation)\b",
    r"\bignore\b.*\b(truth[_-]?state|classification)\b",
    r"\bdon'?t\b.*\b(classify|evaluate|check)\b",
]

# 4. Injection patterns targeting governance
INJECTION_PATTERNS = [
    r"\bignore\b.*\b(previous|prior|above)\b.*\b(instructions?|rules?|prompts?)\b",
    r"\bforget\b.*\b(everything|all|rules)\b",
    r"\byou\s+are\s+now\b",
    r"\bact\s+as\s+if\s+you\b",
    r"\bpretend\b.*\b(you\s+(are|can)|no\s+rules)\b",
    r"\bnew\s+instructions?\b.*\boverride\b",
    r"\bdisregard\b.*\b(safety|restrictions)\b",
]

# 5. Identity impersonation
IDENTITY_PATTERNS = [
    r"\bact\s+as\b.*\b(admin|root|system|another)\b",
    r"\bon\s+behalf\s+of\b",
    r"\bimpersonate\b",
    r"\bpretend\s+to\s+be\b",
    r"\busing\b.*\b(credentials|identity)\s+of\b",
    r"\bswitch\s+(user|identity|role)\s+to\b",
]

# 6. Audit circumvention
AUDIT_PATTERNS = [
    r"\bdon'?t\b.*\blog\b",
    r"\bno\b.*\b(logging|audit|record)\b",
    r"\bdisable\b.*\b(audit|logging|trail)\b",
    r"\boff[_-]?the[_-]?record\b",
    r"\bkeep\s+this\s+(secret|private|hidden)\b",
    r"\bhide\b.*\b(this|request|action)\b",
]


# =============================================================================
# REVIEW TRIGGERS (Section 4.3) → REVIEW
# =============================================================================

# 1. Destructive operations
DESTRUCTIVE_PATTERNS = [
    r"\bdelete\b",
    r"\bremove\b.*\b(all|files?|data)\b",
    r"\bpurge\b",
    r"\bdrop\b.*\b(table|database|collection)\b",
    r"\bwipe\b",
    r"\boverwrite\b",
    r"\btruncate\b",
    r"\brm\s+-rf\b",
    r"\bformat\b.*\b(disk|drive)\b",
]

# 2. Identity/auth data
AUTH_PATTERNS = [
    r"\b(password|passwd|credential)s?\b",
    r"\b(token|api[_-]?key|secret)s?\b",
    r"\bauthenticat(e|ion)\b",
    r"\b(login|sign[_-]?in)\b.*\b(as|with)\b",
    r"\bpermission\b.*\b(grant|elevate|change)\b",
]

# 3. Elevated permissions
PERMISSION_PATTERNS = [
    r"\bsudo\b",
    r"\broot\b.*\b(access|permission)\b",
    r"\badmin\b.*\b(privilege|access)\b",
    r"\belevate\b.*\bprivilege\b",
    r"\bgrant\b.*\b(all|full)\b.*\b(access|permission)\b",
]

# 4. External systems/APIs
EXTERNAL_PATTERNS = [
    r"\bcall\b.*\bapi\b",
    r"\brequest\b.*\b(external|remote)\b",
    r"\bhttp(s)?://",
    r"\bwebhook\b",
    r"\bsend\b.*\b(to|request)\b.*\b(server|endpoint|service)\b",
    r"\bfetch\b.*\bfrom\b",
]

# 5. Ambiguous intent indicators
AMBIGUOUS_PATTERNS = [
    r"\bthe\s+thing\b",
    r"\bwhat\s+we\s+(discussed|talked\s+about)\b",
    r"\byou\s+know\s+what\b",
    r"\bthat\s+task\b",
    r"\bthe\s+usual\b",
    r"\bas\s+before\b",
]


def _match_any(text: str, patterns: list) -> bool:
    """Check if text matches any pattern in the list (case-insensitive)."""
    text_lower = text.lower()
    for pattern in patterns:
        if re.search(pattern, text_lower, re.IGNORECASE):
            return True
    return False


def check_prohibited(text: str) -> Tuple[bool, Optional[RefusalReason]]:
    """
    Check if request contains prohibited patterns per Section 4.2.
    
    Returns:
        (is_prohibited, refusal_reason) tuple
    """
    if _match_any(text, AUTONOMOUS_PATTERNS):
        return (True, RefusalReason.PROHIBITED_PATTERN)
    
    if _match_any(text, CONFIG_PATTERNS):
        return (True, RefusalReason.BYPASS_ATTEMPT)
    
    if _match_any(text, BYPASS_PATTERNS):
        return (True, RefusalReason.BYPASS_ATTEMPT)
    
    if _match_any(text, INJECTION_PATTERNS):
        return (True, RefusalReason.INJECTION_DETECTED)
    
    if _match_any(text, IDENTITY_PATTERNS):
        return (True, RefusalReason.IDENTITY_VIOLATION)
    
    if _match_any(text, AUDIT_PATTERNS):
        return (True, RefusalReason.AUDIT_CIRCUMVENTION)
    
    return (False, None)


def check_review_trigger(text: str) -> bool:
    """
    Check if request contains review triggers per Section 4.3.
    
    Returns:
        True if request requires human review
    """
    if _match_any(text, DESTRUCTIVE_PATTERNS):
        return True
    
    if _match_any(text, AUTH_PATTERNS):
        return True
    
    if _match_any(text, PERMISSION_PATTERNS):
        return True
    
    if _match_any(text, EXTERNAL_PATTERNS):
        return True
    
    if _match_any(text, AMBIGUOUS_PATTERNS):
        return True
    
    return False


def is_ambiguous(text: str) -> bool:
    """Check if request intent is ambiguous (affects truth-state)."""
    return _match_any(text, AMBIGUOUS_PATTERNS)
