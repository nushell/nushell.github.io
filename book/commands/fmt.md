---
title: fmt
version: 0.69.1
conversions: |
  Format a number
usage: |
  Format a number
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.conversions }}</div>

## Signature

```> fmt ```

## Examples

Get a record containing multiple formats for the number 42
```shell
> 42 | fmt
```
