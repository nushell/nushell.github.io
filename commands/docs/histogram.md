---
title: histogram
categories: |
  default
version: 0.83.0
default: |
  Creates a new table with a histogram based on the column name passed in.
usage: |
  Creates a new table with a histogram based on the column name passed in.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> histogram (column-name) (frequency-column-name) --percentage-type```

## Parameters

 -  `column-name`: column name to calc frequency, no need to provide if input is just a list
 -  `frequency-column-name`: histogram's frequency column, default to be frequency column output
 -  `--percentage-type {string}`: percentage calculate method, can be 'normalize' or 'relative', in 'normalize', defaults to be 'normalize'

## Examples

Compute a histogram of file types
```shell
> ls | histogram type

```

Compute a histogram for the types of files, with frequency column named freq
```shell
> ls | histogram type freq

```

Compute a histogram for a list of numbers
```shell
> [1 2 1] | histogram
╭───┬───────┬───────┬──────────┬────────────┬────────────────────────────────────────────────────────────────────╮
│ # │ value │ count │ quantile │ percentage │                             frequency                              │
├───┼───────┼───────┼──────────┼────────────┼────────────────────────────────────────────────────────────────────┤
│ 0 │     1 │     2 │     0.67 │ 66.67%     │ ****************************************************************** │
│ 1 │     2 │     1 │     0.33 │ 33.33%     │ *********************************                                  │
╰───┴───────┴───────┴──────────┴────────────┴────────────────────────────────────────────────────────────────────╯

```

Compute a histogram for a list of numbers, and percentage is based on the maximum value
```shell
> [1 2 3 1 1 1 2 2 1 1] | histogram --percentage-type relative

```
