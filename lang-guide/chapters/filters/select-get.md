---
head: [[meta, {name: draft}]]
---
# Understanding the difference between `get` and `select`

`get` extracts the value and returns a single value or list if multiple keys have been specified.
```nu
~> {a: 1, b: 2, c: 3} | get b
2
~> {a: 1, b: 2, c: 3} | get b c
╭───┬───╮
│ 0 │ 2 │
│ 1 │ 3 │
╰───┴───╯
```

`select` maintains the nushell values and returns the records selected by column name or key.
```nu
~> {a: 1, b: 2, c: 3} | select b
╭───┬───╮
│ b │ 2 │
╰───┴───╯
~> {a: 1, b: 2, c: 3} | select b c
╭───┬───╮
│ b │ 2 │
│ c │ 3 │
╰───┴───╯
```
