#!/bin/bash

# Test the generate-suggestions API with a property image

echo "Testing the generate-suggestions API..."

# Create a simple test image (1x1 red pixel)
echo "Creating test PNG image..."
echo -n "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" | base64 -d > test_property.png

# Check if server is running on port 3000, 3001, or 3002
PORT=""
for port in 3002 3001 3000; do
  # Test with a basic GET request to see if Next.js is running
  if curl -s http://localhost:$port > /dev/null 2>&1; then
    PORT=$port
    break
  fi
done

if [ -z "$PORT" ]; then
  echo "Error: Next.js server not running on any of the expected ports (3000, 3001, 3002)"
  echo "Please start the Next.js server with: pnpm dev"
  exit 1
fi

echo "Found server running on port $PORT"

# Test the generate-suggestions API
echo "Testing property suggestions generation (without address)..."
response=$(curl -s -X POST http://localhost:$PORT/api/generate-suggestions \
  -F "image=@test_property.png" \
  -w "HTTP Status: %{http_code}\n")

echo "API Response (without address):"
echo "$response"

echo -e "\nTesting property suggestions generation (US address - USD)..."
response_us=$(curl -s -X POST http://localhost:$PORT/api/generate-suggestions \
  -F "image=@test_property.png" \
  -F "address=123 Main Street, San Francisco, CA 94102, USA" \
  -w "HTTP Status: %{http_code}\n")

echo "API Response (US address):"
echo "$response_us"

echo -e "\nTesting property suggestions generation (UK address - GBP)..."
response_uk=$(curl -s -X POST http://localhost:$PORT/api/generate-suggestions \
  -F "image=@test_property.png" \
  -F "address=10 Downing Street, London SW1A 2AA, United Kingdom" \
  -w "HTTP Status: %{http_code}\n")

echo "API Response (UK address):"
echo "$response_uk"

echo -e "\nTesting property suggestions generation (Canada address - CAD)..."
response_ca=$(curl -s -X POST http://localhost:$PORT/api/generate-suggestions \
  -F "image=@test_property.png" \
  -F "address=24 Sussex Drive, Ottawa, ON K1M 1M4, Canada" \
  -w "HTTP Status: %{http_code}\n")

echo "API Response (Canada address):"
echo "$response_ca"

echo -e "\nTesting property suggestions generation (Germany address - EUR)..."
response_de=$(curl -s -X POST http://localhost:$PORT/api/generate-suggestions \
  -F "image=@test_property.png" \
  -F "address=Unter den Linden 1, 10117 Berlin, Germany" \
  -w "HTTP Status: %{http_code}\n")

echo "API Response (Germany address):"
echo "$response_de"

# Clean up
rm -f test_property.png

echo -e "\nTest completed!"
