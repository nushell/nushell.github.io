---
title: dfr concat-str
categories: |
  expression
version: 0.76.0
expression: |
  Creates a concat string expression
usage: |
  Creates a concat string expression
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr concat-str ```

## Examples

Creates a concat string expression
```shell
> let df = ([[a b c]; [one two 1] [three four 2]] | dfr into-df);
    $df | dfr with-column ((dfr concat-str "-" [(dfr col a) (dfr col b) ((dfr col c) * 2)]) | dfr as concat)
```
