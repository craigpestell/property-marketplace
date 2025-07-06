# Documentation

This directory contains all documentation for the Property Marketplace application, organized by category for easy navigation.

## Directory Structure

```
docs/
├── README.md                                    # This file - documentation overview
├── setup/                                       # Setup and installation guides
│   ├── DATABASE_SETUP.md                       # Database configuration and setup
│   ├── GOOGLE_OAUTH_SETUP.md                   # Google OAuth configuration
│   └── OLLAMA_SETUP.md                         # Ollama AI setup for image processing
├── features/                                    # Feature documentation and implementation details
│   ├── NOTIFICATIONS_IMPLEMENTATION.md         # Real-time notifications system
│   ├── OFFER_SYSTEM.md                         # Property offer system
│   └── WEBP_IMAGE_PROCESSING_ENHANCEMENT.md    # Image processing and AI features
└── guides/                                      # User and developer guides
    └── TEST_DATA_GUIDE.md                       # Guide for working with test data
```

## Quick Navigation

### 🚀 Getting Started

If you're new to the project, start with these documents:

1. **[Main README](../README.md)** - Project overview and quick start
2. **[Database Setup](setup/DATABASE_SETUP.md)** - Database configuration
3. **[Google OAuth Setup](setup/GOOGLE_OAUTH_SETUP.md)** - Authentication setup
4. **[Ollama Setup](setup/OLLAMA_SETUP.md)** - AI features setup

### 🏗️ Setup Documentation

Complete setup guides for all system components:

- **[Database Setup](setup/DATABASE_SETUP.md)** - PostgreSQL database configuration, schema setup, and migration instructions
- **[Google OAuth Setup](setup/GOOGLE_OAUTH_SETUP.md)** - OAuth 2.0 configuration for user authentication
- **[Ollama Setup](setup/OLLAMA_SETUP.md)** - Local AI model setup for image description and property suggestions

### ⚡ Feature Documentation

Detailed documentation for key application features:

- **[Notifications System](features/NOTIFICATIONS_IMPLEMENTATION.md)** - Real-time notifications with Server-Sent Events
- **[Offer System](features/OFFER_SYSTEM.md)** - Property offer management with UID-based architecture
- **[Image Processing](features/WEBP_IMAGE_PROCESSING_ENHANCEMENT.md)** - AI-powered image description and format conversion

### 📚 Developer Guides

Practical guides for development and testing:

- **[Test Data Guide](guides/TEST_DATA_GUIDE.md)** - Working with sample data and testing workflows
- **[Database Guide](../database/README.md)** - Database management, migrations, and schema
- **[Testing Guide](../tests/README.md)** - Testing frameworks, API tests, and best practices

## Documentation Standards

### Writing Guidelines

1. **Clear Structure** - Use consistent heading hierarchy (H1 → H2 → H3)
2. **Code Examples** - Include practical code snippets and commands
3. **Prerequisites** - List requirements at the beginning of setup guides
4. **Screenshots** - Add visual aids where helpful (store in `docs/images/`)
5. **Links** - Use relative links for internal documentation

### File Naming Convention

- Use UPPERCASE for standalone documentation files
- Use kebab-case for directory names
- Include descriptive suffixes:
  - `*_SETUP.md` for setup/installation guides
  - `*_IMPLEMENTATION.md` for feature implementation details
  - `*_GUIDE.md` for user/developer guides

### Content Organization

#### Setup Documents (`setup/`)

- Prerequisites and requirements
- Step-by-step installation instructions
- Configuration examples
- Troubleshooting common issues
- Environment variable documentation

#### Feature Documents (`features/`)

- Feature overview and goals
- Technical implementation details
- API documentation
- Database schema changes
- Usage examples

#### Guide Documents (`guides/`)

- Practical how-to instructions
- Best practices and workflows
- Testing procedures
- Common development tasks

## Contributing to Documentation

### Adding New Documentation

1. **Choose the right category** - Place files in appropriate subdirectories
2. **Follow naming conventions** - Use consistent file naming patterns
3. **Update this README** - Add links to new documents in relevant sections
4. **Cross-reference** - Link to related documentation where helpful

### Updating Existing Documentation

1. **Keep it current** - Update docs when features change
2. **Test instructions** - Verify setup guides work on fresh installations
3. **Version compatibility** - Note version requirements for setup guides
4. **Migration notes** - Document breaking changes and upgrade paths

### Documentation Review Checklist

- [ ] Clear, concise writing
- [ ] Accurate code examples
- [ ] Working links (internal and external)
- [ ] Proper heading structure
- [ ] Consistent formatting
- [ ] Up-to-date information

## Additional Resources

### External Documentation

- **[Next.js Documentation](https://nextjs.org/docs)** - Framework documentation
- **[PostgreSQL Documentation](https://www.postgresql.org/docs/)** - Database documentation
- **[Ollama Documentation](https://ollama.ai/docs)** - AI model documentation
- **[NextAuth.js Documentation](https://next-auth.js.org/)** - Authentication documentation

### Project Files

- **[CHANGELOG.md](../CHANGELOG.md)** - Release notes and version history
- **[Package.json](../package.json)** - Dependencies and scripts
- **[Environment Variables](../.env.example)** - Configuration template

### Development Tools

- **[VSCode Settings](../.vscode/)** - Editor configuration and snippets
- **[Git Hooks](../.husky/)** - Pre-commit hooks and linting
- **[CI/CD Workflows](../.github/workflows/)** - Automated testing and deployment

## Support and Feedback

If you find issues with the documentation or have suggestions for improvement:

1. **Check existing issues** - Look for related GitHub issues
2. **Create an issue** - Use the documentation label
3. **Submit a PR** - Fix minor issues directly
4. **Ask questions** - Use GitHub Discussions for broader questions

Remember: Good documentation is code too! Keep it maintained and up-to-date.
