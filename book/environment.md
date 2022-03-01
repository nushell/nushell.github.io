# Environment

A common task in a shell is to control the environment that external applications will use. This is often done automatically, as the environment is packaged up and given to the external application as it launches. Sometimes, though, we want to have more precise control over what environment variables an application sees.

You can see the current environment variables using the `env` command:
```
   #           name                 type                value                 raw
──────────────────────────────────────────────────────────────────────────────────────────
  16   DISPLAY              string               :0                   :0
  17   EDITOR               string               nvim                 nvim
  28   LANG                 string               en_US.UTF-8          en_US.UTF-8
  35   PATH                 list<unknown>        [list 16 items]      /path1:/path2:/...
  36   PROMPT_COMMAND       block                <Block 197>          <Block 197>
```

In Nushell, environment variable can be any value and have of any type (see the `type` column).
The actual value of the env. variable used within Nushell is under the `value` column.
You can query the value directly using the `$env` variable, for example, `$env.PATH | length`.
The last `raw` column shows the actual value that will be sent to external applications (check [ENV_CONVERSIONS](#environment-variable-conversions) for details).

## Single-use environment variables

The environment is created from the settings in the Nu configuration and from the environment that Nu is run inside of.  You can updated the environment permanently using the techniques listed in [configuration](configuration.md) chapter.

A common shorthand, inspired by Bash and others, is also available. You can write the above example as:

```
> FOO=BAR echo $env.FOO
BAR
```

You can also temporarily update an environment variable when you run a command or pipeline of commands.

```
> with-env [FOO BAR] { echo $env.FOO }
BAR
```

The `with-env` command will temporarily set the environment variable to the value given (here: the variable "FOO" is given the value "BAR").  Once this is done, the block will run with this new environment variable set.


## Scoped environment variables

You can also set environment variables that will be available in the current scope (the block you're in and any block inside of it).

To do so, you can use the `let-env` command.

```
> let-env FOO = 'BAR'
```

let-env is similar to the **export** command in bash.

If you have more than one environment variable you'd like to set, you can create a table of name/value pairs and load multiple variables at the same time.

```
> load-env { "BOB": "FOO", "JAY": "BAR" }
```

## Permanent environment variables

You can also set environment variables that are set at startup and are available for the duration of Nushell running. These can be set in the `env` section of the [config](configuration.md).

## Defining environment from custom commands

Due to the scoping rules, any environment variables defined inside a custom command will only exist inside the command's scope.
However, a command defined as `def-env` instead of `def` (it applies also to `export def`, see [Modules](modules.md)) will preserve the environment on the caller's side:
```
> def-env foo [] {
    let-env FOO = 'BAR'
}

> foo

> $env.FOO
BAR
```

## (WIP) Environment variable conversions

You can use the `ENV_CONVERSIONS` environment variable to convert between a string and a value.
There are some examples in `default_config.nu`.

## Removing environment variables

You can remove an environment variable only if it was set in the current scope:

```
> let-env FOO = 'BAR'
...
> hide FOO
```

If you want to remove an environment variable stemming from a parent scope, you can `hide` it:

```
> let-env FOO = 'BAR'
> do {
    hide FOO
    # $nu.env.FOO does not exist
  }
> $env.FOO
BAR
```
