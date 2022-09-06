---
title: is-in
version: 0.67.1
usage: |
  Creates an is-in expression
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> is-in (list)```

## Parameters

 -  `list`: List to check if values are in

## Examples

Creates a is-in expression
```shell
> let df = ([[a b]; [one 1] [two 2] [three 3]] | into df);
    $df | with-column (col a | is-in [one two] | as a_in)
```
