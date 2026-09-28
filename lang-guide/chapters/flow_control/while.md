# `while`

`while` checks a condition and, as long as it is `true`, runs its block. The condition is evaluated again before every iteration, so the block may run zero times.

See also: [`while` command help](/commands/docs/while.md) and [Control Flow - `while`](/book/control_flow.md#while) in the Book.

```nu
mut x = 0
while $x < 10 { $x = $x + 1 }
$x
# => 10
```

## Language Notes

1. The condition is an expression that must evaluate to a `bool`. A pipeline or command call needs parentheses: `while ($queue | is-empty) == false { ... }`.

   ```nu
   mut queue = [a b c]
   while not ($queue | is-empty) {
     print $"processing ($queue | first)"
     $queue = ($queue | skip 1)
   }
   # => processing a
   # => processing b
   # => processing c
   ```

1. A non-boolean condition is a runtime error; Nushell does not convert values to "truthy" or "falsy" ones.

   ```nu
   while 1 { break }
   # => Error: nu::shell::type_mismatch
   # =>
   # =>   × Type mismatch.
   # =>    ╭─[repl_entry #1:1:7]
   # =>  1 │ while 1 { break }
   # =>    ·       ┬
   # =>    ·       ╰── expected bool
   # =>    ╰────
   ```

1. If the condition is `false` from the start, the block never runs:

   ```nu
   mut x = 10
   while $x < 3 { print "never runs" }
   $x
   # => 10
   ```

1. Like [`loop`](./loop.md), `while` evaluates to `nothing`, the block's values are discarded, and the block can update `mut` variables from the enclosing scope because it is a block and not a closure. For the same reason, the condition must not be written as a closure:

   ```nu
   mut x = 0; while { $x < 3 } { $x += 1 }
   # => Error: nu::parser::expected_keyword
   # =>
   # =>   × Capture of mutable variable.
   # =>    ╭─[repl_entry #1:1:20]
   # =>  1 │ mut x = 0; while { $x < 3 } { $x += 1 }
   # =>    ·                    ─┬
   # =>    ·                     ╰── capture of mutable variable
   # =>    ╰────
   ```

1. [`break`](./break.md) and [`continue`](./continue.md) work in `while` just as in `loop` and `for`. `while true { ... }` is equivalent to `loop { ... }`:

   ```nu
   mut i = 0
   while true {
     $i += 1
     if $i == 2 { continue }
     if $i > 4 { break }
     print $i
   }
   # => 1
   # => 3
   # => 4
   ```

1. `while` does not accept pipeline input. To iterate over a list or table, use [`for`](/commands/docs/for.md) or a filter such as [`each`](/commands/docs/each.md). To consume a list only while a condition holds, [`take while`](/commands/docs/take_while.md) is usually simpler than a `while` loop:

   ```nu
   [1 3 5 6 7] | take while {|n| $n mod 2 == 1 }
   # => ╭───┬───╮
   # => │ 0 │ 1 │
   # => │ 1 │ 3 │
   # => │ 2 │ 5 │
   # => ╰───┴───╯
   ```
