### Prerequisites

* Install **Node.js** and **Git**.
* Install the VS Code Extension Generator: `npm install -g yo generator-code`

### Setup Instructions

1.  Generate the extension project:
    ```bash
    yo code
    ```
2.  Select **New Extension (TypeScript)**.
3.  Name the extension (e.g., `bujo-task-cycler`).
4.  Navigate to the generated directory: `cd bujo-task-cycler`.

### Configuration: `package.json`

Replace the `contributes` section in your `package.json` to register the command and map it to a keyboard shortcut (e.g., `Ctrl+Enter` or `Cmd+Enter`).

```json
"contributes": {
  "commands": [
    {
      "command": "bujo-task-cycler.cycleTask",
      "title": "Cycle Bullet Journal Task"
    }
  ],
  "keybindings": [
    {
      "command": "bujo-task-cycler.cycleTask",
      "key": "ctrl+enter",
      "mac": "cmd+enter",
      "when": "editorTextFocus"
    }
  ]
}
```

### Logic: `src/extension.ts`

Replace the contents of `src/extension.ts` with the following code. This regex targets standard markdown lists with brackets (e.g., `- [ ]`, `* [/]`) and cycles the character inside the brackets.

```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('bujo-task-cycler.cycleTask', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const document = editor.document;
        const selections = editor.selections;

        editor.edit(editBuilder => {
            selections.forEach(selection => {
                const line = document.lineAt(selection.active.line);
                const text = line.text;

                // Matches lines starting with whitespace, a list marker (-, *, +), and brackets
                const match = text.match(/^(\s*(?:-|\*|\+)\s*\[)(.)(\].*)$/);

                if (match) {
                    const prefix = match[1];
                    const stateChar = match[2];
                    const suffix = match[3];

                    let nextChar = ' ';
                    
                    // Cycle: [ ] -> [/] -> [!] -> [x] -> [ ]
                    switch (stateChar) {
                        case ' ': nextChar = '/'; break;
                        case '/': nextChar = '!'; break;
                        case '!': nextChar = 'x'; break;
                        case 'x': nextChar = ' '; break;
                        default:  nextChar = '/'; break; // Default to in-progress if unknown
                    }

                    const newLine = prefix + nextChar + suffix;
                    editBuilder.replace(line.range, newLine);
                }
            });
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
```

### Testing and Packaging

1.  Press `F5` in VS Code to open an Extension Development Host window.
2.  Open a Markdown file and create a task list item: `- [ ] Task name`.
3.  Place your cursor on the line and press `Ctrl+Enter` (or `Cmd+Enter` on Mac) to cycle through the states.
4.  To package the extension for permanent use, install `vsce` (`npm install -g @vscode/vsce`) and run `vsce package` in the project directory to generate a `.vsix` file.
5.  Install the `.vsix` file via the VS Code Extensions view (**Install from VSIX...**).
