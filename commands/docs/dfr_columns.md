---
title: dfr columns
categories: |
  dataframe
version: 0.82.1
dataframe: |
  Show dataframe columns.
usage: |
  Show dataframe columns.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr columns ```

## Examples

Dataframe columns
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr columns
╭───┬───╮
│ 0 │ a │
│ 1 │ b │
╰───┴───╯

```
