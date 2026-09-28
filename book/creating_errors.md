# Creating Your Own Errors

Using the [metadata](metadata.md) information, you can create your own custom error messages. Error messages are built of multiple parts:

- The title of the error
- The label of error message, which includes both the text of the label and the span to underline
- Optionally, a help message, an error code, a URL, and "inner" errors that led to this one

You can use the [`error make`](/commands/docs/error_make.md) command to create your own error messages. For example, let's say you had your own command called `my-command` and you wanted to give an error back to the caller about something wrong with a parameter that was passed in.

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

Run `help error make` to see the other fields an error can have, such as `code`, `url`, `inner`, and `src` (for labels that point into another file).

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

::: note
In Nushell 0.113 and earlier, this information was available as a JSON string in `$err.json`. Use `$err.details` instead.
:::

## Chaining Errors

If you call `error make` inside a `catch` block, the caught error becomes an inner error of the new one, and both are reported:

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
