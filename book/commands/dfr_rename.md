---
title: dfr rename
layout: command
version: 0.62.0
usage: |
  Renames a series
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr rename (name)```

## Parameters

 -  `name`: new series name

## Examples

Renames a series
```shell
> [5 6 7 8] | dfr to-df | dfr rename new_name
```
