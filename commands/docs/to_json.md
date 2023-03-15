---
title: to json
categories: |
  formats
version: 0.77.0
formats: |
  Converts table data into JSON text.
usage: |
  Converts table data into JSON text.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> to json --raw --indent --tabs```

## Parameters

 -  `--raw` `(-r)`: remove all of the whitespace
 -  `--indent {number}`: specify indentation width
 -  `--tabs {number}`: specify indentation tab quantity

## Examples

Outputs a JSON string, with default indentation, representing the contents of this table
```shell
> [a b c] | to json
[
  "a",
  "b",
  "c"
]
```

Outputs a JSON string, with 4-space indentation, representing the contents of this table
```shell
> [Joe Bob Sam] | to json -i 4
[
    "Joe",
    "Bob",
    "Sam"
]
```

Outputs an unformatted JSON string representing the contents of this table
```shell
> [1 2 3] | to json -r
[1,2,3]
```
