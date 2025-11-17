"""
Unit tests for Semantic Retrieval Engine (Continuity v2.0)
"""

import unittest
import tempfile
import json
from pathlib import Path

# We'll test with the standalone components to avoid dependency issues
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from activemirror.continuity.retrieval.indexer import SemanticIndexer
from activemirror.continuity.retrieval.search import SemanticSearch, SearchResult


class TestSemanticIndexer(unittest.TestCase):
    """Test cases for SemanticIndexer"""

    def setUp(self):
        """Set up test fixtures"""
        self.temp_dir = tempfile.mkdtemp()
        self.index_path = Path(self.temp_dir) / "test_index.json"
        self.indexer = SemanticIndexer(str(self.index_path))

    def tearDown(self):
        """Clean up test fixtures"""
        if self.index_path.exists():
            self.index_path.unlink()

    def test_initialization(self):
        """Test indexer initialization"""
        self.assertEqual(self.indexer.doc_count, 0)
        self.assertEqual(len(self.indexer.documents), 0)
        self.assertEqual(len(self.vocabulary), 0)

    def test_tokenize(self):
        """Test text tokenization"""
        text = "This is a simple test of the tokenizer!"
        tokens = self.indexer.tokenize(text)

        # Should be lowercase
        self.assertTrue(all(t.islower() for t in tokens))

        # Should filter stop words
        self.assertNotIn('the', tokens)
        self.assertNotIn('a', tokens)

        # Should keep meaningful words
        self.assertIn('simple', tokens)
        self.assertIn('test', tokens)
        self.assertIn('tokenizer', tokens)

    def test_compute_tf(self):
        """Test term frequency computation"""
        tokens = ['test', 'test', 'word', 'test']
        tf = self.indexer.compute_tf(tokens)

        # test appears 3 times (max), should have TF = 1.0
        self.assertAlmostEqual(tf['test'], 1.0)

        # word appears 1 time, should have TF = 1/3
        self.assertAlmostEqual(tf['word'], 1/3, places=4)

    def test_add_document(self):
        """Test adding a document"""
        doc_id = "test_doc_1"
        content = "This is a test document about continuity and memory."
        metadata = {'type': 'test', 'author': 'unit_test'}

        self.indexer.add_document(doc_id, content, metadata)

        # Check document was added
        self.assertEqual(self.indexer.doc_count, 1)
        self.assertIn(doc_id, self.indexer.documents)

        # Check document structure
        doc = self.indexer.documents[doc_id]
        self.assertEqual(doc['id'], doc_id)
        self.assertEqual(doc['metadata'], metadata)
        self.assertIn('tf', doc)
        self.assertIn('timestamp', doc)
        self.assertIn('checksum', doc)

    def test_add_multiple_documents(self):
        """Test adding multiple documents"""
        docs = [
            ("doc1", "First document about AI and continuity"),
            ("doc2", "Second document about memory and persistence"),
            ("doc3", "Third document about retrieval and search")
        ]

        for doc_id, content in docs:
            self.indexer.add_document(doc_id, content)

        self.assertEqual(self.indexer.doc_count, 3)
        self.assertEqual(len(self.indexer.documents), 3)

    def test_compute_idf(self):
        """Test IDF computation"""
        self.indexer.add_document("doc1", "apple banana")
        self.indexer.add_document("doc2", "apple cherry")
        self.indexer.add_document("doc3", "banana cherry")

        # apple appears in 2/3 documents
        # banana appears in 2/3 documents
        # cherry appears in 2/3 documents
        # All should have same IDF

        idf_apple = self.indexer.idf.get('apple', 0)
        idf_banana = self.indexer.idf.get('banana', 0)
        idf_cherry = self.indexer.idf.get('cherry', 0)

        self.assertAlmostEqual(idf_apple, idf_banana, places=4)
        self.assertAlmostEqual(idf_apple, idf_cherry, places=4)

    def test_remove_document(self):
        """Test removing a document"""
        self.indexer.add_document("doc1", "test content")
        self.indexer.add_document("doc2", "another test")

        # Remove doc1
        result = self.indexer.remove_document("doc1")

        self.assertTrue(result)
        self.assertEqual(self.indexer.doc_count, 1)
        self.assertNotIn("doc1", self.indexer.documents)
        self.assertIn("doc2", self.indexer.documents)

    def test_remove_nonexistent_document(self):
        """Test removing a document that doesn't exist"""
        result = self.indexer.remove_document("nonexistent")
        self.assertFalse(result)

    def test_save_and_load(self):
        """Test saving and loading index"""
        # Add some documents
        self.indexer.add_document("doc1", "test content one")
        self.indexer.add_document("doc2", "test content two")

        # Save
        self.indexer.save()
        self.assertTrue(self.index_path.exists())

        # Load into new indexer
        new_indexer = SemanticIndexer(str(self.index_path))
        self.assertEqual(new_indexer.doc_count, 2)
        self.assertIn("doc1", new_indexer.documents)
        self.assertIn("doc2", new_indexer.documents)

    def test_get_stats(self):
        """Test getting index statistics"""
        self.indexer.add_document("doc1", "test content")

        stats = self.indexer.get_stats()

        self.assertIn('total_documents', stats)
        self.assertIn('vocabulary_size', stats)
        self.assertIn('index_path', stats)
        self.assertEqual(stats['total_documents'], 1)


