---
title: str upcase
version: 0.66.1
usage: |
  Make text uppercase
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> str upcase ...rest```

## Parameters

 -  `...rest`: optionally upcase text by column paths

## Examples

Upcase contents
```shell
> 'nu' | str upcase
```
