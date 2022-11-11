---
title: par-each
categories: |
  filters
version: 0.71.0
filters: |
  Run a block on each element of input in parallel
usage: |
  Run a block on each element of input in parallel
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> par-each (block) --numbered```

## Parameters

 -  `block`: the block to run
 -  `--numbered`: iterate with an index

## Examples

Multiplies elements in list
```shell
> [1 2 3] | par-each { |it| 2 * $it }
```

Iterate over each element, print the matching value and its index
```shell
> [1 2 3] | par-each -n { |it| if $it.item == 2 { echo $"found 2 at ($it.index)!"} }
```
