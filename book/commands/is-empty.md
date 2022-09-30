---
title: is-empty
version: 0.69.1
usage: |
  Check for empty values.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
