---
title: into duration
version: 0.70.0
conversions: |
  Convert value to duration
usage: |
  Convert value to duration
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into duration ...rest --convert```

## Parameters

 -  `...rest`: column paths to convert to duration (for table input)
 -  `--convert {string}`: convert duration into another duration

## Notes
```text
into duration does not take leap years into account and every month is calculated with 30 days
```
## Examples

Convert string to duration in table
```shell
> echo [[value]; ['1sec'] ['2min'] ['3hr'] ['4day'] ['5wk']] | into duration value
```

Convert string to duration
```shell
> '7min' | into duration
```

Convert string to the requested duration as a string
```shell
> '7min' | into duration --convert sec
```

Convert duration to the requested duration as a string
```shell
> 420sec | into duration --convert min
```
