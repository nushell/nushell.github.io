---
title: dfr get
layout: command
version: 0.59.1
usage: |
  Creates dataframe with the selected columns
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr get ...rest```

## Parameters

 -  `...rest`: column names to sort dataframe

## Examples

Creates dataframe with selected columns
```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr get a
```
