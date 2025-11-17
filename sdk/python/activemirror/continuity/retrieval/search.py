"""
Semantic Search for Continuity Engine v2.0
Hybrid keyword + embedding search with ranking
"""

import json
import math
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
from collections import Counter

from .indexer import SemanticIndexer


class SearchResult:
    """
    Represents a single search result.
    """

    def __init__(
        self,
        doc_id: str,
        score: float,
        content_preview: str,
        metadata: Dict[str, Any],
        highlights: Optional[List[str]] = None
    ):
        self.doc_id = doc_id
        self.score = score
        self.content_preview = content_preview
        self.metadata = metadata
        self.highlights = highlights or []

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation."""
        return {
            'doc_id': self.doc_id,
            'score': round(self.score, 4),
            'content_preview': self.content_preview,
            'metadata': self.metadata,
            'highlights': self.highlights
        }

    def __repr__(self) -> str:
        return f"SearchResult(doc_id='{self.doc_id}', score={self.score:.4f})"


class SemanticSearch:
    """
    Hybrid search engine combining keyword matching and semantic similarity.

    Features:
    - TF-IDF based keyword search
    - Cosine similarity ranking
    - Result highlighting
    - Metadata filtering
    - Extensible for embedding-based search

    Usage:
        search = SemanticSearch(index_path="continuity/retrieval/semantic_index.json")
        results = search.search("identity lock protocols", limit=5)
        for result in results:
            print(f"{result.doc_id}: {result.score}")
    """

    def __init__(self, index_path: str = "continuity/retrieval/semantic_index.json"):
        """
        Initialize search engine.

        Args:
            index_path: Path to the semantic index
        """
        self.index_path = Path(index_path)
        self.indexer = SemanticIndexer(str(index_path))

        if not self.index_path.exists():
            raise FileNotFoundError(
                f"Index not found: {index_path}. Run SemanticIndexer.save() first."
            )

    def search(
        self,
        query: str,
        limit: int = 10,
        filters: Optional[Dict[str, Any]] = None,
        min_score: float = 0.01
    ) -> List[SearchResult]:
        """
        Search the index using hybrid keyword + semantic matching.

        Args:
            query: Search query string
            limit: Maximum number of results to return
            filters: Optional metadata filters (e.g., {'type': 'snapshot'})
            min_score: Minimum relevance score (0.0 to 1.0)

        Returns:
            List of SearchResult objects, sorted by relevance
        """
        # Tokenize query
        query_tokens = self.indexer.tokenize(query)

        if not query_tokens:
            return []

        # Compute query TF
        query_tf = self.indexer.compute_tf(query_tokens)

        # Score all documents
        scores: List[Tuple[str, float]] = []

        for doc_id, doc in self.indexer.documents.items():
            # Apply metadata filters
            if filters and not self._matches_filters(doc['metadata'], filters):
                continue

            # Compute TF-IDF cosine similarity
            score = self._compute_tfidf_score(query_tf, doc)

            if score >= min_score:
                scores.append((doc_id, score))

        # Sort by score (descending) and limit
        scores.sort(key=lambda x: x[1], reverse=True)
        scores = scores[:limit]

        # Build result objects
        results = []
        for doc_id, score in scores:
            doc = self.indexer.documents[doc_id]
            highlights = self._extract_highlights(query_tokens, doc['content'])

            result = SearchResult(
                doc_id=doc_id,
                score=score,
                content_preview=doc['content'],
                metadata=doc['metadata'],
                highlights=highlights
            )
            results.append(result)

        return results

    def _compute_tfidf_score(
        self,
        query_tf: Dict[str, float],
        doc: Dict[str, Any]
    ) -> float:
        """
        Compute TF-IDF cosine similarity between query and document.

        Args:
            query_tf: Query term frequencies
            doc: Document dictionary

        Returns:
            Cosine similarity score (0.0 to 1.0)
        """
        doc_tf = doc.get('tf', {})

        # Compute TF-IDF vectors
        query_vector: Dict[str, float] = {}
        doc_vector: Dict[str, float] = {}

        # Get all terms
        all_terms = set(query_tf.keys()) | set(doc_tf.keys())

        for term in all_terms:
            idf = self.indexer.idf.get(term, 0.0)

            if term in query_tf:
                query_vector[term] = query_tf[term] * idf

            if term in doc_tf:
                doc_vector[term] = doc_tf[term] * idf

        # Compute cosine similarity
        dot_product = sum(
            query_vector.get(term, 0.0) * doc_vector.get(term, 0.0)
            for term in all_terms
        )

        query_magnitude = math.sqrt(sum(v ** 2 for v in query_vector.values()))
        doc_magnitude = math.sqrt(sum(v ** 2 for v in doc_vector.values()))

        if query_magnitude == 0 or doc_magnitude == 0:
            return 0.0

        similarity = dot_product / (query_magnitude * doc_magnitude)
        return max(0.0, min(1.0, similarity))  # Clamp to [0, 1]

    def _matches_filters(
        self,
        metadata: Dict[str, Any],
        filters: Dict[str, Any]
    ) -> bool:
        """
        Check if document metadata matches all filters.

        Args:
            metadata: Document metadata
            filters: Filter criteria

        Returns:
            True if all filters match
        """
        for key, value in filters.items():
            if metadata.get(key) != value:
                return False
        return True

    def _extract_highlights(
        self,
        query_tokens: List[str],
        content: str,
        context_words: int = 5
    ) -> List[str]:
        """
        Extract highlighted snippets where query terms appear.

        Args:
            query_tokens: Query terms to highlight
            content: Document content
            context_words: Number of context words around each match

        Returns:
            List of highlighted snippets
        """
        highlights = []
        content_lower = content.lower()

        for token in query_tokens:
            # Find all occurrences of token
            start = 0
            while True:
                pos = content_lower.find(token, start)
                if pos == -1:
                    break

                # Extract context around match
                words = content[:pos].split()
                before = ' '.join(words[-context_words:])

                words_after = content[pos:].split()
                after = ' '.join(words_after[:context_words + 1])

                snippet = f"...{before} **{words_after[0]}** {' '.join(words_after[1:context_words+1])}..."
                highlights.append(snippet)

                start = pos + len(token)

                # Limit to 3 highlights per term
                if len(highlights) >= 3:
                    break

            if len(highlights) >= 3:
                break

        return highlights[:3]  # Max 3 highlights total

    def search_by_metadata(
        self,
        filters: Dict[str, Any],
        limit: int = 10
    ) -> List[SearchResult]:
        """
        Search by metadata only (no text query).

        Args:
            filters: Metadata filters
            limit: Maximum results

        Returns:
            List of matching documents
        """
        results = []

        for doc_id, doc in self.indexer.documents.items():
            if self._matches_filters(doc['metadata'], filters):
                result = SearchResult(
                    doc_id=doc_id,
                    score=1.0,  # Perfect match for metadata-only search
                    content_preview=doc['content'],
                    metadata=doc['metadata'],
                    highlights=[]
                )
                results.append(result)

                if len(results) >= limit:
                    break

        return results

    def get_document(self, doc_id: str) -> Optional[SearchResult]:
        """
        Retrieve a specific document by ID.

        Args:
            doc_id: Document identifier

        Returns:
            SearchResult if found, None otherwise
        """
        if doc_id not in self.indexer.documents:
            return None

        doc = self.indexer.documents[doc_id]
        return SearchResult(
            doc_id=doc_id,
            score=1.0,
            content_preview=doc['content'],
            metadata=doc['metadata'],
            highlights=[]
        )

    def suggest_terms(self, prefix: str, limit: int = 10) -> List[str]:
        """
        Suggest search terms based on vocabulary.

        Args:
            prefix: Term prefix to match
            limit: Maximum suggestions

        Returns:
            List of suggested terms
        """
        prefix_lower = prefix.lower()
        suggestions = [
            term for term in self.indexer.vocabulary.keys()
            if term.startswith(prefix_lower)
        ]

        # Sort by frequency (most common first)
        suggestions.sort(
            key=lambda t: self.indexer.vocabulary[t],
            reverse=True
        )

        return suggestions[:limit]

    def get_stats(self) -> Dict[str, Any]:
        """
        Get search engine statistics.

        Returns:
            Statistics dictionary
        """
        return {
            **self.indexer.get_stats(),
            'index_loaded': True,
            'search_ready': True
        }
