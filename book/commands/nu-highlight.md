---
title: nu-highlight
version: 0.69.1
strings: |
  Syntax highlight the input string.
usage: |
  Syntax highlight the input string.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.strings }}</div>

## Signature

```> nu-highlight ```

## Examples

Describe the type of a string
```shell
> 'let x = 3' | nu-highlight
```
