# `for`

`for` runs a block once for each item of a list, table, range or stream, with the item bound to a loop variable.

```text
for <variable> in <value> { <block> }
```

See also: [`for` command help](/commands/docs/for.md) and [Control Flow - `for`](/book/control_flow.md#for) in the Book.

```nu
for x in [1 2 3] { $x * $x | print }
# => 1
# => 4
# => 9
```

## What `for` iterates over

| Value after `in`                | Iterations                                                  |
| ------------------------------- | ----------------------------------------------------------- |
| A list                          | One for each item                                           |
| A table                         | One for each row, as a record                               |
| A range such as `1..5` or `1..` | One for each number the range produces                      |
| A list stream                   | One for each item, as the item arrives                      |
| `null`                          | None                                                        |
| Any other value                 | One, with the whole value (a record, a string, binary data) |

## Language Notes

1. A record is a single value, so the loop runs once with the whole record. To loop over its fields, turn it into a table with [`transpose`](/commands/docs/transpose.md), or use [`items`](/commands/docs/items.md) instead of `for`:

   ```nu
   for x in {name: nu, version: 117} { print ($x | describe) }
   # => record<name: string, version: int>
   ```

   ```nu
   let config = {name: nu, version: 117}
   for entry in ($config | transpose key value) {
     print $"($entry.key) = ($entry.value)"
   }
   # => name = nu
   # => version = 117
   ```

1. A string, a number or binary data also runs the block once. `null` runs it zero times, so a value that may be missing needs no special case:

   ```nu
   for x in 42 { print $x }; for x in null { print "never runs" }
   # => 42
   ```

1. `for` takes the items of a stream one at a time, as they are produced. Each item is processed before the next one is produced:

   ```nu
   for x in (1..3 | each {|i| print $"producing ($i)"; $i }) { print $"got ($x)" }
   # => producing 1
   # => got 1
   # => producing 2
   # => got 2
   # => producing 3
   # => got 3
   ```

   A range is not turned into a list first either, so a range without an end, such as `1..`, works when the block leaves with [`break`](./break.md):

   ```nu
   for x in 1.. {
     if $x > 3 { break }
     print $x
   }
   # => 1
   # => 2
   # => 3
   ```

1. The output of an external command is a byte stream, not a list. Split it with [`lines`](/commands/docs/lines.md) to loop over its lines. Without `lines`, the output goes straight to the terminal and the block doesn't run:

   ```nu
   for line in (^printf "a\nb\n" | lines) { print $"line: ($line)" }
   # => line: a
   # => line: b
   ```

1. To get the index of each item as well, loop over the output of [`enumerate`](/commands/docs/enumerate.md):

   ```nu
   for item in ([a b] | enumerate) { print $"($item.index): ($item.item)" }
   # => 0: a
   # => 1: b
   ```

1. Like [`while`](./while.md) and [`loop`](./loop.md), `for` is a statement. It evaluates to `nothing`, the values of its block are discarded, and it can't be used in a pipeline. Its block can update `mut` variables from the enclosing scope, but the loop variable itself can't be assigned:

   ```nu
   mut total = 0
   for x in [1 2 3] { $total += $x }
   $total
   # => 6
   ```

   To collect a result for each item, use [`each`](/commands/docs/each.md), which is an expression. See [Loops](/book/control_flow.md#loops) in the Book for when to choose each one.

1. The loop variable can have a type annotation, as in `for x: int in $numbers`. Nushell doesn't check the items against it; see [Control Flow - `for`](/book/control_flow.md#for).
