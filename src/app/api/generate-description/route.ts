import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

// Use Ollama for local development instead of OpenAI
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llava:latest';

export async function POST(request: NextRequest) {
  try {
    // Check if Ollama is available (for local development)
    let isOllamaAvailable = false;
    try {
      const healthCheck = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      isOllamaAvailable = healthCheck.ok;
    } catch {
      isOllamaAvailable = false;
    }

    if (!isOllamaAvailable) {
      return NextResponse.json(
        { error: 'Ollama not running. Please start Ollama with: ollama serve' },
        { status: 500 },
      );
    }

    let formData;
    try {
      formData = await request.formData();
    } catch (error) {
      return NextResponse.json(
        {
          error:
            'Invalid request format. Please send image as multipart/form-data with "image" field.',
        },
        { status: 400 },
      );
    }

    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 },
      );
    }

    // Check file type and size
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: 'Image file too large. Maximum size is 10MB.' },
        { status: 400 },
      );
    }

    // Get file extension for better type detection
    const fileName = imageFile.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();

    // Determine actual MIME type based on extension if needed
    let actualMimeType = imageFile.type;
    if (actualMimeType === 'application/octet-stream' || !actualMimeType) {
      switch (fileExtension) {
        case 'jpg':
        case 'jpeg':
          actualMimeType = 'image/jpeg';
          break;
        case 'png':
          actualMimeType = 'image/png';
          break;
        case 'webp':
          actualMimeType = 'image/webp';
          break;
        case 'gif':
          actualMimeType = 'image/gif';
          break;
        case 'bmp':
          actualMimeType = 'image/bmp';
          break;
        default:
          actualMimeType = imageFile.type;
      }
    }

    // Supported image types - prioritize formats that work well with llava
    const supportedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/bmp',
    ];

    if (!supportedTypes.includes(actualMimeType)) {
      return NextResponse.json(
        {
          error: `Unsupported image type: ${actualMimeType}. Supported types: ${supportedTypes.join(', ')}`,
        },
        { status: 400 },
      );
    }

    // Convert image to buffer and process with sharp
    const bytes = await imageFile.arrayBuffer();
    let processedBuffer = Buffer.from(bytes);

    // Convert problematic formats (WebP, GIF, BMP) to JPEG for better compatibility
    if (['image/webp', 'image/gif', 'image/bmp'].includes(actualMimeType)) {
      // eslint-disable-next-line no-console
      console.log(
        `Converting ${actualMimeType} to JPEG for better model compatibility...`,
      );

      try {
        processedBuffer = await sharp(processedBuffer)
          .jpeg({ quality: 90 })
          .toBuffer();
      } catch (conversionError) {
        // eslint-disable-next-line no-console
        console.error('Image conversion failed:', conversionError);
        return NextResponse.json(
          {
            error:
              'Failed to process image. Please try with a JPEG or PNG format.',
          },
          { status: 400 },
        );
      }
    }

    // Convert to base64
    const base64Image = processedBuffer.toString('base64');

    // eslint-disable-next-line no-console
    console.log('Processing image:', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      detectedMimeType: actualMimeType,
      originalMimeType: imageFile.type,
      base64Length: base64Image.length,
    });

    // Generate description using Ollama Vision model
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: OLLAMA_MODEL,
            prompt: `Analyze this property image and generate a detailed, professional real estate description. Focus on:

1. Property type and architectural style
2. Exterior features (siding, roofing, windows, doors)
3. Landscaping and outdoor spaces
4. Overall condition and appeal
5. Notable features that would attract buyers

Write in a compelling, professional tone suitable for a real estate listing. Keep it between 100-200 words. Do not make assumptions about interior features you cannot see.`,
            images: [base64Image],
            stream: false,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();

          // Check if it's a vision embedding error
          if (errorText.includes('unable to make llava embedding from image')) {
            if (retryCount < maxRetries) {
              // eslint-disable-next-line no-console
              console.log(
                `Vision embedding failed, retrying... (${retryCount + 1}/${maxRetries + 1})`,
              );

              // Try to reload the model
              await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  model: OLLAMA_MODEL,
                  prompt: 'test',
                  stream: false,
                }),
              });

              retryCount++;
              continue;
            } else {
              throw new Error(
                'Unable to process this image format. Please try with a JPEG or PNG image.',
              );
            }
          }

          // eslint-disable-next-line no-console
          console.error('Ollama API error details:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          throw new Error(
            `Ollama API error: ${response.statusText}. Details: ${errorText}`,
          );
        }

        const result = await response.json();
        const description = result.response;

        if (!description) {
          throw new Error('No description returned from model');
        }

        return NextResponse.json({ description });
      } catch (fetchError) {
        if (
          retryCount < maxRetries &&
          (fetchError as Error).message.includes('embedding')
        ) {
          retryCount++;
          continue;
        }
        throw fetchError;
      }
    }
  } catch (error) {
    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error generating description:', error);
    }

    // Provide more specific error messages
    let errorMessage = 'Failed to generate description';

    if (error instanceof Error) {
      if (error.message.includes('unable to make llava embedding from image')) {
        errorMessage =
          'Unable to process this image format. The vision model had trouble reading this image. Please try with a JPEG or PNG format image, or ensure the image is not corrupted.';
      } else if (error.message.includes('embedding')) {
        errorMessage =
          'Image processing error. Please try with a different image format (JPEG or PNG recommended).';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
