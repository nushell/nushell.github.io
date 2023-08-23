---
title: dfr is-not-null
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Creates mask where value is not null.
usage: |
  Creates mask where value is not null.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr is-not-null ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Create mask where values are not null
```shell
> let s = ([5 6 0 8] | dfr into-df);
    let res = ($s / $s);
    $res | dfr is-not-null
╭───┬─────────────╮
│ # │ is_not_null │
├───┼─────────────┤
│ 0 │ true        │
│ 1 │ true        │
│ 2 │ false       │
│ 3 │ true        │
╰───┴─────────────╯

```

Creates a is not null expression from a column
```shell
> dfr col a | dfr is-not-null

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag