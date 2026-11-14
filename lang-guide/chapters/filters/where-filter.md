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

A bare word on either side of `and`, `or` or `xor`, or after `not`, is a column too, so a `bool` column can be used as a condition by itself:

```nu
[{name: a, done: true, urgent: true} {name: b, done: false, urgent: true} {name: c, done: false, urgent: false}] | where not done and urgent
# => ╭───┬──────┬───────┬────────╮
# => │ # │ name │ done  │ urgent │
# => ├───┼──────┼───────┼────────┤
# => │ 0 │ b    │ false │ true   │
# => ╰───┴──────┴───────┴────────╯
```

Variables from the surrounding scope can be used on either side: `let limit = 2; $list | where $it > $limit`.

A row condition is syntax, not a value. It cannot be stored in a variable; use a closure for that.

Only a bare word written directly in the row condition becomes a column. Inside parentheses, a bare word is a command name again, so `where (size > 1kb)` tries to run a command called `size`. Use `$it` there:

```nu
[[name size]; [a.txt 2kb] [b.md 10b] [c.txt 5kb]] | where ($it.size > 1kb and ($it.name | str ends-with .txt))
# => ╭───┬───────┬────────╮
# => │ # │ name  │  size  │
# => ├───┼───────┼────────┤
# => │ 0 │ a.txt │ 2.0 kB │
# => │ 1 │ c.txt │ 5.0 kB │
# => ╰───┴───────┴────────╯
```

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

A closure body is ordinary code, so nothing in it is expanded to a column, and `$it` isn't defined there. Use the parameter or `$in` instead:

```nu
[[name size]; [a.txt 2kb] [b.md 10b]] | where {|row| $it.size > 1kb }
# => Error: nu::shell::variable_not_found
# =>
# =>   × Variable not found
# =>    ╭─[repl_entry #1:1:54]
# =>  1 │ [[name size]; [a.txt 2kb] [b.md 10b]] | where {|row| $it.size > 1kb }
# =>    ·                                                      ─┬─
# =>    ·                                                       ╰── variable not found
# =>    ╰────
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

1. A `null` from an optional member like `a?` behaves differently depending on the operator:

   - `<`, `<=`, `>` and `>=` return `null`, so the row is dropped without an error.
   - `==` and `!=` return a `bool`, so `where a? == null` keeps the rows that lack `a`.
   - `null` on the item side of `in` or `not-in` is fine when the right side is a list.
   - The other operators raise an error: arithmetic (`+`, `-`, `*`, `/`, `//`, `mod`, `**`), `++`, the bit operators, `=~`, `!~`, `starts-with`, `ends-with`, `and`, `or` and `xor`. So does `not null` (it can't convert `nothing` to a `bool`), and `null` as the collection of `in`, `not-in`, `has` or `not-has`.

   The first rule can turn into the last one. `size? > 1` is `null` for a row without `size`, and `null or ...` is an error:

   ```nu
   [{name: x, size: 5} {name: y} {name: z, size: 0}] | where size? > 1 or name == z
   # => Error: nu::shell::operator_unsupported_type
   # =>
   # =>   × The 'or' operator does not work on values of type 'nothing'.
   # =>    ╭─[repl_entry #1:1:59]
   # =>  1 │ [{name: x, size: 5} {name: y} {name: z, size: 0}] | where size? > 1 or name == z
   # =>    ·                                                           ────┬──── ─┬
   # =>    ·                                                               │      ╰── does not support 'nothing'
   # =>    ·                                                               ╰── nothing
   # =>    ╰────
   ```

   Give the missing value a default first:

   ```nu
   [{name: x, size: 5} {name: y} {name: z, size: 0}] | where ($it.size? | default 0) > 1 or name == z
   # => ╭───┬──────┬──────╮
   # => │ # │ name │ size │
   # => ├───┼──────┼──────┤
   # => │ 0 │ x    │    5 │
   # => │ 1 │ z    │    0 │
   # => ╰───┴──────┴──────╯
   ```

1. Row conditions are not limited to `where`. [`any`](/commands/docs/any.md), [`all`](/commands/docs/all.md), [`take while`](/commands/docs/take_while.md), [`take until`](/commands/docs/take_until.md), [`skip while`](/commands/docs/skip_while.md), [`skip until`](/commands/docs/skip_until.md), [`chunk-by`](/commands/docs/chunk-by.md) and [`record where`](/commands/docs/record_where.md) accept them too, as well as closures. In `record where`, the row is a `{key, value}` record for each field (see [`record` commands](./record_commands.md)):

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
