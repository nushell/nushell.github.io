---
title: rotate
version: 0.67.0
usage: |
  Rotates a table clockwise (default) or counter-clockwise (use --ccw flag).
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> rotate ...rest --ccw```

## Parameters

 -  `...rest`: the names to give columns once rotated
 -  `--ccw`: rotate counter clockwise

## Examples

Rotate 2x2 table clockwise
```shell
> [[a b]; [1 2]] | rotate
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
