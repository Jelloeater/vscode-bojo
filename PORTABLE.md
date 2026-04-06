# PORTABLE.md - Cross-Editor Handoff Specification

This document provides a complete specification for porting the Bojo task cycling logic to other editors and plugins.

## Overview

The core cycling logic in `src/cycler.ts` is **editor-agnostic** and can be ported to any text editor that supports:
- Text manipulation (finding/replacing lines)
- Keyboard shortcuts/keybindings
- File type detection (markdown)

## Core Logic (`cycler.ts`)

The entire logic is contained in ~120 lines of TypeScript with **zero external dependencies**.

### Data Structures

```typescript
// The cycle order - immutable tuple
const CYCLE = [' ', '/', 'x', '>', '<', '-', '*', '?', '!'] as const;

// State name mappings
const nameMap: Record<string, string> = {
    ' ': 'to-do',
    '/': 'incomplete',
    'x': 'done',
    '>': 'rescheduled',
    '<': 'scheduled',
    '-': 'canceled',
    '*': 'star',
    '?': 'question',
    '!': 'important',
};

// Reverse lookup (name -> char)
const stateMap: Record<string, string> = {
    'todo': ' ', 'unchecked': ' ', 'to-do': ' ',
    'incomplete': '/', 'in-progress': '/',
    'done': 'x', 'checked': 'x',
    'rescheduled': '>', 'forwarded': '>',
    'scheduled': '<', 'scheduling': '<',
    'canceled': '-', 'cancelled': '-',
    'star': '*', 'starred': '*',
    'question': '?', 'inquiry': '?',
    'important': '!', 'urgent': '!',
};
```

### Public API

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `getNextState(current)` | `string` | `string \| null` | Get forward state |
| `getPrevState(current)` | `string` | `string \| null` | Get reverse state |
| `getStateName(char)` | `string` | `string \| null` | Get state display name |
| `getStateFromName(name)` | `string` | `string \| null` | Get char from name |
| `cycleLine(line, direction)` | `string, 'forward' \| 'reverse'` | `string \| null` | Transform line |

### Regex Pattern

```
^(\s*(?:-|\*|\+)\s*\[)(.)(\].*)$
```

| Group | Description |
|-------|-------------|
| 1 | Prefix: `  - [` (whitespace + marker + opening bracket) |
| 2 | State char: `x` (the cycled character) |
| 3 | Suffix: `] Task` (closing bracket + rest of line) |

### Algorithm

1. **Match**: Use regex to find bullet journal task lines
2. **Extract**: Get the state character from group 2
3. **Transform**: Call `getNextState()` or `getPrevState()`
4. **Replace**: Reconstruct line with new state character
5. **Return**: Modified line, or `null` if no match/unknown state

## Porting to Other Editors

### Required Integration Points

| Editor | Language | Keybinding API | Text Replace API | Activation |
|--------|----------|----------------|------------------|------------|
| VS Code | TypeScript | `package.json` | `vscode.window.activeTextEditor.edit()` | `onLanguage:markdown` |
| Neovim | Lua/vimscript | `vim.keymap.set()` | `nvim_buf_set_lines()` | `autocmd FileType markdown` |
| Emacs | Emacs Lisp | `global-set-key` | `replace-regexp-in-region` | `(add-hook 'markdown-mode-hook)` |
| JetBrains | Kotlin/Java | `Keymap` settings | `Document.replaceString()` | `FileTypePolicy` |
| Sublime | Python | `KeyBinding` | `view.replace()` | `on_activated_async` |
| Atom | CoffeeScript | `keymaps.add` | `TextEditor::replace` | `language-markdown` |

### Neovim (Lua)

```lua
-- cycler.lua (pure logic, no external deps)
local CYCLE = {' ', '/', 'x', '>', '<', '-', '*', '?', '!'}

local function get_next_state(current)
    local idx = vim.tbl_contains(CYCLE, current) 
        and vim.tbl_index(CYCLE, current) or nil
    if not idx then return nil end
    return CYCLE[(idx % #CYCLE) + 1]
end

local function cycle_line(line, direction)
    local pattern = "^%s*(%p)%s*%[(.)](.*)$"
    local marker, state_char, suffix = line:match(pattern)
    if not marker then return nil end
    
    local new_char = direction == "forward" 
        and get_next_state(state_char) 
        or get_prev_state(state_char)
    if not new_char then return nil end
    
    return string.format("%s [%s]%s", 
        line:match("^%s*"), new_char, suffix)
end
```

