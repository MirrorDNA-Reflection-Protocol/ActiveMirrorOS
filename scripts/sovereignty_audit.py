#!/usr/bin/env python3
"""
ACTIVE MIRROR — SOVEREIGNTY AUDIT TOOL
Enforcement Layer for the 2050 Constitution
Version: 1.0
Status: ACTIVE
"""

import os
import sys
import re
import datetime
import argparse
from typing import List, Dict, Set, Tuple

# --- CONFIGURATION & CONSTANTS ---

# 2050 Spec Patterns
PATTERNS = {
    "EXTERNAL_DEPENDENCY": {
        "severity": "CRITICAL",
        "laws": ["Law 1", "Law 3"],
        "regex": [
            r"https?://",
            r"github\.com",
            r"openai\.com",
            r"npmjs\.com",
            r"pypi\.org",
            r"notion\.so",
            r"docs\.google\.com",
        ],
        "description": "External network dependency or cloud link detected."
    },
    "ABSOLUTE_PATH": {
        "severity": "CRITICAL",
        "laws": ["Law 1"],
        "regex": [
            r"/Users/[a-zA-Z0-9_-]+",
            r"C:\\",
            r"/home/[a-zA-Z0-9_-]+"
        ],
        "description": "Absolute path detected (not portable)."
    },
    "PROPRIETARY_FORMAT_REF": {
        "severity": "CRITICAL",
        "laws": ["Law 1"],
        "regex": [
            r"\.docx",
            r"\.notion",
            r"\.evernote",
            r"\.pages",
            r"\.obsidian-canvas"
        ],
        "description": "Reference to proprietary file format."
    },
    "MODEL_AVAILABILITY": {
        "severity": "WARNING",
        "laws": ["Law 2"],
        "regex": [
            r"gpt-4",
            r"claude-3",
            r"gemini-pro",
            r"inference api",
            r"remote model"
        ],
        "description": "Potential reliance on non-local model."
    },
    "SCRIPT_NETWORK": {
        "severity": "WARNING",
        "laws": ["Law 3"],
        "regex": [
            r"requests\.get",
            r"fetch\(",
            r"urllib",
            r"web scraping",
            r"fetch latest"
        ],
        "description": "Automation assumes internet access."
    },
    "REVIEW_REQUIRED": {
        "severity": "INFO",
        "laws": ["Review"],
        "regex": [
            r"TODO.*api",
            r"FIXME.*online"
        ],
        "description": "Human judgment required."
    }
}

# File Extensions
TEXT_EXTENSIONS = {'.md', '.json', '.csv', '.py', '.js', '.txt', '.html', '.css', '.sh', '.xml', '.yaml', '.yml'}
FORBIDDEN_EXTENSIONS = {'.docx', '.notion', '.evernote', '.pages', '.obsidian-canvas'}

# Exclusions
DEFAULT_EXCLUDED_DIRS = {'.git', '99_ASSETS', '_lib', '__pycache__', 'node_modules', '.obsidian', '.trash'}
DEFAULT_EXCLUDED_FILES = {'sovereignty_audit.py', '.DS_Store'}

class Finding:
    def __init__(self, file_path: str, line_num: int, category: str, severity: str, evidence: str, laws: List[str]):
        self.file_path = file_path
        self.line_num = line_num
        self.category = category
        self.severity = severity
        self.evidence = evidence
        self.laws = laws

    def to_markdown(self) -> str:
        return (f"- File: `{self.file_path}`\n"
                f"  Line: {self.line_num}\n"
                f"  Issue: {self.category}\n"
                f"  Evidence: `{self.evidence.strip()}`\n"
                f"  Law Violated: {', '.join(self.laws)}")

