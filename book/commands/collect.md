---
title: collect
categories: |
  filters
  lazyframe
version: 0.74.0
filters: |
  Collect the stream and pass it to a block.
lazyframe: |
  Collect lazy dataframe into eager dataframe
usage: |
  Collect the stream and pass it to a block.
  Collect lazy dataframe into eager dataframe
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> collect (closure) --keep-env```

## Parameters

 -  `closure`: the closure to run once the stream is collected
 -  `--keep-env`: let the block affect environment variables

## Examples

Use the second value in the stream
```shell
> [1 2 3] | collect { |x| $x.1 }
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> collect ```

## Examples

drop duplicates
```shell
> [[a b]; [1 2] [3 4]] | into lazy | collect
```
