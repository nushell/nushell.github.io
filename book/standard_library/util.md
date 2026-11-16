# `std/util`

The `std/util` module holds commands that don't belong to any other module. Import it with a glob, so they have no prefix:

```nu
use std/util *
```

You can also import a single command, as in `use std/util "path add"`. After `use std/util` without the glob, the commands are `util path add`, `util repeat` and so on, and after `use std`, they are `std path add`, `std repeat` and so on, without `util`.

[[toc]]

## `path add`

`path add` adds directories to the front of `$env.PATH`, or to the end with `--append`. It is described in [Path Configuration](../configuration.md#path-configuration).

## `repeat`

`repeat` returns a list that holds its input `n` times:

```nu
"ab" | repeat 3 | to nuon
# => [ab, ab, ab]
"-" | repeat 10 | str join
# => ----------
```

The input can be any value, and each item of the list is a copy of it. With `0`, the result is an empty list. A negative number is an error:

```nu
"ab" | repeat -1
# => Error: nu::shell::error
# =>
# =>   × invalid_argument
# =>    ╭─[repl_entry #1:1:15]
# =>  1 │ "ab" | repeat -1
# =>    ·               ─┬
# =>    ·                ╰── n should be a positive integer, found -1
# =>    ╰────
```

Without input, `repeat 2` returns `[null, null]`.

## `null-device` and `null_device`

`null-device` returns the path of the system's null device, `/dev/null`, or `\\.\NUL` on Windows. Whatever is written there is thrown away, so use it to discard a stream, as in [File Redirections](../stdout_stderr_exit_codes.md#file-redirections):

```nu
cat unknown.txt e> (null-device)
```

`null_device` is a constant with the same path. Use the constant where Nushell needs a value while it parses the code, such as a parameter's default value. Writing `--log: path = (null-device)` there fails with "Default values should be constant expressions", but the constant works:

```nu
use std/util [null_device]
def build [--log: path = $null_device] { $log }
build
# => /dev/null
```

After `use std/util` without the `*`, the constant is `$util.null_device`. After `use std`, it is `$std.null_device`.

## `structure`

`structure` takes a command line as a string argument and splits it into a table of tokens, with their `text`, `kind` and `span`. It is meant for custom completers that receive the whole command line. See [Context Aware Custom Completions](../custom_completions.md#context-aware-custom-completions).

## `ellie`

`ellie` returns Ellie, Nushell's elephant mascot, as a string of ASCII art in green:

```nu
ellie
# =>      __  ,
# =>  .--()°'.'
# => '|, . ,'
# =>  !_-(_\
```

It is the same drawing that the welcome [`banner`](/commands/docs/banner.md) shows.
