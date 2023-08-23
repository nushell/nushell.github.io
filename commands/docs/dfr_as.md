---
title: dfr as
categories: |
  expression
version: 0.84.0
expression: |
  Creates an alias expression.
usage: |
  Creates an alias expression.
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr as (Alias name)```

## Parameters

 -  `Alias name`: Alias name for the expression


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

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


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag