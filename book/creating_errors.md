# Creating Your Own Errors

Using the [metadata](metadata.md) information, you can create your own custom error messages. Error messages are built of multiple parts:

- The title of the error
- The label of error message, which includes both the text of the label and the span to underline
- Optionally, a help message, an error code, a URL, and "inner" errors that led to this one

You can use the [`error make`](/commands/docs/error_make.md) command to create your own error messages. It is the only subcommand of [`error`](/commands/docs/error.md), and running `error` by itself just prints its help. For example, let's say you had your own command called `my-command` and you wanted to give an error back to the caller about something wrong with a parameter that was passed in.

First, you can take the span of where the argument is coming from:

```nu
let span = (metadata $x).span;
```

Next, you can create an error using the [`error make`](/commands/docs/error_make.md) command. This command takes in a record that describes the error to create:

```nu
error make {msg: "this is fishy", label: {text: "fish right here", span: $span } }
```

Together with your custom command, it might look like this:

```nu
def my-command [x] {
    let span = (metadata $x).span;
    error make {
        msg: "this is fishy",
        label: {
            text: "fish right here",
            span: $span
        }
    }
}
```

When called with a value, we'll now see an error message returned:

```nu
my-command 100
# => Error: nu::shell::error
# =>
# =>   × this is fishy
# =>    ╭─[repl_entry #2:1:12]
# =>  1 │ my-command 100
# =>    ·            ─┬─
# =>    ·             ╰── fish right here
# =>    ╰────
```

If you only need a message, you can pass a string instead of a record:

```nu
error make "something went wrong"
# => Error: nu::shell::error
# =>
# =>   × something went wrong
# =>    ╭─[repl_entry #3:1:1]
# =>  1 │ error make "something went wrong"
# =>    · ──────────
# =>    ╰────
```

## Multiple Labels and Help

To underline more than one place, use `labels` with a list of labels instead of `label`. Each label is a record with a `span` (a `{start, end}` record, such as the one returned by `metadata`) and optional `text`. A `help` message tells the user how to fix the problem:

```nu
def check-range [lo: int, hi: int] {
    if $lo > $hi {
        error make {
            msg: "invalid range"
            labels: [
                {text: "lower bound" span: (metadata $lo).span}
                {text: "is greater than the upper bound" span: (metadata $hi).span}
            ]
            help: "swap the two arguments"
        }
    }
    $lo..$hi
}
```

```nu
check-range 10 1
# => Error: nu::shell::error
# =>
# =>   × invalid range
# =>    ╭─[repl_entry #5:1:13]
# =>  1 │ check-range 10 1
# =>    ·             ─┬ ┬
# =>    ·              │ ╰── is greater than the upper bound
# =>    ·              ╰── lower bound
# =>    ╰────
# =>   help: swap the two arguments
```

`label` and `labels` can be used together. The single `label` is added after the ones in `labels`, and all of them are shown.

## Other error fields

Besides `msg`, `label`, `labels` and `help`, the record can have these fields:

- `code` replaces `nu::shell::error` in the first line of the message. Use it for an identifier that scripts can check with `$err.details.code`.
- `url` is shown after the code. With colors on, Nushell prints it as `(link)`, a terminal hyperlink to the URL. With colors off, it prints the URL itself.
- `inner` is a list of error records, which are printed after the main error. Each one takes the same fields as the main record. See [Chaining Errors](#chaining-errors).
- `src` makes the labels point into other text instead of into Nushell code. Give it a `name` and the `text` itself, or a `path` to read the text from a file. The `span` offsets of the labels then count bytes in that text, and the code is always `nu::shell::outside`. A `code` field is ignored.

```nu
error make {msg: "invalid port", code: "my_tool::bad_port", url: "https://example.com/bad-port"}
# => Error: my_tool::bad_port (link)
# =>
# =>   × invalid port
# =>    ╭─[repl_entry #1:1:12]
# =>  1 │ error make {msg: "invalid port", code: "my_tool::bad_port", url: "https://example.com/bad-port"}
# =>    ·            ─────────────────────────────────────────────────────────────────────────────────────
# =>    ╰────
```

```nu
error make {
    msg: "invalid port"
    src: {name: "config.toml", text: "port = abc"}
    labels: [{text: "not a number", span: {start: 7, end: 10}}]
}
# => Error: nu::shell::outside
# =>
# =>   × invalid port
# =>    ╭─[config.toml:1:8]
# =>  1 │ port = abc
# =>    ·        ─┬─
# =>    ·         ╰── not a number
# =>    ╰────
```

With `path`, `error make` reads the file when it runs and names the source after the path, so a `name` next to `path` is ignored. When both `text` and `path` are given, `text` wins. A `src` with neither one is a `nu::shell::cant_convert` error. A file that can't be read doesn't stop the error. Nushell prints the message, and in place of the code excerpt it prints a note such as ``[Failed to read contents for label `not a number` (offset: 7, length: 3): OutOfBounds]``.

You get the same note when a label points past the end of the text. That happens if you mix in a span taken with `metadata`, because such a span counts bytes in Nushell's own source, not in `src`. One error can't underline both your code and another text. To point at both, give the main error a label in your code and put the error about the file in `inner`, with its own `src`:

```nu
def check-config [file: string] {
    error make {
        msg: "invalid configuration"
        label: {text: "in this file", span: (metadata $file).span}
        inner: [{
            msg: "port is not a number"
            src: {path: $file}
            label: {text: "expected a number", span: {start: 7, end: 10}}
        }]
    }
}

# config.toml contains "port = abc"
check-config config.toml
# => Error: nu::shell::error
# =>
# =>   × invalid configuration
# =>    ╭─[repl_entry #2:1:14]
# =>  1 │ check-config config.toml
# =>    ·              ─────┬─────
# =>    ·                   ╰── in this file
# =>    ╰────
# =>
# => Error: nu::shell::outside
# =>
# =>   × port is not a number
# =>    ╭─[config.toml:1:8]
# =>  1 │ port = abc
# =>    ·        ─┬─
# =>    ·         ╰── expected a number
# =>    ╰────
```

Without any label, the error underlines the record you passed, or the words `error make` when you pass a string. `error make --unspanned` (`-u`) leaves out the labels and the code excerpt, which suits errors that aren't about a place in the code, such as a missing file:

```nu
error make --unspanned "settings.toml not found"
# => Error: nu::shell::error
# =>
# =>   × settings.toml not found
```

`--unspanned` also removes the labels of the `inner` errors. It doesn't touch an error with `src`, whose labels are still shown.

`error make` with no argument at all raises an error whose message is `originates from here`. It is a quick way to stop a script at a given line while you debug it:

```nu
error make
# => Error: nu::shell::error
# =>
# =>   × originates from here
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ error make
# =>    · ──────────
# =>    ╰────
```

## Catching Errors

When an error is caught with [`try`](/commands/docs/try.md), the `catch` closure receives a record describing it:

```nu
try { check-range 10 1 } catch {|err| $err.msg }
# => invalid range
```

Besides `msg`, the record has `debug`, `raw`, and `rendered` fields, and a `details` field with the parts of the error as structured data:

```nu
try { check-range 10 1 } catch {|err| $err.details | reject labels inner }
# => ╭──────┬────────────────────────╮
# => │ msg  │ invalid range          │
# => │ code │                        │
# => │ url  │                        │
# => │ help │ swap the two arguments │
# => ╰──────┴────────────────────────╯
```

`code` is empty here because `check-range` gives no `code`. The header still shows `nu::shell::error`, which is what Nushell prints for an error without one. With a string, as in `error make "message"`, `details.code` is `nu::shell::error`.

Each item in `details.labels` is a record with the label's `text`, its `span` (the same `{start, end}` record that `error make` takes), and a `location` record. `location` has the `file` the label points into (or the name of the prompt entry) and the `start` and `end` byte offsets within it:

```nu
try { 1 / 0 } catch {|err| $err.details.labels.0.location.start }
# => 8
```

The label of a division by zero points at the `/`, the ninth character of the line, so its offset is 8.

`details.inner` is a list of records with the same fields as `details`, one for each inner error.

::: note
In Nushell 0.113 and earlier, this information was available as a JSON string in `$err.json`. Use `$err.details` instead.
:::

## Chaining Errors

`error make` adds an error record that it receives as input to the new error's `inner` list. A `catch` block's input is the caught error, so when `error make` is the first command in the block, the caught error becomes an inner error of the new one, and both are reported:

```nu
try { check-range 10 1 } catch { error make "could not build the range" }
# => Error: nu::shell::error
# =>
# =>   × could not build the range
# =>    ╭─[repl_entry #8:1:34]
# =>  1 │ try { check-range 10 1 } catch { error make "could not build the range" }
# =>    ·                                  ──────────
# =>    ╰────
# =>
# => Error:
# =>   × invalid range
# =>    ╭─[repl_entry #8:1:19]
# =>  1 │ try { check-range 10 1 } catch { error make "could not build the range" }
# =>    ·                   ─┬ ┬
# =>    ·                    │ ╰── is greater than the upper bound
# =>    ·                    ╰── lower bound
# =>    ╰────
# =>   help: swap the two arguments
```

After any other statement in the block, such as a `print`, the caught error is no longer the input, and `error make` reports only the new error. To keep the chain, pipe the error in with `$err | error make "..."`, or pass it with `inner`, as in `catch {|err| print 'cleaning up'; error make {msg: 'could not build the range', inner: [$err]} }`.

Piping works anywhere, not only in `catch`. An error record kept in a variable can be chained later:

```nu
let err = try { 1 / 0 } catch {|e| $e }
print "still running"
$err | error make "could not compute the ratio"
# => still running
# => Error: nu::shell::error
# =>
# =>   × could not compute the ratio
# =>    ╭─[repl_entry #3:1:8]
# =>  1 │ $err | error make "could not compute the ratio"
# =>    ·        ──────────
# =>    ╰────
# =>
# => Error: nu::shell::division_by_zero
# =>
# =>   × Division by zero.
# =>    ╭─[repl_entry #1:1:19]
# =>  1 │ let err = try { 1 / 0 } catch {|e| $e }
# =>    ·                   ┬
# =>    ·                   ╰── division by zero
# =>    ╰────
```

The inner errors don't have to come from `catch`. Each item of `inner` is a record with the same fields as the one passed to `error make`, so you can write the cause yourself. An inner error without labels underlines the same record as the main error, and one without a `code` shows an empty code in its header:

```nu
error make {msg: "deploy failed", inner: [{msg: "config.toml is missing", help: "run init first"}]}
# => Error: nu::shell::error
# =>
# =>   × deploy failed
# =>    ╭─[repl_entry #1:1:12]
# =>  1 │ error make {msg: "deploy failed", inner: [{msg: "config.toml is missing", help: "run init first"}]}
# =>    ·            ────────────────────────────────────────────────────────────────────────────────────────
# =>    ╰────
# =>
# => Error:
# =>   × config.toml is missing
# =>    ╭─[repl_entry #1:1:12]
# =>  1 │ error make {msg: "deploy failed", inner: [{msg: "config.toml is missing", help: "run init first"}]}
# =>    ·            ────────────────────────────────────────────────────────────────────────────────────────
# =>    ╰────
# =>   help: run init first
```

An item that isn't a valid error record, such as one without `msg`, is replaced in the chain by the error that describes the problem, here `nu::shell::column_not_found` for the missing `msg` column.

## Re-raising a caught error

Sometimes a `catch` block only needs to log an error and then let it continue. The `raw` field of the error record holds the original error itself, and returning it from `catch` raises that error again, unchanged:

```nu
try { check-range 10 1 } catch {|err| print "logging the error"; $err.raw }
# => logging the error
# => Error: nu::shell::error
# =>
# =>   × invalid range
# =>    ╭─[repl_entry #2:1:19]
# =>  1 │ try { check-range 10 1 } catch {|err| print "logging the error"; $err.raw }
# =>    ·                   ─┬ ┬
# =>    ·                    │ ╰── is greater than the upper bound
# =>    ·                    ╰── lower bound
# =>    ╰────
# =>   help: swap the two arguments
```

Reading `$err.raw` raises the error right away, so it can't be stored or inspected. That means `error make {msg: "new message", raw: $err.raw}` also re-raises the original error, before `error make` even runs.

`error make` treats a `raw` field the same way. When the record it receives has one, `error make` raises the error stored there and ignores the other fields. The record in `$err` has a `raw` field, so `error make $err` re-raises the caught error, and so does a copy with a changed message:

```nu
try { check-range 10 1 } catch {|err| error make ($err | update msg "could not build the range") }
# => Error: nu::shell::error
# =>
# =>   × invalid range
# =>    ╭─[repl_entry #3:1:19]
# =>  1 │ try { check-range 10 1 } catch {|err| error make ($err | update msg "could not build the range") }
# =>    ·                   ─┬ ┬
# =>    ·                    │ ╰── is greater than the upper bound
# =>    ·                    ╰── lower bound
# =>    ╰────
# =>   help: swap the two arguments
```

To raise a new error based on the caught one, start from `$err.details` instead. It has the `msg`, `labels`, `code`, `url`, `help` and `inner` fields, but no `raw`:

```nu
try { check-range 10 1 } catch {|err| let details = $err.details | update msg "could not build the range"; error make $details }
# => Error: nu::shell::error
# =>
# =>   × could not build the range
# =>    ╭─[repl_entry #4:1:19]
# =>  1 │ try { check-range 10 1 } catch {|err| let details = $err.details | update msg "could not build the range"; error make $details }
# =>    ·                   ─┬ ┬
# =>    ·                    │ ╰── is greater than the upper bound
# =>    ·                    ╰── lower bound
# =>    ╰────
# =>   help: swap the two arguments
```

The new error keeps the original labels and help. Because `error make` isn't the first command in the block, the caught error isn't also attached as an inner error (see [Chaining Errors](#chaining-errors)).

A `raw` field has to hold an error. Any other value, such as `raw: 5`, fails with `Can't convert to ShellError`, and `raw: null` is ignored.
