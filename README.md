# Property Marketplace v2 🏠

<div align="center">
  <h2>🤖 AI-Powered Property Marketplace</h2>
  <p>A modern real estate platform with intelligent image analysis and automated property suggestions</p>
</div>

## 🌟 Features

This property marketplace includes cutting-edge AI capabilities:

### 🤖 **AI-Powered Property Analysis**

- **Image Description Generation**: Upload property photos and get professional real estate descriptions
- **Smart Property Suggestions**: AI analyzes images to suggest titles, pricing, features, and property details
- **Location-Aware Pricing**: Automatic currency detection and market-appropriate pricing based on address
- **Property-Focused Analysis**: AI descriptions focus on structural features, excluding furniture and temporary items

### 🌍 **Global Market Support**

- **Multi-Currency Pricing**: Supports USD, EUR, GBP, CAD, and other major currencies
- **Location Context**: AI considers local market conditions and regional property characteristics
- **International Addresses**: Works with addresses from multiple countries

### 🔧 **Technical Architecture**

- **Next.js 14** with App Router and TypeScript
- **Ollama Integration** for local AI processing with LLaVA vision model
- **Advanced Image Processing** with Sharp (supports WebP, PNG, JPEG, GIF, BMP)
- **Automatic Format Conversion** for optimal AI model compatibility
- **Real-time Notifications** system for property updates
- **UID-Based Architecture** for secure and scalable property management
- **Normalized Database Schema** with client_uid-based relationships

### 🛡️ **Enterprise Features**

- **Authentication System** with NextAuth.js
- **Database Migration Scripts** for offer UID implementation
- **Comprehensive Error Handling** with retry logic and validation
- **Professional Development Workflow** with automated testing and deployment

## � Documentation

Comprehensive documentation is available in the [`docs/`](docs/) directory:

- **[📖 Documentation Index](docs/INDEX.md)** - Complete overview of all documentation
- **[🚀 Setup Guides](docs/setup/)** - Installation and configuration instructions
- **[⚡ Feature Documentation](docs/features/)** - Implementation details for key features
- **[📚 Developer Guides](docs/guides/)** - Testing, development workflows, and best practices

### Quick Links

- **[🔄 Client References Normalization](docs/features/CLIENT_REFERENCES_NORMALIZATION.md)** - How we migrated from email to client_uid relationships

| Topic               | Document                                                               | Description                   |
| ------------------- | ---------------------------------------------------------------------- | ----------------------------- |
| **Getting Started** | [Setup Guides](docs/setup/)                                            | Database, OAuth, and AI setup |
| **AI Features**     | [Image Processing](docs/features/WEBP_IMAGE_PROCESSING_ENHANCEMENT.md) | AI-powered image analysis     |
| **Notifications**   | [Notifications System](docs/features/NOTIFICATIONS_IMPLEMENTATION.md)  | Real-time updates             |
| **Offers**          | [Offer System](docs/features/OFFER_SYSTEM.md)                          | Property offer management     |
| **Testing**         | [Testing Guide](tests/README.md)                                       | Test suites and validation    |
| **Database**        | [Database Guide](database/README.md)                                   | Schema and migrations         |

## �🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or later)
- **pnpm** package manager
- **Ollama** for AI functionality

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/craigpestell/property-marketplace.git
   cd property-marketplace-v2
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Start development environment** (one command does everything):
   ```bash
   ./start-dev.sh
   ```

This script will:

- ✅ Check if Ollama is installed
- 🚀 Start Ollama service if not running
- 🤖 Ensure the required LLaVA model is available
- ⚡ Start the Next.js development server
- 🔧 Install dependencies if needed

## 🛠️ Development Scripts

### Core Development Commands

```bash
# Start all services (Ollama + Next.js dev server)
./start-dev.sh

# Check status of all services
./status-dev.sh

# Stop all development services
./stop-dev.sh
```

### API Testing

```bash
# Test the AI image description API
./test-description-api.sh

# Test the AI property suggestions API (includes currency testing)
./test-suggestions-api.sh
```

### Manual Setup (Alternative)

If you prefer to start services manually:

1. **Install Ollama**:

   ```bash
   # macOS
   brew install ollama

   # Or download from https://ollama.ai/download
   ```

2. **Start Ollama**:

   ```bash
   ollama serve
   ```

3. **Pull the required AI model**:

   ```bash
   ollama pull llava:latest
   ```

4. **Start Next.js dev server**:
   ```bash
   pnpm dev
   ```

## 🎯 AI Features in Detail

### Image Description API (`/api/generate-description`)

Generates professional real estate descriptions from property photos:

```typescript
// Example usage
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('/api/generate-description', {
  method: 'POST',
  body: formData,
});

const { description } = await response.json();
```

**Features:**

- Automatic image format conversion (WebP, GIF, BMP → JPEG)
- Professional real estate writing style
- Focus on permanent property features
- Error handling with retry logic

### Property Suggestions API (`/api/generate-suggestions`)

Analyzes property images to suggest listing details:

```typescript
// Example usage with location context
const formData = new FormData();
formData.append('image', imageFile);
formData.append('address', '123 Main St, San Francisco, CA 94102, USA');

const response = await fetch('/api/generate-suggestions', {
  method: 'POST',
  body: formData,
});

const { suggestions } = await response.json();
// Returns: title, propertyType, bedrooms, bathrooms, price, currency, etc.
```

**Features:**

- Location-aware pricing in local currency
- Structured JSON response with property details
- Confidence scoring for suggestions
- Market-appropriate feature recommendations

## 🏗️ Architecture Highlights

### Offer UID System

Migrated from integer IDs to secure UIDs for all offer-related operations:

- **Database Schema**: Added `offer_uid` columns with proper indexing
- **API Endpoints**: All routes now use UID-based parameters
- **Frontend Components**: Updated to handle UID routing and display
- **Migration Scripts**: Automated migration from legacy `offer_id` system

### Image Processing Pipeline

Robust image handling with multiple format support:

```typescript
// Automatic format detection and conversion
const supportedTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
];
// WebP/GIF/BMP automatically converted to JPEG for AI compatibility
```

### Real-time Notifications

Event-driven notification system:

- **Server-Sent Events** for real-time updates
- **Toast Notifications** with user interaction
- **Notification Center** with filtering and management
- **Database Integration** for persistent notification storage

## 🧪 Testing

The project includes comprehensive testing scripts:

- **API Validation**: Automated testing of both AI endpoints
- **Multi-Format Support**: Tests PNG, WebP, and error cases
- **Currency Testing**: Validates pricing in multiple currencies (USD, EUR, GBP, CAD)
- **Error Handling**: Tests invalid inputs and edge cases

## 🌍 Global Deployment Ready

- **Multi-Currency Support**: USD, EUR, GBP, CAD, and more
- **Location Intelligence**: Market-aware pricing and features
- **Professional Quality**: Real estate industry-standard descriptions
- **Scalable Architecture**: UID-based system for enterprise use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Workflow

- Use `./start-dev.sh` for development
- Run tests with `./test-description-api.sh` and `./test-suggestions-api.sh`
- Follow conventional commit format
- Ensure all AI features work before submitting PRs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ollama** for local AI model hosting
- **LLaVA** for vision-language capabilities
- **Next.js** team for the excellent framework
- **Sharp** for robust image processing
