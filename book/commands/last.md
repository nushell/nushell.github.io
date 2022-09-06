---
title: last
version: 0.67.1
usage: |
  Show only the last number of rows.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> last (rows)```

## Parameters

 -  `rows`: starting from the back, the number of rows to return

## Examples

Get the last 2 items
```shell
> [1,2,3] | last 2
```

Get the last item
```shell
> [1,2,3] | last
```
