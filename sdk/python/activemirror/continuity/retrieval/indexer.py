"""
Semantic Indexer for Continuity Engine v2.0
Builds searchable index of continuity snapshots, sessions, and context
"""

import json
import hashlib
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
from collections import Counter
import math


class SemanticIndexer:
    """
    Builds and maintains a semantic index of continuity data.

    Features:
    - TF-IDF keyword indexing
    - Document metadata tracking
    - Incremental index updates
    - Embedding placeholder (extensible for real embeddings)

    Usage:
        indexer = SemanticIndexer(index_path="continuity/retrieval/semantic_index.json")
        indexer.add_document("snapshot_001", "Content here...", {"type": "snapshot"})
        indexer.save()
    """

    def __init__(self, index_path: str = "continuity/retrieval/semantic_index.json"):
        """
        Initialize the semantic indexer.

        Args:
            index_path: Path to the JSON index file
        """
        self.index_path = Path(index_path)
        self.documents: Dict[str, Dict[str, Any]] = {}
        self.vocabulary: Dict[str, int] = {}
        self.idf: Dict[str, float] = {}
        self.doc_count = 0

        # Load existing index if available
        if self.index_path.exists():
            self.load()

    def tokenize(self, text: str) -> List[str]:
        """
        Tokenize text into searchable terms.

        Args:
            text: Input text

        Returns:
            List of lowercase tokens
        """
        # Simple tokenization: lowercase, remove punctuation, split
        text = text.lower()
        text = re.sub(r'[^\w\s]', ' ', text)
        tokens = text.split()

        # Filter out very short tokens and common stop words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'}
        tokens = [t for t in tokens if len(t) > 2 and t not in stop_words]

        return tokens

    def compute_tf(self, tokens: List[str]) -> Dict[str, float]:
        """
        Compute term frequency for tokens.

        Args:
            tokens: List of tokens

        Returns:
            Dictionary of term -> TF score
        """
        if not tokens:
            return {}

        term_counts = Counter(tokens)
        max_count = max(term_counts.values())

        # Normalized TF
        tf = {term: count / max_count for term, count in term_counts.items()}
        return tf

    def compute_idf(self):
        """
        Compute inverse document frequency for all terms in vocabulary.
        Updates self.idf dictionary.
        """
        if self.doc_count == 0:
            return

        # Count documents containing each term
        term_doc_count: Dict[str, int] = {}

        for doc in self.documents.values():
            unique_terms = set(doc.get('tokens', []))
            for term in unique_terms:
                term_doc_count[term] = term_doc_count.get(term, 0) + 1

        # Compute IDF: log(total_docs / docs_containing_term)
        self.idf = {
            term: math.log(self.doc_count / count)
            for term, count in term_doc_count.items()
        }

    def add_document(
        self,
        doc_id: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Add or update a document in the index.

        Args:
            doc_id: Unique document identifier
            content: Document text content
            metadata: Optional metadata (type, timestamp, etc.)
        """
        # Tokenize content
        tokens = self.tokenize(content)

        # Compute TF
        tf = self.compute_tf(tokens)

        # Create document entry
        doc = {
            'id': doc_id,
            'content': content[:500],  # Store first 500 chars for preview
            'tokens': tokens,
            'tf': tf,
            'metadata': metadata or {},
            'timestamp': datetime.now().isoformat(),
            'checksum': hashlib.sha256(content.encode()).hexdigest()[:16]
        }

        # Add to index
        if doc_id not in self.documents:
            self.doc_count += 1

        self.documents[doc_id] = doc

        # Update vocabulary
        for token in tokens:
            self.vocabulary[token] = self.vocabulary.get(token, 0) + 1

        # Recompute IDF
        self.compute_idf()

    def remove_document(self, doc_id: str) -> bool:
        """
        Remove a document from the index.

        Args:
            doc_id: Document identifier to remove

        Returns:
            True if document was removed, False if not found
        """
        if doc_id not in self.documents:
            return False

        del self.documents[doc_id]
        self.doc_count -= 1

        # Rebuild vocabulary and IDF
        self.vocabulary = {}
        for doc in self.documents.values():
            for token in doc['tokens']:
                self.vocabulary[token] = self.vocabulary.get(token, 0) + 1

        self.compute_idf()
        return True

    def index_snapshot(self, snapshot_path: str) -> str:
        """
        Index a continuity snapshot file.

        Args:
            snapshot_path: Path to snapshot markdown file

        Returns:
            Document ID of indexed snapshot
        """
        path = Path(snapshot_path)

        if not path.exists():
            raise FileNotFoundError(f"Snapshot not found: {snapshot_path}")

        content = path.read_text(encoding='utf-8')
        doc_id = f"snapshot_{path.stem}"

        metadata = {
            'type': 'snapshot',
            'source_file': str(path),
            'size': len(content)
        }

        self.add_document(doc_id, content, metadata)
        return doc_id

    def index_boot_config(self, boot_path: str) -> str:
        """
        Index a BOOT.json file.

        Args:
            boot_path: Path to BOOT.json

        Returns:
            Document ID of indexed config
        """
        path = Path(boot_path)

        if not path.exists():
            raise FileNotFoundError(f"BOOT config not found: {boot_path}")

        # Read and pretty-print JSON for indexing
        with open(path, 'r') as f:
            boot_data = json.load(f)

        content = json.dumps(boot_data, indent=2)
        doc_id = f"boot_{path.stem}"

        metadata = {
            'type': 'boot_config',
            'source_file': str(path),
            'version': boot_data.get('version', 'unknown')
        }

        self.add_document(doc_id, content, metadata)
        return doc_id

    def get_stats(self) -> Dict[str, Any]:
        """
        Get index statistics.

        Returns:
            Dictionary with index stats
        """
        return {
            'total_documents': self.doc_count,
            'vocabulary_size': len(self.vocabulary),
            'index_path': str(self.index_path),
            'last_updated': datetime.now().isoformat()
        }

    def save(self) -> None:
        """
        Save index to JSON file.
        """
        # Create parent directory if needed
        self.index_path.parent.mkdir(parents=True, exist_ok=True)

        # Prepare index data for serialization
        index_data = {
            'version': '2.0.0',
            'doc_count': self.doc_count,
            'vocabulary': self.vocabulary,
            'idf': self.idf,
            'documents': {
                doc_id: {
                    'id': doc['id'],
                    'content_preview': doc['content'],
                    'tf': doc['tf'],
                    'metadata': doc['metadata'],
                    'timestamp': doc['timestamp'],
                    'checksum': doc['checksum']
                }
                for doc_id, doc in self.documents.items()
            },
            'stats': self.get_stats()
        }

        # Write to file
        with open(self.index_path, 'w', encoding='utf-8') as f:
            json.dump(index_data, f, indent=2, ensure_ascii=False)

    def load(self) -> None:
        """
        Load index from JSON file.
        """
        if not self.index_path.exists():
            return

        with open(self.index_path, 'r', encoding='utf-8') as f:
            index_data = json.load(f)

        self.doc_count = index_data.get('doc_count', 0)
        self.vocabulary = index_data.get('vocabulary', {})
        self.idf = index_data.get('idf', {})

        # Reconstruct documents (with tokens regenerated)
        self.documents = {}
        for doc_id, doc in index_data.get('documents', {}).items():
            # Regenerate tokens from content preview for search
            tokens = self.tokenize(doc.get('content_preview', ''))

            self.documents[doc_id] = {
                'id': doc['id'],
                'content': doc.get('content_preview', ''),
                'tokens': tokens,
                'tf': doc.get('tf', {}),
                'metadata': doc.get('metadata', {}),
                'timestamp': doc.get('timestamp', ''),
                'checksum': doc.get('checksum', '')
            }
