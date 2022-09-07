---
title: seq char
version: 0.68.0
usage: |
  Print sequence of chars
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> seq char ...rest --separator --terminator```

## Parameters

 -  `...rest`: sequence chars
 -  `--separator {string}`: separator character (defaults to \n)
 -  `--terminator {string}`: terminator character (defaults to \n)

## Examples

sequence a to e with newline separator
```shell
> seq char a e
```

sequence a to e with pipe separator separator
```shell
> seq char -s '|' a e
```
