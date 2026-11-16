# `each` and `par-each`

[`each`](/commands/docs/each.md) runs a closure on every item of a list (or every row of a table) and returns a list of the results. [`par-each`](/commands/docs/par-each.md) does the same, but runs the closure on several items at once.

## `each`

The closure receives the current item both as its parameter and as `$in`:

```nu
[1 2 3] | each {|x| $x * 10 }
# => ╭───┬────╮
# => │ 0 │ 10 │
# => │ 1 │ 20 │
# => │ 2 │ 30 │
# => ╰───┴────╯
[1 2 3] | each { $in * 10 }
# => ╭───┬────╮
# => │ 0 │ 10 │
# => │ 1 │ 20 │
# => │ 2 │ 30 │
# => ╰───┴────╯
```

For a table, each item is a row (a record):

```nu
[[name size]; [a 1kb] [b 2kb]] | each {|row| $"($row.name): ($row.size)" }
# => ╭───┬───────────╮
# => │ 0 │ a: 1.0 kB │
# => │ 1 │ b: 2.0 kB │
# => ╰───┴───────────╯
```

Some details of how `each` treats its input and output:

- When the closure returns `null`, the result is left out. Use `--keep-empty` (`-k`) to keep an empty cell instead:

  ```nu
  [1 2 3] | each {|x| if $x != 2 { $x * 10 } }
  # => ╭───┬────╮
  # => │ 0 │ 10 │
  # => │ 1 │ 30 │
  # => ╰───┴────╯
  [1 2 3] | each --keep-empty {|x| if $x != 2 { $x * 10 } }
  # => ╭───┬────╮
  # => │ 0 │ 10 │
  # => │ 1 │    │
  # => │ 2 │ 30 │
  # => ╰───┴────╯
  ```

- When the closure returns a list, the result is a list of lists. Use `--flatten` (`-f`) to get a single flat list:

  ```nu
  [a b] | each --flatten {|x| [$x $x] }
  # => ╭───┬───╮
  # => │ 0 │ a │
  # => │ 1 │ a │
  # => │ 2 │ b │
  # => │ 3 │ b │
  # => ╰───┴───╯
  ```

  `--flatten` also changes when results move on. Without it, a stream the closure returns is collected into one list before `each` passes it along. With it, each item goes to the next command as soon as the closure produces it:

  ```nu
  [a b] | each --flatten {|x| 1..2 | each {|n| print $"make ($x)($n)"; $"($x)($n)" } } | each {|v| print $"got ($v)" } | ignore
  # => make a1
  # => got a1
  # => make a2
  # => got a2
  # => make b1
  # => got b1
  # => make b2
  # => got b2
  ```

  Without `--flatten`, `make a1` and `make a2` both print before the second `each` gets anything, and then it gets them together as one list.

- A range is iterated like a list. A `null` input is returned unchanged, without running the closure.

- A string or byte stream, such as the output of an external command, is split into chunks of whatever size the data arrives in, not into lines. A short output is often one chunk. Use [`lines`](/commands/docs/lines.md) first to work line by line. The example runs the Unix `printf` command:

  ```nu
  ^printf "a\nb\n" | each {|chunk| $chunk | str length }
  # => ╭───┬───╮
  # => │ 0 │ 4 │
  # => ╰───┴───╯
  ^printf "a\nb\n" | lines | each {|line| $line | str length }
  # => ╭───┬───╮
  # => │ 0 │ 1 │
  # => │ 1 │ 1 │
  # => ╰───┴───╯
  ```

- A custom value that can be iterated, such as a [table from a SQLite file](./selecting_data.md#tables-from-a-sqlite-file), is treated as a list of its rows. A `matrix` value is rejected with an error that points to [`matrix map`](/commands/docs/matrix_map.md) and [`matrix reduce`](/commands/docs/matrix_reduce.md).

- `break` and `continue` cannot be used inside the closure (it is not a loop). Use [`for`](/commands/docs/for.md), or stop early with `take while` or [`each while`](/commands/docs/each_while.md), which stops at the first `null` result:

  ```nu
  [1 2 3 4] | each while {|x| if $x < 3 { $x * 10 } }
  # => ╭───┬────╮
  # => │ 0 │ 10 │
  # => │ 1 │ 20 │
  # => ╰───┴────╯
  ```

  `each while` takes less input than `each`: a list, a table, or a byte stream from an external command, which it splits into chunks the same way. A range, a `null` or any other single value is a type error.

## Indexes with `enumerate`

[`enumerate`](/commands/docs/enumerate.md) turns each item into a `{index, item}` record, so a closure after it can see the position. Because the column is named `index`, the table shows it in the `#` column. Input that isn't a list becomes a single row with index `0`, and `null` becomes an empty list:

```nu
"solo" | enumerate
# => ╭───┬──────╮
# => │ # │ item │
# => ├───┼──────┤
# => │ 0 │ solo │
# => ╰───┴──────╯
```

## Iterating over a record

`each`/`par-each` only iterates over list/table data. A record is a single value, so `each` runs the closure only once, with the whole record. To iterate over each key/value pair in a record, use [`items`](/commands/docs/items.md):

```nu
{a: 1, b: 2} | items {|key, value| $"($key)=($value)" }
# => ╭───┬─────╮
# => │ 0 │ a=1 │
# => │ 1 │ b=2 │
# => ╰───┴─────╯
```

`items` returns a list. To get a record back, use [`record each`](./record_commands.md#record-each) instead. Unlike `each`, `items` keeps a `null` result as an empty item, so the output always has one item per field. `$in` is empty inside the closure; use the two parameters:

```nu
{a: 1, b: 2} | items {|key, value| if $value > 1 { $key } }
# => ╭───┬───╮
# => │ 0 │   │
# => │ 1 │ b │
# => ╰───┴───╯
```

Or first pipe the record through `| transpose key value` to create a table of the keys/values.

Example:

```nu
{name: "Nushell", lang: "Rust", stars: 38000}
| transpose key value
| inspect
| each {|kv|
    $'The value of the "($kv.key)" field is "($kv.value)"'
  }
# => ╭─────────────┬───────────────────────────────────────────────╮
# => │ description │ table<key: string, value: oneof<string, int>> │
# => ├─────────────┴───────────────┬───────────────────────────────┤
# => │ key                         │ value                         │
# => ├─────────────────────────────┼───────────────────────────────┤
# => │ name                        │ Nushell                       │
# => │ lang                        │ Rust                          │
# => │ stars                       │ 38000                         │
# => ╰─────────────────────────────┴───────────────────────────────╯
# =>
# => ╭───┬────────────────────────────────────────────╮
# => │ 0 │ The value of the "name" field is "Nushell" │
# => │ 1 │ The value of the "lang" field is "Rust"    │
# => │ 2 │ The value of the "stars" field is "38000"  │
# => ╰───┴────────────────────────────────────────────╯
```

## `par-each`

`par-each` takes the same kind of closure as `each`, but runs it on several items in parallel using a thread pool. This helps when the closure does slow work, such as running an external command or reading files. For quick closures, `each` is usually just as fast.

- The results come back in whatever order they finish. Use `--keep-order` (`-k`) to get them in the order of the input.
- Use `--threads` (`-t`) to set the number of threads.

```nu
[1 2 3 4 5] | par-each --keep-order {|x| $x * 2 }
# => ╭───┬────╮
# => │ 0 │  2 │
# => │ 1 │  4 │
# => │ 2 │  6 │
# => │ 3 │  8 │
# => │ 4 │ 10 │
# => ╰───┴────╯
```

See also [Parallelism](/book/parallelism.md) in the Book.
