---
title: metadata
version: 0.67.0
usage: |
  Get the metadata for items in the stream
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> metadata (expression)```

## Parameters

 -  `expression`: the expression you want metadata for

## Examples

Get the metadata of a variable
```shell
> metadata $a
```

Get the metadata of the input
```shell
> ls | metadata
```
