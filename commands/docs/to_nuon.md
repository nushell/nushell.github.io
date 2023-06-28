---
title: to nuon
categories: |
  experimental
version: 0.82.1
experimental: |
  Converts table data into Nuon (Nushell Object Notation) text.
usage: |
  Converts table data into Nuon (Nushell Object Notation) text.
---

# <code>{{ $frontmatter.title }}</code> for experimental

<div class='command-title'>{{ $frontmatter.experimental }}</div>

## Signature

```> to nuon --raw --indent --tabs```

## Parameters

 -  `--raw` `(-r)`: remove all of the whitespace (default behaviour and overwrites -i and -t)
 -  `--indent {number}`: specify indentation width
 -  `--tabs {number}`: specify indentation tab quantity

## Examples

Outputs a NUON string representing the contents of this list, compact by default
```shell
> [1 2 3] | to nuon
[1, 2, 3]
```

Outputs a NUON array of integers, with pretty indentation
```shell
> [1 2 3] | to nuon --indent 2
[
  1,
  2,
  3
]
```

Overwrite any set option with --raw
```shell
> [1 2 3] | to nuon --indent 2 --raw
[1, 2, 3]
```

A more complex record with multiple data types
```shell
> {date: 2000-01-01, data: [1 [2 3] 4.56]} | to nuon --indent 2
{
  date: 2000-01-01T00:00:00+00:00,
  data: [
    1,
    [
      2,
      3
    ],
    4.56
  ]
}
```
