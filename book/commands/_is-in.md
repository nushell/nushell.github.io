---
title: is-in
version: 0.69.1
usage: |
  Checks if elements from a series are contained in right series
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> is-in (other)```

## Parameters

 -  `other`: right series

## Examples

Checks if elements from a series are contained in right series
```shell
> let other = ([1 3 6] | into df);
    [5 6 6 6 8 8 8] | into df | is-in $other
```
