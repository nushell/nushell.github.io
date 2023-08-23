---
title: dfr replace
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Replace the leftmost (sub)string by a regex pattern.
usage: |
  Replace the leftmost (sub)string by a regex pattern.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr replace --pattern --replace```

## Parameters

 -  `--pattern {string}`: Regex pattern to be matched
 -  `--replace {string}`: replacing string


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Replaces string
```shell
> [abc abc abc] | dfr into-df | dfr replace -p ab -r AB
╭───┬─────╮
│ # │  0  │
├───┼─────┤
│ 0 │ ABc │
│ 1 │ ABc │
│ 2 │ ABc │
╰───┴─────╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag