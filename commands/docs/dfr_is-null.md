---
title: dfr is-null
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Creates mask where value is null.
usage: |
  Creates mask where value is null.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr is-null ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Create mask where values are null
```shell
> let s = ([5 6 0 8] | dfr into-df);
    let res = ($s / $s);
    $res | dfr is-null
╭───┬─────────╮
│ # │ is_null │
├───┼─────────┤
│ 0 │ false   │
│ 1 │ false   │
│ 2 │ true    │
│ 3 │ false   │
╰───┴─────────╯

```

Creates a is null expression from a column
```shell
> dfr col a | dfr is-null

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag