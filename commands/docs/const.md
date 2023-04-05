---
title: const
categories: |
  core
version: 0.78.0
core: |
  Create a parse-time constant.
usage: |
  Create a parse-time constant.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> const (const_name) (initial_value)```

## Parameters

 -  `const_name`: constant name
 -  `initial_value`: equals sign followed by constant value

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Create a new parse-time constant.
```shell
> const x = 10

```

Create a composite constant value
```shell
> const x = { a: 10, b: 20 }

```
