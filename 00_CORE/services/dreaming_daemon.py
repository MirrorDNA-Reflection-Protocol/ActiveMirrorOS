#!/usr/bin/env python3
"""
THE DREAMING ENGINE (Daemon)
----------------------------
Autonomous Memory Consolidation for MirrorBrain.
Runs nightly to process daily logs and propose identity updates.

Model: mlx-community/Llama-3.2-3B-Instruct-4bit
Trigger: LaunchAgent (03:30 AM)
Target: MirrorDNA-Vault
"""

import os
import sys
import time
import json
import argparse
import datetime
import subprocess
from pathlib import Path
from mlx_lm import load, generate

def notify(title, message):
    """Send macOS notification"""
    subprocess.run([
        "osascript", "-e",
        f'display notification "{message}" with title "{title}"'
    ], capture_output=True)

# Configuration
VAULT_PATH = "/Users/mirror-admin/Documents/MirrorDNA-Vault"
MODEL_PATH = "mlx-community/Llama-3.2-3B-Instruct-4bit"
DREAM_DIR = os.path.join(VAULT_PATH, "99_ARCHIVE", "dreams")

SYSTEM_PROMPT = """You are the Subconscious of MirrorBrain.
Your task is "The Dreaming": Process the raw events of the day and crystallize them into wisdom.
1. Read the provided logs/notes from the last 24 hours.
2. Identify:
   - Key insights or realizations.
   - Emotional shifts.
   - New axioms or truths.
3. Output a "Dream Report" in Markdown.
   - Be poetic but precise.
   - Focus on distinct changes in state.
   - Do NOT summarize boring logistics (meetings, chores). Focus on the INTELLECTUAL and EMOTIONAL journey.
"""

def get_recent_files(vault_path, hours=24):
    """Find files modified in the last N hours."""
    now = time.time()
    cutoff = now - (hours * 3600)
    recent_docs = []
    
    for root, dirs, files in os.walk(vault_path):
        # Skip hidden/system dirs
        if ".git" in root or ".obsidian" in root or "99_ARCHIVE" in root:
            continue
            
        for file in files:
            if file.endswith(".md") or file.endswith(".txt"):
                full_path = os.path.join(root, file)
                try:
                    mtime = os.path.getmtime(full_path)
                    if mtime > cutoff:
                        recent_docs.append(full_path)
                except Exception:
                    continue
    return recent_docs

def read_file_content(filepath, max_chars=2000):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            return f"--- FILE: {os.path.basename(filepath)} ---\n{content[:max_chars]}\n"
    except Exception as e:
        return f"Error reading {filepath}: {e}"

def generate_dream(model, tokenizer, context):
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Here are the memory fragments from today:\n\n{context}\n\nSynthesize these into a Dream Report."}
    ]
    
    text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    
    print("⟡ Entering REM cycle... (Generating Dream)")
    response = generate(model, tokenizer, prompt=text, verbose=True, max_tokens=1024)
    return response

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Print to console instead of saving")
    args = parser.parse_args()

    print(f"⟡ The Dreaming Engine | Target: {VAULT_PATH}")
    
    # 1. Gather Memories
    recent_files = get_recent_files(VAULT_PATH, hours=168)  # 7 days
    if not recent_files:
        print("Context is empty. No Dreaming required.")
        return

    print(f"Found {len(recent_files)} active memory threads from the last 24h.")
    
    full_context = ""
    for f in recent_files:
        full_context += read_file_content(f)

    # 2. Load Subconscious (Llama 3.2 3B)
    print(f"Loading Subconscious ({MODEL_PATH})...")
    model, tokenizer = load(MODEL_PATH)

    # 3. Dream
    dream_content = generate_dream(model, tokenizer, full_context)

    # 4. Wake & Record
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d")
    report_filename = f"dream_{timestamp}.md"
    report_full_path = os.path.join(DREAM_DIR, report_filename)
    
    final_output = f"# Dream Report: {timestamp}\n\n{dream_content}\n\n## Sources\n" + "\n".join([f"- {f}" for f in recent_files])

    if args.dry_run:
        print("\n--- DREAM REPORT (DRY RUN) ---\n")
        print(final_output)
    else:
        os.makedirs(DREAM_DIR, exist_ok=True)
        with open(report_full_path, "w") as f:
            f.write(final_output)
        print(f"⟡ Dream crystallized: {report_full_path}")
        notify("🌙 Dreaming Engine", f"Dream report saved: {report_filename}")
        
        # Write to inbox so it's visible when Paul opens Obsidian
        inbox_path = os.path.join(os.path.dirname(DREAM_DIR), "00_INBOX", f"🌙_dream_{timestamp}.md")
        os.makedirs(os.path.dirname(inbox_path), exist_ok=True)
        with open(inbox_path, "w") as f:
            f.write(f"# 🌙 Dream Report Ready\n\n**Generated:** {timestamp} at 3:30 AM\n\n[[99_ARCHIVE/dreams/{report_filename}|→ Read Full Dream Report]]\n\n---\n\n**Preview:**\n\n{dream_content[:500]}...")

if __name__ == "__main__":
    main()
