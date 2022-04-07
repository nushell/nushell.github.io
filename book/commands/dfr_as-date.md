---
title: dfr as-date
layout: command
version: 0.60.1
usage: |
  Converts string to date. Format example:
          "%Y-%m-%d"    => 2021-12-31
          "%d-%m-%Y"    => 31-12-2021
          "%Y%m%d"      => 2021319 (2021-03-19)
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr as-date (format) --not-exact```

## Parameters

 -  `format`: formating date string
 -  `--not-exact`: the format string may be contained in the date (e.g. foo-2021-01-01-bar could match 2021-01-01)

## Examples

Converts string to date
```shell
> ["2021-12-30" "2021-12-31"] | dfr to-df | dfr as-datetime "%Y-%m-%d"
```
