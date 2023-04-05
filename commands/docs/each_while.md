---
title: each while
categories: |
  filters
version: 0.78.0
filters: |
  Run a block on each row of the input list until a null is found, then create a new list with the results.
usage: |
  Run a block on each row of the input list until a null is found, then create a new list with the results.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> each while (closure)```

## Parameters

 -  `closure`: the closure to run

## Examples

Produces a list of each element before the 3, doubled
```shell
> [1 2 3 2 1] | each while {|e| if $e < 3 { $e * 2 } }
╭───┬───╮
│ 0 │ 2 │
│ 1 │ 4 │
╰───┴───╯

```

Output elements until reaching 'stop'
```shell
> [1 2 stop 3 4] | each while {|e| if $e != 'stop' { $"Output: ($e)" } }
╭───┬───────────╮
│ 0 │ Output: 1 │
│ 1 │ Output: 2 │
╰───┴───────────╯

```

Iterate over each element, printing the matching value and its index
```shell
> [1 2 3] | enumerate | each while {|e| if $e.item < 2 { $"value ($e.item) at ($e.index)!"} }
╭───┬───────────────╮
│ 0 │ value 1 at 0! │
╰───┴───────────────╯

```
