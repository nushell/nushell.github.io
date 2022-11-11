---
title: lines
categories: |
  filters
version: 0.71.0
filters: |
  Converts input to lines
usage: |
  Converts input to lines
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> lines --skip-empty```

## Parameters

 -  `--skip-empty`: skip empty lines

## Examples

Split multi-line string into lines
```shell
> echo $"two\nlines" | lines
```
