# Boolean

|                       |                                                             |
| --------------------- | ----------------------------------------------------------- |
| **_Description:_**    | A logical data type that can have only True or False values |
| **_Annotation:_**     | `bool`                                                      |
| **_Literal syntax:_** | Either a literal `true` or `false`                          |
| **_Casts:_**          | [`into bool`](/commands/docs/into_bool.md)                  |
| **_See also:_**       | [Types of Data - Booleans](/book/types_of_data.md#booleans) |

## Common commands that can be used with `bool`

- `if`, `while`
- `match` (in clauses where the expression matches the clause expression, or the `_` value which is always true)

- `is-empty`, `is-not-empty` (see [`length` and `is-empty`](../../filters/summarizing_lists.md#length-and-is-empty))
- `is-admin`
- `is-terminal`

The following commands take a closure (or a row condition) as their main argument. The return value from the closure must be a boolean:

- `where`
- `any`, `all`, `skip until`, `skip while`, `take until`, `take while`
- `record where`, which tests each field of a record

[`chunk-by`](/commands/docs/chunk-by.md) also accepts a row condition, but its closure doesn't have to return a boolean. It starts a new chunk whenever the returned value changes.

## Common operators that can be used with `bool`

- `==`, `!=`, `<`, `<=`, `>`, `>=`. When ordered, `false` comes before `true`, so `false < true` is `true`.
- `and`, `or`, `xor`, `not`
- `in`, `not-in`, `has` and `not-has`, to test whether a list holds a bool, as in `true in [true false]`

The regex operators `=~` and `!~` (also spelled `like` and `not-like`), and `starts-with` and `ends-with`, return a bool, but they compare strings. A bool operand is a parse error, as in `true =~ "t"`. See [Comparison Operators](../../operators.md#comparison-operators).

## Short-circuit evaluation

`and` and `or` short-circuit: the right-hand operand is only evaluated when the left-hand operand doesn't already decide the result. With `and`, the right-hand side is skipped when the left-hand side is `false`; with `or`, it is skipped when the left-hand side is `true`.

```nu
def check [] { print "check was called"; true }

false and (check)
# => false

true or (check)
# => true

true and (check)
# => check was called
# => true
```

This means a condition can guard an expression that would otherwise fail:

```nu
let text = ""
($text != "") and (($text | split chars | last) == "%")
# => false
```

## Converting to `bool`

[`into bool`](/commands/docs/into_bool.md) turns numbers and strings into booleans. The strings `true` and `false` convert in any letter case, with or without whitespace around them. A string that holds a number gives `false` for zero and `true` for anything else. Any other string is an error, with the help text 'the strings "true" and "false" can be converted into a bool'.

`--relaxed` accepts every string. Then only `""`, `"0"` and `"false"`, again ignoring case and whitespace, are `false`, and every other string is `true`, including `"no"` and `"0.0"`:

```nu
['true' ' FALSE ' '1' '-1' '0.0' 'yes' ''] | each {|s| {text: $s, default: (try { $s | into bool } catch { 'error' }), relaxed: ($s | into bool --relaxed)} }
# => ╭───┬─────────┬─────────┬─────────╮
# => │ # │  text   │ default │ relaxed │
# => ├───┼─────────┼─────────┼─────────┤
# => │ 0 │ true    │ true    │ true    │
# => │ 1 │  FALSE  │ false   │ false   │
# => │ 2 │ 1       │ true    │ true    │
# => │ 3 │ -1      │ true    │ true    │
# => │ 4 │ 0.0     │ false   │ true    │
# => │ 5 │ yes     │ error   │ true    │
# => │ 6 │         │ error   │ false   │
# => ╰───┴─────────┴─────────┴─────────╯
```

`null` is an error, except with `--relaxed`, which turns it into `false`. A bool comes back unchanged.

`0` and `0.0` are `false`. Other ints, negative ones included, are `true`, and so is `0.5`:

```nu
[0 7 -7 0.5 0.0] | each {|n| {value: $n, bool: ($n | into bool)} }
# => ╭───┬───────┬───────╮
# => │ # │ value │ bool  │
# => ├───┼───────┼───────┤
# => │ 0 │     0 │ false │
# => │ 1 │     7 │ true  │
# => │ 2 │    -7 │ true  │
# => │ 3 │  0.50 │ true  │
# => │ 4 │  0.00 │ false │
# => ╰───┴───────┴───────╯
```

Other types, such as file sizes, dates, lists or records, can't be converted, even with `--relaxed`. Given a list, `into bool` converts each item, so `[1 0 'true'] | into bool` gives `true`, `false` and `true`. For a table or record, name the columns to convert after the command. The other columns stay as they are:

```nu
[[name enabled]; [a 'yes'] [b '0']] | into bool --relaxed enabled
# => ╭───┬──────┬─────────╮
# => │ # │ name │ enabled │
# => ├───┼──────┼─────────┤
# => │ 0 │ a    │ true    │
# => │ 1 │ b    │ false   │
# => ╰───┴──────┴─────────╯
```

A table or record without column names is an error, because each row is a record and a record can't be converted.