class SovereigntyAuditor:
    def __init__(self, vault_path: str):
        self.vault_path = os.path.abspath(vault_path)
        self.findings: List[Finding] = []
        self.stats = {'files_scanned': 0, 'critical': 0, 'warnings': 0, 'info': 0}
        
        # Compile regexes
        self.compiled_patterns = {}
        for cat, data in PATTERNS.items():
            self.compiled_patterns[cat] = [re.compile(p, re.IGNORECASE) for p in data['regex']]

    def is_excluded(self, path: str) -> bool:
        parts = path.split(os.sep)
        for part in parts:
            if part in DEFAULT_EXCLUDED_DIRS:
                return True
        if os.path.basename(path) in DEFAULT_EXCLUDED_FILES:
            return True
        return False

    def scan_file_content(self, file_path: str, rel_path: str):
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                for i, line in enumerate(f, 1):
                    line_content = line.strip()
                    if not line_content:
                        continue
                        
                    for cat, regexes in self.compiled_patterns.items():
                        for regex in regexes:
                            match = regex.search(line_content)
                            if match:
                                severity = PATTERNS[cat]['severity']
                                laws = PATTERNS[cat]['laws']
                                evidence = match.group(0) # or line_content[:50] + "..."
                                
                                # Dedup: Don't report same category on same line multiple times
                                # But actually, we might want to capture all. For now, multiple findings per line allowed.
                                
                                finding = Finding(rel_path, i, cat, severity, evidence, laws)
                                self.findings.append(finding)
                                
                                if severity == 'CRITICAL':
                                    self.stats['critical'] += 1
                                elif severity == 'WARNING':
                                    self.stats['warnings'] += 1
                                elif severity == 'INFO':
                                    self.stats['info'] += 1

        except Exception as e:
            print(f"Error reading {rel_path}: {e}", file=sys.stderr)

    def scan_file_metadata(self, file_path: str, rel_path: str):
        # Check forbidden extensions
        _, ext = os.path.splitext(file_path)
        if ext in FORBIDDEN_EXTENSIONS:
            finding = Finding(rel_path, 0, "PROPRIETARY_FORMAT_REF", "CRITICAL", f"File extension {ext}", ["Law 1"])
            self.findings.append(finding)
            self.stats['critical'] += 1

    def run(self):
        print(f"Starting Sovereignty Audit on: {self.vault_path}")
        start_time = datetime.datetime.now()
        
        for root, dirs, files in os.walk(self.vault_path):
            # Prune excluded dirs
            dirs[:] = [d for d in dirs if d not in DEFAULT_EXCLUDED_DIRS]
            
            for file in files:
                full_path = os.path.join(root, file)
                if self.is_excluded(full_path):
                    continue
                
                rel_path = os.path.relpath(full_path, self.vault_path)
                self.stats['files_scanned'] += 1
                
                # Metadata scan
                self.scan_file_metadata(full_path, rel_path)
                
                # Content scan (text only)
                _, ext = os.path.splitext(file)
                if ext in TEXT_EXTENSIONS:
                    self.scan_file_content(full_path, rel_path)
        
        duration = datetime.datetime.now() - start_time
        print(f"Audit complete in {duration.total_seconds():.2f}s. Files: {self.stats['files_scanned']}")

    def generate_report(self) -> str:
        date_str = datetime.datetime.now().strftime("%Y-%m-%d")
        
        # Sort findings: Critical -> Warning -> Info
        severity_order = {'CRITICAL': 0, 'WARNING': 1, 'INFO': 2}
        self.findings.sort(key=lambda x: (severity_order.get(x.severity, 3), x.file_path, x.line_num))
        
        report = []
        report.append(f"# Sovereignty Audit Report")
        report.append(f"Date: {date_str}")
        report.append(f"Vault Path: {self.vault_path}")
        report.append(f"Audit Version: 1.0")
        report.append(f"")
        report.append(f"## Summary")
        report.append(f"- Files Scanned: {self.stats['files_scanned']}")
        report.append(f"- Critical Findings: {self.stats['critical']}")
        report.append(f"- Warnings: {self.stats['warnings']}")
        report.append(f"- Info Notes: {self.stats['info']}")
        report.append(f"")
        
        # Sections
        for level in ['CRITICAL', 'WARNING', 'INFO']:
            section_title = "Critical Violations" if level == 'CRITICAL' else "Warnings" if level == 'WARNING' else "Info / Review Required"
            report.append(f"## {section_title}")
            
            level_findings = [f for f in self.findings if f.severity == level]
            if not level_findings:
                report.append("None detected.")
            else:
                for f in level_findings:
                    report.append(f.to_markdown())
            report.append("")
            
        report.append("## Auditor Notes")
        report.append("(Auto-generated by Sovereignty Audit Tool v1.0)")
        
        return "\n".join(report)

def main():
    parser = argparse.ArgumentParser(description="Active Mirror Sovereignty Audit Tool")
    parser.add_argument("vault_path", nargs="?", default=os.getcwd(), help="Path to the Vault to scan")
    parser.add_argument("--output", "-o", help="Output file path")
    
    args = parser.parse_args()
    
    vault_path = os.path.abspath(args.vault_path)
    if not os.path.isdir(vault_path):
        print(f"Error: Vault path does not exist: {vault_path}", file=sys.stderr)
        sys.exit(1)
        
    auditor = SovereigntyAuditor(vault_path)
    auditor.run()
    
    report_content = auditor.generate_report()
    
    # Determine output path
    if args.output:
        out_path = args.output
    else:
        date_str = datetime.datetime.now().strftime("%Y-%m-%d")
        out_path = f"sovereignty_audit_report_{date_str}.md"
        
    try:
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(report_content)
        print(f"Report written to: {out_path}")
    except Exception as e:
        print(f"Error writing report: {e}", file=sys.stderr)
        # Fallback print
        print(report_content)

if __name__ == "__main__":
    main()
