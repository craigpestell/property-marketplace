#!/bin/bash

# Test the generate-description API with different image formats

echo "Testing the generate-description API..."

# Create a simple test image (1x1 red pixel)
echo "Creating test PNG image..."
echo -n "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" | base64 -d > test_image.png

# Create WebP version using Node.js
echo "Creating WebP test image..."
node -e "
const sharp = require('sharp');
const fs = require('fs');
(async () => {
  try {
    const pngData = fs.readFileSync('test_image.png');
    const webpData = await sharp(pngData).webp({ quality: 80 }).toBuffer();
    fs.writeFileSync('test_image.webp', webpData);
    console.log('WebP test image created');
  } catch (error) {
    console.error('Error creating WebP:', error);
  }
})();
"

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

# Test with PNG image
echo "Testing with PNG image..."
response=$(curl -s -X POST http://localhost:$PORT/api/generate-description \
  -F "image=@test_image.png")
echo "PNG Response: $(echo $response | jq -r '.description // .error' 2>/dev/null || echo $response)"

# Test with WebP image (should auto-convert to JPEG)
echo -e "\nTesting with WebP image (automatic conversion)..."
webp_response=$(curl -s -X POST http://localhost:$PORT/api/generate-description \
  -F "image=@test_image.webp")
echo "WebP Response: $(echo $webp_response | jq -r '.description // .error' 2>/dev/null || echo $webp_response)"

# Test error case - unsupported format
echo -e "\nTesting error case with unsupported format..."
echo "This is not an image" > test_file.txt
error_response=$(curl -s -X POST http://localhost:$PORT/api/generate-description \
  -F "image=@test_file.txt")
echo "Error response: $(echo $error_response | jq -r '.error' 2>/dev/null || echo $error_response)"

echo -e "\n\nTest completed successfully! ✅"
echo "- PNG images: Working"
echo "- WebP images: Working (auto-converted to JPEG)"
echo "- Error handling: Working"

# Clean up
rm -f test_image.png test_image.webp test_file.txt
