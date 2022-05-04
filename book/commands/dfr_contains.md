---
title: dfr contains
layout: command
version: 0.62.0
usage: |
  Checks if a pattern is contained in a string
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr contains (pattern)```

## Parameters

 -  `pattern`: Regex pattern to be searched

## Examples

Returns boolean indicating if pattern was found
```shell
> [abc acb acb] | dfr to-df | dfr contains ab
```
