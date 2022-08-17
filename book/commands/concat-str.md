---
title: concat-str
version: 0.67.0
usage: |
  Creates a concat string expression
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> concat-str (separator) (concat expressions)```

## Parameters

 -  `separator`: Separator used during the concatenation
 -  `concat expressions`: Expression(s) that define the string concatenation

## Examples

Creates a concat string expression
```shell
> let df = ([[a b c]; [one two 1] [three four 2]] | into df);
    $df | with-column ((concat-str "-" [(col a) (col b) ((col c) * 2)]) | as concat)
```
