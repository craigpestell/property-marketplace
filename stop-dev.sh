#!/bin/bash

# Stop development services for Property Marketplace

echo "🛑 Stopping Property Marketplace Development Environment..."

# Function to stop Next.js servers
stop_nextjs() {
  echo "⚡ Stopping Next.js development servers..."
  
  for port in 3000 3001 3002; do
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ -n "$pid" ]; then
      echo "   Stopping server on port $port (PID: $pid)"
      kill -TERM $pid 2>/dev/null || kill -KILL $pid 2>/dev/null
    fi
  done
}

# Function to stop Ollama
stop_ollama() {
  echo "📡 Stopping Ollama service..."
  
  # Try to stop via brew services first
  if command -v brew > /dev/null 2>&1 && brew services list | grep ollama | grep -q started; then
    echo "   Using Homebrew to stop Ollama..."
    brew services stop ollama
  else
    # Stop Ollama process directly
    local pid=$(pgrep -f "ollama serve" 2>/dev/null)
    if [ -n "$pid" ]; then
      echo "   Stopping Ollama process (PID: $pid)"
      kill -TERM $pid 2>/dev/null || kill -KILL $pid 2>/dev/null
    else
      echo "   No running Ollama process found"
    fi
  fi
}

# Main execution
echo ""
echo "=== Stopping Development Services ==="

stop_nextjs
echo ""
stop_ollama

echo ""
echo "✅ Development environment stopped"
echo ""
echo "To restart, run: ./start-dev.sh"
