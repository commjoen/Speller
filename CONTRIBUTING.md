# Contributing to Speller

Thank you for your interest in contributing to the Speller project! This document provides guidelines and information for developers.

## Development Setup

### Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)
- Python 3.x (for pre-commit hooks)

### Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/commjoen/Speller.git
   cd Speller
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install pre-commit hooks (optional but recommended):
   ```bash
   pip install pre-commit
   pre-commit install
   ```

## Development Tools

### Available Scripts

- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm start` - Start local development server
- `npm run lint` - Check code for linting issues
- `npm run lint:fix` - Fix auto-fixable linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted

### Code Quality Tools

#### ESLint
ESLint is configured with relaxed rules to maintain code quality without breaking existing functionality. The configuration focuses on:
- Preventing undefined variables
- Detecting unused variables (warnings only)
- Maintaining consistent coding patterns

#### Prettier
Prettier is set up for code formatting with the following preferences:
- Single quotes
- Semicolons
- 2-space indentation
- 100 character line width

#### Pre-commit Hooks
Pre-commit hooks run automatically before each commit to:
- Check YAML and JSON syntax
- Validate file formatting
- Run security checks
- Lint Docker files
- Check for large files and merge conflicts

## Dependency Management

This project uses both **Renovate** and **Dependabot** for dependency management:

### Renovate (Primary)
- Runs weekly on Monday mornings
- Groups related updates together
- Auto-merges trusted GitHub Actions updates
- Configured in `renovate.json`

### Dependabot (Backup)
- Runs weekly on Tuesday mornings
- Limited number of open PRs to avoid conflicts with Renovate
- Configured in `.github/dependabot.yml`

## Testing

The project uses Jest for testing with jsdom environment for DOM manipulation testing.

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure
- Tests are located in the `test/` directory
- Test files should end with `.test.js`
- Use descriptive test names and group related tests

## Code Style Guidelines

### JavaScript
- Use modern ES6+ features where appropriate
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable and function names
- Add comments for complex logic
- Console statements are allowed for debugging (warnings only)

### Commits
- Use clear, descriptive commit messages
- Follow conventional commit format when possible
- Keep commits focused on a single change
- Run pre-commit hooks before committing

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the code style guidelines
3. Add or update tests as needed
4. Ensure all tests pass: `npm test`
5. Check linting: `npm run lint`
6. Format code: `npm run format`
7. Commit changes with clear messages
8. Push to your fork and create a pull request

## Docker Development

The project includes Docker support:

```bash
# Build Docker image
docker build -t speller-local .

# Run Docker container
docker run -p 8080:8000 speller-local
```

The Dockerfile is linted using Hadolint in the pre-commit hooks.

## Security

- Secrets detection is enabled in pre-commit hooks
- Dependencies are automatically scanned for vulnerabilities
- Follow security best practices for web applications

## Getting Help

- Check existing issues and pull requests
- Create an issue for bugs or feature requests
- Join discussions in the repository