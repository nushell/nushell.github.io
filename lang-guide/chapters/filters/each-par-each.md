# `each` and `par-each`

TODO: Provide detail on the `each` command set

Note: `each`/`par-each` only iterates over list/table data. To iterate over each key/value pair in a record, first pipe the record through `| transpose key value` to create a table of the keys/values.

Example:

```nu
ls
| get 0
| transpose key value
| inspect
| each {|kv|
    $'The value of the "($kv.key)" field is "($kv.value)"'
  }
```

Result:

```nu
╭─────────────┬──────────────────────────────────╮
│ description │ list<any>                        │
├──────────┬──┴──────────────────────────────────┤
│ key      │ value                               │
├──────────┼─────────────────────────────────────┤
│ name     │ CNAME                               │
│ type     │ file                                │
│ size     │ 15                                  │
│ modified │ 2024-01-31T10:21:46.068408713-05:00 │
╰──────────┴─────────────────────────────────────╯

╭───┬───────────────────────────────────────────────────────────────────────────────────────╮
│ 0 │ The value of the "name" field is "CNAME"                                              │
│ 1 │ The value of the "type" field is "file"                                               │
│ 2 │ The value of the "size" field is "15 B"                                               │
│ 3 │ The value of the "modified" field is "Wed, 31 Jan 2024 10:21:46 -0500 (3 months ago)" │
╰───┴───────────────────────────────────────────────────────────────────────────────────────╯
```
