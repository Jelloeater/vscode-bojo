# AGENTS.md - Development Guidelines

## Project Overview

**Project**: vscode-bojo (Bojo — Bullet Journal Task Cycler)
**Type**: VS Code Extension
**Language**: TypeScript

A VS Code extension that cycles bullet journal task states in markdown files via keyboard shortcuts.

## Quick Commands

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode (auto-recompile)
npm run watch

# Run linting
npm run lint

# Run unit tests
npm run test

# Package extension
vsce package
```

## Project Structure

```
vscode-bojo/
├── src/
│   ├── extension.ts    # VS Code activation & command registration
│   ├── cycler.ts       # Pure cycling logic (testable)
│   └── test/
│       ├── cycler.test.ts  # Unit tests
│       └── runTest.ts      # Test runner bootstrap
├── out/                # Compiled JavaScript
├── package.json        # Extension manifest
├── tsconfig.json       # TypeScript config
└── vscode-bojo-0.0.1.vsix  # Packaged extension
```

## Keybindings

| Action | Windows/Linux | Mac | When |
|--------|--------------|-----|------|
| Cycle forward | `Ctrl+Enter` | `Cmd+Enter` | `editorTextFocus && editorLangId == 'markdown'` |
| Cycle backward | `Ctrl+Shift+Enter` | `Cmd+Shift+Enter` | `editorTextFocus && editorLangId == 'markdown'` |

## Task States (9 States)

Cycle order: `[ ]` → `[/]` → `[x]` → `[>]` → `[<]` → `[-]` → `[*]` → `[?]` → `[!]` → `[ ]`

| Character | State | Description |
|-----------|-------|-------------|
| ` ` (space) | to-do | Not started |
| `/` | incomplete | In progress |
| `x` | done | Completed |
| `>` | rescheduled | Forwarded/deferred |
| `<` | scheduled | Planned/scheduled |
| `-` | canceled | Cancelled/abandoned |
| `*` | star | Starred/important |
| `?` | question | Question/inquiry |
| `!` | important | Urgent/critical |

## Architecture

### Separation of Concerns

The extension is designed with a clear separation between:

1. **Pure Logic** (`src/cycler.ts`) — No editor dependencies
   - `getNextState(current)` — Get forward state
   - `getPrevState(current)` — Get reverse state  
   - `cycleLine(line, direction)` — Transform line text
   - `getStateName(char)` — Get display name
   - `getStateFromName(name)` — Get char from name

2. **Editor Integration** (`src/extension.ts`) — VS Code specific
   - Command registration
   - Text editor manipulation
   - Keybinding handling

This separation makes the core logic portable to other editors.

## Development Notes

### Adding New Commands

1. Add command in `package.json` under `contributes.commands`
2. Add keybinding in `package.json` under `contributes.keybindings`
3. Register command in `src/extension.ts`
4. Implement logic (preferably in `cycler.ts` as pure function)
5. Add tests in `src/test/cycler.test.ts`

### Testing

- Unit tests use Mocha with `describe`/`it` syntax
- Run tests with `npm test` (runs compile + lint + test)
- Pure functions in `cycler.ts` are easily unit-testable

### Publishing

```bash
# Update version in package.json first
vsce package  # Creates .vsix
vsce publish   # Requires publisher setup
```

## Common Issues

- **ESLint warnings**: Check for unused variables
- **Test failures**: Run `npm run compile` first to rebuild
- **VSIX installation fails**: Ensure VS Code is closed during install

## Related Files

- `SPEC.md` — Technical specification
- `PLAN.md` — Implementation plan
- `CHANGELOG.md` — Release notes
- `PORTABLE.md` — Handoff spec for other editors (see separate file)