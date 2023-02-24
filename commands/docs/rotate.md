---
title: rotate
categories: |
  filters
version: 0.76.0
filters: |
  Rotates a table or record clockwise (default) or counter-clockwise (use --ccw flag).
usage: |
  Rotates a table or record clockwise (default) or counter-clockwise (use --ccw flag).
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> rotate ...rest --ccw```

## Parameters

 -  `...rest`: the names to give columns once rotated
 -  `--ccw` `(-)`: rotate counter clockwise

## Examples

Rotate a record clockwise, producing a table (like `transpose` but with column order reversed)
```shell
> {a:1, b:2} | rotate
```

Rotate 2x3 table clockwise
```shell
> [[a b]; [1 2] [3 4] [5 6]] | rotate
```

Rotate table clockwise and change columns names
```shell
> [[a b]; [1 2]] | rotate col_a col_b
```

Rotate table counter clockwise
```shell
> [[a b]; [1 2]] | rotate --ccw
```

Rotate table counter-clockwise
```shell
> [[a b]; [1 2] [3 4] [5 6]] | rotate --ccw
```

Rotate table counter-clockwise and change columns names
```shell
> [[a b]; [1 2]] | rotate --ccw col_a col_b
```
