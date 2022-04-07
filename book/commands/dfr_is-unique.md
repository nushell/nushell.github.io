---
title: dfr is-unique
layout: command
version: 0.60.1
usage: |
  Creates mask indicating unique values
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr is-unique ```

## Examples

Create mask indicating unique values
```shell
> [5 6 6 6 8 8 8] | dfr to-df | dfr is-unique
```
