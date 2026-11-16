# Debugging Scripts

Nushell includes a debugger for scripts. Running `nu --dap` starts a [Debug Adapter Protocol](https://microsoft.github.io/debug-adapter-protocol/) (DAP) server, the protocol that editors such as VS Code, Neovim, and Zed use to drive debuggers. Once your editor is set up to use it, you can set breakpoints in a `.nu` file, step through the script line by line and into pipeline stages, look at variables and `$env`, evaluate expressions while the script is paused, and even step backward through what already ran.

## Setting Up Your Editor

The editor starts `nu --dap` itself and talks to it over the process's standard input and output, so all it needs to know is the command to run (`nu`, with the argument `--dap`) and which script to launch. The debugger is part of the default build (the `dap` [Cargo feature](./installation.md)).

For example, with [nvim-dap](https://github.com/mfussenegger/nvim-dap) in Neovim:

```lua
local dap = require('dap')

dap.adapters.nu = {
  type = 'executable',
  command = 'nu',
  args = { '--dap' },
}

dap.configurations.nu = {
  {
    type = 'nu',
    request = 'launch',
    name = 'Debug this script',
    program = '${file}',
  },
}
```

In VS Code, the debugger comes with the [Nushell extension](https://marketplace.visualstudio.com/items?itemName=TheNuProjectContributors.vscode-nushell-lang), the same one that sets up the [language server](./language_server.md). Debugger support was added to the extension after its 2.0.6 release, so you need a newer release, or a build from the extension's [repository](https://github.com/nushell/vscode-nushell-lang). The extension registers the debug type `nushell` and runs the same `nu` as its language server. A configuration in `.vscode/launch.json` looks like this:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "nushell",
      "request": "launch",
      "name": "Debug nu script",
      "program": "${file}",
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

Zed only runs debug adapters that are built into Zed or provided by a Zed extension. The [Nu extension for Zed](https://github.com/zed-extensions/nu) provides the language server but no debug adapter, so Zed can't start `nu --dap` yet.

The debugger loads your `env.nu` and `config.nu` before it runs the script, so the script sees the same custom commands, aliases, and environment as your shell does. Add `-n` to the arguments (`args = { '--dap', '-n' }`) to start from the defaults instead. While the configuration files run, [`$nu.is-dap`](./special_variables.md#nu) is `true`.

### Launch Settings

These are the settings a launch configuration can have:

| Setting              | Default | Description                                                                                                                                      |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `program`            |         | The absolute path of the `.nu` script to debug. Required.                                                                                        |
| `args`               | `[]`    | Arguments for `main`, or for the `entryPoint` command, as a list of strings. They are parsed the way `nu <script> ...args` parses them.          |
| `cwd`                |         | The directory to run the script in. Without it, the script runs in the directory that holds the script, not the editor's.                        |
| `stopOnEntry`        | `false` | Pause before the first line runs.                                                                                                                |
| `entryPoint`         |         | A command to run after the script's top level, for a file that only defines commands. Without it, `main` runs if the script has one.             |
| `timeTravel`         | `true`  | Record every line that runs, so you can [step backward](#stepping-backward). With `false`, only the places where the script paused are recorded. |
| `timeTravelMaxSteps` | `10000` | How many recorded steps to keep. Older ones are dropped.                                                                                         |

The script runs the way `nu <script> ...args` would: first the top-level code, then `main` with the arguments from `args`, or the command named in `entryPoint`.

The VS Code configuration above, like the one the extension generates, sets `cwd` to `${workspaceFolder}`, the folder open in VS Code. Leave `cwd` out to run the script in its own directory.

## Breakpoints and Stepping

Set a breakpoint on a line, and the script pauses there. A breakpoint on a line that can't pause, such as a comment, moves to the next line that can. If that puts two breakpoints in the same place, for example one on a comment and one on the line below it, only the first one works. The editor shows the other as unverified, with a message such as `another breakpoint already covers line 5`.

A line often holds several steps. In `let doubled = ($nums | each {|n| $n * 2 })`, the `let`, the `each` call, and the closure body each run separately. An ordinary breakpoint pauses at the first of them and then again in the closure body for every item. An _inline_ breakpoint, set at a column (<kbd>Shift</kbd>+<kbd>F9</kbd> in VS Code), pauses at only that step.

Breakpoints can also be:

- **Conditional**: the condition is a Nushell expression, such as `$n == 3`, and the script pauses only when it is `true`. If the condition fails with an error or returns something other than a `bool`, the script pauses anyway, and a note starting with `nu-dap:` in the debug console says what went wrong.
- **Logpoints**: instead of pausing, the breakpoint writes a message to the debug console. Expressions in braces are evaluated, so `names has {$names | length} items` prints `names has 2 items`. A logpoint can have a condition too, and then it logs only when the condition is `true`. A condition that fails or doesn't return a `bool` doesn't hide the message. The logpoint logs anyway, after a `nu-dap:` note that says what went wrong.

The **Runtime errors** exception filter, which is on by default, pauses the script when a command raises an error, including an error that a `try` block will catch. The editor shows the error's code and message.

While the script is paused, you can continue, step over a line, step into a command call or a pipeline stage, or step out of the current command. The call stack shows the command and closure calls that led to the current line.

To stop a script that is running, use the editor's **Pause** command. The script stops at the next step it reaches, as if a breakpoint were there. While a long-running command such as [`sleep`](/commands/docs/sleep.md) or an external program is working, the script isn't at a step, so it pauses when that command finishes.

## Inspecting Values

When the script pauses, the editor's variables view shows:

- **Locals**: the variables in scope, `$in`, and `return`, the value of the last step.
- **Pipeline**: at the boundary between two pipeline stages, the value flowing into the next command.
- **Globals**: `$nu` and `$env`, with any changes the script has made to the environment.
- **Registers**: the evaluator's internal working values, for when you want to see what Nushell is doing under the hood.
- **Process**: the most recent output of the external commands the script ran.

Nested records, lists, and tables load one level at a time as you expand them, so a large value doesn't slow anything down until you look inside it. Streams are described, not read, so looking at one doesn't consume it.

Each level shows at most its first 200 entries. To see the rest, evaluate the value in the debug console or use the visualizer described below. A string longer than 120 characters shows its first 117 characters, then `…` and its length, such as `(500 chars)`. Most other values are cut to 120 characters, ending in `…`. A closure shows its source and how many variables it captured, such as `{|x| $x * $n} +1 capture`, and expanding it lists those variables with their values.

To see a whole value at once, a client can send the debugger's own `nuDapVisualize` request, which the VS Code extension's **Visualize** action uses. Its arguments name a value from the variables view, either with the value's `variablesReference` or, for a value that doesn't expand, with the `containerReference` of the scope or value that holds it and its `name`. The response has the value as JSON in `value`, its Nushell type in `type`, and `truncated`. Lists and records stop at 1000 items, nesting stops at 8 levels, and binary data, sent as a hex string in a `$nuBinary` object, stops at 64 KiB. When any of these limits cuts the value, `truncated` is `true`. Filesizes, durations, and dates come back as strings, such as `"2.0 kB"`, `"1500000000ns"`, and `"2026-01-02T03:04:05+00:00"`. Use references from the current pause. One that the current pause doesn't have gets the error `no value for that reference (stale after resume?)`.

Watch expressions, the debug console, and hovering over a variable evaluate Nushell expressions using the paused values. They run against a copy of the script's state, so they can't change the script's variables.

Output from [`print`](/commands/docs/print.md) and from external commands goes to the editor's debug console. The script has no terminal, so external commands get no standard input.

## Stepping Backward

Nushell can't run code in reverse, so the debugger records the state at each line instead (when `timeTravel` is on, as it is by default). **Step Back** and **Reverse Continue** move back through those recordings, to the previous line or the previous breakpoint, and show the variables and the call stack as they were. Stepping forward from there moves through the recording until you reach the newest step, and then the script runs again. Commands that already ran are not undone: a file that the script wrote stays written.

**Restart** runs the script again from the start in the same session, re-reading it from disk and keeping your breakpoints.

## Limitations

- The debugger can only launch a script. It can't attach to a running Nushell.
- You can't change a variable's value while the script is paused.
- Function breakpoints and hit-count breakpoints aren't supported.
- The variables view always shows the innermost command or closure. Selecting a caller in the call stack takes you to its line, but the variables stay those of the innermost frame.
- [`input`](/commands/docs/input.md) and [`input list`](/commands/docs/input_list.md) need a client that supports the debugger's prompt dialogs. In other editors, the script waits at the prompt and fails after 10 minutes. `input listen` doesn't work in the debugger.
