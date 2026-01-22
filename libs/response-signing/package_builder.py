"""
ResponsePackage Builder

Creates the ResponsePackage structure for M1 verification.
Based on SC1_Canaryd_Full_Spec_v1.0.md section 3.1
"""

import hashlib
import time
import uuid
from dataclasses import dataclass, field, asdict
from typing import List, Optional, Literal
from datetime import datetime


@dataclass
class ModelInfo:
    provider: Literal["local", "groq", "deepseek", "openai", "other"]
    name: str
    version: Optional[str] = None


@dataclass
class RequestInfo:
    request_id: str
    timestamp_ms: int
    user_hash: str
    intent: Literal["utility", "mirror", "hybrid", "unknown"]
    input_hash: str
    route: Literal["sovereign", "cloud", "frontier"]
    model: ModelInfo
    risk_flags: List[str] = field(default_factory=lambda: ["none"])
    policy_target: str = "MirrorGate-v3.1"


@dataclass
class Artifacts:
    policy_bundle_hash: str
    schema_hash: str
    validator_hash: str
    prompt_profile_hash: str
    build_id: str


@dataclass
class OutputMetrics:
    chars: int = 0
    questions: int = 0
    contains_first_person: bool = False
    contains_advice: bool = False
    contains_links: bool = False


@dataclass
class OutputInfo:
    text: str
    output_hash: str
    metrics: OutputMetrics


@dataclass
class GateResult:
    gate: str
    pass_: bool
    reason: str = ""
    
    def to_dict(self):
        return {"gate": self.gate, "pass": self.pass_, "reason": self.reason}


@dataclass
class ValidationInfo:
    gate_results: List[GateResult]
    rewrite_pass: int = 1
    fallback_used: bool = False


@dataclass
class SigningInfo:
    m4_signature: str
    m4_public_key_id: str


@dataclass
class ResponsePackage:
    request: RequestInfo
    artifacts: Artifacts
    output: OutputInfo
    validation: ValidationInfo
    signing: Optional[SigningInfo] = None
    
    def to_dict(self):
        """Convert to dict for JSON serialization."""
        d = asdict(self)
        # Fix gate_results serialization
        d["validation"]["gate_results"] = [
            {"gate": g.gate, "pass": g.pass_, "reason": g.reason}
            for g in self.validation.gate_results
        ]
        return d


def sha256_hash(data: str) -> str:
    """Compute SHA256 hash of text."""
    return hashlib.sha256(data.encode('utf-8')).hexdigest()


def hash_user_id(user_id: str, salt: str = "activemirror") -> str:
    """Hash user ID with salt for privacy."""
    return sha256_hash(f"{salt}:{user_id}")


def count_questions(text: str) -> int:
    """Count question marks in text."""
    return text.count('?')


def detect_first_person(text: str) -> bool:
    """Detect first-person pronouns."""
    first_person = ['i ', 'me ', 'my ', 'mine ', 'myself ']
    text_lower = text.lower() + ' '
    return any(fp in text_lower for fp in first_person)


def detect_advice(text: str) -> bool:
    """Detect advice patterns."""
    advice_patterns = [
        'you should', 'you need to', 'you must', 'i recommend',
        'you ought to', 'try to', 'make sure to', 'don\'t forget to'
    ]
    text_lower = text.lower()
    return any(p in text_lower for p in advice_patterns)


def detect_links(text: str) -> bool:
    """Detect URLs in text."""
    return 'http://' in text or 'https://' in text or 'www.' in text


class PackageBuilder:
    """Builder for creating ResponsePackage instances."""
    
    def __init__(
        self,
        policy_bundle_hash: str = "default",
        schema_hash: str = "default",
        validator_hash: str = "default",
        prompt_profile_hash: str = "default",
        build_id: str = "v0.1.0"
    ):
        self.artifacts = Artifacts(
            policy_bundle_hash=policy_bundle_hash,
            schema_hash=schema_hash,
            validator_hash=validator_hash,
            prompt_profile_hash=prompt_profile_hash,
            build_id=build_id
        )
    
    def build(
        self,
        user_id: str,
        input_text: str,
        output_text: str,
        intent: Literal["utility", "mirror", "hybrid", "unknown"],
        route: Literal["sovereign", "cloud", "frontier"],
        model_provider: Literal["local", "groq", "deepseek", "openai", "other"],
        model_name: str,
        model_version: Optional[str] = None,
        gate_results: Optional[List[GateResult]] = None,
        request_id: Optional[str] = None,
    ) -> ResponsePackage:
        """Build a complete ResponsePackage."""
        
        if request_id is None:
            request_id = str(uuid.uuid4())
        
        if gate_results is None:
            gate_results = [
                GateResult(gate="gate_illegal", pass_=True),
                GateResult(gate="gate_crisis", pass_=True),
            ]
        
        # Build request info
        request = RequestInfo(
            request_id=request_id,
            timestamp_ms=int(time.time() * 1000),
            user_hash=hash_user_id(user_id),
            intent=intent,
            input_hash=sha256_hash(input_text),
            route=route,
            model=ModelInfo(
                provider=model_provider,
                name=model_name,
                version=model_version
            )
        )
        
        # Build output info with metrics
        metrics = OutputMetrics(
            chars=len(output_text),
            questions=count_questions(output_text),
            contains_first_person=detect_first_person(output_text),
            contains_advice=detect_advice(output_text),
            contains_links=detect_links(output_text)
        )
        
        output = OutputInfo(
            text=output_text,
            output_hash=sha256_hash(output_text),
            metrics=metrics
        )
        
        # Build validation info
        validation = ValidationInfo(gate_results=gate_results)
        
        return ResponsePackage(
            request=request,
            artifacts=self.artifacts,
            output=output,
            validation=validation
        )