### Emacs (Emacs Lisp)

```elisp
(defconst bojo-cycle '(" " "/" "x" ">" "<" "-" "*" "?" "!"))

(defun bojo-get-next (char)
  (let ((idx (seq-position bojo-cycle char)))
    (if idx (elt bojo-cycle (mod (1+ idx) (length bojo-cycle))))))

(defun bojo-cycle-line (&optional reverse)
  (interactive "P")
  (let* ((line (thing-at-point 'line t))
         (match (string-match "^\\s-*[-*+]\\s*\\[(.)\\](.*)$" line)))
    (when match
      (let* ((state (match-string 1 line))
             (suffix (match-string 2 line))
             (new-state (if reverse (bojo-get-prev state) (bojo-get-next state))))
        (when new-state
          (replace-match (concat "[" new-state "]" suffix) t t))))))
```

### JetBrains (Kotlin)

```kotlin
// Cycler.kt
object Cycler {
    private val CYCLE = listOf(' ', '/', 'x', '>', '<', '-', '*', '?', '!')
    
    fun getNextState(current: Char): Char? {
        val idx = CYCLE.indexOf(current)
        return if (idx >= 0) CYCLE[(idx + 1) % CYCLE.size] else null
    }
    
    fun cycleLine(line: String, forward: Boolean): String? {
        val regex = Regex("""^(\s*[-*+]\s*\[)(.)(\].*)$""")
        val match = regex.find(line) ?: return null
        val newState = if (forward) getNextState(match.groupValues[2][0])
                       else getPrevState(match.groupValues[2][0])
        return newState?.let { 
            "${match.groupValues[1]}$it${match.groupValues[3]}" 
        }
    }
}
```

### Sublime Text (Python)

```python
# cycler.py
CYCLE = [' ', '/', 'x', '>', '<', '-', '*', '?', '!']

def get_next_state(char):
    try:
        idx = CYCLE.index(char)
        return CYCLE[(idx + 1) % len(CYCLE)]
    except ValueError:
        return None

def cycle_line(line, forward=True):
    import re
    match = re.match(r'^(\s*[-*+]\s*\[)(.)(\].*)$', line)
    if not match:
        return None
    
    new_char = get_next_state(match.group(2)) if forward else get_prev_state(match.group(2))
    if not new_char:
        return None
    
    return f"{match.group(1)}{new_char}{match.group(3)}"
```

## Keybinding Recommendations

| Editor | Forward | Reverse | Scope |
|--------|---------|---------|-------|
| VS Code | `Ctrl+Enter` | `Ctrl+Shift+Enter` | markdown |
| Neovim | `Enter` (in normal mode) | `S-Enter` | markdown |
| Emacs | `C-Enter` | `C-S-Enter` | markdown-mode |
| JetBrains | `Ctrl+Enter` | `Ctrl+Shift+Enter` | Markdown |
| Sublime | `Enter` | `Super+Enter` | markdown |

## Testing Strategy

The pure functions are easily testable in any language:

1. **Forward cycle test**: `space → / → x → > → < → - → * → ? → ! → space`
2. **Reverse cycle test**: `space ← ! ← ? ← * ← - ← < ← > ← x ← / ← space`
3. **Edge cases**: Unknown state returns null, non-matching lines return null

## Files for Porting

| File | Purpose | Needed for Port? |
|------|---------|------------------|
| `src/cycler.ts` | Core logic | **Yes** - copy this |
| `src/extension.ts` | VS Code integration | No - rewrite for target editor |
| `src/test/cycler.test.ts` | Unit tests | Useful as reference |
| `SPEC.md` | Full specification | Yes |
| `PORTABLE.md` | This file | Yes |

## Minimal Porting Checklist

- [ ] Copy `cycler.ts` logic to target language
- [ ] Implement text matching (regex or string parsing)
- [ ] Implement text replacement
- [ ] Bind keyboard shortcut
- [ ] Scope to markdown files only
- [ ] Add multi-cursor/region support (optional)
- [ ] Add tests

## License

MIT — Porting is permitted with attribution.