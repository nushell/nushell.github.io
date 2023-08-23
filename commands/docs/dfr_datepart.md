---
title: dfr datepart
categories: |
  expression
version: 0.84.0
expression: |
  Creates an expression for capturing the specified datepart in a column.
usage: |
  Creates an expression for capturing the specified datepart in a column.
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr datepart (Datepart name)```

## Parameters

 -  `Datepart name`: Part of the date to capture.  Possible values are year, quarter, month, week, weekday, day, hour, minute, second, millisecond, microsecond, nanosecond


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Creates an expression to capture the year date part
```shell
> [["2021-12-30T01:02:03.123456789"]] | dfr into-df | dfr as-datetime "%Y-%m-%dT%H:%M:%S.%9f" | dfr with-column [(dfr col datetime | dfr datepart year | dfr as datetime_year )]
╭───┬─────────────┬───────────────╮
│ # │  datetime   │ datetime_year │
├───┼─────────────┼───────────────┤
│ 0 │ 2 years ago │          2021 │
╰───┴─────────────┴───────────────╯

```

Creates an expression to capture multiple date parts
```shell
> [["2021-12-30T01:02:03.123456789"]] | dfr into-df | dfr as-datetime "%Y-%m-%dT%H:%M:%S.%9f" |
                dfr with-column [ (dfr col datetime | dfr datepart year | dfr as datetime_year ),
                (dfr col datetime | dfr datepart month | dfr as datetime_month ),
                (dfr col datetime | dfr datepart day | dfr as datetime_day ),
                (dfr col datetime | dfr datepart hour | dfr as datetime_hour ),
                (dfr col datetime | dfr datepart minute | dfr as datetime_minute ),
                (dfr col datetime | dfr datepart second | dfr as datetime_second ),
                (dfr col datetime | dfr datepart nanosecond | dfr as datetime_ns ) ]
╭───┬─────────────┬───────────────┬────────────────┬──────────────┬───────────────┬─────────────────┬─────────────────┬─────────────╮
│ # │  datetime   │ datetime_year │ datetime_month │ datetime_day │ datetime_hour │ datetime_minute │ datetime_second │ datetime_ns │
├───┼─────────────┼───────────────┼────────────────┼──────────────┼───────────────┼─────────────────┼─────────────────┼─────────────┤
│ 0 │ 2 years ago │          2021 │             12 │           30 │             1 │               2 │               3 │   123456789 │
╰───┴─────────────┴───────────────┴────────────────┴──────────────┴───────────────┴─────────────────┴─────────────────┴─────────────╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag