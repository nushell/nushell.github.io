# Environment

A common task in a shell is to control the environment that external applications will use. This is often done automatically, as the environment is packaged up and given to the external application as it launches. Sometimes, though, we want to have more precise control over what environment variables an application sees.

You can see the current environment variables that will be sent to applications by echoing the value for `$nu.env`

```
> echo $nu.env
──────────────────────────┬──────────────────────────────
 COLORTERM                │ truecolor 
 DBUS_SESSION_BUS_ADDRESS │ unix:path=/run/user/1000/bus 
 DESKTOP_SESSION          │ gnome 
 DISPLAY                  │ :1 
```

## Single-use environment variables

The environment is created from the settings in the Nu configuration and from the environment that Nu is run inside of.  You can updated the environment permanently using the techniques listed in [configuration](configuration.md) chapter.

You can also temporarily update an environment variable when you run a command or pipeline of commands.

```
> with-env [FOO BAR] { echo $nu.env.FOO }
BAR
```

The `with-env` command will temporarily set the environment variable to the value given (here: the variable "FOO" is given the value "BAR").  Once this is done, the block will run with this new environment variable set.

A common shorthand, inspired by Bash and others, is also available. You can write the above example as:

```
> FOO=BAR echo $nu.env.FOO
BAR
```

## Scoped environment variables

You can also set environment variables that will be available in the current scope (the block you're in and any block inside of it).

To do so, you can use the `let-env` command.

```
> let-env FOO = BAR
```

let-env is similar to the **export** command in bash.

If you have more than one environment variable you'd like to set, you can create a table of name/value pairs and load multiple variables at the same time.

```
> load-env [[name, value]; ["BOB", "FOO"] ["JAY", "BAR"]]
```

## Permanent environment variables

You can also set environment variables that are set at startup and are available for the duration of Nushell running. These can be set in the `env` section of the [config](configuration.md).

## Removing environment variables

You can remove an environment variable only if it was set in the current scope:

```
> let-env FOO = BAR
...
> unlet-env FOO
```

If you want to remove an environment variable stemming from a parent scope, you can do so by shadowing its value with `$nothing`:

```
> let-env FOO = BAR
> do {
    let-env FOO = $nothing
    # $nu.env.FOO does not exist
  }
> $nu.env.FOO
BAR
```

The same approach works with `load-env`. If you use `load-env`, you can simultaneously set some variables to a proper string value, while setting others to `$nothing`, and thus remove them.

You can also use this approach in your `config.toml` to remove an environment variable from all future Nu sessions, but this is only possible by using `let-env` or `load-env` as part of the `startup` section. All values in the `env` section are literal strings:

```
# in config.toml
startup = [
    "let-env FOO = $nothing"
]

[env]
BAZ="$nothing"
```

In the above example, any Nu session would start with no defined `FOO` environment variable, while `BAZ` would have a string value of `"$nothing"`.

You can use the same approach with the long form of `with-env`:

```
> with-env [FOO $nothing] { echo $nu.env.FOO }
error: Unknown column  # FOO is not seen in the block scope
```

Beware that the short form does not work with this feature, it treats the value as a string:

```
> FOO=$nothing echo $nu.env.FOO
$nothing
```

Finally, be aware that environment variables set to `$nothing` can also be fully removed with `unlet-env` from the scope in which they are set. If a parent scope has an environment variable with the same name, this value will then be visible in the current scope.

```
> let-env FOO = BAR
> do {
    # FOO == BAR

    let-env FOO = $nothing
    # FOO does not exist

    unlet-env FOO
    # FOO == BAR (FOO from above this scope is seen again)

    unlet-env FOO
    # error: Not an environment variable
    # the command finds FOO in the parent scope and can not remove it
  }
```
