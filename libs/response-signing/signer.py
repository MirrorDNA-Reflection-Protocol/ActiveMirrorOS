"""
Ed25519 Signer for ResponsePackages

Signs packages with the M4 private key for Canary verification.
"""

import base64
import json
from pathlib import Path
from typing import Optional
from nacl.signing import SigningKey, VerifyKey


class PackageSigner:
    """Signs ResponsePackages with ed25519."""
    
    def __init__(self, key_id: str = "m4-key-2026-01", keys_dir: Optional[Path] = None):
        self.key_id = key_id
        self.keys_dir = keys_dir or Path.home() / ".mirrordna" / "keys"
        self._signing_key: Optional[SigningKey] = None
    
    def load_key(self) -> bool:
        """Load the signing key from disk. Returns True if successful."""
        private_path = self.keys_dir / f"{self.key_id}.private"
        if not private_path.exists():
            return False
        
        self._signing_key = SigningKey(private_path.read_bytes())
        return True
    
    def generate_key(self) -> bool:
        """Generate a new keypair and save it. Returns True if successful."""
        self.keys_dir.mkdir(parents=True, exist_ok=True)
        
        self._signing_key = SigningKey.generate()
        
        # Save private key
        private_path = self.keys_dir / f"{self.key_id}.private"
        private_path.write_bytes(bytes(self._signing_key))
        private_path.chmod(0o600)
        
        # Save public key
        public_path = self.keys_dir / f"{self.key_id}.public"
        public_path.write_bytes(bytes(self._signing_key.verify_key))
        
        return True
    
    @property
    def has_key(self) -> bool:
        """Check if a signing key is loaded."""
        return self._signing_key is not None
    
    def get_public_key_hex(self) -> Optional[str]:
        """Get the public key as hex for sharing."""
        if not self._signing_key:
            return None
        return bytes(self._signing_key.verify_key).hex()
    
    def canonicalize_json(self, obj: dict) -> str:
        """Canonicalize JSON for signing."""
        return json.dumps(obj, sort_keys=True, separators=(',', ':'), ensure_ascii=False)
    
    def sign_package(self, package_dict: dict) -> dict:
        """
        Sign a ResponsePackage dict, adding the signing block.
        Returns the package with signing info added.
        """
        if not self._signing_key:
            if not self.load_key():
                raise ValueError(f"No signing key available: {self.key_id}")
        
        # Remove existing signing block if present
        package_copy = {k: v for k, v in package_dict.items() if k != "signing"}
        
        # Sign the canonical JSON
        canonical = self.canonicalize_json(package_copy)
        signed = self._signing_key.sign(canonical.encode('utf-8'))
        signature = base64.b64encode(signed.signature).decode('ascii')
        
        # Add signing block
        package_dict["signing"] = {
            "m4_signature": signature,
            "m4_public_key_id": self.key_id
        }
        
        return package_dict


def create_signer(key_id: str = "m4-key-2026-01") -> PackageSigner:
    """Factory function to create a PackageSigner."""
    signer = PackageSigner(key_id=key_id)
    if not signer.load_key():
        # Auto-generate if no key exists
        signer.generate_key()
    return signer
