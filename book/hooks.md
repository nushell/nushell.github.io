# Hooks

Hooks allow you to run a code snippet at some predefined situations.
Hooks are only available in the interactive mode, they do not work if you run a Nushell on a script (`nu script.nu`) or commands (`nu -c "echo foo"`).

Currently, we support these hooks:

- `pre_prompt` : Triggered before the prompt is drawn
- `pre_execution` : Triggered before a command starts executing
- `env_change` : Triggered when an environment variable changes

More specifically, one Nushell REPL cycle looks like this:

1. Check for `pre_prompt` hooks and run them
1. Check for `env_change` hooks and run them
1. Display prompt and wait for user input
1. After user typed something and pressed "Enter": Check for `pre_execution` hooks and run them
1. Parse and evaluate user input
1. Return to 1.

## Basic Hooks

To enable hooks, define them in your [config](configuration.md):

```
let-env config = {
    ...other config...

    hooks: {
        pre_prompt: { print "pre prompt hook" }
        pre_execution: { print "pre exec hook" }
        env_change: {
            PWD: {|before, after| print $"changing directory from ($before) to ($after)" }
        }
    }
}
```

Try putting the above to your config, running Nushell and moving around your filesytem.
When you change a directory, the `PWD` environment variable changes and triggers the hook with the previous and the current values stored in `before` and `after` variables, respectively.

Instead of defining a just a single hook per trigger, it is possible to define a list of hooks which will run in sequence:

```
let-env config = {
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

Also, it might be more practical to update the existing config with new hooks like this, instead of defining the whole config:

```
let-env config = ($env.config | upsert hooks {
    pre_prompt: ...
    pre_execution: ...
    env_change: {
        PWD: ...
    }
})
```

## Changing Environment

One feature of the hooks is that they preserve the environment.
Environment variables defined inside the hook block will be preserved in a similar way as [`def-env`](environment.md#defining-environment-from-custom-commands).
You can test it with the following example:

```
> let-env config = ($env.config | upsert hooks {
    pre_prompt: { let-env SPAM = "eggs" }
})

> $env.SPAM
eggs
```

The hook blocks otherwise follow the general scoping rules, i.e., commands, aliases, etc. defined within the block will be thrown away once the block ends.

## Conditional Hooks

One thing you might be tempted to do is to activate an environment whenever you enter a directory:

```
let-env config = ($env.config | upsert hooks {
    env_change: {|before, after|
        if $after == /some/path/to/directory {
            load-env { SPAM: eggs }
        }
    }
})
```

This won't work because the environment will be active only within the `if` block.
In this case, you could easily rewrite it as `load-env (if $after == ... { ... } else { {} })` but this pattern is fairly common and later we'll see that not all cases can be rewritten like this.

To deal with the above problem, we introduce another way to define a hook -- a record:

```
let-env config = ($env.config | upsert hooks {
    env_change:
        condition: {|before, after| $after == /some/path/to/directory }
        code: {|before, after| load-env { SPAM: eggs } }
    }
})
```

When the hook triggers, it evaluates the `condition` block.
If it returns `true`, the `code` block will be evaluated.
If it returns `false`, nothing will happen.
If it returns something else, it will throw an error.

The `pre_prompt` and `pre_execution` hook types also support the conditional hooks but they don't accept the `before` and `after` parameters.

## Hooks as Strings

So far a hook was defined as a block which preserves only the environment, but nothing else.
Another way to define a hook is as a string.
You can think of it as if you typed the string into the REPL and hit Enter.
So, the hook from the previous section can be also written as

```
> let-env config = ($env.config | upsert hooks {
    pre_prompt: 'let-env SPAM = "eggs"'
})

> $env.SPAM
eggs
```

## Examples

### Adding a single hook to existing config

An example for PWD env change hook:

```
let-env config = ($env.config | upsert hooks.env_change.PWD {|config|
    let val = ($config | get -i hooks.env_change.PWD)

    if $val == $nothing {
        $val | append {|before, after| print $"changing directory from ($before) to ($after)" }
    } else {
        [
            {|before, after| print $"changing directory from ($before) to ($after)" }
        ]
    }
})
```
