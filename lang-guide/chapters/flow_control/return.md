# `return`

`return` ends the current custom command or closure early and makes its argument the result. Without an argument, the result is `null`. Since the value of the last expression is returned implicitly (see [Implicit Return](/book/thinking_in_nu.md#implicit-return)), `return` is only needed to leave _early_.

See also: [`return` command help](/commands/docs/return.md) and [Control Flow - `return`](/book/control_flow.md#return) in the Book.

```nu
def sign [n: int] {
  if $n < 0 { return "negative" }
  if $n == 0 { return "zero" }
  "positive"
}
[(sign -5) (sign 0) (sign 7)]
# => ╭───┬──────────╮
# => │ 0 │ negative │
# => │ 1 │ zero     │
# => │ 2 │ positive │
# => ╰───┴──────────╯
```

## Language Notes

1. `return` leaves the nearest enclosing _custom command or closure_. Blocks that belong to `if`, `match`, `try`, `for`, `while` and `loop` are not functions, so a `return` inside them leaves the whole command, including any loop it is in:

   ```nu
   def first-even [nums: list<int>] {
     for n in $nums {
       if $n mod 2 == 0 { return $n }
     }
     null
   }
   first-even [1 3 4 5 6]
   # => 4
   ```

1. A closure is a function of its own. A `return` inside the closure passed to `each` (or `where`, `do`, `reduce`, ...) only ends that call of the closure. The surrounding command keeps running:

   ```nu
   def labels [] {
     [1 2 3] | each {|x| if $x == 2 { return "two" }; $x }
   }
   labels
   # => ╭───┬─────╮
   # => │ 0 │   1 │
   # => │ 1 │ two │
   # => │ 2 │   3 │
   # => ╰───┴─────╯
   ```

   ```nu
   let check = {|n| if $n > 0 { return 'positive' }; 'non-positive' }
   [(do $check 3) (do $check (-3))]
   # => ╭───┬──────────────╮
   # => │ 0 │ positive     │
   # => │ 1 │ non-positive │
   # => ╰───┴──────────────╯
   ```

1. `return` takes at most one value. To return several values, return a list or a record:

   ```nu
   def f [] { return 1 2 }
   # => Error: nu::parser::extra_positional
   # =>
   # =>   × Extra positional argument.
   # =>    ╭─[repl_entry #1:1:21]
   # =>  1 │ def f [] { return 1 2 }
   # =>    ·                     ┬
   # =>    ·                     ╰── extra positional argument
   # =>    ╰────
   # =>   help: Usage: return (return_value)
   ```

1. A bare `return` returns `null`:

   ```nu
   def f [] { return }
   f | describe
   # => nothing
   ```

1. At the top level of a script (or a REPL entry), `return` stops the rest of that script or entry. Its value becomes the result:

   ```nu
   print before; return 5; print after
   # => before
   # => 5
   ```

1. A `finally` block of a surrounding [`try`](./try-catch.md) still runs, and the returned value is kept:

   ```nu
   def f [] { try { return 1 } finally { print "finally ran" }; 2 }
   f
   # => finally ran
   # => 1
   ```
