---
title: par-each
categories: |
  filters
version: 0.75.0
filters: |
  Run a closure on each row of the input list in parallel, creating a new list with the results.
usage: |
  Run a closure on each row of the input list in parallel, creating a new list with the results.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> par-each (closure) --numbered```

## Parameters

 -  `closure`: the closure to run
 -  `--numbered`: iterate with an index (deprecated; use a two-parameter closure instead)

## Examples

Multiplies each number. Note that the list will become arbitrarily disordered.
```shell
> [1 2 3] | par-each { 2 * $in }
```

Iterate over each element, print the matching value and its index
```shell
> [1 2 3] | par-each -n { |it| if $it.item == 2 { $"found 2 at ($it.index)!"} }
```
