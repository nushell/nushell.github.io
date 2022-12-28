---
title: fill-null
categories: |
  lazyframe
version: 0.73.1
lazyframe: |
  Replaces NULL values with the given expression
usage: |
  Replaces NULL values with the given expression
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> fill-null ```

## Examples

Fills the null values by 0
```shell
> [1 2 2 3 3] | into df | shift 2 | fill-null 0
```
