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
