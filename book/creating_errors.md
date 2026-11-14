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
