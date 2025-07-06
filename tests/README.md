# Testing

This directory contains all testing-related files for the Property Marketplace application.

## Directory Structure

```
tests/
├── README.md                    # This file
├── api/                         # API integration tests
│   ├── test-description-api.sh  # Test AI image description API
│   ├── test-suggestions-api.sh  # Test AI property suggestions API
│   ├── test_api.js             # General API tests
│   └── test_notifications.js   # Notifications API tests
├── unit/                        # Unit tests
│   ├── __tests__/              # Component and page tests
│   │   └── pages/
│   │       └── HomePage.test.tsx
│   └── lib/                    # Library unit tests
│       └── og.test.ts
└── fixtures/                   # Test data and assets
    └── test-image.png          # Sample image for API testing
```

## Running Tests

### Unit Tests (Jest)

Run all unit tests:

```bash
npm test
# or
yarn test
# or
pnpm test
```

Run tests in watch mode:

```bash
npm run test:watch
# or
yarn test:watch
# or
pnpm test:watch
```

### API Integration Tests

#### AI Description API Test

Tests the `/api/generate-description` endpoint:

```bash
cd tests/api
chmod +x test-description-api.sh
./test-description-api.sh
```

This test:

- Uploads a test image
- Generates AI description
- Validates response format
- Tests error handling

#### AI Suggestions API Test

Tests the `/api/generate-suggestions` endpoint:

```bash
cd tests/api
chmod +x test-suggestions-api.sh
./test-suggestions-api.sh
```

This test:

- Uploads a test image
- Generates property suggestions
- Validates structured response
- Tests different currencies and locations

#### General API Tests

```bash
cd tests/api
node test_api.js
```

#### Notifications API Tests

```bash
cd tests/api
node test_notifications.js
```

## Test Configuration

### Jest Configuration

Jest is configured in `/jest.config.js` with:

- Test directory: `tests/**/*.{js,jsx,ts,tsx}`
- Setup file: `jest.setup.js`
- Module aliases for `@/` and `~/` imports
- SVG mocking for component tests

### Environment Variables

Tests may require environment variables:

```env
# For API tests
OLLAMA_API_URL=http://localhost:11434
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=postgresql://...

# For local development
NODE_ENV=test
```

## Writing Tests

### Unit Tests

Unit tests should be placed in `tests/unit/` and follow the naming convention:

- `*.test.ts` or `*.test.tsx` for TypeScript
- `*.spec.ts` or `*.spec.tsx` for TypeScript
- `*.test.js` or `*.test.jsx` for JavaScript

Example unit test structure:

```typescript
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
```

### API Integration Tests

API tests should be placed in `tests/api/` and can be:

- Shell scripts (`.sh`) for simple HTTP requests
- Node.js scripts (`.js`) for complex testing logic

Example API test:

```bash
#!/bin/bash
# Test API endpoint
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  | jq .
```

### Test Fixtures

Test data and assets should be placed in `tests/fixtures/`:

- Sample images for AI testing
- Mock data files
- Configuration files for testing

## Best Practices

### For Unit Tests

1. **Test behavior, not implementation** - Focus on what the component does
2. **Use descriptive test names** - Clearly state what is being tested
3. **Keep tests isolated** - Each test should be independent
4. **Mock external dependencies** - Use Jest mocks for APIs and services
5. **Test edge cases** - Include error states and boundary conditions

### For API Tests

1. **Test real endpoints** - Use actual API endpoints in development
2. **Validate response format** - Check both success and error responses
3. **Include authentication** - Test with proper auth tokens when required
4. **Test different scenarios** - Happy path, error cases, edge cases
5. **Clean up after tests** - Remove test data if it affects other tests

### For Fixtures

1. **Use realistic data** - Make test data representative of real usage
2. **Keep files small** - Use minimal files that still test functionality
3. **Document fixture purpose** - Comment what each fixture is for
4. **Version control fixtures** - Include test assets in git (if small)

## Troubleshooting

### Common Issues

1. **Tests fail in CI but pass locally** - Check environment variables and dependencies
2. **Mock not working** - Verify mock paths in Jest configuration
3. **API tests timeout** - Ensure development server is running
4. **File not found errors** - Check relative paths and test directory structure

### Useful Commands

```bash
# Run specific test file
npm test HomePage.test.tsx

# Run tests with coverage
npm test -- --coverage

# Run tests in verbose mode
npm test -- --verbose

# Clear Jest cache
npm test -- --clearCache
```

## CI/CD Integration

Tests are run automatically in CI/CD pipelines:

- **Unit tests** run on every push and pull request
- **API tests** run in development environment
- **Coverage reports** are generated and tracked
- **Test results** are reported in pull requests

See `.github/workflows/` for CI configuration.
