# `try`/`catch`

`try` runs a block. If an error happens anywhere inside it (in a built-in command, a custom command, an [`error make`](/commands/docs/error_make.md), or a failing external command), the rest of the block is skipped and the optional `catch` closure runs instead. An optional `finally` closure runs afterwards in every case.

```text
try { <block> } catch {|err| <on error> } finally {|value| <always> }
```

Both `catch` and `finally` are optional, but if both are given, `catch` comes first.

Each must start on the same line as the `}` before it. On the next line, `catch` or `finally` is a separate command that fails with a "Command not found" error after the `try` has already run without it. A bare `try` swallows the original error, and the cleanup in `finally` never runs. See the `else` example in [Control Flow](/book/control_flow.md#if), which fails the same way.

See also: [`try` command help](/commands/docs/try.md), [Control Flow - `try`](/book/control_flow.md#try) and [Creating Your Own Errors](/book/creating_errors.md) in the Book.

```nu
let n = try { "abc" | into int } catch { 0 }
$n
# => 0
```

## The Result of `try`

| Outcome                            | Value of the `try` expression            |
| ---------------------------------- | ---------------------------------------- |
| The block succeeds                 | The block's value                        |
| An error occurs, `catch` is given  | The `catch` closure's value              |
| An error occurs, no `catch`        | `null` (the error is swallowed)          |
| An error occurs, only `finally`    | The error is re-raised after `finally` runs |

The output of `finally` is always discarded.

```nu
try { 1 / 0 } | describe
# => nothing
```

## The Error Record

The `catch` closure receives a record describing the error, both as its parameter and as `$in`:

| Field       | Contents                                                                              |
| ----------- | ------------------------------------------------------------------------------------- |
| `msg`       | The error message                                                                     |
| `debug`     | The Rust debug representation of the error                                            |
| `raw`       | The error itself. Returning it from `catch` re-raises the original error              |
| `rendered`  | The error as Nushell would print it (a string)                                        |
| `details`   | A record with `msg`, `labels`, `code`, `url`, `help` and `inner` (see below)          |
| `exit_code` | Only for a failed external command. The exit code, or minus the signal number         |

```nu
try { 1 / 0 } catch {|err| [$err.msg $err.details.code] }
# => ╭───┬─────────────────────────────╮
# => │ 0 │ Division by zero.           │
# => │ 1 │ nu::shell::division_by_zero │
# => ╰───┴─────────────────────────────╯
```

```nu
try { error make {msg: "disk full", help: "free some space"} } catch { $in.details | select msg help }
# => ╭──────┬─────────────────╮
# => │ msg  │ disk full       │
# => │ help │ free some space │
# => ╰──────┴─────────────────╯
```

In `details`:

- `labels` is a table with one row for each underlined place. Each row has the label `text`, a `span` record with `start` and `end` in the form that `error make` takes, and a `location` record with the `file` the label points into and the `start` and `end` byte offsets within that file.
- `code` is the error code, such as `nu::shell::division_by_zero`. It is `null` for an error from `error make` with a record that has no `code`. For `error make "message"` it is `nu::shell::error`.
- `inner` is a list of records with the same fields as `details`, one for each inner error.

```nu
try { 1 / 0 } catch {|err| $err.details.labels.0 | to nuon }
# => {text: "division by zero", span: {start: 170554, end: 170555}, location: {file: "repl_entry #1", start: 8, end: 9}}
```

The `span` numbers depend on everything Nushell has parsed so far, so yours will differ. `location.start` and `location.end` count from the start of the file or prompt entry.

## Language Notes

1. A non-zero exit code from an external command is an error, including one in the middle of a pipeline. The error record then has an `exit_code` field:

   ```nu
   try { ^false | lines } catch {|e| $e.exit_code }
   # => 1
   ```

   On Linux and macOS, an external command ended by a signal is an error too, with the code `nu::shell::terminated_by_signal` and a label such as `terminated by SIGTERM (15)`. If the command also dumped core, the code is `nu::shell::core_dumped` and the label reads `core dumped with SIGSEGV (11)`. In both cases `exit_code` is the signal number made negative:

   ```nu
   try { ^sh -c 'kill -TERM $$' } catch {|e| {code: $e.details.code, exit_code: $e.exit_code} }
   # => ╭───────────┬─────────────────────────────────╮
   # => │ code      │ nu::shell::terminated_by_signal │
   # => │ exit_code │ -15                             │
   # => ╰───────────┴─────────────────────────────────╯
   ```

   A command ended by `SIGPIPE` is never an error. That is how commands such as `^yes` normally stop when the command reading their output, like `^head`, exits first.

1. Errors raised inside `catch` propagate normally. `error make` attaches an error record it receives as input to the new error, and the input of `catch` is the original error. So when `error make` is the first command in `catch`, the original error is attached to the new one and printed after it:

   ```nu
   try { error make {msg: a} } catch {|e| error make {msg: b} }
   # => Error: nu::shell::error
   # =>
   # =>   × b
   # =>    ╭─[repl_entry #1:1:51]
   # =>  1 │ try { error make {msg: a} } catch {|e| error make {msg: b} }
   # =>    ·                                                   ────────
   # =>    ╰────
   # =>
   # => Error:
   # =>   × a
   # =>    ╭─[repl_entry #1:1:18]
   # =>  1 │ try { error make {msg: a} } catch {|e| error make {msg: b} }
   # =>    ·                  ────────
   # =>    ╰────
   ```

   After any other statement, the original error is no longer the input. Pipe it in, as in `$e | error make {msg: b}`, or pass it as `inner` to keep it attached: `catch {|e| print "logging"; error make {msg: b, inner: [$e]} }`.

   To log an error and re-raise it unchanged, return `$e.raw`: `catch {|e| print "logging"; $e.raw }`. `error make` also re-raises the error held in the `raw` field of a record it is given, including `$e` itself, and then ignores the record's other fields. See [Re-raising a caught error](/book/creating_errors.md#re-raising-a-caught-error).

1. `finally` runs after the block succeeds, after `catch`, when an uncaught error is about to propagate, and when `break`, `continue`, `return` or `exit` leaves the `try` (only `exit --abort` skips it). It receives a value as its parameter and as `$in`:

   - on success, or after `catch`, the value of the block or of `catch`;
   - on an error that was not caught, the error record;
   - after `break`, `continue` or `return`, `nothing`.

   ```nu
   try { "ok" } catch { "failed" } finally {|v| print $"finally got: ($v)" }
   # => finally got: ok
   # => ok
   ```

   ```nu
   try { error make {msg: boom} } finally {|v| print $"cleaning up after: ($v.msg)" }
   # => cleaning up after: boom
   # => Error: nu::shell::error
   # =>
   # =>   × boom
   # =>    ╭─[repl_entry #1:1:18]
   # =>  1 │ try { error make {msg: boom} } finally {|v| print $"cleaning up after: ($v.msg)" }
   # =>    ·                  ───────────
   # =>    ╰────
   ```

   An error raised inside `finally` replaces the result of the `try`, and also replaces an error that was on its way up. `error make` as the first command of `finally` is the exception, for the same reason as in `catch`. Its input is the uncaught error record, so the original error is attached to the new one as an inner error. Any other error, such as `1 / 0`, drops the original.

   When `try` expressions are nested, every `finally` runs, the innermost first, before the error reaches an outer `catch`:

   ```nu
   try { try { error make {msg: boom} } finally { print "inner finally" } } catch {|e| print $"caught ($e.msg)" } finally { print "outer finally" }
   # => inner finally
   # => caught boom
   # => outer finally
   ```

1. [`exit`](/commands/docs/exit.md) is not an error that `catch` can handle. `catch` never runs for it, and the script ends with the given exit code, after any `finally` blocks have run:

   ```nu
   # exit.nu
   try { exit 4 } catch { print "never printed" } finally { print "finally ran" }
   print "never printed either"
   ```

   ```nu
   nu exit.nu
   # => finally ran

   nu exit.nu | complete | get exit_code
   # => 4
   ```

1. An interrupt is an error that `try` can catch. Pressing <kbd>Ctrl</kbd>+<kbd>C</kbd> while the block runs Nushell code raises an `Operation interrupted` error. On Unix, an external command stopped by <kbd>Ctrl</kbd>+<kbd>C</kbd> fails with `External command was terminated by a signal` instead, which `try` catches the same way. Nushell clears the interrupt before it runs `catch` or `finally`, so those closures run to the end instead of being interrupted in turn.

1. The `try` body is a block, so it can update `mut` variables. `catch` and `finally` are closures, so they cannot:

   ```nu
   mut x = 0; try { error make {msg: a} } catch { $x = 1 }
   # => Error: nu::parser::expected_keyword
   # =>
   # =>   × Capture of mutable variable.
   # =>    ╭─[repl_entry #1:1:48]
   # =>  1 │ mut x = 0; try { error make {msg: a} } catch { $x = 1 }
   # =>    ·                                                ─┬
   # =>    ·                                                 ╰── capture of mutable variable
   # =>    ╰────
   ```

   Assign the result of the whole `try` expression instead: `$x = try { ... } catch { 1 }`.

1. `try` passes its pipeline input to the block as `$in`:

   ```nu
   [1 2 3] | try { math sum } catch { 0 }
   # => 6
   ```

1. `catch` accepts any expression that gives a closure, such as a variable or a command's parameter, not only a closure written in place. The closure receives the error record as its parameter and as `$in`. A value the parser already knows is not a closure, such as a string variable, is a `nu::parser::type_mismatch` error. A value it can't check in advance, such as an untyped parameter, fails with `Can't convert to Closure` when an error reaches the `catch`.

   ```nu
   let fallback = {|err| $"failed: ($err.msg)" }
   try { 1 / 0 } catch $fallback
   # => failed: Division by zero.
   ```

   `finally` takes only a closure written in place. A variable after `finally` is rejected before anything runs:

   ```nu
   let cleanup = {|| print "cleaning up" }
   try { "done" } finally $cleanup
   # => Error: nu::compile::invalid_keyword_call
   # =>
   # =>   × Encountered invalid `try` keyword call.
   # =>    ╭─[repl_entry #2:1:1]
   # =>  1 │ try { "done" } finally $cleanup
   # =>    · ─┬─
   # =>    ·  ╰── this call is not properly formed
   # =>    ╰────
   ```

   Call the stored closure from a literal one instead: `try { "done" } finally { do $cleanup }`.

1. With a `catch` or a `finally`, `try` collects the whole output of its block before it returns. It doesn't pass stream items on as they arrive, so an error in a later item of a stream is still caught:

   ```nu
   try { 1..3 | each {|x| if $x == 3 { error make {msg: boom} } else { $x } } } catch { "caught" }
   # => caught
   ```

   The next command in the pipeline gets the items only after the block has finished. Here all three items are produced before the first one is consumed:

   ```nu
   try { 1..3 | each {|x| print $"producing ($x)"; $x } } catch { [] } | each {|x| print $"consuming ($x)"; $x } | ignore
   # => producing 1
   # => producing 2
   # => producing 3
   # => consuming 1
   # => consuming 2
   # => consuming 3
   ```

   Without `catch` and `finally`, the stream passes through and the lines alternate. A `try` with a `catch` around an endless stream never returns. External commands get one exception. When the block ends with an external command and the next command takes its stderr, as [`complete`](/commands/docs/complete.md) and `save --stderr` do, `try` still reads all of the output and waits for the external to exit, but it passes stdout and stderr on separately so that the next command receives both. A non-zero exit code is still caught.

1. Parse errors cannot be caught. The whole entry or script is parsed before anything runs, so a syntax error inside a `try` block stops everything:

   ```nu
   try { 1 + } catch { "never reached" }
   # => Error: nu::parser::incomplete_math_expression
   # =>
   # =>   × Incomplete math expression.
   # =>    ╭─[repl_entry #1:1:9]
   # =>  1 │ try { 1 + } catch { "never reached" }
   # =>    ·         ┬
   # =>    ·         ╰── incomplete math expression
   # =>    ╰────
   ```

1. For external commands, [`complete`](/commands/docs/complete.md) is an alternative when you want the exit code and output without treating failure as an error.

1. [`do --ignore-errors`](/commands/docs/do.md) (`-i`) runs a closure and ignores its errors. An error stops the closure, and `do` returns `null` instead. When the closure returns a list stream, each error item in it becomes `null`:

   ```nu
   do -i { [1 2 3] | each {|x| if $x == 2 { error make {msg: boom} } else { $x } } } | to nuon
   # => [1, null, 3]
   ```

   An external command that ends the closure works differently. Its non-zero exit code, or its end by a signal, is ignored only when the output of `do` goes to the terminal or is discarded, for example with `ignore`. When the output is assigned with `let` or piped to another command, the failure still stops the pipeline. Pipe it to `complete` to read the exit code instead:

   ```nu
   try { do -i { ^false } | lines } catch {|e| $"still failed with exit code ($e.exit_code)" }
   # => still failed with exit code 1

   do -i { ^false } | complete | get exit_code
   # => 1
   ```

   When `do -i` ignores an external's failure, `$env.LAST_EXIT_CODE` is `0` afterwards, not the external's exit code. A core dump is never ignored. An external that dumps core raises `nu::shell::core_dumped` even inside `do -i`.

1. [`do --capture-errors`](/commands/docs/do.md) (`-c`) does the opposite for an external command that ends the closure. `do` reads all of the command's output into memory and waits for it to exit. If the exit code isn't zero, `do` fails with `nu::shell::non_zero_exit_code`, and the commands after it never see the output:

   ```nu
   try { do -c { ^sh -c "echo one; exit 2" } | lines | each { print $"got ($in)" } } catch {|e| $"failed with ($e.exit_code)" }
   # => failed with 2
   ```

   Without `-c`, `each` would print `got one` before the failure is reported. Because the output is held until the command exits, `-c` doesn't suit a command with endless output. Its stderr still goes to the terminal unless you redirect it. Errors from Nushell commands in the closure are passed on as usual. When both flags are given, `-c` wins, and the external's failure is raised even at the terminal. [Closure](../types/basic_types/closure.md) shows the streaming case side by side, and why `-c` shouldn't be combined with `complete`.
