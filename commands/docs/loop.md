---
title: loop
categories: |
  core
version: 0.76.0
core: |
  Run a block in a loop.
usage: |
  Run a block in a loop.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> loop (block)```

## Parameters

 -  `block`: block to loop

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Loop while a condition is true
```shell
> mut x = 0; loop { if $x > 10 { break }; $x = $x + 1 }; $x
```
