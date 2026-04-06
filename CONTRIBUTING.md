# Contributing to vscode-bojo

Thank you for your interest in contributing!

## Development Workflow

### Prerequisites

- Node.js 18+
- VS Code 1.85.0+
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/Jelloeater/vscode-bojo
cd vscode-bojo

# Install dependencies
npm install

# Compile TypeScript
npm run compile
```

### Testing

```bash
# Run unit tests
npm test

# Or run them directly
npx mocha out/test/cycler.test.js
```

### Development Mode

Press `F5` in VS Code to open the Extension Development Host. This allows you to test the extension in a separate VS Code window with debugging enabled.

### Building

```bash
# Compile and prepare for publishing
npm run vscode:prepublish

# Package as VSIX
npx vsce package
```

## Code Style

- TypeScript with strict mode enabled
- ESLint for code linting
- 2-space indentation
- Use `const` over `let` where possible
- Add type annotations for function parameters and return types

## Project Structure

```
src/
├── extension.ts    # VS Code activation (register commands)
├── cycler.ts       # Pure logic (testable, no VS Code deps)
└── test/
    ├── cycler.test.ts  # Unit tests
    └── runTest.ts      # Test runner bootstrap
```

## Testing Guidelines

- Pure functions in `cycler.ts` should have unit tests
- Use Mocha's `describe`/`it` syntax
- Test both forward and reverse cycling
- Include edge cases: unknown states, no match, indentation

## Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Add tests if applicable
5. Ensure tests pass (`npm test`)
6. Commit with a conventional commit message
7. Push to your fork
8. Open a pull request

## Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Tests
- `refactor:` Code refactoring
- `chore:` Maintenance

Example: `feat: add reverse cycling command`

## License

By contributing, you agree that your contributions will be licensed under the MIT License.