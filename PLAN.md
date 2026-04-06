# vscode-bojo — Implementation Plan

## Naming Decision
- **Extension ID**: `vscode-bojo` (matches repo)
- **Display Name**: "Bojo — Bullet Journal Task Cycler"
- **Command prefix**: `bojo.cycleTask` / `bojo.cycleTaskReverse`

---

## Phase 1: Project Scaffolding (manual, no `yo code`)

> **Why skip `yo code`?** It generates heavy boilerplate (webpack config, .eslintrc, sample tests we'd delete). For a focused single-command extension, manual scaffolding is leaner and gives full control.

### Files to create:
```
vscode-bojo/
├── .gitignore
├── .vscodeignore
├── CHANGELOG.md
├── LICENSE              # MIT
├── README.md
├── SPEC.md              # (already exists)
├── package.json         # Extension manifest + npm config
├── tsconfig.json
├── src/
│   ├── extension.ts     # Activation, command registration
│   └── cycler.ts        # Pure cycling logic (extracted for testability)
└── src/test/
    ├── runTest.ts        # VS Code test runner bootstrap
    └── cycler.test.ts    # Unit tests for cycling logic
```

### `package.json` highlights:
- `engines.vscode`: `"^1.85.0"` (recent but not bleeding edge)
- `activationEvents`: `["onLanguage:markdown"]`
- Two commands: `bojo.cycleTask` and `bojo.cycleTaskReverse`
- Keybindings scoped: `"when": "editorTextFocus && editorLangId == 'markdown'"`
- Dev dependencies: `typescript`, `@types/vscode`, `@types/mocha`, `@types/node`, `@vscode/test-electron`

---

## Phase 2: Core Logic

### `src/cycler.ts` — Pure functions (no VS Code dependency)

```typescript
// The cycle order as a const tuple
const CYCLE = [' ', '/', '!', 'x'] as const;

// Forward: [ ] → [/] → [!] → [x] → [ ]
export function getNextState(current: string): string | null

// Reverse: [ ] → [x] → [!] → [/] → [ ]
export function getPrevState(current: string): string | null

// Returns null for unknown states (leave line untouched)

// Regex + line transform
export function cycleLine(line: string, direction: 'forward' | 'reverse'): string
```

**Key improvement over SPEC**: Unknown bracket states are left untouched (return `null`) instead of silently converting to `/`.

### `src/extension.ts` — Thin VS Code glue
- Registers two commands: `bojo.cycleTask`, `bojo.cycleTaskReverse`
- Both use `editor.edit()` with `selections.forEach` (multi-cursor support, as in SPEC)
- Delegates to `cycleLine()` from `cycler.ts`

---

## Phase 3: Testing

### Unit tests (`src/test/cycler.test.ts`)
- Forward cycle through all 4 states
- Reverse cycle through all 4 states
- Unknown state returns unchanged line
- Various list markers: `-`, `*`, `+`
- Indented lines
- Lines without brackets (no match)
- Lines with extra content after `]`

### Integration tests (Phase 3b — optional)
- VS Code test runner with `@vscode/test-electron`
- Open a markdown file, execute command, verify document change
- Multi-cursor test

---

## Phase 4: Polish & Package

- [ ] `README.md` with usage GIF/screenshot, keybinding table, install instructions
- [ ] `CHANGELOG.md` with initial release entry
- [ ] `.vscodeignore` to exclude test files, source maps, etc.
- [ ] Extension icon (simple BuJo-style bullet icon)
- [ ] `vsce package` → `.vsix`
- [ ] Optional: GitHub Actions workflow for CI (lint + test + package)

---

## Keybinding Summary

| Action         | Windows/Linux        | Mac                   | When                                                  |
|----------------|----------------------|-----------------------|-------------------------------------------------------|
| Cycle forward  | `Ctrl+Enter`         | `Cmd+Enter`           | `editorTextFocus && editorLangId == 'markdown'`       |
| Cycle reverse  | `Ctrl+Shift+Enter`   | `Cmd+Shift+Enter`     | `editorTextFocus && editorLangId == 'markdown'`       |

---

## Changes from SPEC

| SPEC says                  | Plan says                            | Reason                                         |
|----------------------------|--------------------------------------|------------------------------------------------|
| `yo code` scaffolding      | Manual scaffolding                   | Leaner, no boilerplate to delete               |
| `bujo-task-cycler` name    | `vscode-bojo`                        | Match repo name                                |
| `when: "editorTextFocus"`  | `+ editorLangId == 'markdown'`       | Prevent firing in non-markdown files           |
| Single command             | Forward + Reverse commands           | Better UX, avoid cycling through 3 states back |
| `let disposable`           | `const disposable`                   | Never reassigned                               |
| Unknown state → `/`        | Unknown state → no change            | Less surprising behavior                       |
| All logic in extension.ts  | Extracted `cycler.ts`                | Testable pure functions                        |
| No tests                   | Unit + integration tests             | Essential for correctness                      |
