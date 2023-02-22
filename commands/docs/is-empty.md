---
title: is-empty
categories: |
  filters
version: 0.76.0
filters: |
  Check for empty values.
usage: |
  Check for empty values.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> is-empty ...rest```

## Parameters

 -  `...rest`: the names of the columns to check emptiness

## Examples

Check if a string is empty
```shell
> '' | is-empty
```

Check if a list is empty
```shell
> [] | is-empty
```

Check if more than one column are empty
```shell
> [[meal size]; [arepa small] [taco '']] | is-empty meal size
```
