"""
Semantic Retrieval Engine for Continuity v2.0
Hybrid keyword + embedding search for intelligent recall
"""

from .indexer import SemanticIndexer
from .search import SemanticSearch

__all__ = ["SemanticIndexer", "SemanticSearch"]
