---
title: dfr is-in
categories: |
  expression
version: 0.84.0
expression: |
  Creates an is-in expression.
usage: |
  Creates an is-in expression.
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr is-in (list)```

## Parameters

 -  `list`: List to check if values are in


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Creates a is-in expression
```shell
> let df = ([[a b]; [one 1] [two 2] [three 3]] | dfr into-df);
    $df | dfr with-column (dfr col a | dfr is-in [one two] | dfr as a_in)
╭───┬───────┬───┬───────╮
│ # │   a   │ b │ a_in  │
├───┼───────┼───┼───────┤
│ 0 │ one   │ 1 │ true  │
│ 1 │ two   │ 2 │ true  │
│ 2 │ three │ 3 │ false │
╰───┴───────┴───┴───────╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag