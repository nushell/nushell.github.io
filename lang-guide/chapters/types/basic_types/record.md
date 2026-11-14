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

A field's value is a single word, just like a [list item](list.md#expressions-in-a-list-literal). In `{a: 1 + 1}`, the value of `a` is `1`, and Nushell then reads `+` as the next key:

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
