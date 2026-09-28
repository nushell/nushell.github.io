# `loop`

`loop` runs a block over and over until something stops it: a [`break`](./break.md), a [`return`](./return.md) from the enclosing custom command, or an error. It takes no condition; use [`while`](./while.md) when the loop should stop as soon as a condition becomes false.

See also: [`loop` command help](/commands/docs/loop.md) and [Control Flow - `loop`](/book/control_flow.md#loop) in the Book.

```nu
mut n = 1
loop {
  print $n
  if $n >= 3 { break }
  $n += 1
}
# => 1
# => 2
# => 3
```

## Language Notes

1. `loop` is a statement. It always evaluates to `nothing`, and the value of the last expression in the body is discarded on every iteration. Use [`print`](/commands/docs/print.md) to show something, or collect results in a mutable variable.

   ```nu
   mut n = 0
   loop { $n += 1; if $n > 2 { break }; $"value ($n)" } | describe
   # => nothing
   ```

   ```nu
   mut fib = [0 1]
   loop {
     let next = ($fib | last 2 | math sum)
     if $next > 50 { break }
     $fib ++= [$next]
   }
   $fib
   # => ╭───┬────╮
   # => │ 0 │  0 │
   # => │ 1 │  1 │
   # => │ 2 │  1 │
   # => │ 3 │  2 │
   # => │ 4 │  3 │
   # => │ 5 │  5 │
   # => │ 6 │  8 │
   # => │ 7 │ 13 │
   # => │ 8 │ 21 │
   # => │ 9 │ 34 │
   # => ╰───┴────╯
   ```

1. The body is a _block_, not a closure. That is why it can update `mut` variables declared outside of it. A closure passed to a command like `each` cannot (see [Variable Scope](../variable_scope.md)).

1. Variables declared with `let` inside the body are local to a single iteration and are not visible after the loop.

1. `loop` does not accept pipeline input:

   ```nu
   1 | loop { break }
   # => Error: nu::parser::input_type_mismatch
   # =>
   # =>   × Command does not support int input.
   # =>    ╭─[repl_entry #1:1:5]
   # =>  1 │ 1 | loop { break }
   # =>    ·     ──┬─
   # =>    ·       ╰── command doesn't support int input
   # =>    ╰────
   ```

1. Inside a custom command, `return` leaves both the loop and the command, and it can carry a value out:

   ```nu
   def find-free-name [base: string, taken: list<string>] {
     mut i = 1
     loop {
       let candidate = $"($base)-($i)"
       if $candidate not-in $taken { return $candidate }
       $i += 1
     }
   }
   find-free-name report [report-1 report-2]
   # => report-3
   ```

1. [`continue`](./continue.md) skips the rest of the current iteration and starts the next one.

1. When the goal is to _produce_ a list, a filter is usually simpler than a loop and a mutable variable. [`generate`](/commands/docs/generate.md) builds the same Fibonacci list as above:

   ```nu
   generate {|fib| if $fib.0 <= 50 { {out: $fib.0, next: [$fib.1, ($fib.0 + $fib.1)]} } } [0 1]
   # => ╭───┬────╮
   # => │ 0 │  0 │
   # => │ 1 │  1 │
   # => │ 2 │  1 │
   # => │ 3 │  2 │
   # => │ 4 │  3 │
   # => │ 5 │  5 │
   # => │ 6 │  8 │
   # => │ 7 │ 13 │
   # => │ 8 │ 21 │
   # => │ 9 │ 34 │
   # => ╰───┴────╯
   ```
