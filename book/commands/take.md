---
title: take
version: 0.68.0
usage: |
  Take only the first n elements.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> take (n)```

## Parameters

 -  `n`: starting from the front, the number of elements to return

## Examples

Return the first item of a list/table
```shell
> [1 2 3] | take
```

Return the first 2 items of a list/table
```shell
> [1 2 3] | take 2
```
