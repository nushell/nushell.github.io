---
title: into duration
categories: |
  conversions
version: 0.78.0
conversions: |
  Convert value to duration.
usage: |
  Convert value to duration.
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into duration ...rest --convert```

## Parameters

 -  `...rest`: for a data structure input, convert data at the given cell paths
 -  `--convert {string}`: convert duration into another duration

## Notes
This command does not take leap years into account, and every month is assumed to have 30 days.
## Examples

Convert string to duration in table
```shell
> [[value]; ['1sec'] ['2min'] ['3hr'] ['4day'] ['5wk']] | into duration value
╭───┬─────────────╮
│ # │    value    │
├───┼─────────────┤
│ 0 │        1sec │
│ 1 │        2min │
│ 2 │         3hr │
│ 3 │        4day │
│ 4 │ 1month 5day │
╰───┴─────────────╯

```

Convert string to duration
```shell
> '7min' | into duration
7min
```

Convert string to the requested duration as a string
```shell
> '7min' | into duration --convert sec
420 sec
```

Convert duration to duration
```shell
> 420sec | into duration
7min
```

Convert duration to the requested duration as a string
```shell
> 420sec | into duration --convert ms
420000 ms
```

Convert µs duration to the requested duration as a string
```shell
> 1000000µs | into duration --convert sec
1 sec
```

Convert duration to the µs duration as a string
```shell
> 1sec | into duration --convert µs
1000000 µs
```

Convert duration to µs as a string if unit asked for was us
```shell
> 1sec | into duration --convert us
1000000 µs
```
