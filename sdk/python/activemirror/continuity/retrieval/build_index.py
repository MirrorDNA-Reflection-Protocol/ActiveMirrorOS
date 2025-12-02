"""
Index Builder for Continuity Engine v2.0
Builds semantic index from continuity files
"""

import sys
from pathlib import Path
from .indexer import SemanticIndexer


def build_continuity_index(repo_root: str = ".") -> None:
    """
    Build semantic index from all continuity files.

    Args:
        repo_root: Path to repository root
    """
    root = Path(repo_root).resolve()

    # Initialize indexer
    index_path = root / "continuity" / "retrieval" / "semantic_index.json"
    indexer = SemanticIndexer(str(index_path))

    print(f"Building semantic index at: {index_path}")
    print()

    # Index snapshots
    snapshot_dir = root / "continuity"
    for snapshot_file in snapshot_dir.glob("Snapshot_*.md"):
        try:
            doc_id = indexer.index_snapshot(str(snapshot_file))
            print(f"✓ Indexed snapshot: {snapshot_file.name} → {doc_id}")
        except Exception as e:
            print(f"✗ Failed to index {snapshot_file.name}: {e}")

    # Index BOOT.json
    boot_file = root / "continuity" / "BOOT.json"
    if boot_file.exists():
        try:
            doc_id = indexer.index_boot_config(str(boot_file))
            print(f"✓ Indexed BOOT config: {boot_file.name} → {doc_id}")
        except Exception as e:
            print(f"✗ Failed to index {boot_file.name}: {e}")

    # Index documentation
    docs_dir = root / "docs"
    if docs_dir.exists():
        for doc_file in docs_dir.glob("*.md"):
            try:
                content = doc_file.read_text(encoding='utf-8')
                doc_id = f"doc_{doc_file.stem}"
                metadata = {
                    'type': 'documentation',
                    'source_file': str(doc_file),
                    'size': len(content)
                }
                indexer.add_document(doc_id, content, metadata)
                print(f"✓ Indexed doc: {doc_file.name} → {doc_id}")
            except Exception as e:
                print(f"✗ Failed to index {doc_file.name}: {e}")

    # Save index
    indexer.save()

    # Print stats
    print()
    stats = indexer.get_stats()
    print("Index built successfully!")
    print(f"Total documents: {stats['total_documents']}")
    print(f"Vocabulary size: {stats['vocabulary_size']}")
    print(f"Index saved to: {stats['index_path']}")


if __name__ == "__main__":
    repo_root = sys.argv[1] if len(sys.argv) > 1 else "."
    build_continuity_index(repo_root)
