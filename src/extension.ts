// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import selection from './selection';
import {paserClassName} from './paserClassName';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export  function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "jsx-class-to-less" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('jsx-class-to-less', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
        // vscode.window.showInformationMessage('jsx-class-to-less');

        const activeText = selection.getText()!;
        // const activeText = vscode.window.activeTextEditor?.document.getText()!;

        const lessTree = await paserClassName(activeText) as any;
        const doc = await vscode.workspace.openTextDocument({
            content: lessTree,
            language: 'less'
        });

        await vscode.window.showTextDocument(doc);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
