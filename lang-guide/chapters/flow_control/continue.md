# `continue`

`continue` skips the rest of the current iteration of the innermost enclosing loop and starts the next one. If there is no next iteration (a `for` loop has no more items, or a `while` condition is now `false`), the loop ends normally.

See also: [`continue` command help](/commands/docs/continue.md) and [Control Flow - `continue`](/book/control_flow.md#continue) in the Book.

```nu
for x in [1 2 3] { print $x; if $x == 2 { continue }; print "  after" }
# => 1
# =>   after
# => 2
# => 3
# =>   after
```

## Language Notes

1. `continue` follows the same placement rules as [`break`](./break.md): it is allowed only in [`for`](/commands/docs/for.md), [`while`](./while.md) and [`loop`](./loop.md), and not inside a closure, not even one that is nested in a loop.

   ```nu
   [1 2 3] | each {|x| if $x == 2 { continue }; $x }
   # => Error: nu::compile::not_in_a_loop
   # =>
   # =>   × 'continue' can only be used inside a loop
   # =>    ╭─[repl_entry #1:1:34]
   # =>  1 │ [1 2 3] | each {|x| if $x == 2 { continue }; $x }
   # =>    ·                                  ────┬───
   # =>    ·                                      ╰── can't be used outside of a loop
   # =>    ╰────
   ```

1. In an `each` closure, [`return`](./return.md) with no value gives the effect of `continue`: the closure ends early, and `each` drops `null` results (unless you pass `--keep-empty`). To drop items before processing them, filter with [`where`](../filters/where-filter.md) first.

   ```nu
   [1 2 3] | each {|x| if $x == 2 { return }; $x * 10 }
   # => ╭───┬────╮
   # => │ 0 │ 10 │
   # => │ 1 │ 30 │
   # => ╰───┴────╯
   ```

   ```nu
   [1 2 3] | where $it != 2 | each {|x| $x * 10 }
   # => ╭───┬────╮
   # => │ 0 │ 10 │
   # => │ 1 │ 30 │
   # => ╰───┴────╯
   ```

1. In a `while` loop, remember to update the loop variable _before_ `continue`, or the loop will never end:

   ```nu
   mut x = 0
   while $x < 7 {
     $x += 1
     if $x mod 3 == 0 { continue }
     print $x
   }
   # => 1
   # => 2
   # => 4
   # => 5
   # => 7
   ```

1. In nested loops, `continue` applies to the innermost loop only:

   ```nu
   for i in 1..2 { for j in 1..3 { if $j == 2 { continue }; print $"($i),($j)" } }
   # => 1,1
   # => 1,3
   # => 2,1
   # => 2,3
   ```

1. A `finally` block of a surrounding [`try`](./try-catch.md) runs before the loop moves on:

   ```nu
   for i in 1..2 { try { continue } finally { print $"finally ($i)" } }
   # => finally 1
   # => finally 2
   ```
