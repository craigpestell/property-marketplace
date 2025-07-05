import { NextRequest, NextResponse } from 'next/server';

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

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 },
      );
    }

    // Convert image to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Generate description using Ollama Vision model
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
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const result = await response.json();
    const description = result.response;

    if (!description) {
      return NextResponse.json(
        { error: 'Failed to generate description' },
        { status: 500 },
      );
    }

    return NextResponse.json({ description });
  } catch (error) {
    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error generating description:', error);
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate description',
      },
      { status: 500 },
    );
  }
}
