---
title: cache
categories: |
  lazyframe
version: 0.73.1
lazyframe: |
  Caches operations in a new LazyFrame
usage: |
  Caches operations in a new LazyFrame
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> cache ```

## Examples

Caches the result into a new LazyFrame
```shell
> [[a b]; [6 2] [4 2] [2 2]] | into df | reverse | cache
```
