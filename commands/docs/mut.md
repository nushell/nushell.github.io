---
title: mut
categories: |
  core
version: 0.77.0
core: |
  Create a mutable variable and give it a value.
usage: |
  Create a mutable variable and give it a value.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> mut (var_name) (initial_value)```

## Parameters

 -  `var_name`: variable name
 -  `initial_value`: equals sign followed by value

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Set a mutable variable to a value, then update it
```shell
> mut x = 10; $x = 12

```

Upsert a value inside a mutable data structure
```shell
> mut a = {b:{c:1}}; $a.b.c = 2

```

Set a mutable variable to the result of an expression
```shell
> mut x = 10 + 100

```

Set a mutable variable based on the condition
```shell
> mut x = if false { -1 } else { 1 }

```
