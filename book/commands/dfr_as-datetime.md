---
title: dfr as-datetime
layout: command
version: 0.60.1
usage: |
  Converts string to datetime.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr as-datetime (format) --not-exact```

## Parameters

 -  `format`: formatting date time string
 -  `--not-exact`: the format string may be contained in the date (e.g. foo-2021-01-01-bar could match 2021-01-01)

## Examples

Converts string to datetime
```shell
> ["2021-12-30 00:00:00" "2021-12-31 00:00:00"] | dfr to-df | dfr as-datetime "%Y-%m-%d %H:%M:%S"
```
