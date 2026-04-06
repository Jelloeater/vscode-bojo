# Bojo — Bullet Journal Task Cycler

A VS Code extension that cycles bullet journal task states in markdown files via keyboard shortcuts.

## Quick Start

| Action | Windows/Linux | Mac |
|--------|--------------|-----|
| Cycle forward | `Ctrl+Enter` | `Cmd+Enter` |
| Cycle backward | `Ctrl+Shift+Enter` | `Cmd+Shift+Enter` |

## Features

- **Quick task state cycling** — Press `Ctrl+Enter` to cycle through task states
- **Reverse cycling** — Press `Ctrl+Shift+Enter` to cycle backwards
- **Multi-cursor support** — Cycle multiple tasks at once
- **Markdown-only** — Only activates in markdown files to avoid conflicts
- **Supported list markers** — Works with `-`, `*`, and `+`

## Task States

Cycle order: `[ ]` → `[/]` → `[!]` → `[x]` → `[ ]`

| State | Character | Meaning |
|-------|-----------|---------|
| Empty | ` ` | Not started |
| In Progress | `/` | Currently working |
| Blocked | `!` | Blocked/waiting |
| Done | `x` | Completed |

## Installation

### From VSIX

1. Download the `.vsix` file from releases
2. Open VS Code → Extensions (`Ctrl+Shift+X`)
3. Click **Install from VSIX...**
4. Select the downloaded file

### From Source

```bash
git clone https://github.com/Jelloeater/vscode-bojo
cd vscode-bojo
npm install
npm run compile
# Press F5 to test in Extension Development Host
```

## Usage

Open any markdown file and create tasks:

```markdown
- [ ] Write documentation
- [/] Implement feature
- [!] Review PR
- [x] Deploy to production
```

Place your cursor on a line and press `Ctrl+Enter` to cycle through states.

## Development

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run compile` | Compile TypeScript |
| `npm run watch` | Watch mode (auto-recompile) |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests (compile + lint + mocha) |
| `vsce package` | Build .vsix |

## Requirements

- Node.js 18+
- VS Code 1.85.0+

## License

MIT — See [LICENSE](LICENSE) for details.