#!/bin/bash

# Check status of development services for Property Marketplace

echo "📊 Property Marketplace Development Environment Status"
echo "=================================================="

# Function to check service status with colored output
check_service() {
  local service_name="$1"
  local check_command="$2"
  local url="$3"
  
  printf "%-20s" "$service_name:"
  
  if eval "$check_command" > /dev/null 2>&1; then
    echo "✅ Running${url:+ ($url)}"
  else
    echo "❌ Not running"
  fi
}

# Check Ollama
check_service "Ollama API" "curl -s http://localhost:11434/api/tags" "http://localhost:11434"

# Check if llava model is available
printf "%-20s" "LLaVA Model:"
if command -v ollama > /dev/null 2>&1 && ollama list 2>/dev/null | grep -q "llava:latest"; then
  echo "✅ Available"
else
  echo "❌ Not available"
fi

# Check Next.js servers
for port in 3000 3001 3002; do
  check_service "Next.js :$port" "curl -s http://localhost:$port" "http://localhost:$port"
done

# Check if processes are running
echo ""
echo "📋 Process Information:"
echo "======================"

# Ollama process
ollama_pid=$(pgrep -f "ollama serve" 2>/dev/null)
if [ -n "$ollama_pid" ]; then
  echo "Ollama Process: PID $ollama_pid"
else
  echo "Ollama Process: Not running"
fi

# Next.js processes
for port in 3000 3001 3002; do
  nextjs_pid=$(lsof -ti:$port 2>/dev/null)
  if [ -n "$nextjs_pid" ]; then
    echo "Next.js :$port: PID $nextjs_pid"
  fi
done

echo ""
echo "💡 Quick Actions:"
echo "================"
echo "Start all services: ./start-dev.sh"
echo "Stop all services:  ./stop-dev.sh"
echo "Test APIs:          ./test-description-api.sh"
echo "Test suggestions:   ./test-suggestions-api.sh"
