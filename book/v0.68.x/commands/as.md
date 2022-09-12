---
title: as
version: 0.68.0
usage: |
  Creates an alias expression
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> as (Alias name)```

## Parameters

 -  `Alias name`: Alias name for the expression

## Examples

Creates and alias expression
```shell
> col a | as new_a | into nu
```
