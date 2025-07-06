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
    const address = formData.get('address') as string;

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
    const imageBuffer = new Uint8Array(bytes);
    let processedBuffer = Buffer.from(imageBuffer);

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
    console.log('Processing image for property suggestions:', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      detectedMimeType: actualMimeType,
      originalMimeType: imageFile.type,
      base64Length: base64Image.length,
      hasAddress: !!address,
      address: address || 'not provided',
    });

    // Generate property suggestions using Ollama Vision model
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
            prompt: `You are viewing a photograph of a real estate property. Analyze this property and provide specific suggestions for a real estate listing form based on THE PROPERTY you can see in the photograph.

${
  address
    ? `Property Address/Location: ${address}

Consider this location information when making your suggestions, especially for pricing, property type expectations, and market context for this area. When suggesting price, use the appropriate currency for the country where this address is located (e.g., USD for United States, CAD for Canada, EUR for European countries, GBP for United Kingdom, AUD for Australia, etc.).

`
    : ''
}Look at the actual property in the photo and respond with a JSON object containing these fields:

{
  "title": "Suggested property title for this specific property (be specific and appealing based on what you see${address ? ` and the location: ${address}` : ''}, e.g., 'Modern 3-Bedroom Colonial with Garden Views')",
  "propertyType": "Choose one based on this property: house, apartment, condo, townhouse, or commercial",
  "bedrooms": "Number of bedrooms you can estimate for this property (as integer, or null if unclear)",
  "bathrooms": "Number of bathrooms you can estimate for this property (as number with decimals allowed, or null if unclear)",
  "squareFootage": "Estimated square footage of this property (as integer, or null if unclear)",
  "yearBuilt": "Estimated year this property was built based on its architectural style (as integer, or null if unclear)",
  "price": "Suggested price range for this property based on its type, visible features${address ? `, and the location (${address}) in the appropriate local currency` : ''} (as integer, or null if unclear)",
  "currency": "${address ? 'The appropriate currency code for the country (e.g., USD, EUR, GBP, CAD, AUD, etc.)' : 'Currency code if price is suggested (optional)'}",
  "description": "Detailed description of this property focusing on what you can see${address ? ` and mentioning the location context` : ''}",
  "features": ["Array of notable features visible in this property${address ? ' and location-relevant amenities' : ''}"],
  "confidence": "Your confidence level in these suggestions about this property (low/medium/high)"
}

Focus on what you can actually see about this specific property${address ? ` and consider the location context for pricing and market expectations` : ''}. Be conservative with estimates when unclear. Provide realistic values based on this property's type and visible characteristics${address ? ` and the specified location` : ''}.

IMPORTANT: Do NOT describe furniture, appliances, decorations, personal belongings, or other movable items. Focus only on permanent structural features, built-in elements, and architectural details of the property itself.

IMPORTANT: Respond ONLY with valid JSON. Do not include any other text before or after the JSON.`,
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
        let suggestions = result.response;

        if (!suggestions) {
          throw new Error('No suggestions returned from model');
        }

        // Try to parse as JSON
        try {
          // Clean up the response - remove any markdown code blocks
          suggestions = suggestions
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
          const parsedSuggestions = JSON.parse(suggestions);

          // Validate the response structure
          if (
            typeof parsedSuggestions !== 'object' ||
            parsedSuggestions === null
          ) {
            throw new Error('Invalid suggestions format');
          }

          return NextResponse.json({ suggestions: parsedSuggestions });
        } catch (parseError) {
          // If JSON parsing fails, return the raw response as description
          // eslint-disable-next-line no-console
          console.warn(
            'Failed to parse suggestions as JSON, using as description:',
            parseError,
          );

          return NextResponse.json({
            suggestions: {
              title: 'Property Listing',
              description: suggestions,
              confidence: 'low',
              features: [],
              propertyType: null,
              bedrooms: null,
              bathrooms: null,
              squareFootage: null,
              yearBuilt: null,
              price: null,
            },
          });
        }
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
      console.error('Error generating property suggestions:', error);
    }

    // Provide more specific error messages
    let errorMessage = 'Failed to generate property suggestions';

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
