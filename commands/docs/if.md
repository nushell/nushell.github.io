---
title: if
categories: |
  core
version: 0.81.0
core: |
  Conditionally run a block.
usage: |
  Conditionally run a block.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> if (cond) (then_block) (else_expression)```

## Parameters

 -  `cond`: condition to check
 -  `then_block`: block to run if check succeeds
 -  `else_expression`: expression or block to run if check fails

## Examples

Output a value if a condition matches, otherwise return nothing
```shell
> if 2 < 3 { 'yes!' }
yes!
```

Output a value if a condition matches, else return another value
```shell
> if 5 < 3 { 'yes!' } else { 'no!' }
no!
```

Chain multiple if's together
```shell
> if 5 < 3 { 'yes!' } else if 4 < 5 { 'no!' } else { 'okay!' }
no!
```
