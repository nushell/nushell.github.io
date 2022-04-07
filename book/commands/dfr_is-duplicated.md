---
title: dfr is-duplicated
layout: command
version: 0.60.1
usage: |
  Creates mask indicating duplicated values
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr is-duplicated ```

## Examples

Create mask indicating duplicated values
```shell
> [5 6 6 6 8 8 8] | dfr to-df | dfr is-duplicated
```
