---
title: sort-by
version: 0.65.1
usage: |
  sorts a lazy dataframe based on expression(s)
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> sort-by ...sort expression --reverse```

## Parameters

 -  `...sort expression`: sort expression for the dataframe
 -  `--reverse {list<bool>}`: Reverse sorting. Default is false

## Examples

Sort dataframe by one column
```shell
> [[a b]; [6 2] [1 4] [4 1]] | into df | sort-by a
```

Sort column using two columns
```shell
> [[a b]; [6 2] [1 1] [1 4] [2 4]] | into df | sort-by [a b] -r [false true]
```
