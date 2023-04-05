---
title: dfr replace
categories: |
  dataframe
version: 0.78.0
dataframe: |
  Replace the leftmost (sub)string by a regex pattern.
usage: |
  Replace the leftmost (sub)string by a regex pattern.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr replace ```

## Examples

Replaces string
```shell
> [abc abc abc] | dfr into-df | dfr replace -p ab -r AB
╭───┬─────╮
│ # │  0  │
├───┼─────┤
│ 0 │ ABc │
│ 1 │ ABc │
│ 2 │ ABc │
╰───┴─────╯

```
