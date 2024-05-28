# List

What it is: Basic collection of values ordered by their insertion.

Annotation: `list`

A list is like a vector or array list in other languages.

0-based indexing to retrieve values.

Lists use either commas or spaces to delimit values.

Examples of lists:

```nu
[1, 2, 3]
[1 2 3]
[1,2,3]
```

Effectively, commas in the above are treated like spaces.

Lists can span multiple lines to enumerate values. For example, this is equivalent to `[1, 2, 3]`:

```nu
[
1
2
3
]
```

## Commands that use list

Since lists, records and tables form the backbone of Nushell's structured nature,
there are too many commands to list here.

Here are a few

- `any`
- `all`
- `get`
- `select`
- `get`
- `each`, `par-each`, `filter`, `reduce`
- `skip`, `skip until`, `skip while`, `take`, `take until`, `take while`
- `first`, `last`, `length`
- `insert`, `update`, `upsert`, `append`
  See also the `to (subcommands)` and `from (subcommands)` for more examples.
- `where`
- `match`
  - Can destructure a list

## Operators that use list

- in For set membership
  - `not (12 in [1 2 3])` for inverse set membership
