# vscode-bojo Specification

## Overview

vscode-bojo is a VS Code extension that cycles bullet journal (BuJo) task states in markdown files via keyboard shortcuts.

## Prerequisites

- Node.js 18+
- VS Code 1.85.0+
- Git

## Installation

### From VSIX

1. Download `vscode-bojo-0.0.1.vsix` from releases
2. Open VS Code → Extensions (`Ctrl+Shift+X`)
3. Click **Install from VSIX...**
4. Select the downloaded file

### From Source

```bash
git clone https://github.com/Jelloeater/vscode-bojo
cd vscode-bojo
npm install
npm run compile
# Press F5 to test
```

## Configuration

### package.json

The extension registers two commands with keybindings:

```json
{
  "contributes": {
    "commands": [
      {
        "command": "bojo.cycleTask",
        "title": "Cycle Bullet Journal Task (Forward)"
      },
      {
        "command": "bojo.cycleTaskReverse", 
        "title": "Cycle Bullet Journal Task (Reverse)"
      }
    ],
    "keybindings": [
      {
        "command": "bojo.cycleTask",
        "key": "ctrl+enter",
        "mac": "cmd+enter",
        "when": "editorTextFocus && editorLangId == 'markdown'"
      },
      {
        "command": "bojo.cycleTaskReverse",
        "key": "ctrl+shift+enter",
        "mac": "cmd+shift+enter",
        "when": "editorTextFocus && editorLangId == 'markdown'"
      }
    ]
  }
}
```

### Keybinding Conditions

The `when` clause ensures the extension only activates in:
- An active text editor (`editorTextFocus`)
- Markdown files specifically (`editorLangId == 'markdown'`)

## Task States

### Cycle Order

**Forward**: `[ ]` → `[/]` → `[!]` → `[x]` → `[ ]` (repeats)
**Reverse**: `[ ]` → `[x]` → `[!]` → `[/]` → `[ ]` (repeats)

### State Characters

| Character | State | Meaning |
|-----------|-------|---------|
| ` ` (space) | Empty | Not started |
| `/` | In Progress | Currently working on |
| `!` | Blocked | Waiting on something |
| `x` | Done | Completed |

## Implementation

### Architecture

The extension is split into two main files:

- `src/extension.ts` — VS Code activation and command registration
- `src/cycler.ts` — Pure cycling logic (testable, no VS Code dependencies)

### Core Logic (`src/cycler.ts`)

```typescript
const CYCLE = [' ', '/', '!', 'x'] as const;

// Forward: get next state
export function getNextState(current: string): string | null

// Reverse: get previous state  
export function getPrevState(current: string): string | null

// Cycle a line
export function cycleLine(line: string, direction: 'forward' | 'reverse'): string | null
```

### Regex Pattern

```
^(\s*(?:-|\*|\+)\s*\[)(.)(\].*)$
```

| Group | Description |
|-------|-------------|
| 1 | Prefix: whitespace + list marker + `[` |
| 2 | State character (the cycled character) |
| 3 | Suffix: `]` + rest of line |

### Supported List Markers

- `-` (hyphen)
- `*` (asterisk)
- `+` (plus)

### Edge Cases Handled

- Indented lists (`  - [ ] Task`)
- Multiple spaces (`-   [ ] Task`)
- Extra content after brackets (`- [ ] Task with notes`)
- Unknown states (left unchanged, not converted)
- Non-matching lines (left untouched)

### Multi-Cursor Support

The extension iterates over all cursor selections:

```typescript
editor.edit(editBuilder => {
    selections.forEach(selection => {
        const line = document.lineAt(selection.active.line);
        const newLine = cycleLine(line.text, 'forward');
        
        if (newLine !== null) {
            editBuilder.replace(line.range, newLine);
        }
    });
});
```

## Testing

### Unit Tests

Run with `npm test` or directly:

```bash
npx mocha out/test/cycler.test.js
```

### Test Coverage

- Forward cycle through all 4 states
- Reverse cycle through all 4 states
- Unknown state handling (returns null)
- Various list markers (-, *, +)
- Indented lines
- Lines with extra content
- Edge cases (no brackets, no marker)

## Building

### Compile

```bash
npm run compile
```

### Package

```bash
npm install -g @vscode/vsce
vsce package
```

Creates `vscode-bojo-0.0.1.vsix`

## Development

### Watch Mode

```bash
npm run watch
```

### Debugging

Press `F5` in VS Code to open the Extension Development Host with debugger attached.

### Linting

```bash
npm run lint
```

## File Structure

```
vscode-bojo/
├── src/
│   ├── extension.ts         # VS Code activation
│   ├── cycler.ts            # Pure logic
│   └── test/
│       ├── cycler.test.ts  # Unit tests
│       └── runTest.ts      # Test runner
├── out/                    # Compiled JavaScript
├── package.json            # Extension manifest
├── tsconfig.json           # TypeScript config
├── README.md               # User documentation
├── CONTRIBUTING.md         # Contributor guide
├── AGENTS.md               # AI agent guidelines
├── CHANGELOG.md            # Release notes
└── LICENSE                 # MIT license
```

## Version History

- **0.0.1** — Initial release with forward/reverse cycling, multi-cursor support, markdown-only activation
