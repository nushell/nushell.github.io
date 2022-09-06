---
title: lines
version: 0.67.1
usage: |
  Converts input to lines
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> lines --skip-empty```

## Parameters

 -  `--skip-empty`: skip empty lines

## Examples

Split multi-line string into lines
```shell
> echo $'two(char nl)lines' | lines
```
