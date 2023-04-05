---
title: dfr as-datetime
categories: |
  dataframe
version: 0.78.0
dataframe: |
  Converts string to datetime.
usage: |
  Converts string to datetime.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr as-datetime ```

## Notes
Format example:
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
## Examples

Converts string to datetime
```shell
> ["2021-12-30 00:00:00" "2021-12-31 00:00:00"] | dfr into-df | dfr as-datetime "%Y-%m-%d %H:%M:%S"
╭───┬────────────╮
│ # │  datetime  │
├───┼────────────┤
│ 0 │ a year ago │
│ 1 │ a year ago │
╰───┴────────────╯

```
