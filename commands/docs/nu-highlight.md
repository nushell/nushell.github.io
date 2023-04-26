---
title: nu-highlight
categories: |
  strings
version: 0.79.0
strings: |
  Syntax highlight the input string.
usage: |
  Syntax highlight the input string.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> nu-highlight ```

## Examples

Describe the type of a string
```shell
> 'let x = 3' | nu-highlight

```
