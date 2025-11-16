---
head: [[meta, {name: draft}]]
---
# Understanding the difference between `get` and `select`

`get` extracts the value and returns a single value or array if multiple keys have been specified.
```nu
~> {a: 1, b: 2, c: 3} | get b
2
~> {a: 1, b: 2, c: 3} | get b c
╭───┬───╮
│ 0 │ 2 │
│ 1 │ 3 │
╰───┴───╯
```

`select` returns a record without the other values.
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
