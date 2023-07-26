---
title: dfr into-nu
categories: |
  expression
version: 0.83.0
expression: |
  Convert expression into a nu value for access and exploration.
usage: |
  Convert expression into a nu value for access and exploration.
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr into-nu ```

## Examples

Convert a col expression into a nushell value
```shell
> dfr col a | dfr into-nu
╭───────┬────────╮
│ expr  │ column │
│ value │ a      │
╰───────┴────────╯
```
