---
title: dfr when
categories: |
  expression
version: 0.84.0
expression: |
  Creates and modifies a when expression.
usage: |
  Creates and modifies a when expression.
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr when (when expression) (then expression)```

## Parameters

 -  `when expression`: when expression used for matching
 -  `then expression`: expression that will be applied when predicate is true


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Create a when conditions
```shell
> dfr when ((dfr col a) > 2) 4

```

Create a when conditions
```shell
> dfr when ((dfr col a) > 2) 4 | dfr when ((dfr col a) < 0) 6

```

Create a new column for the dataframe
```shell
> [[a b]; [6 2] [1 4] [4 1]]
   | dfr into-lazy
   | dfr with-column (
    dfr when ((dfr col a) > 2) 4 | dfr otherwise 5 | dfr as c
     )
   | dfr with-column (
    dfr when ((dfr col a) > 5) 10 | dfr when ((dfr col a) < 2) 6 | dfr otherwise 0 | dfr as d
     )
   | dfr collect
╭───┬───┬───┬───┬────╮
│ # │ a │ b │ c │ d  │
├───┼───┼───┼───┼────┤
│ 0 │ 6 │ 2 │ 4 │ 10 │
│ 1 │ 1 │ 4 │ 5 │  6 │
│ 2 │ 4 │ 1 │ 4 │  0 │
╰───┴───┴───┴───┴────╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag