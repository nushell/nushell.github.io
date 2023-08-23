---
title: dfr collect
categories: |
  lazyframe
version: 0.84.0
lazyframe: |
  Collect lazy dataframe into eager dataframe.
usage: |
  Collect lazy dataframe into eager dataframe.
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr collect ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

drop duplicates
```shell
> [[a b]; [1 2] [3 4]] | dfr into-lazy | dfr collect
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ 2 │
│ 1 │ 3 │ 4 │
╰───┴───┴───╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag