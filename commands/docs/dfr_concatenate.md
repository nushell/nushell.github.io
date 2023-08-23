---
title: dfr concatenate
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Concatenates strings with other array.
usage: |
  Concatenates strings with other array.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr concatenate (other)```

## Parameters

 -  `other`: Other array with string to be concatenated


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Concatenate string
```shell
> let other = ([za xs cd] | dfr into-df);
    [abc abc abc] | dfr into-df | dfr concatenate $other
╭───┬───────╮
│ # │   0   │
├───┼───────┤
│ 0 │ abcza │
│ 1 │ abcxs │
│ 2 │ abccd │
╰───┴───────╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag