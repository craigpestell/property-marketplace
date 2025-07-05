# Ollama Setup for Local AI Development

This project uses Ollama for local AI-powered property description generation instead of external APIs like OpenAI.

## Installation

### 1. Install Ollama

**macOS:**

```bash
brew install --cask ollama
```

**Linux:**

```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download from https://ollama.ai/download

### 2. Start Ollama Service

```bash
ollama serve
```

This starts the Ollama API server on `http://localhost:11434`

### 3. Install Vision Model

For property image analysis, install the LLaVA (Large Language and Vision Assistant) model:

```bash
# Install the default LLaVA model (recommended)
ollama pull llava:latest

# Or install a specific version
ollama pull llava:7b
ollama pull llava:13b
```

### 4. Test the Setup

You can test if everything is working:

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Test the vision model (optional)
ollama run llava:latest "Describe this image" --image path/to/your/image.jpg
```

## Configuration

The application will automatically detect if Ollama is running. You can customize the configuration in your `.env` file:

```env
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llava:latest
```

## Usage

1. Start Ollama: `ollama serve`
2. Make sure the LLaVA model is installed: `ollama pull llava:latest`
3. Start your Next.js development server: `npm run dev`
4. Upload an image in the property form and click "✨ Generate from Image"

## Models

**Recommended models for property descriptions:**

- `llava:latest` - Good balance of speed and quality
- `llava:7b` - Faster, lighter model
- `llava:13b` - Higher quality, slower
- `bakllava` - Alternative vision model

## Troubleshooting

**"Ollama not running" error:**

- Make sure `ollama serve` is running
- Check if port 11434 is available
- Verify the base URL in your environment variables

**Model not found:**

- Make sure you've pulled the model: `ollama pull llava:latest`
- Check available models: `ollama list`

**Slow generation:**

- Try a smaller model like `llava:7b`
- Ensure your machine has sufficient RAM (8GB+ recommended)

## Benefits of Ollama

✅ **No API costs** - Runs locally  
✅ **Privacy** - Images never leave your machine  
✅ **No rate limits** - Generate as many descriptions as needed  
✅ **Offline capable** - Works without internet  
✅ **Customizable** - Can fine-tune models for better real estate descriptions

## Model Performance

| Model        | Size  | Speed  | Quality | RAM Required |
| ------------ | ----- | ------ | ------- | ------------ |
| llava:7b     | ~4GB  | Fast   | Good    | 8GB+         |
| llava:latest | ~7GB  | Medium | Better  | 12GB+        |
| llava:13b    | ~13GB | Slow   | Best    | 16GB+        |

Choose the model that best fits your hardware capabilities!
