# Language Server

Running `nu --lsp` starts Nushell's built-in [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) (LSP) server. An editor that speaks LSP uses it to underline errors as you type, complete commands and paths, show a command's help when you hover over it, jump to definitions, and rename a variable or custom command across files. The server runs Nushell's own parser on your code, so the errors it reports are the ones `nu` would report before running the script.

The language server is part of the default build (the `lsp` [Cargo feature](./installation.md)). To step through a script while it runs, use the debugger instead (see [Debugging Scripts](./debugging.md)).

## Starting the server

You don't run the server by hand. The editor starts `nu --lsp` and talks to it over the process's standard input and output. No other arguments are needed.

Before it answers the editor, the server loads the same startup files as an interactive session: the plugin registry, `env.nu`, `config.nu`, and the autoload directories. Custom commands, aliases, and modules defined there, and the commands of registered plugins, are all known to the server. It completes them, shows their help, and doesn't treat calls to them as external commands. Add `-n` (`--no-config-file`) to the arguments to start from the defaults instead. The other startup flags, such as `--config`, `--env-config`, `--plugin-config`, and `--plugins`, work with `--lsp` too.

While the startup files run, [`$nu.is-lsp`](./special_variables.md#nu) is `true`. [`print`](/commands/docs/print.md) writes to stderr in this mode, but the output of an external command still goes to stdout, in between the protocol messages that the editor reads from there. Skip such commands when the language server starts:

```nu
# in config.nu
if not $nu.is-lsp {
    ^echo "hello from config.nu"
}
```

The server parses each file with the file's own directory as the current directory. Relative paths in `use` and `source`, and file path completions, start from where the file is, not from where the editor was started.

## Editor setup

### VS Code

The [Nushell extension for VS Code](https://marketplace.visualstudio.com/items?itemName=TheNuProjectContributors.vscode-nushell-lang) starts `nu --lsp` for `.nu` files.

### Neovim

Neovim 0.11 and later can start the server with the built-in LSP client. Neovim sets the `nu` filetype for `.nu` files:

```lua
vim.lsp.config('nushell', {
  cmd = { 'nu', '--lsp' },
  filetypes = { 'nu' },
  root_markers = { '.git' },
})
vim.lsp.enable('nushell')
```

`root_markers` decides the workspace folder. Neovim looks upward from the file for one of the listed names and sends that directory to the server as the workspace folder. When nothing matches, no folder is sent, and find references and rename only see the current file.

### Helix

Helix comes with the server already configured. Its built-in `languages.toml` gives `.nu` and `.nuon` files the `nu` language, whose language server, `nu-lsp`, runs `nu --lsp`. It works as long as `nu` is on your `PATH`. Run `hx --health nu` to see whether Helix found it.

To change the arguments or the `nu` binary, redefine `nu-lsp` in your own `languages.toml`, which lives in `~/.config/helix/` on Linux and macOS and in `%AppData%\helix\` on Windows. Helix merges your table with the built-in one, so a key you leave out, such as `command` here, keeps its built-in value. This starts the server without your configuration files:

```toml
[language-server.nu-lsp]
args = ["--lsp", "--no-config-file"]
```

### Zed

Install the Nu extension from Zed's extensions panel. It gives `.nu` and `.nuon` files the Nu language and starts `nu --lsp` with the `nu` it finds on your `PATH`. When there is no `nu` on the `PATH`, it reports `nu is not installed`. This describes version 0.0.10 of the [extension](https://github.com/zed-extensions/nu).

To run a different `nu` or pass more arguments, override the `nu` language server's binary in your Zed settings. The extension's README uses this to load a smaller configuration file instead of your full one, since a large configuration can slow the server down. Replace `<file>` with the path to that file:

```json
{
  "lsp": {
    "nu": {
      "binary": {
        "path": "nu",
        "arguments": ["--config", "<file>", "--lsp"]
      }
    }
  }
}
```

### Other editors

Any editor with an LSP client can use the server. Configure it to run `nu` with the argument `--lsp` for `.nu` files, and check that it sends a workspace folder, as described in the next section.

## What the editor sends

The server uses standard LSP over stdin and stdout: JSON-RPC messages, each preceded by a `Content-Length` header. Editors with an LSP client handle the details, but a few of them matter when a feature doesn't work:

- The server reads the project directories from the `workspaceFolders` field of the `initialize` request. It ignores `rootUri` and `rootPath`, so a client that only sends those gets no workspace-wide search. Later `workspace/didChangeWorkspaceFolders` notifications add and remove folders. A file belongs to a folder when the file's URI starts with the folder's URI.
- The editor sends `textDocument/didOpen`, `didChange`, and `didClose` for the files you edit. The server asks for incremental changes, so each `didChange` carries only the edited range. The server works from the text it was sent, including unsaved edits.
- The server reports the progress of workspace-wide searches with `$/progress` notifications, and sends warnings as `window/logMessage` notifications.
- The server registers no trigger characters for completion or signature help. Most editors ask for completions while you type a word, but whether signature help appears without you asking for it depends on the editor.

An `initialize` request with one workspace folder looks like this:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "processId": null,
    "capabilities": {},
    "workspaceFolders": [
      { "uri": "file:///home/me/project", "name": "project" }
    ]
  }
}
```

The response lists the features below in `capabilities`, and its `serverInfo` gives the name `Nushell` and the version of `nu`.

## Features

| Feature            | LSP method                                               |
| ------------------ | -------------------------------------------------------- |
| Diagnostics        | `textDocument/publishDiagnostics` (sent by the server)   |
| Completion         | `textDocument/completion`                                |
| Hover              | `textDocument/hover`                                     |
| Signature help     | `textDocument/signatureHelp`                             |
| Go to definition   | `textDocument/definition`                                |
| Document highlight | `textDocument/documentHighlight`                         |
| Find references    | `textDocument/references`                                |
| Rename             | `textDocument/prepareRename`, then `textDocument/rename` |
| Document symbols   | `textDocument/documentSymbol`                            |
| Workspace symbols  | `workspace/symbol`                                       |
| Inlay hints        | `textDocument/inlayHint`                                 |
| Semantic tokens    | `textDocument/semanticTokens/full`                       |

The server has no formatting or code actions.

### Diagnostics

Each time a file is opened or changed, the server parses it and sends the problems it found in a `textDocument/publishDiagnostics` notification. Parse errors become errors, and parse warnings, such as a call to a deprecated command, become warnings. These are the problems `nu` finds before it runs a script: syntax errors, unknown flags, missing arguments, variables that don't exist, and the type mismatches the parser can detect. Errors that only happen while a script runs aren't reported. In this file:

```nu
ls --al
$greting
```

the server reports two errors, ``The `ls` command doesn't have flag `al`.`` on `--al` and `Variable not found.` on `$greting`.

A diagnostic has only the short message, without the help text and labels that `nu` prints. A problem inside a file that this one imports with `use` or `source` is reported on this file, at its end.

### Completion

Completions come from the same engine as <kbd>Tab</kbd> completion in the REPL. They include commands, flags, file and directory paths, module names after `use`, variables, the fields of a record in a cell path, and operators. [Custom completions](./custom_completions.md) and the external completer set in `config.nu` (`$env.config.completions.external.completer`) apply as well.

Each item has a kind, which most editors show as an icon:

| Suggestion                             | Completion item kind |
| -------------------------------------- | -------------------- |
| Built-in command                       | Function             |
| Custom command or plugin command       | Method               |
| Keyword, such as `let` or `def`        | Keyword              |
| Alias                                  | Reference            |
| External command                       | Interface            |
| Flag                                   | Field                |
| File                                   | File                 |
| Directory                              | Folder               |
| Module                                 | Module               |
| Variable                               | Variable             |
| Cell path member                       | Property             |
| Operator                               | Operator             |
| String value, such as a flag's choices | Value                |

Choosing a command inserts a snippet with a placeholder for each positional parameter. An optional parameter's placeholder ends in `?`, a rest parameter's starts with `...`, and a block parameter gets braces. The item's documentation is the command's help. Completing `str jo` returns (some fields left out):

```json
{
  "label": "str join",
  "labelDetails": { "description": "built-in" },
  "kind": 3,
  "detail": "Concatenate multiple strings into a single string, with an optional separator between each.",
  "insertTextFormat": 2,
  "textEdit": {
    "range": {
      "start": { "line": 1, "character": 0 },
      "end": { "line": 1, "character": 6 }
    },
    "newText": "str join ${1:separator?}"
  }
}
```

### Hover

What hovering shows depends on what is under the cursor:

- A command: its help as Markdown, with the description, usage, flags, parameters, input and output types, and examples. This covers built-in, custom, and plugin commands.
- A variable: its type, and its value if it is a constant. For other variables, hover says whether the variable is `mutable` or `immutable`.
- A cell path such as `$person.name`: the type of that field, and its value when the variable is a constant.
- A module name: the module's documentation comments.
- An external command: its manual page, from `man`. On Windows, the server runs PowerShell's `help` instead.
- Any other expression, such as a literal: its type.

### Signature help

With the cursor among a command's arguments, signature help shows the command's usage line, such as `str join {flags} (separator)`, and describes each parameter. Positional parameters come first, in order, and the flags follow them. The active parameter is the positional parameter the cursor is on, counted by the positional arguments before it.

### Go to definition

Go to definition jumps to:

- the body of a custom command
- the declaration of a variable, including command parameters and closure parameters
- the definition of a module
- the value of a field, for a cell path into a constant

For a module that is a whole file, as in `overlay use lib.nu`, the definition is the start of that file. The definition can be in another file that the current one imports with `use` or `source`, whether or not that file is open in the editor. Built-in commands, plugin commands, and external commands have no definition to go to. Neither do commands from the [standard library](./standard_library.md), which is built into `nu`. For a standard library command, the server logs a warning and returns nothing.

### Document highlight

Document highlight marks every place in the current file where the variable, command, or module under the cursor appears, including its definition.

### Find references

Find references lists every place where the variable, command, or module under the cursor appears, including its definition.

When the file is in a workspace folder, the server searches every `.nu` file under that folder, at any depth, along with the files open in the editor. It parses only the files whose text contains the name, and reports its progress as it goes (`Finding references ...`). The search has a five-second budget. When that runs out, the server stops, logs `Workspace-wide search took too long!`, and returns the references it found so far.

When the file isn't in a workspace folder, only the current file is searched.

### Rename

Renaming takes two requests. `textDocument/prepareRename` checks what is under the cursor and starts a search for every occurrence, and `textDocument/rename` turns what that search found into edits.

Only variables, custom commands, and modules defined in your code can be renamed. On a built-in command, or anything else without a definition, preparation fails with `Definition not found. Not allowed to rename built-ins.` On a literal or another expression, it fails with `Rename only works for variable/command.`

The search covers the same files as find references, and reports progress as `Preparing rename ...`. It has no time limit, but any other message from the editor stops it, such as a hover request or the `didChange` that a keystroke sends. The server then logs `Workspace-wide search took too long!` and ends the progress report with `interrupted.` A rename request that arrives before the search finishes is refused with `Please wait for renaming preparation to complete.` and stops the search too. A rename after a stopped search only edits what the search found before it stopped, which can be nothing at all. Start the rename again to search every file.

Without a workspace folder, only the current file is edited. When the command is defined in another file, its definition keeps the old name.

### Symbols

Document symbols list the custom commands, variables, and modules defined in a file, as a flat list with the commands first. Editors use them for an outline view and for jumping to a symbol.

Workspace symbols search the symbols of the files open in the editor and of the files they import with `use` or `source`, matching the query fuzzily. The query is case-insensitive unless it has an uppercase letter. Files in the workspace folder that aren't open or imported aren't searched.

### Inlay hints

Inlay hints are short labels that the editor draws inside the code without changing it. The server adds:

- the type after the name in a `let`, `mut`, or `const` declaration and after a `for` loop variable, unless the code already has a type annotation, as in `let count: int = 0`,
- the type after the variable in an assignment, such as `$count += 1`,
- the parameter name before each positional argument of a custom command defined in your code, with the parameter's type and description as a tooltip.

Lists, records, and tables are shown as `list`, `record`, and `table`, without their element types. Parameter names aren't shown for built-in or plugin commands, for flags, or for a rest parameter. After a spread argument (`...$args`), no more parameter names are shown. For this file:

```nu
def greet [name: string] { $"hello ($name)" }
let names = [Ada Grace]
$names | each {|n| greet $n }
```

an editor shows `: list` after `names`, and `name:` before `$n`.

The server computes the hints when the file is opened or changed and always returns the hints for the whole file, whatever range the editor asks for.

### Semantic tokens

Most editors color Nushell code with a syntax grammar that only sees the text. Such a grammar can't know which multi-word names, such as `str join`, are a single command, so it may color the second word as an argument. Semantic tokens cover that one case. The server marks each call to a command whose name has more than one word, such as `str join`, a custom command named `git sync`, or `assert equal` from the standard library, with the token type `function`. Calls to commands whose names start with `export` or `overlay` aren't marked, and neither is anything else, so the grammar still colors the rest of the file. Only full-document requests are supported.

## One-shot IDE flags

Before the language server existed, editor extensions asked `nu` about a file through five command-line flags, and `nu` still has them. Each one parses a file, prints one answer as JSON, and exits. The current VS Code extension uses `--lsp` instead, but the flags are handy for a quick check from a script, or in a tool that has no LSP client.

All five take the file to inspect as the last argument and read it from disk, so they don't see unsaved changes in the editor. They parse the file without running it. They don't load `env.nu`, `config.nu` or the plugin registry, so your custom commands and plugin commands are unknown, and calls to them look like external commands. The standard library is loaded. Relative paths in `use` and `source` start from the file's directory. If the file can't be read, `--ide-goto-def`, `--ide-hover` and `--ide-check` print a `File not found` error and exit with status 1, `--ide-complete` exits with status 1 without a message, and `--ide-ast` prints nothing and exits with status 0. Otherwise the exit status is 0, even when the file has errors.

`--ide-goto-def`, `--ide-hover` and `--ide-complete` take a cursor position, as a byte offset from the start of the file, counting from 0. An editor that tracks the cursor by line and column has to convert it, and a character outside ASCII counts as more than one byte. The examples use this `script.nu`, where `$names` on the last line starts at byte 70, `each` at byte 79, and the call to `greet` at byte 89:

```nu
def greet [name: string] { $"hello ($name)" }
let names = [Ada Grace]
$names | each {|n| greet $n }
```

### `--ide-goto-def`

`--ide-goto-def <offset>` prints where the item at the offset is defined, as `{file, start, end}`. For a custom command, `start` and `end` are the byte range of the command's body. For a variable, they are the range of its name where it's declared. Both count from the start of `file`. `file` is the path as you gave it when the definition is in the same file, and an absolute path when it's in a file loaded with `use` or `source`. Built-in commands, external commands, and anything else without a definition give `{}`:

```nu
nu --ide-goto-def 89 script.nu
# => {"file":"script.nu","start":25,"end":45}
nu --ide-goto-def 70 script.nu
# => {"file":"script.nu","start":50,"end":55}
nu --ide-goto-def 79 script.nu
# => {}
```

### `--ide-hover`

`--ide-hover <offset>` prints `{hover, span: {start, end}}`. For a command, built-in or custom, `hover` is its help as Markdown, with the description, usage, flags, parameters, input and output types, and examples. For a variable, it's the variable's type, after the word `mutable` for a `mut` variable. For a literal, it's the kind of value, such as `string`, `int` or `file path`. `span` is the byte range of the item under the cursor. When there's nothing to describe, such as at a pipe symbol or past the end of the file, it prints nothing at all:

```nu
nu --ide-hover 70 script.nu
# => {"hover":"list<string>","span":{"start":70,"end":76}}
```

### `--ide-complete`

`--ide-complete <offset>` completes the code that comes before the offset, as if you had pressed <kbd>Tab</kbd> there in the REPL, and prints `{completions: [...]}` with the text of each suggestion. An offset past the end of the file completes at the end. For a file that holds just `str jo`:

```nu
nu --ide-complete 6 partial.nu
# => {"completions":["str join"]}
```

### `--ide-check`

`--ide-check <max-errors>` takes the most errors to report, not an offset. It prints one JSON object per line. First comes a `{type: diagnostic, severity, message, span}` object for each parse error, up to the limit. `severity` is always `Error`, and warnings, such as a call to a deprecated command, aren't reported. Then comes a `{type: hint, typename, position}` object for each variable declared with `let`, `mut`, `const` or `for`, with the type the parser inferred and the byte range of the variable's name. The hints don't count toward the limit, and they are printed even with a limit of 0. For this `check.nu`:

```nu
ls --al
let count = 0
$greting
```

```nu
nu --ide-check 10 check.nu
# => {"type":"diagnostic","severity":"Error","message":"The `ls` command doesn't have flag `al`.","span":{"start":3,"end":7}}
# => {"type":"diagnostic","severity":"Error","message":"Variable not found.","span":{"start":22,"end":30}}
# => {"type":"hint","typename":"int","position":{"start":12,"end":17}}
```

### `--ide-ast`

`--ide-ast` takes no number. It prints the file's tokens as one JSON array, with a `{type: ast, span, shape, content}` object for each token. `shape` is the token's syntax shape, as in [`ast --flatten`](/lang-guide/chapters/helpers_and_debugging.md#ast), and `content` is its text. For a file that holds `ls | length`:

```nu
nu --ide-ast small.nu
# => [{"type":"ast","span":{"start":0,"end":2},"shape":"shape_internalcall","content":"ls"},{"type":"ast","span":{"start":3,"end":4},"shape":"shape_pipe","content":"|"},{"type":"ast","span":{"start":5,"end":11},"shape":"shape_internalcall","content":"length"}]
```
