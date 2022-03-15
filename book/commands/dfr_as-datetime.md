---
title: dfr as-datetime
layout: command
version: 0.59.1
usage: |
  Converts string to datetime. Format example:
          "%y/%m/%d %H:%M:%S"  => 21/12/31 12:54:98
          "%y-%m-%d %H:%M:%S"  => 2021-12-31 24:58:01
          "%y/%m/%d %H:%M:%S"  => 21/12/31 24:58:01
          "%y%m%d %H:%M:%S"    => 210319 23:58:50
          "%Y/%m/%d %H:%M:%S"  => 2021/12/31 12:54:98
          "%Y-%m-%d %H:%M:%S"  => 2021-12-31 24:58:01
          "%Y/%m/%d %H:%M:%S"  => 2021/12/31 24:58:01
          "%Y%m%d %H:%M:%S"    => 20210319 23:58:50
          "%FT%H:%M:%S"        => 2019-04-18T02:45:55
          "%FT%H:%M:%S.%6f"    => microseconds
          "%FT%H:%M:%S.%9f"    => nanoseconds
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr as-datetime (format) --not-exact```

## Parameters

 -  `format`: formating date string
 -  `--not-exact`: the format string may be contained in the date (e.g. foo-2021-01-01-bar could match 2021-01-01)

## Examples

Converts string to datetime
```shell
> ["2021-12-30 00:00:00" "2021-12-31 00:00:00"] | dfr to-df | dfr as-datetime "%Y-%m-%d %H:%M:%S"
```
