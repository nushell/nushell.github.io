# Environment

A common task in a shell is to control the environment that external applications will use. This is often done automatically, as the environment is packaged up and given to the external application as it launches. Sometimes, though, we want to have more precise control over what environment variables an application sees.

You can see the current environment variables in the $env variable:

```nu
$env | table -e
# => ╭──────────────────────┬───────────────────────────────────────────────────────────────────────────╮
# => │ ENV_CONVERSIONS      │ {record 0 fields}                                                         │
# => │ HOME                 │ /Users/jelle                                                              │
# => │ LSCOLORS             │ GxFxCxDxBxegedabagaced                                                    │
# => │                      │ ╭───┬──────────────────────────────────────────────────────────────╮      │
# => │ NU_LIB_DIRS          │ │ 0 │ /Users/jelle/Library/Application Support/nushell/scripts     │      │
# => │                      │ │ 1 │ /Users/jelle/Library/Application Support/nushell/completions │      │
# => │                      │ ╰───┴──────────────────────────────────────────────────────────────╯      │
# => │ NU_PLUGIN_DIRS       │ [list 0 items]                                                            │
# => │ NU_VERSION           │ 0.116.0                                                                   │
# => │                      │ ╭───┬──────────╮                                                          │
# => │ PATH                 │ │ 0 │ /usr/bin │                                                          │
# => │                      │ │ 1 │ /bin     │                                                          │
# => │                      │ ╰───┴──────────╯                                                          │
# => │ ...                  │ ...                                                                       │
# => ╰──────────────────────┴───────────────────────────────────────────────────────────────────────────╯
```

In Nushell, environment variables can be any value and have any type. You can see the type of an env variable with the describe command, for example: `$env.PROMPT_COMMAND | describe`.

