---
title: headers
categories: |
  filters
version: 0.83.0
filters: |
  Use the first row of the table as column names.
usage: |
  Use the first row of the table as column names.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> headers ```

## Examples

Sets the column names for a table created by `split column`
```shell
> "a b c|1 2 3" | split row "|" | split column " " | headers
╭───┬───┬───┬───╮
│ # │ a │ b │ c │
├───┼───┼───┼───┤
│ 0 │ 1 │ 2 │ 3 │
╰───┴───┴───┴───╯

```

Columns which don't have data in their first row are removed
```shell
> "a b c|1 2 3|1 2 3 4" | split row "|" | split column " " | headers
╭───┬───┬───┬───╮
│ # │ a │ b │ c │
├───┼───┼───┼───┤
│ 0 │ 1 │ 2 │ 3 │
│ 1 │ 1 │ 2 │ 3 │
╰───┴───┴───┴───╯

```