class TestSemanticSearch(unittest.TestCase):
    """Test cases for SemanticSearch"""

    def setUp(self):
        """Set up test fixtures"""
        self.temp_dir = tempfile.mkdtemp()
        self.index_path = Path(self.temp_dir) / "test_index.json"

        # Build a test index
        self.indexer = SemanticIndexer(str(self.index_path))

        self.indexer.add_document(
            "doc1",
            "ActiveMirrorOS provides persistent memory and continuity for AI systems.",
            {'type': 'description'}
        )

        self.indexer.add_document(
            "doc2",
            "The continuity engine ensures zero-drift and perfect recall.",
            {'type': 'feature'}
        )

        self.indexer.add_document(
            "doc3",
            "Semantic retrieval uses hybrid keyword and embedding search.",
            {'type': 'feature'}
        )

        self.indexer.save()

        # Create search engine
        self.search = SemanticSearch(str(self.index_path))

    def tearDown(self):
        """Clean up test fixtures"""
        if self.index_path.exists():
            self.index_path.unlink()

    def test_initialization(self):
        """Test search engine initialization"""
        self.assertIsNotNone(self.search.indexer)
        self.assertEqual(self.search.indexer.doc_count, 3)

    def test_search_basic(self):
        """Test basic search"""
        results = self.search.search("continuity memory")

        # Should return results
        self.assertGreater(len(results), 0)

        # Should be SearchResult objects
        self.assertIsInstance(results[0], SearchResult)

        # Should have scores
        for result in results:
            self.assertGreater(result.score, 0.0)
            self.assertLessEqual(result.score, 1.0)

    def test_search_ranking(self):
        """Test search result ranking"""
        results = self.search.search("continuity engine")

        # doc2 mentions "continuity engine" explicitly, should rank higher
        top_result = results[0]
        self.assertIn("continuity", top_result.content_preview.lower())
        self.assertIn("engine", top_result.content_preview.lower())

    def test_search_limit(self):
        """Test search result limiting"""
        results = self.search.search("memory", limit=2)

        self.assertLessEqual(len(results), 2)

    def test_search_filters(self):
        """Test metadata filtering"""
        # Search only 'feature' type documents
        results = self.search.search(
            "continuity",
            filters={'type': 'feature'}
        )

        # Should only return feature documents
        for result in results:
            self.assertEqual(result.metadata['type'], 'feature')

    def test_search_no_results(self):
        """Test search with no matches"""
        results = self.search.search("xyznonexistent")

        self.assertEqual(len(results), 0)

    def test_search_by_metadata(self):
        """Test metadata-only search"""
        results = self.search.search_by_metadata({'type': 'feature'})

        # Should return 2 feature documents
        self.assertEqual(len(results), 2)

        for result in results:
            self.assertEqual(result.metadata['type'], 'feature')

    def test_get_document(self):
        """Test retrieving specific document"""
        result = self.search.get_document("doc1")

        self.assertIsNotNone(result)
        self.assertIsInstance(result, SearchResult)
        self.assertEqual(result.doc_id, "doc1")

    def test_get_nonexistent_document(self):
        """Test retrieving nonexistent document"""
        result = self.search.get_document("nonexistent")

        self.assertIsNone(result)

    def test_suggest_terms(self):
        """Test term suggestion"""
        suggestions = self.search.suggest_terms("mem")

        # Should suggest "memory"
        self.assertIn("memory", suggestions)

    def test_suggest_terms_empty(self):
        """Test term suggestion with no matches"""
        suggestions = self.search.suggest_terms("xyz")

        self.assertEqual(len(suggestions), 0)

    def test_get_stats(self):
        """Test getting search stats"""
        stats = self.search.get_stats()

        self.assertIn('total_documents', stats)
        self.assertIn('index_loaded', stats)
        self.assertIn('search_ready', stats)
        self.assertTrue(stats['search_ready'])


class TestSearchResult(unittest.TestCase):
    """Test cases for SearchResult"""

    def test_initialization(self):
        """Test SearchResult initialization"""
        result = SearchResult(
            doc_id="test_doc",
            score=0.75,
            content_preview="Test content",
            metadata={'type': 'test'},
            highlights=["highlight1", "highlight2"]
        )

        self.assertEqual(result.doc_id, "test_doc")
        self.assertAlmostEqual(result.score, 0.75)
        self.assertEqual(result.content_preview, "Test content")
        self.assertEqual(result.metadata, {'type': 'test'})
        self.assertEqual(len(result.highlights), 2)

    def test_to_dict(self):
        """Test SearchResult to_dict conversion"""
        result = SearchResult(
            doc_id="test_doc",
            score=0.75,
            content_preview="Test content",
            metadata={'type': 'test'}
        )

        result_dict = result.to_dict()

        self.assertIn('doc_id', result_dict)
        self.assertIn('score', result_dict)
        self.assertIn('content_preview', result_dict)
        self.assertIn('metadata', result_dict)
        self.assertIn('highlights', result_dict)


if __name__ == '__main__':
    unittest.main()
