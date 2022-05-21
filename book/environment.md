# Environment

A common task in a shell is to control the environment that external applications will use. This is often done automatically, as the environment is packaged up and given to the external application as it launches. Sometimes, though, we want to have more precise control over what environment variables an application sees.

You can see the current environment variables using the [`env`](commands/env.html) command:

```
   #           name                 type                value                 raw
──────────────────────────────────────────────────────────────────────────────────────────
  16   DISPLAY              string               :0                   :0
  17   EDITOR               string               nvim                 nvim
  28   LANG                 string               en_US.UTF-8          en_US.UTF-8
  35   PATH                 list<unknown>        [list 16 items]      /path1:/path2:/...
  36   PROMPT_COMMAND       block                <Block 197>
```

In Nushell, environment variables can be any value and have any type (see the `type` column).
The actual value of the env. variable used within Nushell is under the `value` column.
You can query the value directly using the `$env` variable, for example, `$env.PATH | length`.
The last `raw` column shows the actual value that will be sent to external applications (see [Environment variable conversions](#environment-variable-conversions) for details).

The environment is initially created from the Nu [configuration file](configuration.md) and from the environment that Nu is run inside of.

## Setting environment variables

There are several ways to set an environment variable:

### [`let-env`](commands/let-env.html)

Using the `let-env` command is the most straightforward method

```
> let-env FOO = 'BAR'
```

'let-env' is similar to the **export** command in bash.

So if you want to extend the `PATH` variable for example, you could do that as follows.

```
let-env PATH = ($env.PATH | prepend '/path/you/want/to/add')
```

Here we've prepended our folder to the existing folders in the PATH, so it will have the highest priority.
If you want to give it the lowest priority instead, you can use the `append` command.

### [`load-env`](commands/load-env.html)

If you have more than one environment variable you'd like to set, you can use `load-env` to create a table of name/value pairs and load multiple variables at the same time:

```
> load-env { "BOB": "FOO", "JAY": "BAR" }
```

### One-shot environment variables

These are defined to be active only temporarily for a duration of executing a code block.
See [Single-use environment variables](environment.md#single-use-environment-variables) for details.

### Calling a command defined with [`def-env`](commands/def-env.md)

See [Defining environment from custom commands](environment.md#defining-environment-from-custom-commands) for details.

### Using module's exports

See [Modules](modules.md) for details.

## Scoping

When you set an environment variable, it will be available only in the current scope (the block you're in and any block inside of it).

Here is a small example to demonstrate the environment scoping:

```
> let-env FOO = "BAR"
> do {
    let-env FOO = "BAZ"
    $env.FOO == "BAZ"
}
true
> $env.FOO == "BAR"
true
```

## Changing directory

Common task in a shell is to change directory with the [`cd`](commands/cd.html) command.
In Nushell, calling `cd` is equivalent to setting the `PWD` environment variable.
Therefore, it follows the same rules as other environment variables (for example, scoping).

## Single-use environment variables

A common shorthand to set an environment variable once is available, inspired by Bash and others:

```
> FOO=BAR echo $env.FOO
BAR
```

You can also use [`with-env`](commands/with-env.html) to do the same thing more explicitly:

```
> with-env { FOO: BAR } { echo $env.FOO }
BAR
```

The [`with-env`](commands/with-env.html) command will temporarily set the environment variable to the value given (here: the variable "FOO" is given the value "BAR"). Once this is done, the [block](types_of_data.html#blocks) will run with this new environment variable set.

## Permanent environment variables

You can also set environment variables at startup so they are available for the duration of Nushell running.
To do this, set an environment variable inside [the Nu configuration file](configuration.md).
For example:

```
# In config.nu
let-env FOO = 'BAR'
```

## Defining environment from custom commands

Due to the scoping rules, any environment variables defined inside a custom command will only exist inside the command's scope.
However, a command defined as [`def-env`](commands/def-env.html) instead of [`def`](commands/def.html) (it applies also to `export def`, see [Modules](modules.md)) will preserve the environment on the caller's side:

```
> def-env foo [] {
    let-env FOO = 'BAR'
}

> foo

> $env.FOO
BAR
```

## Environment variable conversions

You can set the `ENV_CONVERSIONS` environment variable to convert other environment variables between a string and a value.
For example, the [default enfironment config](https://github.com/nushell/nushell/blob/main/docs/sample_config/default_env.nu) includes conversion of PATH (and Path used on Windows) environment variables from a string to a list.
After both `env.nu` and `config.nu` are loaded, any existing environment variable specified inside `ENV_CONVERSIONS` will be translated according to its `from_string` field into a value of any type.
External tools require environment variables to be strings, therefore, any non-string environment variable needs to be converted first.
The conversion of value -> string is set by the `to_string` field of `ENV_CONVERSIONS` and is done every time an external command is run.

Let's illustrate the conversions with an example.
Put the following in your config.nu:

```
let-env ENV_CONVERSIONS = {
    # ... you might have Path and PATH already there, add:
    FOO : {
        from_string: { |s| $s | split row '-' }
        to_string: { |v| $v | str collect '-' }
    }
}
```

Now, within a Nushell instance:

```
> with-env { FOO : 'a-b-c' } { nu }  # runs Nushell with FOO env. var. set to 'a-b-c'

> $env.FOO
  0   a
  1   b
  2   c
```

You can see the `$env.FOO` is now a list in a new Nushell instance with the updated config.
You can also test the conversion manually by

```
> do $env.ENV_CONVERSIONS.FOO.from_string 'a-b-c'
```

Now, to test the conversion list -> string, run:

```
> nu -c '$env.FOO'
a-b-c
```

Because `nu` is an external program, Nushell translated the `[ a b c ]` list according to `ENV_CONVERSIONS.FOO.to_string` and passed it to the `nu` process.
Running commands with `nu -c` does not load the config file, therefore the env conversion for `FOO` is missing and it is displayed as a plain string -- this way we can verify the translation was successful.
You can also run this step manually by `do $env.ENV_CONVERSIONS.FOO.to_string [a b c]`

If we look back at the [`env`](commands/env.html) command, the `raw` column shows the value translated by `ENV_CONVERSIONS.<name>.to_string` and the `value` column shows the value used in Nushell (the result of `ENV_CONVERSIONS.<name>.from_string` in the case of `FOO`).
If the value is not a string and does not have `to_string` conversion, it is not passed to an external (see the `raw` column of `PROMPT_COMMAND`).
One exception is `PATH` (`Path` on Windows): By default, it converts the string to a list on startup and from a list to a string when running externals if no manual conversions are specified.

_(Important! The environment conversion string -> value happens **after** the env.nu and config.nu are evaluated. All environment variables in env.nu and config.nu are still strings unless you set them manually to some other values.)_

## Removing environment variables

You can remove an environment variable only if it was set in the current scope via [`hide`](commands/hide.html):

```
> let-env FOO = 'BAR'
...
> hide FOO
```

The hiding is also scoped which both allows you to remove an environment variable temporarily and prevents you from modifying a parent environment from within a child scope:

```
> let-env FOO = 'BAR'
> do {
    hide FOO
    # $env.FOO does not exist
  }
> $env.FOO
BAR
```

You can check [Modules](modules.md) for more details about hiding.
