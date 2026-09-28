# `break`

`break` stops the innermost enclosing loop immediately. Execution continues with the first statement after that loop.

See also: [`break` command help](/commands/docs/break.md) and [Control Flow - `break`](/book/control_flow.md#break) in the Book.

```nu
for x in 1..10 { if $x > 3 { break }; print $x }
# => 1
# => 2
# => 3
```

## Language Notes

1. `break` works only inside [`for`](/commands/docs/for.md), [`while`](./while.md) and [`loop`](./loop.md). Using it anywhere else is a compile error. This includes closures such as the ones passed to `each`, `where` or `do`, even when that closure is itself inside a loop, because a closure is a separate function:

   ```nu
   [1 2 3] | each {|x| if $x == 2 { break }; $x }
   # => Error: nu::compile::not_in_a_loop
   # =>
   # =>   × 'break' can only be used inside a loop
   # =>    ╭─[repl_entry #1:1:34]
   # =>  1 │ [1 2 3] | each {|x| if $x == 2 { break }; $x }
   # =>    ·                                  ──┬──
   # =>    ·                                    ╰── can't be used outside of a loop
   # =>    ╰────
   ```

   ```nu
   for x in 1..3 { do { break } }
   # => Error: nu::compile::not_in_a_loop
   # =>
   # =>   × 'break' can only be used inside a loop
   # =>    ╭─[repl_entry #1:1:22]
   # =>  1 │ for x in 1..3 { do { break } }
   # =>    ·                      ──┬──
   # =>    ·                        ╰── can't be used outside of a loop
   # =>    ╰────
   ```

   Blocks that are not closures, such as the branches of `if` and `match` and the body of `try`, are fine.

1. To stop a stream early without a loop, use [`take while`](/commands/docs/take_while.md) or [`take until`](/commands/docs/take_until.md) instead:

   ```nu
   [1 2 3 4 5 6] | take while {|x| $x <= 3 }
   # => ╭───┬───╮
   # => │ 0 │ 1 │
   # => │ 1 │ 2 │
   # => │ 2 │ 3 │
   # => ╰───┴───╯
   ```

1. `break` takes no arguments. Loops always evaluate to `nothing`, so there is no value to pass out. Assign to a `mut` variable before breaking, or use [`return`](./return.md) inside a custom command.

   ```nu
   for x in [1 2] { break 5 }
   # => Error: nu::parser::extra_positional
   # =>
   # =>   × Extra positional argument.
   # =>    ╭─[repl_entry #1:1:24]
   # =>  1 │ for x in [1 2] { break 5 }
   # =>    ·                        ┬
   # =>    ·                        ╰── extra positional argument
   # =>    ╰────
   # =>   help: Usage: break
   ```

1. In nested loops, `break` leaves only the innermost loop. There are no loop labels:

   ```nu
   for i in 1..3 { for j in 1..3 { if $j == 2 { break }; print $"($i),($j)" } }
   # => 1,1
   # => 2,1
   # => 3,1
   ```

1. A `finally` block of a surrounding [`try`](./try-catch.md) still runs when `break` jumps out of it:

   ```nu
   for i in 1..3 { try { break } finally { print "cleanup" } }; print done
   # => cleanup
   # => done
   ```
