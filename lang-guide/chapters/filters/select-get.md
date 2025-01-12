# Understanding the difference between `get` and `select`

### Get

Extract data using a cell path.

This is equivalent to using the cell path access syntax: `$env.OS` is the same as `$env | get OS`.

If multiple cell paths are given, this will produce a list of values.

```nu
'{"name":"Alice","job":"Engineer"}'
| from json
| get name
| describe
# => string
```

### Select

Select only these columns or rows from the input. Opposite of `reject`.

This differs from `get` in that, rather than accessing the given value in the data structure, it removes all non-selected values from the structure.

Hence, using `select` on a table will produce a table, a list will produce a list, and a record will produce a record.

```nu
'{"name":"Alice","job":"Engineer"}'
| from json
| select name
| describe
# => record<name: string>
```
