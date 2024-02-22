---
title: Environment
---

A common task in a shell is to control the environment that external applications will use. This is often done automatically, as the environment is packaged up and given to the external application as it launches. Sometimes, though, we want to have more precise control over what environment variables an application sees.

You can see the current environment variables in the $env variable:

```nushell
~> $env | table -e
╭────────────────────────────┬─────────────────────────────────────────────────╮
│ CMD_DURATION_MS            │ 0823                                            │
│                            │ ╭───┬──────────────────╮                        │
│ DIRS_LIST                  │ │ 0 │ /Users/name      │                        │
│                            │ ╰───┴──────────────────╯                        │
│ DIRS_POSITION              │ 0                                               │
│                            │ ╭──────┬──────────────────────────────────────╮ │
│ ENV_CONVERSIONS            │ │      │ ╭───────────────┬──────────────────╮ │ │
│                            │ │ PATH │ │ from_string   │ <Closure 1212>   │ │ │
│                            │ │      │ │ to_string     │ <Closure 1214>   │ │ │
│                            │ │      │ ╰───────────────┴──────────────────╯ │ │
│                            │ │      │ ╭───────────────┬──────────────────╮ │ │
│                            │ │ Path │ │ from_string   │ <Closure 1216>   │ │ │
│                            │ │      │ │ to_string     │ <Closure 1218>   │ │ │
│                            │ │      │ ╰───────────────┴──────────────────╯ │ │
│                            │ ╰──────┴──────────────────────────────────────╯ │
│ HOME                       │ /Users/name                                     │
| ...                        | ...                                             |
╰────────────────────────────┴─────────────────────────────────────────────────╯
```

In Nushell, environment variables can be any value and have any type. You can see the type of an env variable with the describe command, for example: `$env.PROMPT_COMMAND | describe`.

