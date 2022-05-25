---
title: dfr as
layout: command
version: 0.63.0
usage: |
  Creates an alias expression
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr as (Alias name)```

## Parameters

 -  `Alias name`: Alias name for the expression

## Examples

Creates and alias expression
```shell
> (dfr col a | df as new_a)
```
