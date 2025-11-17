"""
Standalone script to build semantic index
"""

import sys
import json
import hashlib
import re
from pathlib import Path
from datetime import datetime
from collections import Counter
import math


# Simplified inline indexer for bootstrapping
class SimpleIndexer:
    def __init__(self, index_path):
        self.index_path = Path(index_path)
        self.documents = {}
        self.vocabulary = {}
        self.idf = {}
        self.doc_count = 0

    def tokenize(self, text):
        text = text.lower()
        text = re.sub(r'[^\w\s]', ' ', text)
        tokens = text.split()
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'}
        return [t for t in tokens if len(t) > 2 and t not in stop_words]

    def compute_tf(self, tokens):
        if not tokens:
            return {}
        term_counts = Counter(tokens)
        max_count = max(term_counts.values())
        return {term: count / max_count for term, count in term_counts.items()}

    def add_document(self, doc_id, content, metadata=None):
        tokens = self.tokenize(content)
        tf = self.compute_tf(tokens)

        doc = {
            'id': doc_id,
            'content': content[:500],
            'tf': tf,
            'metadata': metadata or {},
            'timestamp': datetime.now().isoformat(),
            'checksum': hashlib.sha256(content.encode()).hexdigest()[:16]
        }

        if doc_id not in self.documents:
            self.doc_count += 1

        self.documents[doc_id] = doc

        for token in tokens:
            self.vocabulary[token] = self.vocabulary.get(token, 0) + 1

        self.compute_idf()

    def compute_idf(self):
        if self.doc_count == 0:
            return

        term_doc_count = {}
        for doc in self.documents.values():
            unique_terms = set(self.tokenize(doc['content']))
            for term in unique_terms:
                term_doc_count[term] = term_doc_count.get(term, 0) + 1

        self.idf = {
            term: math.log(self.doc_count / count)
            for term, count in term_doc_count.items()
        }

    def save(self):
        self.index_path.parent.mkdir(parents=True, exist_ok=True)

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
            'stats': {
                'total_documents': self.doc_count,
                'vocabulary_size': len(self.vocabulary),
                'index_path': str(self.index_path),
                'last_updated': datetime.now().isoformat()
            }
        }

        with open(self.index_path, 'w', encoding='utf-8') as f:
            json.dump(index_data, f, indent=2, ensure_ascii=False)


def main():
    root = Path(".").resolve()
    index_path = root / "continuity" / "retrieval" / "semantic_index.json"
    indexer = SimpleIndexer(index_path)

    print(f"Building semantic index at: {index_path}\n")

    # Index snapshots
    snapshot_dir = root / "continuity"
    for snapshot_file in snapshot_dir.glob("Snapshot_*.md"):
        content = snapshot_file.read_text(encoding='utf-8')
        doc_id = f"snapshot_{snapshot_file.stem}"
        metadata = {'type': 'snapshot', 'source_file': str(snapshot_file)}
        indexer.add_document(doc_id, content, metadata)
        print(f"✓ Indexed: {snapshot_file.name}")

    # Index BOOT.json
    boot_file = root / "continuity" / "BOOT.json"
    if boot_file.exists():
        with open(boot_file) as f:
            boot_data = json.load(f)
        content = json.dumps(boot_data, indent=2)
        metadata = {'type': 'boot_config', 'version': boot_data.get('version')}
        indexer.add_document("boot_BOOT", content, metadata)
        print(f"✓ Indexed: BOOT.json")

    # Index docs
    docs_dir = root / "docs"
    for doc_file in docs_dir.glob("*.md"):
        content = doc_file.read_text(encoding='utf-8')
        doc_id = f"doc_{doc_file.stem}"
        metadata = {'type': 'documentation', 'source_file': str(doc_file)}
        indexer.add_document(doc_id, content, metadata)
        print(f"✓ Indexed: {doc_file.name}")

    indexer.save()

    print(f"\n✅ Index built successfully!")
    print(f"   Documents: {indexer.doc_count}")
    print(f"   Vocabulary: {len(indexer.vocabulary)} terms")
    print(f"   Saved to: {index_path}")


if __name__ == "__main__":
    main()
