---
title: dfr get-week
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Gets week from date.
usage: |
  Gets week from date.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr get-week ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Returns week from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | dfr into-df);
    $df | dfr get-week
╭───┬────╮
│ # │ 0  │
├───┼────┤
│ 0 │ 32 │
│ 1 │ 32 │
╰───┴────╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag