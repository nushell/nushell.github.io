---
title: dfr as-date
layout: command
version: 0.60.1
usage: |
  Converts string to date.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr as-date (format) --not-exact```

## Parameters

 -  `format`: formatting date string
 -  `--not-exact`: the format string may be contained in the date (e.g. foo-2021-01-01-bar could match 2021-01-01)

## Examples

Converts string to date
```shell
> ["2021-12-30" "2021-12-31"] | dfr to-df | dfr as-datetime "%Y-%m-%d"
```