To send environment variables to external applications, the values will need to be converted to strings. See [Environment variable conversions](#environment-variable-conversions) on how this works.

The environment is initially created from the Nu [configuration files](configuration) and from the environment that Nu is run inside of.

## Setting environment variables

There are several ways to set an environment variable:

### $env.VAR assignment

Using the `$env.VAR = "val"` is the most straightforward method

```nushell
> $env.FOO = 'BAR'
```

So, if you want to extend the Windows `Path` variable, for example, you could do that as follows.

```nushell
$env.Path = ($env.Path | prepend 'C:\path\you\want\to\add')
```

Here we've prepended our folder to the existing folders in the Path, so it will have the highest priority.
If you want to give it the lowest priority instead, you can use the [`append`](/commands/docs/append) command.

### [`load-env`](/commands/docs/load-env)

If you have more than one environment variable you'd like to set, you can use [`load-env`](/commands/docs/load-env) to create a table of name/value pairs and load multiple variables at the same time:

```nushell
> load-env { "BOB": "FOO", "JAY": "BAR" }
```

### One-shot environment variables

These are defined to be active only temporarily for a duration of executing a code block.
See [Single-use environment variables](environment#single-use-environment-variables) for details.

### Calling a command defined with [`def --env`](/commands/docs/def)

See [Defining environment from custom commands](environment#defining-environment-from-custom-commands) for details.

### Using module's exports

See [Modules](modules) for details.

## Reading environment variables

Individual environment variables are fields of a record that is stored in the `$env` variable and can be read with `$env.VARIABLE`:

```nushell
> $env.FOO
BAR
```

Sometimes, you may want to access an environmental variable which might be unset. Consider using the [question mark operator](variables_and_subexpressions#variable-paths) to avoid an error:

```nushell
> $env.FOO | describe
Error: nu::shell::column_not_found

  × Cannot find column
   ╭─[entry #1:1:1]
 1 │ $env.FOO
   · ──┬─ ─┬─
   ·   │   ╰── cannot find column 'FOO'
   ·   ╰── value originates here
   ╰────

> $env.FOO? | describe
nothing

> $env.FOO? | default "BAR"
BAR
```

Alternatively, you can check for the presence of an environmental variable with `in`:

```nushell
> $env.FOO
BAR

> if "FOO" in $env {
>     echo $env.FOO
> }
BAR
```

## Scoping

When you set an environment variable, it will be available only in the current scope (the block you're in and any block inside of it).

Here is a small example to demonstrate the environment scoping:

```nushell
> $env.FOO = "BAR"
> do {
    $env.FOO = "BAZ"
    $env.FOO == "BAZ"
}
true
> $env.FOO == "BAR"
true
```

## Changing directory

Common task in a shell is to change directory with the [`cd`](/commands/docs/cd) command.
In Nushell, calling [`cd`](/commands/docs/cd) is equivalent to setting the `PWD` environment variable.
Therefore, it follows the same rules as other environment variables (for example, scoping).

## Single-use environment variables

A common shorthand to set an environment variable once is available, inspired by Bash and others:

```nushell
> FOO=BAR $env.FOO
BAR
```

You can also use [`with-env`](/commands/docs/with-env) to do the same thing more explicitly:

```nushell
> with-env { FOO: BAR } { $env.FOO }
BAR
```

The [`with-env`](/commands/docs/with-env) command will temporarily set the environment variable to the value given (here: the variable "FOO" is given the value "BAR"). Once this is done, the [block](types_of_data#blocks) will run with this new environment variable set.

## Permanent environment variables

You can also set environment variables at startup so they are available for the duration of Nushell running.
To do this, set an environment variable inside [the Nu configuration file](configuration).
For example:

```nushell title="config.nu"
$env.FOO = 'BAR'
```

## Defining environment from custom commands

Due to the scoping rules, any environment variables defined inside a custom command will only exist inside the command's scope.
However, a command defined as [`def --env`](/commands/docs/def) instead of [`def`](/commands/docs/def) (it applies also to [`export def`](/commands/docs/export_def), see [Modules](modules)) will preserve the environment on the caller's side:

```nushell
> def --env foo [] {
    $env.FOO = 'BAR'
}

> foo

> $env.FOO
BAR
```

## Environment variable conversions

You can set the `ENV_CONVERSIONS` environment variable to convert other environment variables between a string and a value.
For example, the [default environment config](https://github.com/nushell/nushell/blob/main/crates/nu-utils/src/sample_config/default_env.nu) includes conversion of PATH (and Path used on Windows) environment variables from a string to a list.
After both `env.nu` and `config.nu` are loaded, any existing environment variable specified inside `ENV_CONVERSIONS` will be translated according to its `from_string` field into a value of any type.
External tools require environment variables to be strings, therefore, any non-string environment variable needs to be converted first.
The conversion of value -> string is set by the `to_string` field of `ENV_CONVERSIONS` and is done every time an external command is run.

Let's illustrate the conversions with an example.
Put the following in your config.nu:

```nushell
$env.ENV_CONVERSIONS = {
    # ... you might have Path and PATH already there, add:
    FOO : {
        from_string: { |s| $s | split row '-' }
        to_string: { |v| $v | str join '-' }
    }
}
```

Now, within a Nushell instance:

```nushell
> with-env { FOO : 'a-b-c' } { nu }  # runs Nushell with FOO env. var. set to 'a-b-c'

> $env.FOO
  0   a
  1   b
  2   c
```

You can see the `$env.FOO` is now a list in a new Nushell instance with the updated config.
You can also test the conversion manually by

```nushell
> do $env.ENV_CONVERSIONS.FOO.from_string 'a-b-c'
```

Now, to test the conversion list -> string, run:

```nushell
> nu -c '$env.FOO'
a-b-c
```

Because `nu` is an external program, Nushell translated the `[ a b c ]` list according to `ENV_CONVERSIONS.FOO.to_string` and passed it to the `nu` process.
Running commands with `nu -c` does not load the config file, therefore the env conversion for `FOO` is missing and it is displayed as a plain string -- this way we can verify the translation was successful.
You can also run this step manually by `do $env.ENV_CONVERSIONS.FOO.to_string [a b c]`

_(Important! The environment conversion string -> value happens **after** the env.nu and config.nu are evaluated. All environment variables in env.nu and config.nu are still strings unless you set them manually to some other values.)_

## Removing environment variables

You can remove an environment variable only if it was set in the current scope via [`hide-env`](/commands/docs/hide_env):

```nushell
> $env.FOO = 'BAR'
...
> hide-env FOO
```

The hiding is also scoped which both allows you to remove an environment variable temporarily and prevents you from modifying a parent environment from within a child scope:

```nushell
> $env.FOO = 'BAR'
> do {
    hide-env FOO
    # $env.FOO does not exist
  }
> $env.FOO
BAR
```
