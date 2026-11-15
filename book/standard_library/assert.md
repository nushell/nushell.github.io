# `std/assert`

The `std/assert` module has commands that check a condition and raise an error when it doesn't hold. Tests are built from them, since a test passes when it runs to the end without an error. See [Testing your Nushell Code](../testing.md) for how to organize and run tests.

Import the module without a glob, so the commands keep their `assert` prefix:

```nu
use std/assert
```

[[toc]]

## Overview

Each command takes an optional message as its last positional argument. For `assert`, `assert not` and `assert error`, your message replaces `Assertion failed.`. For the others, the error shows your message first and the command's own message on the next line.

| Command                                              | Passes when                                   | Built-in message                                 |
| ---------------------------------------------------- | --------------------------------------------- | ------------------------------------------------ |
| `assert <condition>`                                 | the condition is `true`                       | `Assertion failed.` (replaced by your message)   |
| `assert not <condition>`                             | the condition is `false`                      | `Assertion failed.` (replaced by your message)   |
| `assert error <closure>`                             | running the closure raises an error           | `Assertion failed.` (replaced by your message)   |
| `assert equal <left> <right>`                        | `$left == $right`                             | `These are not equal.`                           |
| `assert not equal <left> <right>`                    | `$left != $right`                             | `These are equal`                                |
| `assert less <left> <right>`                         | `$left < $right`                              | `The condition *left < right* is not satisfied`  |
| `assert less or equal <left> <right>`                | `$left <= $right`                             | `The condition *left <= right* is not satisfied` |
| `assert greater <left> <right>`                      | `$left > $right`                              | `The condition *left > right* is not satisfied`  |
| `assert greater or equal <left> <right>`             | `$left >= $right`                             | `The condition *left >= right* is not satisfied` |
| `assert length <list> <n>`                           | the list has `n` items                        | `` `$left` does not have the correct length ``   |
| `assert str contains <string> <substring>`           | the string contains the substring             | `` `$left` does not have the correct length ``   |
| `assert compare <closure> <left> <right> <base_msg>` | the closure returns `true` for the two values | `base_msg`                                       |

## `assert`

`assert` takes a boolean. If it is `false`, `assert` raises an error whose label points at the condition:

```nu
assert (1 + 1 == 3)
# => Error: nu::shell::error
# =>
# =>   × Assertion failed.
# =>    ╭─[repl_entry #1:1:9]
# =>  1 │ assert (1 + 1 == 3)
# =>    ·         ─────┬────
# =>    ·              ╰── It is not true.
# =>    ╰────
```

The `--error-label` flag replaces the `It is not true.` label with one of your own, a record with a `text` and a `span`, the same shape as a label for [`error make`](/commands/docs/error_make.md). `--error-labels` takes a list of such records, for an error that underlines more than one place. You can give both, and the error shows all of them. These flags are meant for your own assertion commands. With them, the error can point at the arguments that your command was called with, instead of at the code inside it:

```nu
def "assert in-range" [value: int, low: int, high: int] {
    assert ($value >= $low and $value <= $high) "Value out of range" --error-labels [
        {text: $"value: ($value)", span: (metadata $value).span}
        {text: $"allowed: ($low)..($high)", span: (metadata $high).span}
    ]
}
assert in-range 15 1 10
# => Error: nu::shell::error
# =>
# =>   × Value out of range
# =>    ╭─[repl_entry #1:7:17]
# =>  6 │ }
# =>  7 │ assert in-range 15 1 10
# =>    ·                 ─┬   ─┬
# =>    ·                  │    ╰── allowed: 1..10
# =>    ·                  ╰── value: 15
# =>    ╰────
```

