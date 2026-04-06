# vscode-bojo Specification

## Overview

vscode-bojo is a VS Code extension that cycles bullet journal (BuJo) task states in markdown files via keyboard shortcuts.

## Task States

The extension supports **9 task states** with full Obsidian Tasks compatibility:

### Cycle Order

**Forward**: `[ ]` → `[/]` → `[x]` → `[>]` → `[<]` → `[-]` → `[*]` → `[?]` → `[!]` → `[ ]`

**Reverse**: `[ ]` → `[!]` → `[?]` → `[*]` → `[-]` → `[<]` → `[>]` → `[x]` → `[/]` → `[ ]`

### State Reference

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

### Alternative Names

Each state has multiple accepted names for compatibility:

- **space**: todo, unchecked, to-do
- **/**: incomplete, in-progress
- **x**: done, checked
- **>**: rescheduled, forwarded
- **<**: scheduled, scheduling
- **-**: canceled, cancelled
- **\***: star, starred
- **?**: question, inquiry
- **!**: important, urgent

## Implementation

### Core Logic (`src/cycler.ts`)

```typescript
const CYCLE = [' ', '/', 'x', '>', '<', '-', '*', '?', '!'] as const;

export function getNextState(current: string): string | null
export function getPrevState(current: string): string | null
export function getStateName(char: string): string | null
export function getStateFromName(name: string): string | null
export function cycleLine(line: string, direction: 'forward' | 'reverse'): string | null
```

## Testing

Run with `npm test` — **67 passing tests** covering:
- All 9 states forward cycle
- All 9 states reverse cycle
- State name/character mapping
- Edge cases (unknown states, no match)
- Various list markers and indentation