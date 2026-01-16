#!/bin/bash
# ActiveMirror v3.0 — Quick Start Script
# 
# Usage: ./start.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "◈ ActiveMirror v3.0 — Starting..."
echo ""

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found"
    exit 1
fi

# Check/install dependencies
echo "Checking dependencies..."
pip3 install aiohttp --quiet 2>/dev/null || true

# Check if Ollama is running
echo "Checking Ollama..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✓ Ollama is running"
    
    # Check for model
    if curl -s http://localhost:11434/api/tags | grep -q "gpt-oss"; then
        echo "✓ GPT-OSS model available"
    else
        echo "⚠ GPT-OSS model not found — pulling..."
        ollama pull gpt-oss:20b &
    fi
else
    echo "⚠ Ollama not running — starting..."
    ollama serve &
    sleep 3
fi

# Load API keys
if [ -f ~/.env.mirrordna ]; then
    source ~/.env.mirrordna
    echo "✓ API keys loaded"
else
    echo "⚠ No API keys found at ~/.env.mirrordna"
fi

# Start the inference router
echo ""
echo "Starting inference router on port 8086..."
echo "═══════════════════════════════════════════"
python3 inference_router.py
