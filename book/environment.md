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

In Nushell, environment variables can be any value and have any type (see the `type` column).
The actual value of the env. variable used within Nushell is under the `value` column.
You can query the value directly using the `$env` variable, for example, `$env.PATH | length`.
The last `raw` column shows the actual value that will be sent to external applications (see [Environment variable conversions](#environment-variable-conversions) for details).

## Single-use environment variables

The environment is created from the settings in the Nu configuration and from the environment that Nu is run inside of.  You can update the environment permanently using the techniques listed in the [configuration](configuration.md) chapter.

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

## Environment variable conversions

You can set the `ENV_CONVERSIONS` environment variable to convert other environment variables between a string and a value.
For example, the [default config](https://github.com/nushell/nushell/blob/main/docs/sample_config/default_config.nu) includes conversion of PATH (and Path used on Windows) environment variables from a sting to a list.
After the config loaded, any existing environment variable specified inside `ENV_CONVERSIONS` will be translated according to its `from_string` field into a value of any type.
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
Because `nu` is an external program, Nushell translated the `[ a b c ]` according to `ENV_CONVERSIONS.FOO.to_string` and passed it to the `nu` process.
Running commands with `nu -c` does not load the config file, therefore the env conversion for `FOO` is missing and it is displayed as a plain string -- this way we can verify the translation was succesful.
You can also run this step manually by `do $env.ENV_CONVERSIONS.FOO.to_string [a b c]`

If we look back at the `env` command, the `raw` column shows the value translated by `ENV_CONVERSIONS.<name>.to_string` and the `value` column shows the value used in Nushell (the result of `ENV_CONVERSIONS.<name>.from_string` in the case of `FOO`).

_(Important! The environment conversion string -> value happens **after** the config.nu is evaluated. All environment variables in config.nu are still strings unless you set them manually to some other values.)_

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
