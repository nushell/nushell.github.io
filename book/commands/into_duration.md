---
title: into duration
version: 0.67.0
usage: |
  Convert value to duration
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> into duration ...rest```

## Parameters

 -  `...rest`: column paths to convert to duration (for table input)

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
