---
title: dfr cache
categories: |
  lazyframe
version: 0.84.0
lazyframe: |
  Caches operations in a new LazyFrame
usage: |
  Caches operations in a new LazyFrame
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr cache ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Caches the result into a new LazyFrame
```shell
> [[a b]; [6 2] [4 2] [2 2]] | dfr into-df | dfr reverse | dfr cache

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag