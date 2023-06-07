---
title: for
categories: |
  core
version: 0.81.0
core: |
  Loop over a range.
usage: |
  Loop over a range.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> for (var_name) (range) (block) --numbered```

## Parameters

 -  `var_name`: name of the looping variable
 -  `range`: range of the loop
 -  `block`: the block to run
 -  `--numbered` `(-n)`: return a numbered item ($it.index and $it.item)

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Echo the square of each integer
```shell
> for x in [1 2 3] { print ($x * $x) }

```

Work with elements of a range
```shell
> for $x in 1..3 { print $x }

```

Number each item and echo a message
```shell
> for $it in ['bob' 'fred'] --numbered { print $"($it.index) is ($it.item)" }

```
