---
title: to json
version: 0.69.1
formats: |
  Converts table data into JSON text.
usage: |
  Converts table data into JSON text.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.formats }}</div>

## Signature

```> to json --raw --indent --tabs```

## Parameters

 -  `--raw`: remove all of the whitespace
 -  `--indent {number}`: specify indentation width
 -  `--tabs {number}`: specify indentation tab quantity

## Examples

Outputs a JSON string, with default indentation, representing the contents of this table
```shell
> [a b c] | to json
```

Outputs a JSON string, with 4-space indentation, representing the contents of this table
```shell
> [Joe Bob Sam] | to json -i 4
```

Outputs an unformatted JSON string representing the contents of this table
```shell
> [1 2 3] | to json -r
```
