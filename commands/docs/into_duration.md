---
title: into duration
categories: |
  conversions
version: 0.76.1
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
```

Convert string to duration
```shell
> '7min' | into duration
```

Convert string to the requested duration as a string
```shell
> '7min' | into duration --convert sec
```

Convert duration to duration
```shell
> 420sec | into duration
```

Convert duration to the requested duration as a string
```shell
> 420sec | into duration --convert ms
```
