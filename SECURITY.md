# Security Policy

## Supported Versions

We support the latest release of vscode-bojo. Older versions may work but are not actively maintained.

| Version | Supported          |
| ------- | ------------------ |
| 0.0.1   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by opening an issue on GitHub. We will respond within 48 hours and work with you to resolve the issue.

Do not report security vulnerabilities through public GitHub issues.

## Security Considerations

vscode-bojo is a local VS Code extension that:

- Only modifies text in markdown files within VS Code
- Does not make any network requests
- Does not collect or transmit any user data
- Does not access files outside of explicitly opened markdown documents

The extension operates entirely within the VS Code environment and has minimal attack surface.