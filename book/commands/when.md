---
title: when
version: 0.65.1
usage: |
  Creates and modifies a when expression
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> when (when expression) (then expression)```

## Parameters

 -  `when expression`: when expression used for matching
 -  `then expression`: expression that will be applied when predicate is true

## Examples

Create a when conditions
```shell
> when ((col a) > 2) 4
```

Create a when conditions
```shell
> when ((col a) > 2) 4 | when ((col a) < 0) 6
```

Create a new column for the dataframe
```shell
> [[a b]; [6 2] [1 4] [4 1]]
   | into lazy
   | with-column (
       when ((col a) > 2) 4 | otherwise 5 | as c
     )
   | with-column (
       when ((col a) > 5) 10 | when ((col a) < 2) 6 | otherwise 0 | as d
     )
   | collect
```
