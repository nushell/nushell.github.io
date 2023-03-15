---
title: dfr as
categories: |
  expression
version: 0.77.0
expression: |
  Creates an alias expression.
usage: |
  Creates an alias expression.
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr as ```

## Examples

Creates and alias expression
```shell
> dfr col a | dfr as new_a | dfr into-nu
╭───────┬────────────────────╮
│       │ ╭───────┬────────╮ │
│ expr  │ │ expr  │ column │ │
│       │ │ value │ a      │ │
│       │ ╰───────┴────────╯ │
│ alias │ new_a              │
╰───────┴────────────────────╯
```
