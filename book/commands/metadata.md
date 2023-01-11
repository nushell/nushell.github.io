---
title: metadata
categories: |
  core
version: 0.74.0
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
> let a = 42; metadata $a
```

Get the metadata of the input
```shell
> ls | metadata
```
