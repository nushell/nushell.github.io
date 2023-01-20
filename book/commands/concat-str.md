---
title: concat-str
categories: |
  expression
version: 0.74.0
expression: |
  Creates a concat string expression
usage: |
  Creates a concat string expression
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> concat-str ```

## Examples

Creates a concat string expression
```shell
> let df = ([[a b c]; [one two 1] [three four 2]] | into df);
    $df | with-column ((concat-str "-" [(col a) (col b) ((col c) * 2)]) | as concat)
```
