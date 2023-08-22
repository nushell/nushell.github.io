---
title: into duration
categories: |
  conversions
version: 0.83.2
conversions: |
  Convert value to duration.
usage: |
  Convert value to duration.
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into duration ...rest```

## Parameters

 -  `...rest`: for a data structure input, convert data at the given cell paths


## Input/output types:

| input    | output   |
| -------- | -------- |
| duration | duration |
| string   | duration |
| table    | table    |
## Examples

Convert duration string to duration value
```shell
> '7min' | into duration
7min
```

Convert compound duration string to duration value
```shell
> '1day 2hr 3min 4sec' | into duration
1day 2hr 3min 4sec
```

Convert table of duration strings to table of duration values
```shell
> [[value]; ['1sec'] ['2min'] ['3hr'] ['4day'] ['5wk']] | into duration value
╭───┬───────╮
│ # │ value │
├───┼───────┤
│ 0 │  1sec │
│ 1 │  2min │
│ 2 │   3hr │
│ 3 │  4day │
│ 4 │   5wk │
╰───┴───────╯

```

Convert duration to duration
```shell
> 420sec | into duration
7min
```

## Notes
Max duration value is i64::MAX nanoseconds; max duration time unit is wk (weeks).