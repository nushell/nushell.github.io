---
title: return
categories: |
  core
version: 0.79.0
core: |
  Return early from a function.
usage: |
  Return early from a function.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> return (return_value)```

## Parameters

 -  `return_value`: optional value to return

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Return early
```shell
> def foo [] { return }

```
