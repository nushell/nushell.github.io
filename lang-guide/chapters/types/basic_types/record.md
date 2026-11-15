# Record

|                       |                                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| **_Description:_**    | The foundational associative map. Holds key-value pairs, which associate string keys with various data values. |
| **_Annotation:_**     | `record`                                                                                                       |
| **_Literal syntax:_** | See below                                                                                                      |
| **_Casts:_**          | [`into record`](/commands/docs/into_record.md), [`wrap`](/commands/docs/wrap.md)                               |
| **_See Also:_**       | [Working with Records](/book/working_with_records.md)                                                          |
|                       | [Navigating and Accessing Structured Data](/book/navigating_structured_data.md)                                |
|                       | [Types of Data - Records](/book/types_of_data.md#records)                                                      |

# Language Notes

- The keys maintain the order of insertion or the order defined in a record literal.
- Keys are guaranteed to be unique. Defining the same key twice in a record literal is an error (`nu::shell::column_defined_twice`), and `insert` refuses to add a key that already exists (`nu::shell::column_already_exists`). Use `upsert`, `update` or `merge` to replace the value of an existing key:

  ```nu
  {a: 1, b: 2} | merge {a: 5}
  # => ╭───┬───╮
  # => │ a │ 5 │
  # => │ b │ 2 │
  # => ╰───┴───╯
  ```

(TBD: complex hashable/equality checkable keys)

# Record-Literal Syntax

Record syntax is very similar to objects in JSON. However, commas are _not_ required to separate values when Nushell can easily distinguish them. The key-value pairs of a record may be delimited by:

- Commas

  ```nu
  {name: "Sam", rank: 10}
  # => ╭──────┬─────╮
  # => │ name │ Sam │
  # => │ rank │ 10  │
  # => ╰──────┴─────╯
  ```

- Spaces (when unambiguous):

  ```nu
  {name: "Sam" rank: 10}
  # => ╭──────┬─────╮
  # => │ name │ Sam │
  # => │ rank │ 10  │
  # => ╰──────┴─────╯
  ```

- Line breaks:

  ```nu
  {
    name: "Sam"
    rank: 10
  }
  # => ╭──────┬─────╮
  # => │ name │ Sam │
  # => │ rank │ 10  │
  # => ╰──────┴─────╯
  ```

As in lists, extra commas are ignored: `{a: 1,, b: 2,}` is `{a: 1, b: 2}`.

## Expressions in a record literal

A field's value is a single word, like a [list item](list.md#expressions-in-a-list-literal). In `{a: 1 + 1}`, the value of `a` is `1`, and Nushell then reads `+` as the next key:

```nu
{a: 1 + 1}
# => Error: nu::parser::error
# =>
# =>   × Expected `:` after record key
# =>    ╭─[repl_entry #1:1:9]
# =>  1 │ {a: 1 + 1}
# =>    ·         ┬
# =>    ·         ╰── expected `:`, found `1`
# =>    ╰────
# =>   help: Record fields look like `key: value`. A missing colon often causes
# =>         this field to be parsed as a block or closure.
```

Wrap the expression in parentheses:

```nu
{a: (1 + 1)}
# => ╭───┬───╮
# => │ a │ 2 │
# => ╰───┴───╯
```

## No field shorthand

JavaScript lets you write `{a}` for `{a: a}`. Nushell has no such shorthand, and every field needs a key and a colon. Braces holding only a variable, such as `{$a}`, are a closure that returns `$a`:

```nu
let a = 1
{$a} | describe
# => closure
```

When the braces also hold a real field, the missing colon is an error. `{a: 1, b}` and `{a: 1, $b}` both fail with "Incomplete record field". Write the key out instead: `{a: $a, b: $b}`.

## Converting to a record

[`into record`](/commands/docs/into_record.md) builds a record from a list in one of two shapes. A list of two-item lists gives one field per pair, with the first item as the key. A list of records merges them into one record:

```nu
[[name Ann] [city Oslo]] | into record
# => ╭──────┬──────╮
# => │ name │ Ann  │
# => │ city │ Oslo │
# => ╰──────┴──────╯
[{a: 1, b: 2} {b: 3, c: 4}] | into record
# => ╭───┬───╮
# => │ a │ 1 │
# => │ b │ 3 │
# => │ c │ 4 │
# => ╰───┴───╯
```

When a key comes up twice, the later value wins, as `b` shows. A table is a list of records, so a one-row table becomes that row, and a longer table collapses into one record holding the last value of each column. `null` items are skipped, and an empty list gives an empty record.

A pair's key is converted to a string, so `[[1 one] [true yes]]` gives the keys `1` and `true`. A key that can't be a string, such as `null` or a list, is an error. The list has to keep to one shape. Mixing pairs and records is a "Type mismatch" error that names the item that broke the pattern, and an inner list with more or fewer than two items is an "Incorrect value" error such as "expected inner list with two elements, but found 3 element(s)".

`into record` also takes a value apart into its components:

- A date gives `year`, `month`, `day`, `hour`, `minute`, `second`, `millisecond`, `microsecond` and `nanosecond` as ints, and `timezone` as a string such as `+02:00`. Each sub-second field holds only its own three digits, so `.123456789` seconds is 123 milliseconds, 456 microseconds and 789 nanoseconds.
- A duration gives one field for each unit it uses, from `week` down to `nanosecond`, and a `sign` field of `+` or `-`. Units that are zero are left out, and the largest unit is `week`: `90min` gives `{hour: 1, minute: 30, sign: +}`. A zero duration gives `{second: 0, sign: +}`.
- A `semver` gives the six fields described in [SemVer](../other_types/custom_value.md#semver), plus `pre_identifiers` and `build_identifiers`, which split the pre-release and build metadata at the dots and turn numeric parts into ints. `"1.2.3-rc.1" | into semver | into record | get pre_identifiers` is `[rc, 1]`.

[`into datetime`](/commands/docs/into_datetime.md), [`into duration`](/commands/docs/into_duration.md) and [`into semver`](/commands/docs/into_semver.md) accept these records, so you can change one component and convert back:

```nu
2024-01-02T03:04:05+02:00 | into record | update day 9 | into datetime | format date '%F %T %:z'
# => 2024-01-09 03:04:05 +02:00
```

A record passes through unchanged. Any other input, such as a string, is an error.

## Common commands that can be used with `record`

Since the record data type is foundational to Nushell's structured nature, many commands use records as inputs or as parameters. See the list of commands for tables as many of those also take records.

Here are a few commands that use records:

- `get`
- `insert`
- `merge`
- `update`
- `upsert`

The `record` subcommands take a record and return a record, without converting it to a table and back. Given a table, they work on each row. See [Transforming Records](/book/working_with_records.md#transforming-records) in the Book.

- `record where`: keep the fields for which a row condition on `key` and `value`, or a closure, is true
- `record each`: build a new record from the records a closure returns for each field
- `record walk`: run a closure on every nested value, rebuilding the record from the results
- `record apply`: run a record of closures on the fields with the same names
