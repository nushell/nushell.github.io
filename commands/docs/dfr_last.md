---
title: dfr last
categories: |
  expression
version: 0.83.0
expression: |
  creates a last expression
usage: |
  creates a last expression
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr last ```

## Examples

Creates a last expression from a column
```shell
> dfr col a | dfr last

```
