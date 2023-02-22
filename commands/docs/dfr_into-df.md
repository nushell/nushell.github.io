---
title: dfr into-df
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Converts a list, table or record into a dataframe
usage: |
  Converts a list, table or record into a dataframe
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr into-df ```

## Examples

Takes a dictionary and creates a dataframe
```shell
> [[a b];[1 2] [3 4]] | dfr into-df
```

Takes a list of tables and creates a dataframe
```shell
> [[1 2 a] [3 4 b] [5 6 c]] | dfr into-df
```

Takes a list and creates a dataframe
```shell
> [a b c] | dfr into-df
```

Takes a list of booleans and creates a dataframe
```shell
> [true true false] | dfr into-df
```
