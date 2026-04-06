import * as vscode from 'vscode';
import { cycleLine } from './cycler';

export function activate(context: vscode.ExtensionContext) {
	// Register forward cycle command
	const forwardDisposable = vscode.commands.registerCommand('bojo.cycleTask', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const document = editor.document;
		const selections = editor.selections;

		editor.edit(editBuilder => {
			selections.forEach(selection => {
				const line = document.lineAt(selection.active.line);
				const newLine = cycleLine(line.text, 'forward');
				
				if (newLine !== null) {
					editBuilder.replace(line.range, newLine);
				}
			});
		});
	});

	// Register reverse cycle command
	const reverseDisposable = vscode.commands.registerCommand('bojo.cycleTaskReverse', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const document = editor.document;
		const selections = editor.selections;

		editor.edit(editBuilder => {
			selections.forEach(selection => {
				const line = document.lineAt(selection.active.line);
				const newLine = cycleLine(line.text, 'reverse');
				
				if (newLine !== null) {
					editBuilder.replace(line.range, newLine);
				}
			});
		});
	});

	context.subscriptions.push(forwardDisposable, reverseDisposable);
}

export function deactivate() {}
