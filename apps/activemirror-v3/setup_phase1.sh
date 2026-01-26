#!/bin/bash
# ActiveMirror Phase 1 Setup & Launch
# Vendors Sovereign Memory, installs deps, and launches App
# ---------------------------------------------------------

set -e

# Configuration
APP_DIR="$HOME/repos/ActiveMirrorOS/apps/activemirror-v3"
MEMORY_SRC="$HOME/repos/sovereign-memory/src/sovereign_memory"
MEMORY_DEST="$APP_DIR/sovereign_memory"

echo "⟡ ActiveMirror Phase 1: Setup & Launch"
echo "--------------------------------------"

# 1. Vendor Sovereign Memory (Law 3: Vendor Zero)
if [ ! -d "$MEMORY_DEST" ]; then
    echo "Creating symlink to Sovereign Memory..."
    ln -s "$MEMORY_SRC" "$MEMORY_DEST"
else
    echo "✓ Sovereign Memory link exists"
fi

# 2. Install Python Dependencies
echo "Installing Python dependencies..."
# We need aiohttp and sentence-transformers (for local embedding) or requests (for Ollama embedding)
pip3 install aiohttp requests sentence-transformers --quiet 2>/dev/null || true
echo "✓ Python deps installed"

# 3. Check for Server Dependencies (Node)
# Assuming simple http server doesn't need npm install, standard node modules

# 4. Launch Backend (Inference Router + RAG)
echo "Starting Inference Router (Backend)..."
cd "$APP_DIR"
python3 inference_router.py > backend.log 2>&1 &
BACKEND_PID=$!
echo "✓ Backend running (PID $BACKEND_PID)"

# 5. Launch Frontend (Web Server)
echo "Starting Web Server (Frontend)..."
node server.js > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✓ Frontend running (PID $FRONTEND_PID)"

echo "--------------------------------------"
echo "🚀 Active Mirror MVP Live!"
echo "   GUI: http://localhost:8087/?v=dark"
echo "   API: http://localhost:8086"
echo ""
echo "Press Ctrl+C to stop both services."
echo "--------------------------------------"

# Trap interrupt to kill background processes
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit
}

trap cleanup SIGINT SIGTERM

# Keep script running
wait
