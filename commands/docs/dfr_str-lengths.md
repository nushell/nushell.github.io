---
title: dfr str-lengths
categories: |
  dataframe
version: 0.81.0
dataframe: |
  Get lengths of all strings.
usage: |
  Get lengths of all strings.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr str-lengths ```

## Examples

Returns string lengths
```shell
> [a ab abc] | dfr into-df | dfr str-lengths
╭───┬───╮
│ # │ 0 │
├───┼───┤
│ 0 │ 1 │
│ 1 │ 2 │
│ 2 │ 3 │
╰───┴───╯

```
