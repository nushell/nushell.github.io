---
title: dfr fetch
categories: |
  lazyframe
version: 0.84.0
lazyframe: |
  collects the lazyframe to the selected rows.
usage: |
  collects the lazyframe to the selected rows.
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr fetch (rows)```

## Parameters

 -  `rows`: number of rows to be fetched from lazyframe


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Fetch a rows from the dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | dfr into-df | dfr fetch 2
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 6 │ 2 │
│ 1 │ 4 │ 2 │
╰───┴───┴───╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag