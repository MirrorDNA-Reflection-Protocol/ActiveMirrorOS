#!/bin/bash
# ActiveMirror v3 Dev Server Startup

DIR="$(cd "$(dirname "$0")" && pwd)"
PORT=8087

# Kill any existing server on the port
echo "◈ Stopping existing servers on port $PORT..."
lsof -ti :$PORT | xargs kill -9 2>/dev/null

sleep 1

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "⚠ Node.js not found. Falling back to Python..."
    cd "$DIR"
    python3 -m http.server $PORT &
    echo "◈ Python server started on http://localhost:$PORT/"
    exit 0
fi

# Start Node server
cd "$DIR"
echo "◈ Starting Node.js dev server..."
node server.js

# If Node fails, fall back to Python
if [ $? -ne 0 ]; then
    echo "⚠ Node failed, falling back to Python..."
    python3 -m http.server $PORT
fi
