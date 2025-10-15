#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Stopping any existing server processes...${NC}"

# Kill all processes on port 5001
lsof -ti:5001 | xargs kill -9 2>/dev/null

# Kill all ts-node-dev processes
pkill -9 -f "ts-node-dev.*server.ts" 2>/dev/null

sleep 2

# Check if port is free
if lsof -ti:5001 > /dev/null 2>&1; then
    echo -e "${RED}❌ Port 5001 is still in use!${NC}"
    echo -e "${YELLOW}Please manually kill the process or use a different port${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Port 5001 is free${NC}"
echo -e "${YELLOW}🚀 Starting server...${NC}\n"

# Start the server
npm run dev
