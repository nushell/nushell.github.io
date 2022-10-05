---
title: str upcase
version: 0.69.1
default: |
  Make text uppercase
usage: |
  Make text uppercase
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> str upcase ...rest```

## Parameters

 -  `...rest`: optionally upcase text by column paths

## Examples

Upcase contents
```shell
> 'nu' | str upcase
```
