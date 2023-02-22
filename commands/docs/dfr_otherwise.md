---
title: dfr otherwise
categories: |
  expression
version: 0.76.0
expression: |
  completes a when expression
usage: |
  completes a when expression
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr otherwise ```

## Examples

Create a when conditions
```shell
> dfr when ((dfr col a) > 2) 4 | dfr otherwise 5
```

Create a when conditions
```shell
> dfr when ((dfr col a) > 2) 4 | dfr when ((dfr col a) < 0) 6 | dfr otherwise 0
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
```
