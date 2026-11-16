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

`load-env` also takes the record as pipeline input, which suits commands that output one, as in `direnv export json | from json | load-env`. See [Direnv](/cookbook/direnv.md).

Each string value goes through its `from_string` conversion in `$env.ENV_CONVERSIONS`, and a string `PATH` becomes a list. See [Environment Variable Conversions](#environment-variable-conversions). `--no-convert` sets the values exactly as given. If a conversion fails, `load-env` sets none of the variables, unless the record has an `ENV_CONVERSIONS` key.

Three kinds of keys are special. A `config` key applies its settings to `$env.config` right away, as assigning `$env.config` does. `PWD`, `FILE_PWD`, and `CURRENT_FILE` are rejected with an error. See [Automatic variables](#automatic-variables). An `ENV_CONVERSIONS` key changes the order. `load-env` first sets every value in the record as given, then runs the new conversions on every string variable, as assigning `$env.ENV_CONVERSIONS` does. One record can therefore carry a conversion and the variable it converts:

```nu
load-env { ENV_CONVERSIONS: { FOO: { from_string: { split row '-' } } }, FOO: 'a-b' }
$env.FOO
# => ╭───┬───╮
# => │ 0 │ a │
# => │ 1 │ b │
# => ╰───┴───╯
```

When one of those conversions fails, `load-env` reports the error, but the values from the record stay set. [`with-env`](/commands/docs/with-env.md) handles an `ENV_CONVERSIONS` key the same way.

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

When you update a variable with a different spelling, using `$env.foo = ...` or [`load-env`](/commands/docs/load-env.md), Nushell changes the existing variable and keeps its original spelling. That spelling is the name external commands see:

```nu
$env.FOO = 'a'
$env.foo = 'b'
^printenv FOO
# => b
```

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

A common task in a shell is to change the directory using the [`cd`](/commands/docs/cd.md) command. In Nushell, [`cd`](/commands/docs/cd.md) works by changing the `PWD` environment variable. Therefore, it follows the same rules as other environment variables (for example, scoping). You can't assign `PWD` yourself, though. Use `cd` instead.

Before it changes `PWD`, `cd` saves the old directory in `OLDPWD`, and `cd -` goes back to it. Auto-cd at the prompt sets `OLDPWD` too. See [`$env.OLDPWD`](./special_variables.md#env-oldpwd).

## Automatic variables

Nushell sets three environment variables itself:

- `PWD` holds the current directory. [`cd`](/commands/docs/cd.md) changes it.
- `FILE_PWD` holds the directory of the script, module, or sourced file that is running.
- `CURRENT_FILE` holds the full path of that file.

Nushell rejects every attempt to set or hide one of them, whether through `$env.PWD = ...`, [`load-env`](/commands/docs/load-env.md), [`with-env`](/commands/docs/with-env.md), a `PWD=... cmd` prefix, or [`hide-env`](/commands/docs/hide-env.md). The check ignores case, so `$env.pwd = ...` fails as well:

```nu
$env.PWD = '/tmp'
# => Error: nu::compile::automatic_env_var_set_manually
# =>
# =>   × 'PWD' cannot be changed manually.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ $env.PWD = '/tmp'
# =>    · ────┬───
# =>    ·     ╰── cannot change 'PWD' manually
# =>    ╰────
# =>   help: The environment variable 'PWD' is set automatically by Nushell and
# =>         cannot be changed manually.
```

An assignment like this one fails before anything runs, with a `nu::compile` error. The commands fail when they run, with `nu::shell::automatic_env_var_set_manually`. To get the file's path or directory as a constant at parse time, use [`path self`](/commands/docs/path_self.md).

When Nushell starts, it sets `PWD` to the directory its process starts in. An inherited `PWD` variable that names a different directory is replaced. External commands always start in `$env.PWD`.

For when exactly `FILE_PWD` and `CURRENT_FILE` are set, see [`$env.CURRENT_FILE`](./special_variables.md#env-current-file).

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

The shorthand takes several variables, each with its own prefix:

```nu
A=1 B=2 ^env | lines | where $it =~ '^(A|B)='
# => ╭───┬─────╮
# => │ 0 │ A=1 │
# => │ 1 │ B=2 │
# => ╰───┴─────╯
```

The name has to start with a letter or `_`, and the rest can be letters, digits, and `_`. A word such as `MY-VAR=1` isn't a shorthand, so Nushell runs it as an external command and reports that `MY-VAR=1` isn't found.

The value after `=` is a string unless it starts with `$`:

- A bare word or a quoted string sets a string. `FOO=1` sets the string `1`, and `FOO='a b'` sets `a b`.
- With nothing after the `=`, as in `FOO= cmd`, the value is an empty string.
- A variable, a cell path such as `$record.field`, or a `$"..."` interpolation sets its value with its type, so `N=$n` sets an int when `$n` holds one.
- A parenthesized expression doesn't work. In `FOO=(1 + 1) cmd`, Nushell runs `FOO=2` as a command name and doesn't set `FOO`. Save the result in a variable first, or use `with-env`.

```nu
let n = 5
N=$n $env.N | describe
# => int
FOO=1 $env.FOO | describe
# => string
```

Nushell computes all the values before it sets any of them, so in `A=1 B=$env.A cmd`, the value of `B` can't read the new `A`.

The variables apply to the one command they precede. The next command in the pipeline doesn't see them, and neither does the next line:

```nu
FOO=bar $env.FOO | $"($in), ($env.FOO? | default unset)"
# => bar, unset
```

A shorthand with no command after it, such as `FOO=bar` on its own, is an `Unknown command` error. To set a variable for the rest of the session, assign it with `$env.FOO = 'bar'`.

The configuration lives in `$env.config`, so `with-env` can change it for one block. When the block ends, the configuration is back to what it was. Draw the output inside the block, as `table` does here. A value that the block returns is drawn after the block ends, with the configuration from outside it:

```nu
with-env { config: ($env.config | upsert float_precision 5) } { [3.14159265] | table }
# => ╭───┬─────────╮
# => │ 0 │ 3.14159 │
# => ╰───┴─────────╯
[3.14159265]
# => ╭───┬──────╮
# => │ 0 │ 3.14 │
# => ╰───┴──────╯
```

Both forms convert the values they set the way `load-env` does. A string value goes through its `from_string` conversion in `$env.ENV_CONVERSIONS`, and a string `PATH` becomes a list:

```nu
PATH=/opt/bin:/usr/bin $env.PATH
# => ╭───┬──────────╮
# => │ 0 │ /opt/bin │
# => │ 1 │ /usr/bin │
# => ╰───┴──────────╯
```

To set the values as given, use `with-env --no-convert`.

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

_(Important! The string -> value conversion happens only for variables that already exist when `$env.ENV_CONVERSIONS` is assigned, such as those inherited from the parent process. A variable that you set as a string afterwards with `$env.FOO = ...` stays a string. To convert it, set it before assigning `ENV_CONVERSIONS`, or assign `$env.ENV_CONVERSIONS` to itself again. [`load-env`](/commands/docs/load-env.md), [`with-env`](/commands/docs/with-env.md) and `FOO=bar cmd` don't have this limit, as described above.)_

Spell each key in `ENV_CONVERSIONS` the way the variable is spelled.

If a `from_string` closure fails while `$env.ENV_CONVERSIONS` is being assigned, the assignment reports the error. The new record is stored anyway, and the variable keeps its string value.

### Path list conversions from the standard library

For variables that hold a list of directories, like `PATH`, the standard library has ready-made closures. `config env-conversions` from `std/config` returns a record with one entry, `path`. Its `from_string` splits the string on [`char esep`](/commands/docs/char.md) (`:`, or `;` on Windows) and expands each entry with `path expand --no-symlink`. Its `to_string` expands the entries the same way and joins them with `char esep`. Merge it into `ENV_CONVERSIONS` under the name of each variable you want converted:

```nu
use std/config
$env.ENV_CONVERSIONS = $env.ENV_CONVERSIONS | merge {
    XDG_DATA_DIRS: (config env-conversions).path
}
$env.XDG_DATA_DIRS
# => ╭───┬──────────────────╮
# => │ 0 │ /usr/local/share │
# => │ 1 │ /usr/share       │
# => ╰───┴──────────────────╯
```

### What external commands receive

An external command gets the variables in `$env` at the point where it runs, except hidden ones, with each value turned into a string:

- A value with a `to_string` closure in `ENV_CONVERSIONS` becomes that closure's result.
- `PATH` (`Path` on Windows), a list, is joined as described in [`$env.PATH`](./special_variables.md#env-path).
- Strings and globs are passed as they are.
- Booleans, ints, and floats become their text, such as `true` and `42`.
- Dates become RFC 3339 text, such as `2026-03-01T14:30:00.000Z`.
- Binary values that hold valid UTF-8 become that text.

Any other value is left out, with no error: records (so `$env.config` never reaches an external), lists other than `PATH`, filesizes, durations, closures, ranges, `null`, and binary values that aren't valid UTF-8. To pass one of these, give it a `to_string` closure in `ENV_CONVERSIONS`, or convert it yourself.

```nu
with-env {X_BOOL: true, X_INT: 42, X_DATE: 2026-03-01T14:30:00Z, X_LIST: [a b], X_SIZE: 1kb, X_REC: {a: 1}} {
    ^env | lines | where $it starts-with X_ | sort
}
# => ╭───┬─────────────────────────────────╮
# => │ 0 │ X_BOOL=true                     │
# => │ 1 │ X_DATE=2026-03-01T14:30:00.000Z │
# => │ 2 │ X_INT=42                        │
# => ╰───┴─────────────────────────────────╯
```

## Removing Environment Variables

You can remove an environment variable with [`hide-env`](/commands/docs/hide-env.md):

```nu
$env.FOO = 'BAR'
hide-env FOO
```

`hide-env` takes several names at once, as in `hide-env FOO BAR`. A name that isn't set is an error:

```nu
hide-env NOT_SET
# => Error: nu::shell::env_variable_not_found
# =>
# =>   × Environment variable 'NOT_SET' not found
# =>    ╭─[repl_entry #1:1:10]
# =>  1 │ hide-env NOT_SET
# =>    ·          ───┬───
# =>    ·             ╰── environment variable not found
# =>    ╰────
```

Nushell hides the names in order and stops at the first one that isn't set, so `hide-env FOO NOT_SET` still hides `FOO`. With `--ignore-errors` (`-i`), names that aren't set are skipped without an error. A hidden variable is also left out of the environment of external commands, even one that Nushell inherited.

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
