# List

|                       |                                                                                 |
| --------------------- | ------------------------------------------------------------------------------- |
| **_Description:_**    | Ordered sequence of zero or more values of any type                             |
| **_Annotation:_**     | `list`                                                                          |
| **_Literal syntax:_** | See below                                                                       |
| **_Casts:_**          | N/A                                                                             |
| **_See Also:_**       | [Working with Lists](/book/working_with_lists.md)                               |
|                       | [Navigating and Accessing Structured Data](/book/navigating_structured_data.md) |
|                       | [Types of Data - Lists](/book/types_of_data.md#lists)                           |

## List-literal Syntax

List syntax is very similar to that of arrays in JSON. However, commas are _not_ required to separate values when Nushell can easily distinguish them. The values of a list may be delimited by:

- Commas

  ```nu
  [ foo, bar, baz ]
  # => ╭───┬─────╮
  # => │ 0 │ foo │
  # => │ 1 │ bar │
  # => │ 2 │ baz │
  # => ╰───┴─────╯
  ```

- Spaces (when unambiguous):

  ```nu
  [ foo bar baz ]
  # => ╭───┬─────╮
  # => │ 0 │ foo │
  # => │ 1 │ bar │
  # => │ 2 │ baz │
  # => ╰───┴─────╯
  ```

- Line breaks:

  ```nu
  [
    foo
    bar
    baz
  ]
  # => ╭───┬─────╮
  # => │ 0 │ foo │
  # => │ 1 │ bar │
  # => │ 2 │ baz │
  # => ╰───┴─────╯
  ```

## Additional Language Notes

1. A list is like a vector or array list in other languages.
2. A list uses 0-based indexing to retrieve values.

## Common commands that can be used with `list`

Since lists, records and tables form the backbone of Nushell's structured nature,
there are too many commands to list here. Here are a few:

- `any`
- `all`
- `get`
- `select`
- `each`, `par-each`, `where`, `reduce`
- `skip`, `skip until`, `skip while`, `take`, `take until`, `take while`
- `first`, `last`, `length`
- `insert`, `update`, `upsert`, `append`
  See also the `to (subcommands)` and `from (subcommands)` for more examples.
- `where`
- `match`
  - Can destructure a list

## Common operators that can be used with `list`

- `in` and `has` for set membership (`12 in [1 2 3]` and `[1 2 3] has 12` are equivalent)
  - `not-in` and `not-has` for inverse set membership (`12 not-in [1 2 3]` is the same as `not (12 in [1 2 3])`)
- `++` to concatenate two lists

  ```nu
  [1 2] ++ [3 4] | to nuon
  # => [1, 2, 3, 4]
  ```

  Both operands must be lists. To add a single value, use `append` (or wrap the value in a list: `$list ++ [$value]`).
