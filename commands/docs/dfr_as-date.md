---
title: dfr as-date
categories: |
  dataframe
version: 0.80.0
dataframe: |
  Converts string to date.
usage: |
  Converts string to date.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr as-date (format) --not-exact```

## Parameters

 -  `format`: formatting date string
 -  `--not-exact` `(-n)`: the format string may be contained in the date (e.g. foo-2021-01-01-bar could match 2021-01-01)

## Notes
Format example:
        "%Y-%m-%d"    => 2021-12-31
        "%d-%m-%Y"    => 31-12-2021
        "%Y%m%d"      => 2021319 (2021-03-19)
## Examples

Converts string to date
```shell
> ["2021-12-30" "2021-12-31"] | dfr into-df | dfr as-datetime "%Y-%m-%d"

```
