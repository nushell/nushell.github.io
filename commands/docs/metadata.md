---
title: metadata
categories: |
  debug
version: 0.79.0
debug: |
  Get the metadata for items in the stream.
usage: |
  Get the metadata for items in the stream.
---

# <code>{{ $frontmatter.title }}</code> for debug

<div class='command-title'>{{ $frontmatter.debug }}</div>

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