[Testing your Nushell Code](../testing.md#assert-commands) has a one-label example, `assert even`.

## `assert not`

`assert not` passes when the condition is `false`, the opposite of `assert`. The message, `--error-label` and `--error-labels` work the same way. Give it a message that says what went wrong, or a label that points at the value:

```nu
def "assert odd" [number: int] {
    assert not ($number mod 2 == 0) --error-label {text: $"($number) is even", span: (metadata $number).span}
}
assert odd 3
assert odd 4
# => Error: nu::shell::error
# =>
# =>   × Assertion failed.
# =>    ╭─[repl_entry #1:5:12]
# =>  4 │ assert odd 3
# =>  5 │ assert odd 4
# =>    ·            ┬
# =>    ·            ╰── 4 is even
# =>    ╰────
```

## `assert error`

`assert error` takes a closure, runs it, and passes if the closure raises an error. A failing external command counts too, so `assert error { ^false }` passes. If the closure finishes without an error, the label shows the closure's source:

```nu
assert error { [1 2 3] | get 1 } "get should fail"
# => Error: nu::shell::error
# =>
# =>   × get should fail
# =>    ╭─[repl_entry #1:1:14]
# =>  1 │ assert error { [1 2 3] | get 1 } "get should fail"
# =>    ·              ─────────┬─────────
# =>    ·                       ╰─┤ There were no error during code execution:
# =>    ·                         │     { [1 2 3] | get 1 }
# =>    ╰────
```

`assert error` only checks that some error happened, not which one. To check the error itself, catch it and assert on its message:

```nu
let msg = try { [1 2] | get 5 } catch {|err| $err.msg }
$msg
# => Row number too large (max: 1).
assert str contains $msg "too large"
```

## Comparing two values

`assert equal`, `assert not equal`, `assert less`, `assert less or equal`, `assert greater` and `assert greater or equal` take a left value, a right value and an optional message. They compare the values with the operator in the [table above](#overview), so the operator's rules apply. `assert equal 1 1.0` passes because `1 == 1.0` is `true`, and comparing values that the operator can't compare, such as `assert less 1 "a"`, fails with the operator's type error rather than an assertion error.

When the assertion fails, the error underlines both arguments and shows each value as [NUON](/commands/docs/to_nuon.md), so a difference deep inside a record or list is easy to spot:

```nu
assert equal {a: 1, b: [1 2]} {a: 1, b: [1 3]}
# => Error: nu::shell::error
# =>
# =>   × These are not equal.
# =>    ╭─[repl_entry #1:1:14]
# =>  1 │ assert equal {a: 1, b: [1 2]} {a: 1, b: [1 3]}
# =>    ·              ────────┬─────── ────────┬───────
# =>    ·                      │                ╰── right: {a: 1, b: [1, 3]}
# =>    ·                      ╰── left: {a: 1, b: [1, 2]}
# =>    ╰────
```

A message goes on the first line, above the command's own text:

```nu
assert greater or equal 1 2 "need at least two"
# => Error: nu::shell::error
# =>
# =>   × need at least two
# =>   │ The condition *left >= right* is not satisfied
# =>    ╭─[repl_entry #1:1:25]
# =>  1 │ assert greater or equal 1 2 "need at least two"
# =>    ·                         ┬ ┬
# =>    ·                         │ ╰── right: 2
# =>    ·                         ╰── left: 1
# =>    ╰────
```

`assert not equal` is the exception. Its left label is only the word `left`, without the value. The right label shows the value, which is the same on both sides:

```nu
assert not equal 7 7
# => Error: nu::shell::error
# =>
# =>   × These are equal
# =>    ╭─[repl_entry #1:1:18]
# =>  1 │ assert not equal 7 7
# =>    ·                  ┬ ┬
# =>    ·                  │ ╰── right: 7
# =>    ·                  ╰── left
# =>    ╰────
```

## `assert length`

`assert length` takes a list, the expected number of items and an optional message. The labels show the list's actual length and the expected one:

```nu
assert length [a b c] 2
# => Error: nu::shell::error
# =>
# =>   × `$left` does not have the correct length
# =>    ╭─[repl_entry #1:1:15]
# =>  1 │ assert length [a b c] 2
# =>    ·               ───┬─── ┬
# =>    ·                  │    ╰── expected: 2
# =>    ·                  ╰── length: 3
# =>    ╰────
```

The first argument must be a list. A string is a parse error, so check a string's length with `assert equal ($text | str length) 3`.

## `assert str contains`

`assert str contains` takes a string, the substring it should contain and an optional message. The labels show the string as NUON and the substring it looked for. Give it a message that says what was missing:

```nu
assert str contains "haystack" "needle" "search failed"
# => Error: nu::shell::error
# =>
# =>   × search failed
# =>   │ `$left` does not have the correct length
# =>    ╭─[repl_entry #1:1:21]
# =>  1 │ assert str contains "haystack" "needle" "search failed"
# =>    ·                     ─────┬──── ────┬───
# =>    ·                          │         ╰── expected: needle
# =>    ·                          ╰── value: "haystack"
# =>    ╰────
```

## `assert compare`

`assert compare` is the building block for comparison assertions that `std/assert` doesn't have. It takes a closure, a left value, a right value, a base message and an optional message. It calls the closure with the left and right values as its two parameters and passes if the closure returns `true`. When it fails, the error text is the optional message, if any, then the base message, and the labels show both values as NUON, as for `assert equal`.

Wrap `assert compare` in a command of your own:

```nu
def "assert divisible" [n: int, d: int, message?: string] {
    assert compare {|a, b| $a mod $b == 0} $n $d $"($n) is not divisible by ($d)" $message
}
assert divisible 12 4
assert divisible 10 4
# => Error: nu::shell::error
# =>
# =>   × 10 is not divisible by 4
# =>    ╭─[repl_entry #1:2:44]
# =>  1 │ def "assert divisible" [n: int, d: int, message?: string] {
# =>  2 │     assert compare {|a, b| $a mod $b == 0} $n $d $"($n) is not divisible by ($d)" $message
# =>    ·                                            ─┬ ─┬
# =>    ·                                             │  ╰── right: 4
# =>    ·                                             ╰── left: 10
# =>  3 │ }
# =>    ╰────
```

The labels point at the arguments inside the wrapper, not at the line that called `assert divisible`. If you want them on the caller's arguments, build the assertion on `assert` with `--error-labels` instead, as in the [`assert in-range` example](#assert).
