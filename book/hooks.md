# Hooks

Hooks allow you to run a code snippet at some predefined situations.
The `pre_prompt`, `pre_execution` and `env_change` hooks only run in the interactive mode ([REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)). They do not run if you run Nushell with a script (`nu script.nu`) or command (`nu -c "print foo"`) argument.
The `display_output` and `command_not_found` hooks work there too. `display_output` formats the value that the script or command returns, and `command_not_found` runs when it calls a command that doesn't exist.

If a hook raises an error, Nushell prints the error and carries on, and the REPL still shows the next prompt. [Hook lists and errors](#hook-lists-and-errors) describes which other hooks still run.

Currently, we support these types of hooks:

- `pre_prompt` : Triggered before the prompt is drawn
- `pre_execution` : Triggered before the line input starts executing
- `env_change` : Triggered when an environment variable changes
- `display_output` : A block that the output is passed to
- `command_not_found` : Triggered when a command is not found

To make it clearer, we can break down Nushell's execution cycle.
The steps to evaluate one line in the REPL mode are as follows:

1. Check for `env_change` hooks and run them
1. Check for `pre_prompt` hooks and run them
1. Display prompt and wait for user input
1. After user typed something and pressed "Enter": Check for `pre_execution` hooks and run them
1. Parse and evaluate user input
1. If a command is not found: Run the `command_not_found` hook. If it returns a string, show it.
1. If `display_output` is defined, use it to print command output
1. Return to 1.

## Basic Hooks

To enable hooks, define them in your [config](configuration.md):

```nu
$env.config.hooks = {
    pre_prompt: [{ print "pre prompt hook" }]
    pre_execution: [{ print "pre exec hook" }]
    env_change: {
        PWD: [{|before, after| print $"changing directory from ($before) to ($after)" }]
    }
}
```

Try putting the above into your config, running Nushell and moving around your filesystem.
When you change a directory, the `PWD` environment variable changes and the change triggers the hook with the previous and the current values stored in `before` and `after` variables, respectively.

Like environment variable names, the keys of `env_change` are case-insensitive, so a hook under `pwd` also runs when `PWD` changes.

Each watched variable also fires once before the first prompt, with `$before` set to `null`, since Nushell has no earlier value to compare with yet. The hook above prints `changing directory from  to /home/user` when Nushell starts. A variable that isn't set at startup fires the first time it gets a value, again with `$before` as `null`.

The `pre_prompt` and `pre_execution` hooks, and each variable in `env_change`, take a **list of hooks**, even if there is only one. When a list contains several hooks, they run in sequence:

```nu
$env.config.hooks = {
    pre_prompt: [
        { print "pre prompt hook" }
        { print "pre prompt hook2" }
    ]
    pre_execution: [
        { print "pre exec hook" }
        { print "pre exec hook2" }
    ]
    env_change: {
        PWD: [
            {|before, after| print $"changing directory from ($before) to ($after)" }
            {|before, after| print $"changing directory from ($before) to ($after) 2" }
        ]
    }
}
```

Instead of replacing all hooks, you can append a new hook to existing configuration:

```nu
$env.config.hooks.pre_execution = $env.config.hooks.pre_execution | append { print "pre exec hook3" }
```

To remove the hooks again, assign an empty list (or, for `env_change`, an empty record):

```nu
$env.config.hooks.pre_prompt = []
$env.config.hooks.pre_execution = []
$env.config.hooks.env_change = {}
```

### Hook lists and errors

A list can contain other lists. Nushell runs the hooks of an inner list in order, at the point where the inner list appears:

```nu
$env.config.hooks.pre_prompt = [
    [{ print "a" } { print "b" }]
    { print "c" }
]
```

This prints `a`, `b`, and `c` before each prompt.

If a hook raises an error, Nushell prints it and skips the rest of that list until the hook fires again. A hook whose definition is wrong counts as failing too, for example a closure with too many parameters or a [record](#conditional-hooks) without `code`. The one exception is a runtime error inside a [string hook](#hooks-as-strings). Nushell prints it and moves on to the next hook in the list.

## Changing Environment

One feature of the hooks is that they preserve the environment.
Environment variables defined inside the hook **block** will be preserved in a similar way as [`def --env`](custom_commands.md#changing-the-environment-in-a-custom-command).
You can test it with the following example:

```nu
$env.config = ($env.config | upsert hooks {
    pre_prompt: [{ $env.SPAM = "eggs" }]
})
```

The hook runs before the next prompt is shown, so at that prompt:

```nu
$env.SPAM
# => eggs
```

The hook blocks otherwise follow the general scoping rules, i.e., commands, aliases, etc. defined within the block will be thrown away once the block ends.

A closure can declare fewer parameters than its hook passes, but not more. `env_change` hooks pass two values (`before` and `after`), `command_not_found` passes one (the command name), and `pre_prompt`, `pre_execution`, and `display_output` pass none. A closure with an extra parameter, such as `pre_prompt: [{|x| print $x }]`, fails with "This hook block has too many parameters".

## `pre_execution` Hooks

`pre_execution` hooks can inspect the to-be-executed command through the [`commandline` command](/commands/docs/commandline.md).

For example, to print the command being executed:

```nu
$env.config = (
    $env.config
    | upsert hooks.pre_execution [ {||
        $env.repl_commandline = (commandline)
        print $"Command: ($env.repl_commandline)"
    } ]
)
```

From now on, each command line is printed before it runs:

```nu
print (1 + 3)
# => Command: print (1 + 3)
# => 4
```

Run `$env.config.hooks.pre_execution = []` to turn this off again.

On its own, `commandline` returns the text in the line editor's buffer as a string. In a `pre_execution` hook, that's the line about to run. Outside the REPL, in a script or with `nu -c`, it returns an empty string. Two of its subcommands change the buffer. [`commandline edit`](/commands/docs/commandline_edit.md) inserts, appends, or replaces text, and [`commandline set-cursor`](/commands/docs/commandline_set-cursor.md) moves the cursor.

These commands also work from a keybinding whose event is [`executehostcommand`](line_editor.md#send-type), which runs Nushell code while you're still editing the line. For example, this keybinding puts `sudo ` in front of the current line when you press <kbd>Alt</kbd>+<kbd>S</kbd>:

```nu
$env.config.keybindings ++= [{
    name: prepend_sudo
    modifier: alt
    keycode: char_s
    mode: [emacs vi_insert]
    event: {
        send: executehostcommand
        cmd: "commandline edit --replace $'sudo (commandline)'"
    }
}]
```

## Conditional Hooks

One thing you might be tempted to do is to activate an environment whenever you enter a directory:

```nu
$env.config = ($env.config | upsert hooks {
    env_change: {
        PWD: [
            {|before, after|
                if $after == /some/path/to/directory {
                    load-env { SPAM: eggs }
                }
            }
        ]
    }
})
```

This won't work because the environment will be active only within the [`if`](/commands/docs/if.md) block.
In this case, you could easily rewrite it as `load-env (if $after == ... { ... } else { {} })` but this pattern is fairly common and later we'll see that not all cases can be rewritten like this.

To deal with the above problem, we introduce another way to define a hook - **a record**:

```nu
$env.config = ($env.config | upsert hooks {
    env_change: {
        PWD: [
            {
                condition: {|before, after| $after == /some/path/to/directory }
                code: {|before, after| load-env { SPAM: eggs } }
            }
        ]
    }
})
```

When the hook triggers, it evaluates the `condition` block.
If it returns `true`, the `code` block will be evaluated.
If it returns `false`, nothing will happen.
If it returns something else, an error will be thrown.
The `condition` field can also be omitted altogether in which case the hook will always evaluate.

`condition` has to be a closure. A string there fails with a type mismatch. `code` can be a closure or a string (see [Hooks as Strings](#hooks-as-strings)). A record without `code` fails with "Cannot find column 'code'", but only once its condition passes, because Nushell looks for `code` only when it's about to run it.

The `pre_prompt` and `pre_execution` hook types also support the conditional hooks but they don't accept the `before` and `after` parameters.

## Hooks as Strings

So far a hook was defined as a block that preserves only the environment, but nothing else.
To be able to define commands or aliases, it is possible to define the `code` field as **a string**.
You can think of it as if you typed the string into the REPL and hit Enter.
So, the hook from the previous section can be also written as

```nu
$env.config = ($env.config | upsert hooks {
    pre_prompt: ['$env.SPAM = "eggs"']
})
```

and, at the next prompt:

```nu
$env.SPAM
# => eggs
```

This feature can be used, for example, to conditionally bring in definitions based on the current directory:

```nu
$env.config = ($env.config | upsert hooks {
    env_change: {
        PWD: [
            {
                condition: {|_, after| $after == /some/path/to/directory }
                code: 'def foo [] { print "foo" }'
            }
            {
                condition: {|before, _| $before == /some/path/to/directory }
                code: 'hide foo'
            }
        ]
    }
})
```

When defining a hook as a string, the `$before` and `$after` variables are set to the previous and current environment variable value, respectively, similarly to the previous examples:

```nu
$env.config = ($env.config | upsert hooks {
    env_change: {
        PWD: [{
            code: 'print $"changing directory from ($before) to ($after)"'
        }]
    }
})
```

Nushell parses a string hook each time the hook runs. If the string doesn't parse, Nushell prints the parse error, then a second error that reads "Failed to run pre_prompt list, recursive hook" (with the name of your hook in place of `pre_prompt`) and points at the string with the label "source code has errors". It skips that hook and, like any failing hook, the rest of its list. A string that parses but fails while running only prints its error, and the next hook in the list still runs.

## `command_not_found` hook

The `command_not_found` hook runs when Nushell can't find a command, in the REPL, in a script, or with `nu -c`. A closure gets the command name as its parameter, and a string hook gets it as `$cmd_name`. If the hook returns a string, Nushell shows the string as the help text of the usual error:

```nu
$env.config.hooks.command_not_found = {|cmd_name| $"Try installing ($cmd_name)" }
nosuchcmd
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[repl_entry #2:1:1]
# =>  1 │ nosuchcmd
# =>    · ────┬────
# =>    ·     ╰── Command `nosuchcmd` not found
# =>    ╰────
# =>   help: Try installing nosuchcmd
```

If the hook returns anything else, such as `null`, Nushell ignores the result and shows its usual help, which suggests commands with similar names. If the hook raises an error, that error replaces the "not found" error.

While the hook runs, Nushell sets the `ENTERED_COMMAND_NOT_FOUND` environment variable. If the hook itself calls a command that doesn't exist, Nushell sees the variable and fails with "Command pkgfile not found while running the `command_not_found` hook" (with that command's name) instead of starting the hook again.

## Examples

### Adding a Single Hook to Existing Config

An example for PWD env change hook:

```nu
$env.config = ($env.config | upsert hooks.env_change.PWD {|config|
    let val = ($config | get -o hooks.env_change.PWD)

    if $val == null {
        [
            {|before, after| print $"changing directory from ($before) to ($after)" }
        ]
    } else {
        $val | append {|before, after| print $"changing directory from ($before) to ($after)" }
    }
})
```

### Automatically Activating an Environment when Entering a Directory

This one looks for `test-env.nu` in a directory

```nu
$env.config = ($env.config | upsert hooks.env_change.PWD {
    [
        {
            condition: {|_, after|
                ($after == '/path/to/target/dir'
                    and ($after | path join test-env.nu | path exists))
            }
            code: "overlay use test-env.nu"
        }
        {
            condition: {|before, after|
                ('/path/to/target/dir' not-in $after
                    and '/path/to/target/dir' in ($before | default "")
                    and 'test-env' in (overlay list | where active | get name))
            }
            code: "overlay hide test-env --keep-env [ PWD ]"
        }
    ]
})
```

### Filtering or Diverting Command Output

You can use the `display_output` hook to redirect the output of commands.
You should define a block that works on all value types.
The output of external commands is not filtered through `display_output`.

This hook can display the output in a separate window,
perhaps as rich HTML text. Here is the basic idea of how to do that:

```nu
$env.config = ($env.config | upsert hooks {
    display_output: { to html --partial --no-color | save --force --raw /tmp/nu-output.html }
})
```

You can view the result by opening `file:///tmp/nu-output.html` in
a web browser.
Of course this isn't very convenient unless you use
a browser that automatically reloads when the file changes.
Instead of the [`save`](/commands/docs/save.md) command, you would normally customize this
to send the HTML output to a desired window.

### Changing how Output is Displayed

You can change to default behavior of how output is displayed by using the `display_output` hook.
Here is an example that changes the default display behavior to show a table 1 layer deep if the terminal is wide enough, or collapse otherwise:

```nu
$env.config = ($env.config | upsert hooks {
    display_output: {if (term size).columns >= 100 { table -ed 1 } else { table }}
})
```

The default hook is the string `'if (term size).columns >= 100 { table -e } else { table }'`, which expands nested data in full when the terminal is at least 100 columns wide. The hook also formats the final value of a script or a `nu -c` command, not just REPL output.

Setting `display_output` to `null` doesn't bring the default back. With no hook, Nushell draws output with a plain [`table`](/commands/docs/table.md), so nested data stays collapsed however wide the terminal is. To restore the default, assign the string above:

```nu
$env.config.hooks.display_output = 'if (term size).columns >= 100 { table -e } else { table }'
```

### `command_not_found` Hook in _Arch Linux_

The following hook uses the `pkgfile` command, to find which packages commands belong to in _Arch Linux_.

```nu
$env.config.hooks.command_not_found = {
    |cmd_name| (
        try {
            let pkgs = (pkgfile --binaries --verbose $cmd_name)
            if ($pkgs | is-empty) {
                return null
            }
            (
                $"(ansi $env.config.color_config.shape_external)($cmd_name)(ansi reset) " +
                $"may be found in the following packages:\n($pkgs)"
            )
        } catch {
            null
        }
    )
}
```

### `command_not_found` Hook in _NixOS_

NixOS comes with the command `command-not-found`. We only need to plug it in the nushell hook. Its output is captured with [`complete`](/commands/docs/complete.md), so that a non-zero exit code of `command-not-found` does not stop the hook, and the hook returns the message as a string to be shown with the error:

```nu
$env.config.hooks.command_not_found = {
  |command_name|
  let result = (command-not-found $command_name | complete)
  $result.stdout + $result.stderr | str trim
}
```

### `command_not_found` Hook in _Windows_

The following hook uses the `ftype` command, to find program paths in _Windows_ that might be relevant to the user for `alias`-ing.

```nu
$env.config.hooks.command_not_found = {
    |cmd_name| (
        try {
            let attrs = (
                ftype | find --ignore-case --no-highlight $cmd_name | to text | lines | reduce -f [] { |line, acc|
                    $line | parse "{type}={path}" | append $acc
                } | group-by path | transpose key value | each { |row|
                    { path: $row.key, types: ($row.value | get type | str join ", ") }
                }
            )
            let len = ($attrs | length)

            if $len == 0 {
                return null
            } else {
                return ($attrs | table --collapse --width 80 | collect)
            }
        }
    )
}
```
