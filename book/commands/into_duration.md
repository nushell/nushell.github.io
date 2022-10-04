---
title: into duration
version: 0.69.1
conversions: |
  Convert value to duration
usage: |
  Convert value to duration
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.conversions }}</div>

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

Convert string to a named duration
```shell
> '7min' | into duration --convert sec
```
