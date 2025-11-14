#!/bin/bash
#
# ActiveMirrorOS cURL Examples
#
# Note: ActiveMirrorOS is primarily a local SDK, not a web service.
# These examples show how to integrate ActiveMirrorOS with HTTP APIs
# by wrapping the SDK in a simple REST API server.
#
# Usage:
#   1. Start the example server (see api_examples.md)
#   2. Run these cURL commands
#

set -e

# Configuration
API_BASE="http://localhost:3000/api"
SESSION_ID="curl-demo-session"

echo "========================================="
echo "ActiveMirrorOS cURL Examples"
echo "========================================="
echo ""
echo "Prerequisites:"
echo "  - Example API server running on port 3000"
echo "  - See api_examples.md for server setup"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Example 1: Create a session
echo -e "${BLUE}Example 1: Create a Session${NC}"
curl -X POST "${API_BASE}/sessions" \
  -H "Content-Type: application/json" \
  -d "{
    \"session_id\": \"${SESSION_ID}\",
    \"metadata\": {
      \"project\": \"API Demo\",
      \"created_via\": \"curl\"
    }
  }" | jq '.'

echo -e "${GREEN}✓ Session created${NC}\n"
sleep 1


# Example 2: Add a message
echo -e "${BLUE}Example 2: Add a Message${NC}"
curl -X POST "${API_BASE}/sessions/${SESSION_ID}/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "user",
    "content": "Hello from cURL! Testing ActiveMirrorOS API."
  }' | jq '.'

echo -e "${GREEN}✓ Message added${NC}\n"
sleep 1


# Example 3: Add assistant response
echo -e "${BLUE}Example 3: Add Assistant Response${NC}"
curl -X POST "${API_BASE}/sessions/${SESSION_ID}/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "assistant",
    "content": "Hi! I received your message via the API. ActiveMirrorOS is persisting this conversation."
  }' | jq '.'

echo -e "${GREEN}✓ Assistant response added${NC}\n"
sleep 1


# Example 4: Get session context
echo -e "${BLUE}Example 4: Get Session Context${NC}"
curl -X GET "${API_BASE}/sessions/${SESSION_ID}" \
  -H "Accept: application/json" | jq '.'

echo -e "${GREEN}✓ Session context retrieved${NC}\n"
sleep 1


# Example 5: List all sessions
echo -e "${BLUE}Example 5: List All Sessions${NC}"
curl -X GET "${API_BASE}/sessions" \
  -H "Accept: application/json" | jq '.'

echo -e "${GREEN}✓ Sessions listed${NC}\n"
sleep 1


# Example 6: Export session (markdown)
echo -e "${BLUE}Example 6: Export Session (Markdown)${NC}"
curl -X GET "${API_BASE}/sessions/${SESSION_ID}/export?format=markdown" \
  -H "Accept: text/markdown" \
  -o "${SESSION_ID}.md"

echo "Exported to: ${SESSION_ID}.md"
cat "${SESSION_ID}.md"
echo -e "${GREEN}✓ Session exported${NC}\n"
sleep 1


# Example 7: Export session (JSON)
echo -e "${BLUE}Example 7: Export Session (JSON)${NC}"
curl -X GET "${API_BASE}/sessions/${SESSION_ID}/export?format=json" \
  -H "Accept: application/json" | jq '.'

echo -e "${GREEN}✓ Session exported as JSON${NC}\n"
sleep 1


# Example 8: Add multiple messages (batch)
echo -e "${BLUE}Example 8: Add Multiple Messages (Batch)${NC}"
curl -X POST "${API_BASE}/sessions/${SESSION_ID}/messages/batch" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "What are the key features of ActiveMirrorOS?"
      },
      {
        "role": "assistant",
        "content": "Key features: 1) Persistent memory, 2) Cross-session continuity, 3) Encrypted storage, 4) Reflective dialogue"
      },
      {
        "role": "user",
        "content": "How does it compare to standard AI?"
      },
      {
        "role": "assistant",
        "content": "Standard AI forgets after each session. ActiveMirrorOS remembers forever."
      }
    ]
  }' | jq '.'

echo -e "${GREEN}✓ Batch messages added${NC}\n"
sleep 1


# Example 9: Search messages
echo -e "${BLUE}Example 9: Search Messages${NC}"
curl -X GET "${API_BASE}/sessions/${SESSION_ID}/search?q=features" \
  -H "Accept: application/json" | jq '.'

echo -e "${GREEN}✓ Messages searched${NC}\n"
sleep 1


# Example 10: Get session statistics
echo -e "${BLUE}Example 10: Get Session Statistics${NC}"
curl -X GET "${API_BASE}/sessions/${SESSION_ID}/stats" \
  -H "Accept: application/json" | jq '.'

echo -e "${GREEN}✓ Statistics retrieved${NC}\n"
sleep 1


# Example 11: Update session metadata
echo -e "${BLUE}Example 11: Update Session Metadata${NC}"
curl -X PATCH "${API_BASE}/sessions/${SESSION_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {
      "project": "API Demo",
      "status": "completed",
      "updated_via": "curl"
    }
  }' | jq '.'

echo -e "${GREEN}✓ Metadata updated${NC}\n"
sleep 1


# Example 12: Delete a session
echo -e "${BLUE}Example 12: Delete a Session${NC}"
read -p "Delete the demo session? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    curl -X DELETE "${API_BASE}/sessions/${SESSION_ID}" \
      -H "Accept: application/json" | jq '.'
    echo -e "${GREEN}✓ Session deleted${NC}\n"
else
    echo "Skipped deletion\n"
fi


# Summary
echo "========================================="
echo "✅ All cURL Examples Completed!"
echo "========================================="
echo ""
echo "What you learned:"
echo "  • Creating sessions via HTTP API"
echo "  • Adding messages (single and batch)"
echo "  • Retrieving session context"
echo "  • Exporting sessions (markdown, JSON)"
echo "  • Searching and filtering messages"
echo "  • Managing session metadata"
echo "  • Deleting sessions"
echo ""
echo "Next steps:"
echo "  1. Review api_examples.md for server implementation"
echo "  2. Integrate with your own HTTP API"
echo "  3. Add authentication and rate limiting"
echo "  4. Deploy to production"
echo ""
