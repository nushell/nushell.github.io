---
title: nu-highlight
version: 0.64.0
usage: |
  Syntax highlight the input string.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> nu-highlight ```

## Examples

Describe the type of a string
```shell
> 'let x = 3' | nu-highlight
```
