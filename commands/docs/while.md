---
title: while
categories: |
  core
version: 0.76.0
core: |
  Conditionally run a block in a loop.
usage: |
  Conditionally run a block in a loop.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> while (cond) (block)```

## Parameters

 -  `cond`: condition to check
 -  `block`: block to loop if check succeeds

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Loop while a condition is true
```shell
> mut x = 0; while $x < 10 { $x = $x + 1 }
```
