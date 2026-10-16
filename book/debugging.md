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

VS Code needs an extension that registers a debugger for Nushell, which then reads the same launch settings from `launch.json`.

The debugger loads your `env.nu` and `config.nu` before it runs the script, so the script sees the same custom commands, aliases, and environment as your shell does. Add `-n` to the arguments (`args = { '--dap', '-n' }`) to start from the defaults instead. While the configuration files run, [`$nu.is-dap`](./special_variables.md#nu) is `true`.

### Launch Settings

These are the settings a launch configuration can have:

| Setting              | Default | Description                                                                                                                                      |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `program`            |         | The absolute path of the `.nu` script to debug. Required.                                                                                        |
| `args`               | `[]`    | Arguments for `main`, or for the `entryPoint` command, as a list of strings. They are parsed the way `nu <script> ...args` parses them.          |
| `cwd`                |         | The directory to run the script in.                                                                                                              |
| `stopOnEntry`        | `false` | Pause before the first line runs.                                                                                                                |
| `entryPoint`         |         | A command to run after the script's top level, for a file that only defines commands. Without it, `main` runs if the script has one.             |
| `timeTravel`         | `true`  | Record every line that runs, so you can [step backward](#stepping-backward). With `false`, only the places where the script paused are recorded. |
| `timeTravelMaxSteps` | `10000` | How many recorded steps to keep. Older ones are dropped.                                                                                         |

The script runs the way `nu <script> ...args` would: first the top-level code, then `main` with the arguments from `args`, or the command named in `entryPoint`.

## Breakpoints and Stepping

Set a breakpoint on a line, and the script pauses there. A breakpoint on a line that can't pause, such as a comment, moves to the next line that can.

A line often holds several steps. In `let doubled = ($nums | each {|n| $n * 2 })`, the `let`, the `each` call, and the closure body each run separately. An ordinary breakpoint pauses at the first of them and then again in the closure body for every item. An _inline_ breakpoint, set at a column (<kbd>Shift</kbd>+<kbd>F9</kbd> in VS Code), pauses at only that step.

Breakpoints can also be:

- **Conditional**: the condition is a Nushell expression, such as `$n == 3`, and the script pauses only when it is `true`.
- **Logpoints**: instead of pausing, the breakpoint writes a message to the debug console. Expressions in braces are evaluated, so `names has {$names | length} items` prints `names has 2 items`.

The **Runtime errors** exception filter, which is on by default, pauses the script when a command raises an error, including an error that a `try` block will catch. The editor shows the error's code and message.

While the script is paused, you can continue, step over a line, step into a command call or a pipeline stage, or step out of the current command. The call stack shows the command and closure calls that led to the current line.

## Inspecting Values

When the script pauses, the editor's variables view shows:

- **Locals**: the variables in scope, `$in`, and `return`, the value of the last step.
- **Pipeline**: at the boundary between two pipeline stages, the value flowing into the next command.
- **Globals**: `$nu` and `$env`, with any changes the script has made to the environment.
- **Registers**: the evaluator's internal working values, for when you want to see what Nushell is doing under the hood.
- **Process**: the most recent output of the external commands the script ran.

Nested records, lists, and tables load one level at a time as you expand them, so a large value doesn't slow anything down until you look inside it. Streams are described, not read, so looking at one doesn't consume it.

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
