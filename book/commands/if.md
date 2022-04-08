---
title: if
layout: command
version: 0.60.1
usage: |
  Conditionally run a block.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> if (cond) (then_block) (else_expression)```

## Parameters

 -  `cond`: condition to check
 -  `then_block`: block to run if check succeeds
 -  `else_expression`: expression or block to run if check fails

## Notes
```text
This command is a parser keyword. For details, check
https://www.nushell.sh/book/thinking_in_nushell.html#parsing-and-evaluation-are-different-stages
```
## Examples

Output a value if a condition matches, otherwise return nothing
```shell
> if 2 < 3 { 'yes!' }
```

Output a value if a condition matches, else return another value
```shell
> if 5 < 3 { 'yes!' } else { 'no!' }
```

Chain multiple if's together
```shell
> if 5 < 3 { 'yes!' } else if 4 < 5 { 'no!' } else { 'okay!' }
```
