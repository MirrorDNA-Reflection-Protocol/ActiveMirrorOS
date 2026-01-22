"""
Canary Client

Calls M1 /verify endpoint to verify response packages.
"""

import httpx
from typing import Optional
from dataclasses import dataclass
from enum import Enum


class Verdict(Enum):
    VERIFIED = "verified"
    NEEDS_REWRITE = "needs_rewrite"
    REJECTED = "rejected"
    ERROR = "error"


@dataclass
class VerificationResult:
    """Result from Canary verification."""
    request_id: str
    verdict: Verdict
    reasons: list
    policy_bundle_hash: str
    schema_hash: str
    canary_signature: str
    canary_public_key_id: str
    timestamp_ms: int
    error: Optional[str] = None


class CanaryClient:
    """Client for communicating with the M1 Canary verification node."""
    
    def __init__(
        self,
        base_url: str = "http://100.106.113.28:8100",  # M1 Tailscale IP
        timeout: float = 5.0
    ):
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
    
    async def health(self) -> dict:
        """Check Canary node health."""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(f"{self.base_url}/health")
            response.raise_for_status()
            return response.json()
    
    async def status(self) -> dict:
        """Get Canary node status."""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(f"{self.base_url}/status")
            response.raise_for_status()
            return response.json()
    
    async def verify(self, package: dict) -> VerificationResult:
        """
        Send a response package to Canary for verification.
        
        Args:
            package: The signed ResponsePackage dict
            
        Returns:
            VerificationResult with verdict and details
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/verify",
                    json=package
                )
                response.raise_for_status()
                data = response.json()
                
                return VerificationResult(
                    request_id=data.get("request_id", "unknown"),
                    verdict=Verdict(data.get("verdict", "error")),
                    reasons=data.get("reasons", []),
                    policy_bundle_hash=data.get("policy_bundle_hash", ""),
                    schema_hash=data.get("schema_hash", ""),
                    canary_signature=data.get("canary_signature", ""),
                    canary_public_key_id=data.get("canary_public_key_id", ""),
                    timestamp_ms=data.get("timestamp_ms", 0)
                )
                
        except httpx.HTTPStatusError as e:
            return VerificationResult(
                request_id=package.get("request", {}).get("request_id", "unknown"),
                verdict=Verdict.ERROR,
                reasons=[f"HTTP error: {e.response.status_code}"],
                policy_bundle_hash="",
                schema_hash="",
                canary_signature="",
                canary_public_key_id="",
                timestamp_ms=0,
                error=str(e)
            )
        except Exception as e:
            return VerificationResult(
                request_id=package.get("request", {}).get("request_id", "unknown"),
                verdict=Verdict.ERROR,
                reasons=[f"Connection error: {str(e)}"],
                policy_bundle_hash="",
                schema_hash="",
                canary_signature="",
                canary_public_key_id="",
                timestamp_ms=0,
                error=str(e)
            )
    
    def verify_sync(self, package: dict) -> VerificationResult:
        """Synchronous version of verify for non-async contexts."""
        import asyncio
        return asyncio.run(self.verify(package))


def create_client(base_url: Optional[str] = None) -> CanaryClient:
    """Factory function to create a CanaryClient."""
    if base_url:
        return CanaryClient(base_url=base_url)
    return CanaryClient()
