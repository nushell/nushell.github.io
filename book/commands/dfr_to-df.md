---
title: dfr to-df
layout: command
version: 0.63.0
usage: |
  Converts a List, Table or Dictionary into a dataframe
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr to-df ```

## Examples

Takes a dictionary and creates a dataframe
```shell
> [[a b];[1 2] [3 4]] | dfr to-df
```

Takes a list of tables and creates a dataframe
```shell
> [[1 2 a] [3 4 b] [5 6 c]] | dfr to-df
```

Takes a list and creates a dataframe
```shell
> [a b c] | dfr to-df
```

Takes a list of booleans and creates a dataframe
```shell
> [true true false] | dfr to-df
```
