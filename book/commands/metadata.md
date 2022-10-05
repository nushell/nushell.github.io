---
title: metadata
version: 0.69.1
core: |
  Get the metadata for items in the stream
usage: |
  Get the metadata for items in the stream
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

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
