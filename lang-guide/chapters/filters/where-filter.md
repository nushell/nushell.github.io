# `where` and `filter`

[`where`](/commands/docs/where.md) keeps the items of a list or the rows of a table for which a condition is `true`, and drops the rest. The condition can be written in two ways:

- a **row condition**: an expression written directly after `where`, such as `size > 1kb`;
- a **closure** that receives each item and returns a `bool`, written inline or stored in a variable.

`filter` is the old name for the closure form. It has been deprecated since 0.105; use `where` instead.

See also: [Working with Tables](/book/working_with_tables.md) and [Working with Lists](/book/working_with_lists.md) in the Book, and [`$it`](/book/special_variables.md#it).

## Row Conditions

In a row condition, a bare word on the left of an operator is a column of the current row (a cell path, so `info.size` works too), and `$it` is the whole current row or list item:

```nu
let files = [
  [name size type];
  [README.md 2kb file]
  [src 0b dir]
  [build.rs 12kb file]
  [notes.txt 300b file]
]
$files | where type == file and size > 1kb
# => ╭───┬───────────┬─────────┬──────╮
# => │ # │   name    │  size   │ type │
# => ├───┼───────────┼─────────┼──────┤
# => │ 0 │ README.md │  2.0 kB │ file │
# => │ 1 │ build.rs  │ 12.0 kB │ file │
# => ╰───┴───────────┴─────────┴──────╯
```

```nu
[1 2 3 4 5] | where $it > 2
# => ╭───┬───╮
# => │ 0 │ 3 │
# => │ 1 │ 4 │
# => │ 2 │ 5 │
# => ╰───┴───╯
```

Any operator can be used, and conditions combine with `and`, `or` and `not`. Use `$it` to write expressions over several columns:

```nu
[[name]; [alpha] [beta] [gamma]] | where name in [beta gamma]
# => ╭───┬───────╮
# => │ # │ name  │
# => ├───┼───────┤
# => │ 0 │ beta  │
# => │ 1 │ gamma │
# => ╰───┴───────╯
```

```nu
[[a b]; [1 2] [3 4]] | where ($it.a + $it.b) > 4
# => ╭───┬───┬───╮
# => │ # │ a │ b │
# => ├───┼───┼───┤
# => │ 0 │ 3 │ 4 │
# => ╰───┴───┴───╯
```

Variables from the surrounding scope can be used on either side: `let limit = 2; $list | where $it > $limit`.

A row condition is syntax, not a value. It cannot be stored in a variable; use a closure for that.

## Closures

A closure receives the item as its parameter and as `$in`:

```nu
[1 2 3 4 5] | where {|n| $n mod 2 == 1 }
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 3 │
# => │ 2 │ 5 │
# => ╰───┴───╯
```

A closure stored in a variable can be passed to `where`. This is the use case that `filter` used to cover:

```nu
let is_odd = {|n| $n mod 2 == 1 }
[1 2 3 4 5] | where $is_odd
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 3 │
# => │ 2 │ 5 │
# => ╰───┴───╯
```

## Language Notes

1. `where` works on lists and tables (including streams), not on a single record:

   ```nu
   {a: 1} | where a == 1
   # => Error: nu::parser::input_type_mismatch
   # =>
   # =>   × Command does not support record<a: int> input.
   # =>    ╭─[repl_entry #1:1:10]
   # =>  1 │ {a: 1} | where a == 1
   # =>    ·          ──┬──
   # =>    ·            ╰── command doesn't support record<a: int> input
   # =>    ╰────
   ```

1. If some rows lack the column, the condition fails with `column_not_found`. Make the member optional with `?`, so missing values become `null`:

   ```nu
   [{a: 1} {b: 2}] | where a? == 1
   # => ╭───┬───╮
   # => │ # │ a │
   # => ├───┼───┤
   # => │ 0 │ 1 │
   # => ╰───┴───╯
   ```

1. Only rows for which the condition is exactly `true` are kept.

1. Row conditions are not limited to `where`. [`any`](/commands/docs/any.md), [`all`](/commands/docs/all.md), [`take while`](/commands/docs/take_while.md), [`take until`](/commands/docs/take_until.md), [`skip while`](/commands/docs/skip_while.md), [`skip until`](/commands/docs/skip_until.md) and [`chunk-by`](/commands/docs/chunk-by.md) accept them too, as well as closures:

   ```nu
   [1 2 3 4 1] | take while $it < 3
   # => ╭───┬───╮
   # => │ 0 │ 1 │
   # => │ 1 │ 2 │
   # => ╰───┴───╯
   ```

   ```nu
   [9 8 7 6] | enumerate | any item == index * 2
   # => true
   ```

1. `filter` still works, but the parser prints a deprecation warning:

   ```nu
   [1 2 3] | filter {|x| $x > 1}
   # => Warning: nu::parser::deprecated
   # =>
   # =>   ⚠ Command deprecated.
   # =>    ╭─[repl_entry #1:1:11]
   # =>  1 │ [1 2 3] | filter {|x| $x > 1}
   # =>    ·           ─────────┬─────────
   # =>    ·                    ╰── filter was deprecated in 0.105.0 and will be removed in a future release.
   # =>    ╰────
   # =>   help: `where` command can be used instead, as it can now read the predicate closure from a variable
   # =>
   # => ╭───┬───╮
   # => │ 0 │ 2 │
   # => │ 1 │ 3 │
   # => ╰───┴───╯
   ```
