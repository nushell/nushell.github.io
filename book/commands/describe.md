---
title: describe
layout: command
version: 0.60.0
usage: |
  Describe the value(s) piped in.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> describe ```

## Examples

Describe the type of a string
```shell
> 'hello' | describe
```
