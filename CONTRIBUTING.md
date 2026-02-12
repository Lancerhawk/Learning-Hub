# Contributing to Learning's Hub

Thank you for your interest in contributing to Learning's Hub! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- Git
- SendGrid account (for email functionality)

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/learnings-hub.git
   cd learnings-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

4. **Initialize the database**
   ```bash
   npm run init-db
   ```

5. **Start development servers**
   ```bash
   npm run dev:all
   ```

## Development Workflow

We follow the branching strategy outlined in [BRANCHING_STRATEGY.md](BRANCHING_STRATEGY.md).

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-custom-lists`)
- `fix/` - Bug fixes (e.g., `fix/progress-migration-race-condition`)
- `docs/` - Documentation updates (e.g., `docs/update-api-documentation`)
- `refactor/` - Code refactoring (e.g., `refactor/optimize-database-queries`)
- `test/` - Test additions or modifications (e.g., `test/add-progress-tracking-tests`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit your changes**
   
   Follow our [commit convention](COMMIT_CONVENTION.md):
   ```bash
   git commit -m "feat: add custom list sharing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   
   Open a PR against the `develop` branch with a clear description of your changes.

## Coding Standards

### JavaScript/React

- Use ES6+ syntax
- Follow functional programming principles where appropriate
- Use meaningful variable and function names
- Keep functions small and focused (single responsibility)
- Use async/await instead of promises when possible
- Avoid nested callbacks

### Code Style

- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Line Length**: Maximum 100 characters
- **Naming Conventions**:
  - Components: PascalCase (e.g., `CustomListViewer`)
  - Functions: camelCase (e.g., `loadAllProgress`)
  - Constants: UPPER_SNAKE_CASE (e.g., `API_URL`)
  - Files: kebab-case for utilities, PascalCase for components

### React Best Practices

- Use functional components with hooks
- Keep components small and reusable
- Use Context API for global state
- Avoid prop drilling (use context or composition)
- Use custom hooks for reusable logic
- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback`

### Backend Best Practices

- Use parameterized queries to prevent SQL injection
- Implement proper error handling
- Use middleware for cross-cutting concerns
- Keep routes thin, business logic in services
- Validate all user input
- Use rate limiting for API endpoints
- Return appropriate HTTP status codes

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification. See [COMMIT_CONVENTION.md](COMMIT_CONVENTION.md) for details.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(progress): add batch progress loading optimization

Reduced API calls from 17 to 1 by implementing batch loading endpoint.
This improves page load performance by 94%.

Closes #123
```

```bash
fix(migration): resolve race condition in progress migration

Fixed issue where progress would disappear after login due to race
condition between migration and data loading processes.

Fixes #456
```

## Pull Request Process

### Before Submitting

1. Ensure your code follows the coding standards
2. Run all tests and ensure they pass
3. Update documentation if needed
4. Add/update tests for your changes
5. Rebase your branch on the latest `develop`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
```

### Review Process

1. At least one maintainer must approve the PR
2. All CI checks must pass
3. No merge conflicts with target branch
4. Code review feedback must be addressed

### After Approval

- Maintainers will merge your PR using squash merge
- Your branch will be deleted after merge
- Changes will be included in the next release

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write unit tests for utilities and helpers
- Write integration tests for API endpoints
- Write component tests for React components
- Aim for at least 80% code coverage
- Test edge cases and error scenarios

### Test Structure

```javascript
describe('Component/Function Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments for functions and classes
- Document complex logic with inline comments
- Keep comments up-to-date with code changes
- Explain "why" not "what" in comments

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error responses
- Keep API documentation in sync with code

### README Updates

- Update README.md for new features
- Add examples for new functionality
- Update installation instructions if needed
- Keep feature list current

## Questions or Need Help?

- Open an issue for bugs or feature requests
- Join our community discussions
- Check existing issues and PRs first
- Be respectful and patient

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Learning's Hub!
