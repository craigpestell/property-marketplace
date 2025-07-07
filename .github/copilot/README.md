# Copilot Configuration

This directory contains configuration files for GitHub Copilot.

## Commit Conventions

The `commit-conventions.json` file configures Copilot to understand our commit message format requirements, which follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

Commit messages should follow this format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Where:

- `<type>`: Describes the kind of change (e.g., feat, fix, docs)
- `<scope>`: (Optional) Describes what area of the codebase is affected (e.g., ui, api)
- `<subject>`: A short description of the change
- `<body>`: (Optional) More detailed explanatory text
- `<footer>`: (Optional) References to issues, breaking changes, etc.

### Avoiding Commit Formatting Errors

To avoid git commit formatting errors:

- **Keep subject lines short**: Limit subject lines to 50 characters (previously 72)
- **Break down complex commits**: Use multiple smaller commits instead of one large commit
- **Use appropriate scopes**: Include a scope for clarity, e.g., `feat(theme): add dark mode support`
- **Avoid special characters**: Minimize the use of special characters like quotes and backticks
- **Split long messages**: For complex changes, keep the subject short and put details in the body

If you encounter formatting errors with a commit message:

1. Try a shorter, more concise message
2. Use the `-m` flag multiple times for multi-line messages:
   ```
   git commit -m "feat(ui): add new component" -m "This adds a new reusable button component with variants"
   ```
3. For interactive commits, manually wrap text and keep lines under 50 characters

The `commit-conventions.json` configuration has been updated with:

- Shorter maximum subject line length (50 characters)
- Shorter body line length (72 characters)
- Automatic formatting of commit messages
- Support for splitting long commit messages
- Addition of a "theme" scope

### Commit Helper Script

A helper script is available to easily create properly formatted commits:

```bash
./.github/scripts/commit.sh <type> <scope> <message> [<body>]
```

Example usage:

```bash
./.github/scripts/commit.sh feat theme "Add dark mode toggle"
```

With optional commit body:

```bash
./.github/scripts/commit.sh feat theme "Add dark mode toggle" "Implements system preference detection and toggle button in the header"
```

The script will:

- Validate the type and scope against the configuration
- Check message length against the configuration
- Format the commit message according to conventions
- Allow you to review the message before committing

Run the script with `--help` or `-h` to see available options:

```bash
./.github/scripts/commit.sh --help
```

### Types

The following commit types are supported:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Code changes that improve performance
- `test`: Adding or modifying tests
- `build`: Changes to the build system or dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverting a previous commit

### Scopes

Common scopes include:

- `ui`: User interface components
- `api`: API-related changes
- `db`: Database changes
- `auth`: Authentication and authorization
- `listings`: Property listings functionality
- `offers`: Offer system functionality
- `users`: User management functionality
- `notifications`: Notification system
- `config`: Configuration changes
- `docs`: Documentation

### Examples

```
feat(listings): add search by property type feature
```

```
fix(api): resolve issue with property image upload
```

```
style(ui): improve header responsiveness
```

```
docs: update setup instructions in README
```

## Database Configuration

The `database-config.json` file provides Copilot with information about our database structure and common queries, enabling it to generate more accurate and relevant code suggestions for database operations.

### Database Schema

The configuration includes details about our database tables:

- **users**: User accounts and authentication
- **properties**: Real estate property listings
- **saved_properties**: Properties saved by users
- **offers**: Offers made on properties
- **notifications**: User notifications
- **showings**: Property showing appointments
- **showing_times**: Available times for property showings

### Environment Variables

The database relies on the following environment variables:

```
PGUSER=username
PGHOST=localhost
PGDATABASE=real_estate_marketplace
PGPASSWORD=password
PGPORT=5432
```

### Common Queries

The configuration includes examples of common database queries used in the application, which Copilot can use as templates when suggesting SQL operations.

### Usage

When working with database-related code, Copilot will use this configuration to suggest appropriate table names, field names, and query patterns that align with our existing database structure.

Example of how Copilot might assist:

```typescript
// When you start typing:
const getProperty = async (propertyId) => {
  const result = await pool.query(
    // Copilot will suggest:
    'SELECT p.*, u.name as owner_name FROM properties p JOIN users u ON p.user_id = u.id WHERE p.id = $1',
    [propertyId],
  );
  return result.rows[0];
};
```