To send environment variables to external applications, the values will need to be converted to strings. See [Environment variable conversions](#environment-variable-conversions) on how this works.

The environment is initially created from the Nu [configuration files](configuration.md) and from the environment that Nu is run inside of.

## Setting Environment Variables

There are several ways to set an environment variable:

### $env.VAR assignment

Using the `$env.VAR = "val"` is the most straightforward method

```nu
$env.FOO = 'BAR'
```

So, if you want to extend the `PATH` variable, for example, you could do that as follows.

```nu
$env.PATH = ($env.PATH | prepend '/path/you/want/to/add')
# or, with a Windows path:
# $env.PATH = ($env.PATH | prepend 'C:\path\you\want\to\add')
```

Here we've prepended our folder to the existing folders in the path, so it will have the highest priority.
If you want to give it the lowest priority instead, you can use the [`append`](/commands/docs/append.md) command.

### [`load-env`](/commands/docs/load-env.md)

If you have more than one environment variable you'd like to set, you can use [`load-env`](/commands/docs/load-env.md) to create a table of name/value pairs and load multiple variables at the same time:

```nu
load-env { "BOB": "FOO", "JAY": "BAR" }
```

### One-shot Environment Variables

These are defined to be active only temporarily for a duration of executing a code block.
See [Single-use environment variables](environment.md#single-use-environment-variables) for details.

### Calling a Command Defined with [`def --env`](/commands/docs/def.md)

See [Defining environment from custom commands](custom_commands.md#changing-the-environment-in-a-custom-command) for details.

### Using Module's Exports

See [Modules](modules.md) for details.

## Reading Environment Variables

Individual environment variables are fields of a record that is stored in the `$env` variable and can be read with `$env.VARIABLE`:

```nu
$env.FOO
# => BAR
```

Sometimes, you may want to access an environmental variable which might be unset. Consider using the [optional operator](navigating_structured_data.md#the-optional-operator) to avoid an error:

```nu
$env.NOT_SET | describe
# => Error: nu::shell::column_not_found
# =>
# =>   × Cannot find column 'NOT_SET'
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ $env.NOT_SET | describe
# =>    · ──────┬─────┬
# =>    ·       │     ╰── value originates here
# =>    ·       ╰── column 'NOT_SET' is missing in one or more values
# =>    ╰────
# =>   help: If some rows have this column, try using 'NOT_SET?' for optional access, or pre-fill using the `default` command

$env.NOT_SET? | describe
# => nothing

$env.NOT_SET? | default "BAR"
# => BAR
```

Alternatively, you can check for the presence of an environmental variable with `in`:

```nu
$env.FOO
# => BAR

if "FOO" in $env {
    echo $env.FOO
}
# => BAR
```

### Case sensitivity

Nushell's `$env` is case-insensitive, regardless of the OS. Although `$env` behaves mostly like a record, it is special in that it ignores the case when reading or updating. This means, for example, you can use any of `$env.PATH`, `$env.Path`, or `$env.path`, and they all work the same on any OS:

```nu
$env.FOO = 'BAR'
$env.foo
# => BAR
```

This only applies when you access `$env` directly with a cell path, like `$env.foo`. When `$env` is used as a value, such as when it is piped into a command or used with the `in` operator, it is a regular record with case-sensitive keys. So if you want to read `$env` in a case-sensitive manner, use `$env | get FOO` (`$env | get foo` is an error) or `"FOO" in $env`.

## Scoping

When you set an environment variable inside a closure or a custom command (unless the command is defined with `def --env`), it will be available only in that scope (the closure or command and any block inside of it).

Here is a small example to demonstrate the environment scoping:

```nu
$env.FOO = "BAR"
do {
    $env.FOO = "BAZ"
    $env.FOO == "BAZ"
}
# => true
$env.FOO == "BAR"
# => true
```

The blocks of control flow keywords such as [`if`](/commands/docs/if.md), [`for`](/commands/docs/for.md), [`while`](/commands/docs/while.md), [`loop`](/commands/docs/loop.md), and [`match`](/commands/docs/match.md) are not closures, so environment changes made inside them remain after the block ends:

```nu
if true { $env.FOO = "BAZ" }
$env.FOO
# => BAZ
```

See also: [Changing the Environment in a Custom Command](./custom_commands.html#changing-the-environment-in-a-custom-command).

## Changing the Directory

A common task in a shell is to change the directory using the [`cd`](/commands/docs/cd.md) command. In Nushell, calling [`cd`](/commands/docs/cd.md) is equivalent to setting the `PWD` environment variable. Therefore, it follows the same rules as other environment variables (for example, scoping).

## Single-use Environment Variables

A common shorthand to set an environment variable once is available, inspired by Bash and others:

```nu
FOO=BAR $env.FOO
# => BAR
```

You can also use [`with-env`](/commands/docs/with-env.md) to do the same thing more explicitly:

```nu
with-env { FOO: BAR } { $env.FOO }
# => BAR
```

The [`with-env`](/commands/docs/with-env.md) command will temporarily set the environment variable to the value given (here: the variable "FOO" is given the value "BAR"). Once this is done, the [block](types_of_data.md#blocks) will run with this new environment variable set.

## Permanent Environment Variables

You can also set environment variables at startup so they are available for the duration of Nushell running. To do this, set an environment variable inside [the Nu configuration file](configuration.md).

For example:

```nu
# In config.nu
$env.FOO = 'BAR'
```

## Environment Variable Conversions

You can set the `ENV_CONVERSIONS` environment variable to convert other environment variables between a string and a value.
Nushell itself converts the `PATH` (and `Path` used on Windows) environment variable from a string to a list when it starts, before any configuration file is loaded, so it does not need an entry in `ENV_CONVERSIONS` (which is an empty record by default).
When you assign `$env.ENV_CONVERSIONS`, any existing string environment variable specified inside it is immediately translated according to its `from_string` field into a value of any type.
External tools require environment variables to be strings, therefore, any non-string environment variable needs to be converted first.
The conversion of value -> string is set by the `to_string` field of `ENV_CONVERSIONS` and is done every time an external command is run.

Let's illustrate the conversions with an example.
Put the following in your config.nu:

```nu
$env.ENV_CONVERSIONS = {
    FOO : {
        from_string: { |s| $s | split row '-' }
        to_string: { |v| $v | str join '-' }
    }
}
```

Now, when Nushell starts with `FOO` set to `'a-b-c'` in its environment (for example, when you run `with-env { FOO: 'a-b-c' } { nu }`), `config.nu` assigns `$env.ENV_CONVERSIONS`, which converts `FOO` into a list in the new instance.

Because the conversion happens whenever `$env.ENV_CONVERSIONS` is assigned, you can also try it in your current session:

```nu
$env.FOO = 'a-b-c'
$env.ENV_CONVERSIONS = $env.ENV_CONVERSIONS  # re-apply the conversions to the existing variables
$env.FOO
# => ╭───┬───╮
# => │ 0 │ a │
# => │ 1 │ b │
# => │ 2 │ c │
# => ╰───┴───╯
```

You can see the `$env.FOO` is now a list.
You can also test the conversion manually by

```nu
do $env.ENV_CONVERSIONS.FOO.from_string 'a-b-c'
# => ╭───┬───╮
# => │ 0 │ a │
# => │ 1 │ b │
# => │ 2 │ c │
# => ╰───┴───╯
```

Now, to test the conversion list -> string, run:

```nu
nu -c '$env.FOO'
# => a-b-c
```

Because `nu` is an external program, Nushell translated the `[ a b c ]` list according to `ENV_CONVERSIONS.FOO.to_string` and passed it to the `nu` process.
Running commands with `nu -c` does not load the config file, therefore the env conversion for `FOO` is missing and it is displayed as a plain string -- this way we can verify the translation was successful.
You can also run this step manually by `do $env.ENV_CONVERSIONS.FOO.to_string [a b c]`

_(Important! The string -> value conversion happens only for variables that already exist when `$env.ENV_CONVERSIONS` is assigned, such as those inherited from the parent process. A variable that you set as a string afterwards stays a string. To convert it, set it before assigning `ENV_CONVERSIONS`, or assign `$env.ENV_CONVERSIONS` to itself again.)_

## Removing Environment Variables

You can remove an environment variable with [`hide-env`](/commands/docs/hide-env.md):

```nu
$env.FOO = 'BAR'
hide-env FOO
```

The hiding is also scoped which both allows you to remove an environment variable temporarily and prevents you from modifying a parent environment from within a child scope:

```nu
$env.FOO = 'BAR'
do {
  hide-env FOO
  # $env.FOO does not exist
}
$env.FOO
# => BAR
```
