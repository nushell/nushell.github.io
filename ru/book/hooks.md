# Hooks

Hooks allow you to run a code snippet at some predefined situations.
They are only available in the interactive mode ([REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)), they do not work if you run a Nushell with a script (`nu script.nu`) or commands (`nu -c "print foo"`) arguments.

Currently, we support these types of hooks:

- `pre_prompt` : Triggered before the prompt is drawn
- `pre_execution` : Triggered before the line input starts executing
- `env_change` : Triggered when an environment variable changes
- `display_output` : A block that the output is passed to (experimental).
- `command_not_found` : Triggered when a command is not found.

To make it clearer, we can break down Nushell's execution cycle.
The steps to evaluate one line in the REPL mode are as follows:

1. Check for `pre_prompt` hooks and run them
1. Check for `env_change` hooks and run them
1. Display prompt and wait for user input
1. After user typed something and pressed "Enter": Check for `pre_execution` hooks and run them
1. Parse and evaluate user input
1. If a command is not found: Run the `command_not_found` hook. If it returns a string, show it.
1. If `display_output` is defined, use it to print command output
1. Return to 1.

## Basic Hooks

To enable hooks, define them in your [config](configuration.md):

```nu
$env.config = {
    # ...other config...

    hooks: {
        pre_prompt: { print "pre prompt hook" }
        pre_execution: { print "pre exec hook" }
        env_change: {
            PWD: {|before, after| print $"changing directory from ($before) to ($after)" }
        }
    }
}
```

Try putting the above to your config, running Nushell and moving around your filesystem.
When you change a directory, the `PWD` environment variable changes and the change triggers the hook with the previous and the current values stored in `before` and `after` variables, respectively.

Instead of defining just a single hook per trigger, it is possible to define a **list of hooks** which will run in sequence:

```nu
$env.config = {
    ...other config...

    hooks: {
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
}
```

Also, it might be more practical to update the existing config with new hooks, instead of defining the whole config from scratch:

```nu
$env.config = ($env.config | upsert hooks {
    pre_prompt: ...
    pre_execution: ...
    env_change: {
        PWD: ...
    }
})
```

## Changing Environment

One feature of the hooks is that they preserve the environment.
Environment variables defined inside the hook **block** will be preserved in a similar way as [`def --env`](environment.md#defining-environment-from-custom-commands).
You can test it with the following example:

```nu
> $env.config = ($env.config | upsert hooks {
    pre_prompt: { $env.SPAM = "eggs" }
})

> $env.SPAM
eggs
```

The hook blocks otherwise follow the general scoping rules, i.e., commands, aliases, etc. defined within the block will be thrown away once the block ends.

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

To deal with the above problem, we introduce another way to define a hook -- **a record**:

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

The `pre_prompt` and `pre_execution` hook types also support the conditional hooks but they don't accept the `before` and `after` parameters.

## Hooks as Strings

So far a hook was defined as a block that preserves only the environment, but nothing else.
To be able to define commands or aliases, it is possible to define the `code` field as **a string**.
You can think of it as if you typed the string into the REPL and hit Enter.
So, the hook from the previous section can be also written as

```nu
> $env.config = ($env.config | upsert hooks {
    pre_prompt: '$env.SPAM = "eggs"'
})

> $env.SPAM
eggs
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
        PWD: {
            code: 'print $"changing directory from ($before) to ($after)"'
        }
    }
}
```

## Examples

### Adding a single hook to existing config

An example for PWD env change hook:

```nu
$env.config = ($env.config | upsert hooks.env_change.PWD {|config|
    let val = ($config | get -i hooks.env_change.PWD)

    if $val == null {
        $val | append {|before, after| print $"changing directory from ($before) to ($after)" }
    } else {
        [
            {|before, after| print $"changing directory from ($before) to ($after)" }
        ]
    }
})
```

### Automatically activating an environment when entering a directory

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
                    and '/path/to/target/dir' in $before
                    and 'test-env' in (overlay list))
            }
            code: "overlay hide test-env --keep-env [ PWD ]"
        }
    ]
})
```

### Filtering or diverting command output

You can use the `display_output` hook to redirect the output of commands.
You should define a block that works on all value types.
The output of external commands is not filtered through `display_output`.

This hook can display the output in a separate window,
perhaps as rich HTML text. Here is the basic idea of how to do that:

```nu
$env.config = ($env.config | upsert hooks {
    display_output: { to html --partial --no-color | save --raw /tmp/nu-output.html }
})
```

You can view the result by opening `file:///tmp/nu-output.html` in
a web browser.
Of course this isn't very convenient unless you use
a browser that automatically reloads when the file changes.
Instead of the [`save`](/commands/docs/save.md) command, you would normally customize this
to send the HTML output to a desired window.

### Changing how output is displayed

You can change to default behavior of how output is displayed by using the `display_output` hook.
Here is an example that changes the default display behavior to show a table 1 layer deep if the terminal is wide enough, or collapse otherwise:

```nu
$env.config = ($env.config | upsert hooks {
    display_output: {if (term size).columns >= 100 { table -ed 1 } else { table }}
})
```

### `command_not_found` hook in _Arch Linux_

The following hook uses the `pkgfile` command, to find which packages commands belong to in _Arch Linux_.

```nu
$env.config = {
    ...other config...

    hooks: {
        ...other hooks...

        command_not_found: {
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
                }
            )
        }
    }
}
```
