---
title: each while
categories: |
  filters
version: 0.71.0
filters: |
  Run a block on each element of input until a null is found
usage: |
  Run a block on each element of input until a null is found
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> each while (block) --numbered```

## Parameters

 -  `block`: the block to run
 -  `--numbered`: iterate with an index

## Examples

Multiplies elements below three by two
```shell
> [1 2 3] | each while { |it| if $it < 3 { $it * 2 } else { null } }
```

Output elements till reaching 'stop'
```shell
> [1 2 stop 3 4] | each while { |it| if $it == 'stop' { null } else { $"Output: ($it)" } }
```

Iterate over each element, print the matching value and its index
```shell
> [1 2 3] | each while -n { |it| if $it.item < 2 { $"value ($it.item) at ($it.index)!"} else { null } }
```
