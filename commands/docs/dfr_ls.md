---
title: dfr ls
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Lists stored dataframes.
usage: |
  Lists stored dataframes.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr ls ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Creates a new dataframe and shows it in the dataframe list
```shell
> let test = ([[a b];[1 2] [3 4]] | dfr into-df);
    ls

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag