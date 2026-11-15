# Control Flow

Nushell provides several commands that help determine how different groups of code are executed. In programming languages this functionality is often referred to as _control flow_.

::: tip
One thing to note is that all of the commands discussed on this page use [blocks](/book/types_of_data.html#blocks). This means you can mutate [environmental variables](/book/environment.html) and other [mutable variables](/book/variables.html#mutable-variables) in them. The exceptions are the `catch` and `finally` parts of [`try`](#try), which are closures.
:::

## Already covered

Below we cover some commands related to control flow, but before we get to them, it's worthwhile to note there are several pieces of functionality and concepts that have already been covered in other sections that are also related to control flow or that can be used in the same situations. These include:

- Pipes on the [pipelines](/book/pipelines.html) page.
- Closures on the [types of data](/book/types_of_data.html) page.
- Iteration commands on the [working with lists](/book/working_with_lists.html) page. Such as:
  - [`each`](/commands/docs/each.html)
  - [`where`](/commands/docs/where.html)
  - [`reduce`](/commands/docs/reduce.html)

## Choice (Conditionals)

The following commands execute code based on some given condition.

::: tip
The choice/conditional commands are expressions so they return values, unlike the other commands on this page. This means the following works.

```nu
'foo' | if $in == 'foo' { 1 } else { 0 } | $in + 2
# => 3
```

:::

### `if`

[`if`](/commands/docs/if.html) evaluates branching [blocks](/book/types_of_data.html#blocks) of code based on the results of one or more conditions similar to the "if" functionality in other programming languages. For example:

```nu
let x = 5
if $x > 0 { 'positive' }
# => positive
```

Returns `'positive`' when the condition is `true` (`$x` is greater than zero) and `null` when the condition is `false` (`$x` is less than or equal to zero).

We can add an `else` branch to the `if` after the first block which executes and returns the resulting value from the `else` block when the condition is `false`. For example:

```nu
let x = -5
if $x > 0 { 'positive' } else { 'non-positive' }
# => non-positive
```

This time it returns `'positive'` when the condition is `true` (`$x` is greater than zero) and `'non-positive`' when the condition is `false` (`$x` is less than or equal to zero).

We can also chain multiple `if`s together like the following:

```nu
let x = 0
if $x > 0 { 'positive' } else if $x == 0 { 'zero' } else { "negative" }
# => zero
```

When the first condition is `true` (`$x` is greater than zero) it will return `'positive'`, when the first condition is `false` and the next condition is `true` (`$x` equals zero) it will return `'zero'`, otherwise it will return `'negative'` (when `$x` is less than zero).

The condition is a math expression, like the ones above. To use the result of a command or pipeline as the condition, wrap it in parentheses, as in `if ($files | is-empty) { ... }`. See the [Language Guide](/lang-guide/chapters/flow_control/if-else.md) for what happens without them.

::: warning
`else` has to start on the same line as the `}` before it. A newline ends the `if` command, so Nushell runs the `if` by itself and then tries to run `else` as a separate command. The parser doesn't catch this. The script fails when it reaches the `else`, whichever branch the condition picked:

```nu
# size.nu
def describe-size [n: int] {
    if $n > 100 {
        "big"
    }
    else {
        "small"
    }
}

describe-size 5
```

```nu
nu size.nu
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[/home/me/size.nu:5:5]
# =>  4 │     }
# =>  5 │     else {
# =>    ·     ──┬─
# =>    ·       ╰── Command `else` not found
# =>  6 │         "small"
# =>    ╰────
# =>   help: Did you mean `if`?
```

Write `} else {` on one line. The same rule applies to `else if` and to the `catch` and `finally` parts of [`try`](#try). Inside parentheses a newline doesn't end the command, so wrapping the whole `if` in `( )` also lets `else` start a new line (see [Multi-line pipelines](pipelines.md#multi-line-pipelines)).
:::

### `match`

[`match`](/commands/docs/match.html) executes one of several conditional branches based on the value given to match. You can also do some [pattern matching](/cookbook/pattern_matching.html) to unpack values in composite types like lists and records.

Basic usage of [`match`](/commands/docs/match.html) can conditionally run different code like a "switch" statement common in other languages. [`match`](/commands/docs/match.html) checks if the value after the word [`match`](/commands/docs/match.html) is equal to the value at the start of each branch before the `=>` and if it does, it executes the code after that branch's `=>`.

```nu
match 3 {
    1 => 'one',
    2 => {
        let w = 'w'
        't' + $w + 'o'
    },
    3 => 'three',
    4 => 'four'
}
# => three
```

The branches can either return a single value or, as shown in the second branch, can return the results of a [block](/book/types_of_data.html#blocks).

#### Catch all Branch

You can also have a catch all condition for when the given value doesn't match any of the other conditions by having a branch whose matching value is `_`.

```nu
let foo = match 7 {
    1 => 'one',
    2 => 'two',
    3 => 'three',
    _ => 'other number'
}
$foo
# => other number
```

(Reminder, [`match`](/commands/docs/match.html) is an expression which is why we can assign the result to `$foo` here).

#### Pattern Matching

You can "unpack" values from types like lists and records with [pattern matching](/cookbook/pattern_matching.html). You can then assign variables to the parts you want to unpack and use them in the matched expressions.

```nu
let foo = { name: 'bar', count: 7 }
match $foo {
    { name: 'bar', count: $it } => ($it + 3),
    { name: _, count: $it } => ($it + 7),
    _ => 1
}
# => 10
```

The `_` in the second branch means it matches any record with field `name` and `count`, not just ones where `name` is `'bar'`.

Lists unpack the same way. In a list pattern, `..` stands for any number of items, and it can go at the start, in the middle, or at the end. `..$name` also binds those items to a variable:

```nu
let steps = [build test done]
match $steps {
    [] => 'nothing to do',
    [.., 'done'] => 'finished',
    [$current, ..] => $"running ($current)"
}
# => finished
```

#### Guards

You can also add an additional condition to each branch called a "guard" to determine if the branch should be matched. To do so, after the matched pattern put `if` and then the condition before the `=>`.

```nu
let foo = { name: 'bar', count: 7 }
match $foo {
    { name: 'bar', count: $it } if $it < 5 => ($it + 3),
    { name: 'bar', count: $it } if $it >= 5 => ($it + 7),
    _ => 1
}
# => 14
```

---

You can find more details about [`match`](/commands/docs/match.html) in the [pattern matching cookbook page](https://www.nushell.sh/cookbook/pattern_matching.html).

## Loops

The loop commands allow you to repeat a block of code multiple times.

### Loops and Other Iterating Commands

The functionality of the loop commands is similar to commands that apply a closure over elements in a list or table like [`each`](/commands/docs/each.html) or [`where`](/commands/docs/where.html) and many times you can accomplish the same thing with either. For example:

```nu
mut result = []
for $it in [1 2 3] { $result = ($result | append ($it + 1)) }
$result
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 3 │
# => │ 2 │ 4 │
# => ╰───┴───╯


[1 2 3] | each { $in + 1 }
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 3 │
# => │ 2 │ 4 │
# => ╰───┴───╯
```

While it may be tempting to use loops if you're familiar with them in other languages, it is considered more in the [Nushell-style](/book/thinking_in_nu.html) (idiomatic) to use commands that apply closures when you can solve a problem either way. The reason for this is because of a pretty big downside with using loops.

#### Loop Disadvantages

The biggest downside of loops is that they are statements, unlike [`each`](/commands/docs/each.html) which is an expression. Expressions, like [`each`](/commands/docs/each.html) always result in some output value, however statements do not.

This means that they don't work well with immutable variables and using immutable variables is considered a more [Nushell-style](/book/thinking_in_nu.html#variables-are-immutable-by-default). Without a mutable variable declared beforehand in the example in the previous section, it would be impossible to use [`for`](/commands/docs/for.html) to get the list of numbers with incremented numbers, or any value at all.

Statements also don't work in Nushell pipelines which require some output. In fact Nushell will give an error if you try:

```nu
[1 2 3] | for x in $in { $x + 1 } | $in ++ [5 6 7]
# => Error: nu::parser::unexpected_keyword
# =>
# =>   × Statement used in pipeline.
# =>    ╭─[repl_entry #1:1:11]
# =>  1 │ [1 2 3] | for x in $in { $x + 1 } | $in ++ [5 6 7]
# =>    ·           ─┬─
# =>    ·            ╰── not allowed in pipeline
# =>    ╰────
# =>   help: 'for' keyword is not allowed in pipeline. Use 'for' by itself, outside of a pipeline.
```

Because Nushell is very pipeline oriented, this means using expression commands like [`each`](/commands/docs/each.html) is typically more natural than loop statements.

#### Loop Advantages

If loops have such a big disadvantage, why do they exist? Well, one reason is that closures, like [`each`](/commands/docs/each.html) uses, can't modify mutable variables in the surrounding environment. If you try to modify a mutable variable in a closure you will get an error:

```nu
mut foo = []
[1 2 3] | each { $foo = ($foo | append ($in + 1)) }
# => Error: nu::parser::expected_keyword
# =>
# =>   × Capture of mutable variable.
# =>    ╭─[repl_entry #1:2:18]
# =>  1 │ mut foo = []
# =>  2 │ [1 2 3] | each { $foo = ($foo | append ($in + 1)) }
# =>    ·                  ──┬─
# =>    ·                    ╰── capture of mutable variable
# =>    ╰────
```

If you modify an environmental variable in a closure, you can, but it will only modify it within the scope of the closure, leaving it unchanged everywhere else. Loops, however, use [blocks](/book/types_of_data.html#blocks) which means they can modify a regular mutable variable or an environmental variable within the larger scope.

```nu
mut result = []
for $it in [1 2 3] { $result = ($result | append ($it + 1)) }
$result
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 3 │
# => │ 2 │ 4 │
# => ╰───┴───╯
```

Errors, on the other hand, are not a reason to pick one over the other. When the closure given to `each` fails, Nushell reports the closure's own error, with an extra `source value` label on the input item that was being processed:

```nu
[0] | each { error make { msg: "Custom error" } | default '' }
# => Error: nu::shell::error
# =>
# =>   × Custom error
# =>    ╭─[repl_entry #1:1:2]
# =>  1 │ [0] | each { error make { msg: "Custom error" } | default '' }
# =>    ·  ┬                      ───────────────────────
# =>    ·  ╰── source value
# =>    ╰────
```

A `for` loop reports the same error, without the `source value` label:

```nu
for x in [0] { error make { msg: "Custom error" } }
# => Error: nu::shell::error
# =>
# =>   × Custom error
# =>    ╭─[repl_entry #2:1:27]
# =>  1 │ for x in [0] { error make { msg: "Custom error" } }
# =>    ·                           ───────────────────────
# =>    ╰────
```

### `for`

[`for`](/commands/docs/for.html) loops over a range or collection like a list or a table.

```nu
for x in [1 2 3] { $x * $x | print }
# => 1
# => 4
# => 9
```

A table gives one row at a time, as a record. Any other single value, including a record or a string, runs the block once with the whole value, and `null` runs it zero times. A stream, such as the output of `each` or a range like `1..` with no end, is consumed one item at a time as the loop runs. See the [Language Guide](/lang-guide/chapters/flow_control/for.md) for examples.

The loop variable can be written with or without its `$`. `for $x in [1 2 3]` is the same loop as `for x in [1 2 3]`, and the block reads the item as `$x` either way. `_` is an ordinary name too. It's a common choice when the block doesn't need the item, as in `for _ in 1..3 { print hi }`, but it is still bound, so the block could read `$_`. The names of the built-in variables `nu`, `env`, `in` and `ans` can't be used, the same as for [`let`](/lang-guide/chapters/declarations.md#reserved-names).

#### Expression Command Alternatives

- [`each`](/commands/docs/each.html)
- [`par-each`](/commands/docs/par-each.html)
- [`where`](/commands/docs/where.html)
- [`reduce`](/commands/docs/reduce.html)

### `while`

[`while`](/commands/docs/while.html) loops the same block of code until the given condition is `false`.

```nu
mut x = 0; while $x < 10 { $x = $x + 1 }; $x
# => 10
```

#### Expression Command Alternatives

The "until" and other "while" commands

- [`take until`](/commands/docs/take_until.html)
- [`take while`](/commands/docs/take_while.html)
- [`skip until`](/commands/docs/skip_until.html)
- [`skip while`](/commands/docs/skip_while.html)

### `loop`

[`loop`](/commands/docs/loop.html) loops a block infinitely. You can use [`break`](/commands/docs/break.html) (as described in the next section) to limit how many times it loops. It can also be handy for continuously running scripts, like an interactive prompt.

```nu
mut x = 0; loop { if $x > 10 { break }; $x = $x + 1 }; $x
# => 11
```

### `break`

[`break`](/commands/docs/break.html) will stop executing the code in a loop and resume execution after the loop. Effectively "break"ing out of the loop.

```nu
for x in 1..10 { if $x > 3 { break }; print $x }
# => 1
# => 2
# => 3
```

### `continue`

[`continue`](/commands/docs/continue.html) will stop execution of the current loop, skipping the rest of the code in the loop, and will go to the next loop. If the loop would normally end, like if [`for`](/commands/docs/for.html) has iterated through all the given elements, or if [`while`](/commands/docs/while.html)'s condition is now false, it won't loop again and execution will continue after the loop block.

```nu
mut x = -1; while $x <= 6 { $x = $x + 1; if $x mod 3 == 0 { continue }; print $x }
# => 1
# => 2
# => 4
# => 5
# => 7
```

## Errors

### `error make`

[`error make`](/commands/docs/error_make.html) creates an error that stops execution of the code and any code that called it, until either it is handled by a [`try`](/commands/docs/try.html) block, or it ends the script and outputs the error message. This functionality is the same as "exceptions" in other languages.

```nu
print 'printed'; error make { msg: 'Some error info' }; print 'unprinted'
# => printed
# => Error: nu::shell::error
# =>
# =>   × Some error info
# =>    ╭─[repl_entry #1:1:29]
# =>  1 │ print 'printed'; error make { msg: 'Some error info' }; print 'unprinted'
# =>    ·                             ──────────────────────────
# =>    ╰────
```

The record passed to it provides some information to the code that catches it or the resulting error message.

You can find more information about [`error make`](/commands/docs/error_make.html) and error concepts on the [Creating your own errors page](/book/creating_errors.html).

### `try`

[`try`](/commands/docs/try.html) will catch errors created anywhere in the [`try`](/commands/docs/try.html)'s code block and resume execution of the code after the block.

```nu
try { error make { msg: 'Some error info' }}; print 'Resuming'
# => Resuming
```

This includes catching built in errors.

```nu
try { 1 / 0 }; print 'Resuming'
# => Resuming
```

The resulting value will be `nothing` if an error occurs and the returned value of the block if an error did not occur.

If you include a `catch` block after the [`try`](/commands/docs/try.html) block, it will execute the code in the `catch` block if an error occurred in the [`try`](/commands/docs/try.html) block.

```nu
try { 1 / 0 } catch { 'An error happened!' } | $in ++ ' And now I am resuming.'
# => An error happened! And now I am resuming.
```

It will not execute the `catch` block if an error did not occur. As with [`else`](#if), `catch` and `finally` have to start on the same line as the `}` before them.

The `catch` closure can take a parameter, which receives a record describing the error:

```nu
try { 1 / 0 } catch {|err| $err.msg }
# => Division by zero.
```

Instead of writing the closure after `catch`, you can give it a closure stored in a variable or passed in as a parameter, as in `try { ... } catch $handler`. `finally` only takes a closure written in place. See [the Language Guide](/lang-guide/chapters/flow_control/try-catch.md#language-notes) for both.

`try` also works for external commands:

```nu
try { ^nonexisting }; print 'a'
# => a

^nonexisting; print 'a'
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[repl_entry #2:1:2]
# =>  1 │ ^nonexisting; print 'a'
# =>    ·  ─────┬─────
# =>    ·       ╰── Command `nonexisting` not found
# =>    ╰────
# =>   help: `nonexisting` is neither a Nushell built-in or a known external command
```

An external command that exits with a non-zero code is an error as well, and so is one ended by a signal on Linux and macOS. `try` catches both, and the `exit_code` field of the error record holds the exit code, or the signal number made negative. See [the Language Guide](/lang-guide/chapters/flow_control/try-catch.md#language-notes) for the error codes.

When such an error isn't caught, it stops the script like any other error, but Nushell doesn't always print a message for it. These settings control what you see:

- [`$env.config.display_errors.exit_code`](/book/config_reference.md#display-errors) is `false` by default. A command that exits with a non-zero code then shows only what it wrote to stderr itself. A script can stop at such a command with no Nushell message at all. Its exit status is then the exit code of that command, which is also in `$env.LAST_EXIT_CODE` at the prompt. Set this to `true` to get a `nu::shell::non_zero_exit_code` error that points at the command.
- `$env.config.display_errors.termination_signal` is `true` by default, so a command ended by a signal gets a `nu::shell::terminated_by_signal` error with a label like `terminated by SIGTERM (15)`. Set it to `false` to hide that message. The script still stops.

A core dump (`nu::shell::core_dumped`) is always reported, and a command ended by `SIGPIPE` is never treated as a failure. Both settings change only what is printed. Either way, the error stops the script and `try` can catch it.

```nu
$env.config.display_errors.exit_code = true
^false
# => Error: nu::shell::non_zero_exit_code
# =>
# =>   × External command had a non-zero exit code
# =>    ╭─[repl_entry #2:1:2]
# =>  1 │ ^false
# =>    ·  ──┬──
# =>    ·    ╰── exited with code 1
# =>    ╰────
```

`try` also catches an interrupt. If you press <kbd>Ctrl</kbd>+<kbd>C</kbd> while the `try` block runs Nushell code, the block stops with an `Operation interrupted` error. On Unix, an external command stopped by <kbd>Ctrl</kbd>+<kbd>C</kbd> fails with `External command was terminated by a signal` instead, and `try` handles that error the same way. Nushell clears the interrupt before `catch` runs, so `catch` and `finally` run to the end rather than being interrupted as well. See also [Background Jobs](./background_jobs.md#exit-behavior).

#### `finally`

A `finally` block can be added after `try` (with or without a `catch`). It always runs when the `try` expression is finished, whether the `try` block succeeded, an error was caught, or an error is still on its way up. This makes it a good place for cleanup code:

```nu
try { 1 / 0 } catch { 'caught' } finally { print 'cleaning up' }
# => cleaning up
# => caught
```

`finally` also runs when the code leaves the `try` or `catch` block early through `return`, `break`, `continue` or [`exit`](/commands/docs/exit.md). (Use `exit --abort` to exit without running it.) `catch` never runs for `exit`, so `try { exit 1 } catch { ... }` still ends the script with exit code 1.

```nu
def get-answer [] {
  try {
    return 42
  } finally {
    print 'cleaning up'
  }
}

get-answer
# => cleaning up
# => 42
```

The value of the whole expression is the value of the `try` or `catch` block. Whatever `finally` returns is discarded. The `finally` closure can take a parameter, which is also available as `$in`. It receives:

- the value of the `try` or `catch` block, if it completed normally;
- the error record, if an error occurred and wasn't handled by a `catch`;
- `nothing`, if the block was left through `return`, `break`, `continue` or `exit`.

```nu
try { 'result' } finally {|v| print $"finally got: ($v)" }
# => finally got: result
# => result
```

Without a `catch`, the error isn't suppressed. `finally` runs, and then the error continues to propagate:

```nu
try { 1 / 0 } finally { print 'cleaning up' }
# => cleaning up
# => Error: nu::shell::division_by_zero
# =>
# =>   × Division by zero.
# =>    ╭─[repl_entry #1:1:9]
# =>  1 │ try { 1 / 0 } finally { print 'cleaning up' }
# =>    ·         ┬
# =>    ·         ╰── division by zero
# =>    ╰────
```

With a `catch` or a `finally`, `try` collects the whole output of its block before it returns. An error in any item of a stream is therefore still caught, but the output doesn't stream on to the next command while the block runs. See [the Language Guide](/lang-guide/chapters/flow_control/try-catch.md#language-notes) for an example.

## Other

### `return`

[`return`](/commands/docs/return.html) Ends a closure or command early where it is called, without running the rest of the command/closure, and returns the given value. Not often necessary since the last value in a closure or command is also returned, but it can sometimes be convenient.

```nu
def 'positive-check' [it] {
    if $it > 0 {
        return 'positive'
    };

    'non-positive'
}
```

```nu
positive-check 3
# => positive

positive-check (-3)
# => non-positive

let positive_check = {|elt| if $elt > 0 { return 'positive' }; 'non-positive' }

do $positive_check 3
# => positive

do $positive_check (-3)
# => non-positive
```
