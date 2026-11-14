# `std/iter`

The `std/iter` module has commands for working through lists, in the style of the iterator functions of other languages. They are prefixed with `iter` so they don't clash with built-in commands such as [`find`](/commands/docs/find.md). Import the module without a glob to keep the prefix:

```nu
use std/iter
```

Each command takes a list or a range as input, and most of them take a closure.

[[toc]]

## `iter find`

`iter find` returns the first item for which the closure returns `true`, or `null` if there is none:

```nu
["shell" "abc" "around" "nushell"] | iter find {|e| $e starts-with "a" }
# => abc
```

An error inside the closure counts as `false` for that item, and so does a result that isn't a boolean. The search goes on with the next item:

```nu
[1 "two" 3 4] | iter find {|e| $e mod 2 == 0 }
# => 4
```

Here `"two" mod 2` is an error, so `"two"` is skipped. The same leniency hides mistakes. A closure that never returns a boolean makes `iter find` return `null` for every input.

## `iter find-index`

`iter find-index` works like `iter find` but returns the index of the first matching item:

```nu
[a b c] | iter find-index {|x| $x == "b" }
# => 1
```

When nothing matches, it returns `null`. Its help text has an example whose result is `-1`, but in Nushell 0.117.0 the command never returns `-1`:

```nu
[3 5 13 91] | iter find-index {|x| $x mod 2 == 0 } | describe
# => nothing
```

## `iter intersperse`

`iter intersperse` puts a separator between each pair of neighboring items:

```nu
[1 2 3 4] | iter intersperse 0 | to nuon
# => [1, 0, 2, 0, 3, 0, 4]
```

A list with one item or none comes back unchanged. The separator can be any value. To join strings with a separator into one string, use [`str join`](/commands/docs/str_join.md) instead.

## `iter scan`

`iter scan` works like [`reduce`](/commands/docs/reduce.md) but returns every intermediate result instead of only the last one. The closure receives the current item first and the accumulator second. The accumulator is also its pipeline input, `$in`, so `{|x| $in + $x }` works as well as `{|x, acc| $acc + $x }`. What the closure returns becomes the next accumulator.

Without `--fold`, the first item is the starting accumulator, and it is also the first item of the result:

```nu
[1 2 3 4] | iter scan {|x, acc| $acc + $x } | to nuon
# => [1, 3, 6, 10]
```

`--fold` (`-f`) gives the starting accumulator. It becomes the first item of the result, so the result is one item longer than the input:

```nu
[a b c] | iter scan --fold "" {|x, acc| $acc + $x } | to nuon
# => ["", a, ab, abc]
```

An empty input gives an empty list without `--fold`, and a list holding only the `--fold` value with it. The starting value can't be `null`. `--fold null` counts as no `--fold` at all, and `-f null` fails with `The initial value is missing`.

## `iter filter-map`

`iter filter-map` calls the closure on each item and keeps the results, except `null` results and errors, which it drops. Use it to transform items and skip the ones that don't fit in one step:

```nu
[2 5 "4" 7] | iter filter-map {|e| $e ** 2 } | to nuon
# => [4, 25, 49]
[{a: 1} {b: 2} {a: 3}] | iter filter-map {|r| $r.a? } | to nuon
# => [1, 3]
```

Only `null` is dropped. A result of `false` or `0` stays in the list.

## `iter flat-map`

`iter flat-map` calls the closure on each item and flattens the lists it returns into one list. It is the same as [`each --flatten`](/commands/docs/each.md) with the closure:

```nu
1..3 | iter flat-map {|e| 0..<$e | each { $e } } | to nuon
# => [1, 2, 2, 3, 3, 3]
```

## `iter zip-with`

`iter zip-with` pairs each item of the input with the item at the same position in another list, as [`zip`](/commands/docs/zip.md) does, and then calls the closure with the two items as its two parameters. It returns the closure's results:

```nu
[1 2 3] | iter zip-with [10 20 30] {|a, b| $a + $b } | to nuon
# => [11, 22, 33]
```

As with `zip`, the result is as long as the shorter of the two.

## `iter zip-into-record`

`iter zip-into-record` uses the input items as keys and the items of another list as values. Despite its name, it returns a table with one row, not a record:

```nu
[name size] | iter zip-into-record [report.txt 12kb]
# => ╭───┬────────────┬─────────╮
# => │ # │    name    │  size   │
# => ├───┼────────────┼─────────┤
# => │ 0 │ report.txt │ 12.0 kB │
# => ╰───┴────────────┴─────────╯
```

Add `| first` to get the record. Keys that aren't strings are converted to strings, the extra items of the longer list are dropped, and if a key appears twice, the later value wins.
