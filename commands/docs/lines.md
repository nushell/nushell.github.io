---
title: lines
categories: |
  filters
version: 0.80.0
filters: |
  Converts input to lines.
usage: |
  Converts input to lines.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> lines --skip-empty```

## Parameters

 -  `--skip-empty` `(-s)`: skip empty lines

## Examples

Split multi-line string into lines
```shell
> $"two\nlines" | lines
╭───┬───────╮
│ 0 │ two   │
│ 1 │ lines │
╰───┴───────╯

```
