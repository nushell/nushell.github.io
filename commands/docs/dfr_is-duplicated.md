---
title: dfr is-duplicated
categories: |
  dataframe
version: 0.83.0
dataframe: |
  Creates mask indicating duplicated values.
usage: |
  Creates mask indicating duplicated values.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr is-duplicated ```

## Examples

Create mask indicating duplicated values
```shell
> [5 6 6 6 8 8 8] | dfr into-df | dfr is-duplicated
╭───┬───────────────╮
│ # │ is_duplicated │
├───┼───────────────┤
│ 0 │ false         │
│ 1 │ true          │
│ 2 │ true          │
│ 3 │ true          │
│ 4 │ true          │
│ 5 │ true          │
│ 6 │ true          │
╰───┴───────────────╯

```

Create mask indicating duplicated rows in a dataframe
```shell
> [[a, b]; [1 2] [1 2] [3 3] [3 3] [1 1]] | dfr into-df | dfr is-duplicated
╭───┬───────────────╮
│ # │ is_duplicated │
├───┼───────────────┤
│ 0 │ true          │
│ 1 │ true          │
│ 2 │ true          │
│ 3 │ true          │
│ 4 │ false         │
╰───┴───────────────╯

```
