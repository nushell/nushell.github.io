---
title: dfr contains
categories: |
  dataframe
version: 0.77.0
dataframe: |
  Checks if a pattern is contained in a string.
usage: |
  Checks if a pattern is contained in a string.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr contains ```

## Examples

Returns boolean indicating if pattern was found
```shell
> [abc acb acb] | dfr into-df | dfr contains ab
╭───┬───────╮
│ # │   0   │
├───┼───────┤
│ 0 │ true  │
│ 1 │ false │
│ 2 │ false │
╰───┴───────╯

```
