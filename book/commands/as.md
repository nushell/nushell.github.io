---
title: as
categories: |
  expression
version: 0.73.1
expression: |
  Creates an alias expression
usage: |
  Creates an alias expression
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> as ```

## Examples

Creates and alias expression
```shell
> col a | as new_a | into nu
```
