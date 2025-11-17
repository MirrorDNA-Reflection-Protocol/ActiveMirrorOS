# Embeddings Directory

This directory is reserved for embedding model files used by the Semantic Retrieval Engine.

## Current Status

**v2.0 MVP**: Embeddings are optional. The retrieval engine currently uses TF-IDF keyword matching, which works without embeddings.

## Future Integration

When you're ready to add embedding-based semantic search:

### Recommended Models

1. **sentence-transformers/all-MiniLM-L6-v2** (lightweight, 384 dimensions)
   - Good for general-purpose semantic search
   - Fast inference
   - ~90MB model size

2. **sentence-transformers/all-mpnet-base-v2** (higher quality, 768 dimensions)
   - Better accuracy
   - Slower inference
   - ~420MB model size

### Integration Steps

1. Install embedding library:
   ```bash
   pip install sentence-transformers
   ```

2. Download model:
   ```python
   from sentence_transformers import SentenceTransformer
   model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
   model.save('continuity/retrieval/embeddings/model')
   ```

3. Extend `SemanticIndexer`:
   ```python
   def add_document_with_embedding(self, doc_id, content, metadata=None):
       # Generate embedding
       embedding = self.embedding_model.encode(content)

       # Store with document
       doc['embedding'] = embedding.tolist()
   ```

4. Extend `SemanticSearch`:
   ```python
   def _compute_semantic_score(self, query_embedding, doc_embedding):
       # Cosine similarity
       return np.dot(query_embedding, doc_embedding) / (
           np.linalg.norm(query_embedding) * np.linalg.norm(doc_embedding)
       )
   ```

5. Use hybrid scoring:
   ```python
   final_score = 0.5 * tfidf_score + 0.5 * semantic_score
   ```

## Files

- **model.bin** — Reserved for embedding model binary (not included in v2.0)
- **config.json** — Model configuration (when added)
- **vocab.txt** — Tokenizer vocabulary (when added)

## FEU Note

Embedding integration is intentionally left as an extension point. The current TF-IDF implementation provides functional search without requiring large model downloads or GPU resources. Add embeddings when:

- Search quality needs improvement
- You have GPU resources available
- Model size (~90-420MB) is acceptable

**Status**: Placeholder for v2.1+
