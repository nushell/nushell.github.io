---
title: str upcase
categories: |
  default
version: 0.83.0
default: |
  Make text uppercase.
usage: |
  Make text uppercase.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> str upcase ...rest```

## Parameters

 -  `...rest`: For a data structure input, convert strings at the given cell paths

## Examples

Upcase contents
```shell
> 'nu' | str upcase
NU
```
