---
title: dfr get-year
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Gets year from date.
usage: |
  Gets year from date.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr get-year ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Returns year from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | dfr into-df);
    $df | dfr get-year
╭───┬──────╮
│ # │  0   │
├───┼──────┤
│ 0 │ 2020 │
│ 1 │ 2020 │
╰───┴──────╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag