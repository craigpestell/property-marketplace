# Documentation Index

This is a comprehensive index of all documentation in the Property Marketplace project.

## 📖 Core Documentation

| Document        | Location                          | Description                                       |
| --------------- | --------------------------------- | ------------------------------------------------- |
| **Main README** | [`README.md`](../README.md)       | Project overview, features, and quick start guide |
| **Changelog**   | [`CHANGELOG.md`](../CHANGELOG.md) | Version history and release notes                 |

## 🚀 Setup & Installation

| Document               | Location                                                          | Description                               |
| ---------------------- | ----------------------------------------------------------------- | ----------------------------------------- |
| **Database Setup**     | [`docs/setup/DATABASE_SETUP.md`](setup/DATABASE_SETUP.md)         | PostgreSQL configuration and schema setup |
| **Google OAuth Setup** | [`docs/setup/GOOGLE_OAUTH_SETUP.md`](setup/GOOGLE_OAUTH_SETUP.md) | Authentication provider configuration     |
| **Ollama AI Setup**    | [`docs/setup/OLLAMA_SETUP.md`](setup/OLLAMA_SETUP.md)             | Local AI model setup for image processing |

## ⚡ Features & Implementation

| Document                 | Location                                                                                              | Description                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Notifications System** | [`docs/features/NOTIFICATIONS_IMPLEMENTATION.md`](features/NOTIFICATIONS_IMPLEMENTATION.md)           | Real-time notifications with SSE                         |
| **Offer System**         | [`docs/features/OFFER_SYSTEM.md`](features/OFFER_SYSTEM.md)                                           | Property offer management architecture                   |
| **Image Processing**     | [`docs/features/WEBP_IMAGE_PROCESSING_ENHANCEMENT.md`](features/WEBP_IMAGE_PROCESSING_ENHANCEMENT.md) | AI-powered image description and format conversion       |
| **Client Normalization** | [`docs/features/CLIENT_REFERENCES_NORMALIZATION.md`](features/CLIENT_REFERENCES_NORMALIZATION.md)     | Normalized database schema with client_uid relationships |

## 📚 Developer Guides

| Document            | Location                                                      | Description                                 |
| ------------------- | ------------------------------------------------------------- | ------------------------------------------- |
| **Test Data Guide** | [`docs/guides/TEST_DATA_GUIDE.md`](guides/TEST_DATA_GUIDE.md) | Working with sample data and testing        |
| **Database Guide**  | [`database/README.md`](../database/README.md)                 | Database management, migrations, and schema |
| **Testing Guide**   | [`tests/README.md`](../tests/README.md)                       | Testing frameworks and best practices       |

## 🗂️ Technical Documentation

| Category          | Documents                       | Purpose                                |
| ----------------- | ------------------------------- | -------------------------------------- |
| **Database**      | Schema files, migrations, seeds | Database structure and data management |
| **API**           | Route handlers, endpoint docs   | Backend API implementation             |
| **Testing**       | Unit tests, integration tests   | Quality assurance and validation       |
| **Configuration** | Environment vars, configs       | Application setup and deployment       |

## 🔧 Development Resources

### Configuration Files

- **Jest Config** - [`jest.config.js`](../jest.config.js) - Testing framework configuration
- **Next.js Config** - [`next.config.js`](../next.config.js) - Framework and build configuration
- **Tailwind Config** - [`tailwind.config.ts`](../tailwind.config.ts) - Styling framework setup
- **TypeScript Config** - [`tsconfig.json`](../tsconfig.json) - TypeScript compiler options

### Development Scripts

- **Start Development** - [`start-dev.sh`](../start-dev.sh) - Start all development services
- **Stop Development** - [`stop-dev.sh`](../stop-dev.sh) - Stop all development services
- **Check Status** - [`status-dev.sh`](../status-dev.sh) - Check service status

### Code Quality

- **ESLint Config** - [`.eslintrc.js`](../.eslintrc.js) - Code linting rules
- **Prettier Config** - [`.prettierrc.js`](../.prettierrc.js) - Code formatting rules
- **Commitlint Config** - [`commitlint.config.js`](../commitlint.config.js) - Commit message standards
- **Husky Hooks** - [`.husky/`](../.husky/) - Git hooks for code quality

## 📋 Quick Reference

### Common Tasks

1. **First-time setup**: Follow setup guides in order (Database → OAuth → Ollama)
2. **Adding features**: Check feature docs for implementation patterns
3. **Testing changes**: Use testing guide and run test suites
4. **Database changes**: Follow database guide for migrations
5. **Debugging**: Check relevant feature documentation for troubleshooting

### File Organization

```
project-root/
├── docs/                    # 📖 All documentation
│   ├── setup/              # 🚀 Installation guides
│   ├── features/           # ⚡ Feature documentation
│   └── guides/             # 📚 Developer guides
├── database/               # 🗄️ Database files
├── tests/                  # 🧪 Test files
└── src/                    # 💻 Application code
```

### Documentation Standards

- **Setup docs**: Prerequisites → Installation → Configuration → Troubleshooting
- **Feature docs**: Overview → Implementation → API → Examples
- **Guide docs**: Purpose → Instructions → Best Practices → Tips

## 🔄 Keeping Documentation Updated

### When to Update Documentation

- ✅ Adding new features or APIs
- ✅ Changing configuration requirements
- ✅ Modifying database schema
- ✅ Updating dependencies with breaking changes
- ✅ Fixing bugs that affect setup or usage

### Documentation Checklist

- [ ] Update relevant documentation files
- [ ] Test setup instructions on clean environment
- [ ] Update this index if adding new documents
- [ ] Check for broken internal links
- [ ] Verify code examples still work

---

**Need help?** Check the main [docs README](README.md) for detailed information about documentation standards and contribution guidelines.
