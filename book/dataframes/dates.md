# Dates and Times in Dataframes

The [Dataframes](../dataframes.md) chapter shows how to load data and work with
series and expressions. This page picks up from there and covers the columns that
hold dates and times: turning strings into dates, pulling out parts such as the
month or the hour, formatting dates as text, moving between time zones, rounding
times down to buckets, and generating ranges of dates.

Most of the commands here build expressions, so you use them inside
[`polars select`](/commands/docs/polars_select.md),
[`polars with-column`](/commands/docs/polars_with-column.md), or
[`polars agg`](/commands/docs/polars_agg.md), as described in
[Lazy Dataframes](../dataframes.md#lazy-dataframes).
`polars datepart`, `polars truncate`, `polars convert-time-zone`, and
`polars replace-time-zone` also take a [selector](./selectors.md) as input.
With the other commands, name the column with `polars col`.

::: tip
By default, a table shows a date as how long ago it was, such as `4 years ago`.
The examples on this page first set a table format so that you can see the dates
themselves:

```nu
$env.config.datetime_format.table = "%F %T %:z"
```

:::

## Date and datetime columns

Polars has two column types for points in time. A `date` column holds calendar
days. A `datetime` column holds instants. Its type names a time unit, one of
`ns`, `us`, or `ms`, and can also name a time zone, as in `datetime<ns, UTC>`. A datetime
column without a time zone is called naive. Its values are wall-clock times that
don't say where on Earth they were read.

Nushell's own datetime values always carry an offset.
[`polars into-df`](/commands/docs/polars_into-df.md) stores them as
`datetime<ns, UTC>`, converting each value to UTC:

```nu
[[at]; [2025-03-08T23:45:10-05:00]] | polars into-df | polars collect
# => ╭───┬────────────────────────────╮
# => │ # │             at             │
# => ├───┼────────────────────────────┤
# => │ 0 │ 2025-03-09 04:45:10 +00:00 │
# => ╰───┴────────────────────────────╯
```

Going the other way, every value has to become a Nushell datetime with an offset.
A `date` becomes midnight UTC, and a naive datetime is shown as if it were UTC,
with `+00:00`.

## Parsing strings

Dates often arrive as text. [`polars as-date`](/commands/docs/polars_as-date.md)
parses strings into a `date` column, and
[`polars as-datetime`](/commands/docs/polars_as-datetime.md) parses them into a
`datetime` column. Both take a format string made of
[chrono specifiers](https://docs.rs/chrono/latest/chrono/format/strftime/index.html),
such as `%Y-%m-%d %H:%M:%S`. The examples on the rest of this page use this log:

```nu
let log = [[event at]; [deploy "2025-03-08 23:45:10"] [backup "2025-03-09 01:30:00"] [deploy "2025-12-29 08:05:00"]] | polars into-df
let events = $log | polars with-column (polars col at | polars as-datetime "%Y-%m-%d %H:%M:%S") | polars collect
$events
# => ╭───┬────────┬────────────────────────────╮
# => │ # │ event  │             at             │
# => ├───┼────────┼────────────────────────────┤
# => │ 0 │ deploy │ 2025-03-08 23:45:10 +00:00 │
# => │ 1 │ backup │ 2025-03-09 01:30:00 +00:00 │
# => │ 2 │ deploy │ 2025-12-29 08:05:00 +00:00 │
# => ╰───┴────────┴────────────────────────────╯
$events | polars schema
# => ╭───────┬──────────────╮
# => │ event │ str          │
# => │ at    │ datetime<μs> │
# => ╰───────┴──────────────╯
```

Both commands behave differently depending on what you give them.

- Given an expression, as above, they convert that column and keep its name. If
  any value doesn't match the format, the whole query fails with an error such as
  ``conversion from `str` to `date` failed in column 'at' for 1 out of 3 values``.
- Given a dataframe, they convert its only column, so a dataframe with more than
  one column fails with `Error using as series`. The result is a single column
  named `date` or `datetime`, and values that don't match the format become null
  instead of raising an error.
- Given a lazy dataframe, they convert every column and keep the names. Each
  column has to hold strings, and the values have to match, as with an
  expression.

```nu
["2025-03-08" "oops"] | polars into-df | polars as-date "%Y-%m-%d"
# => ╭───┬────────────────────────────╮
# => │ # │            date            │
# => ├───┼────────────────────────────┤
# => │ 0 │ 2025-03-08 00:00:00 +00:00 │
# => │ 1 │                            │
# => ╰───┴────────────────────────────╯
```

Both commands take `--not-exact` (`-n`), which lets the format match part of the
string. Use it for dates inside other text:

```nu
["shipped 2025-03-08 by ana" "2025-03-09"] | polars into-df | polars as-date "%Y-%m-%d" --not-exact
# => ╭───┬────────────────────────────╮
# => │ # │            date            │
# => ├───┼────────────────────────────┤
# => │ 0 │ 2025-03-08 00:00:00 +00:00 │
# => │ 1 │ 2025-03-09 00:00:00 +00:00 │
# => ╰───┴────────────────────────────╯
```

`polars as-datetime` has more flags, and some of them only apply to one form:

- `--time-unit` sets the unit to `ns`, `us`, or `ms`, and also accepts `μs` for
  `us`. Without it, a dataframe gets `ns` and an expression or lazy dataframe gets
  `us`, which the schema above prints as `μs`. Any other unit fails with
  `Invalid time unit`.
- `--time-zone` names a time zone from the
  [IANA database](https://www.iana.org/time-zones), such as `America/New_York`.
  If the format reads an offset with `%z`, the command converts the times to that
  zone. Without `%z`, it reads them as wall-clock times in that zone. A name the
  database doesn't know fails with `Invalid timezone`.
- With `%z` and no `--time-zone`, an expression gives a `UTC` column. Without
  either, it gives a naive column.
- `--naive` only matters for a dataframe. Without it, the command expects every
  string in a dataframe to carry an offset, so a format without `%z` turns every
  value into null. With `--naive`, it drops an offset read by `%z` and keeps the
  wall-clock time.
- `--ambiguous` (`-a`) applies to expressions and lazy dataframes, and only when
  `--time-zone` puts a value inside a daylight saving change. See
  [Ambiguous and missing times](#ambiguous-and-missing-times).

```nu
[[s]; ["2025-03-08 10:15:00 +0900"]] | polars into-df | polars select (polars col s | polars as-datetime "%Y-%m-%d %H:%M:%S %z" | polars as utc) (polars col s | polars as-datetime "%Y-%m-%d %H:%M:%S %z" --time-zone Asia/Tokyo | polars as tokyo) | polars collect
# => ╭───┬────────────────────────────┬────────────────────────────╮
# => │ # │            utc             │           tokyo            │
# => ├───┼────────────────────────────┼────────────────────────────┤
# => │ 0 │ 2025-03-08 01:15:00 +00:00 │ 2025-03-08 10:15:00 +09:00 │
# => ╰───┴────────────────────────────┴────────────────────────────╯
```

## Extracting parts of a date

The `polars get-*` commands each return one part of a date or datetime as an
integer:

| Command                                                            | Returns                                  | Type  |
| ------------------------------------------------------------------ | ---------------------------------------- | ----- |
| [`polars get-year`](/commands/docs/polars_get-year.md)             | calendar year                            | `i32` |
| [`polars get-month`](/commands/docs/polars_get-month.md)           | month, 1 to 12                           | `i8`  |
| [`polars get-day`](/commands/docs/polars_get-day.md)               | day of the month, 1 to 31                | `i8`  |
| [`polars get-ordinal`](/commands/docs/polars_get-ordinal.md)       | day of the year, 1 to 366                | `i16` |
| [`polars get-week`](/commands/docs/polars_get-week.md)             | ISO week number, 1 to 53                 | `i8`  |
| [`polars get-weekday`](/commands/docs/polars_get-weekday.md)       | ISO weekday, Monday is 1 and Sunday is 7 | `i8`  |
| [`polars get-hour`](/commands/docs/polars_get-hour.md)             | hour, 0 to 23                            | `i8`  |
| [`polars get-minute`](/commands/docs/polars_get-minute.md)         | minute, 0 to 59                          | `i8`  |
| [`polars get-second`](/commands/docs/polars_get-second.md)         | whole seconds, 0 to 59                   | `i8`  |
| [`polars get-nanosecond`](/commands/docs/polars_get-nanosecond.md) | fraction of the second, in nanoseconds   | `i32` |

[`polars datepart`](/commands/docs/polars_datepart.md) does the same job with the
part's name as an argument. It takes `year`, `quarter`, `month`, `week`, `day`,
`hour`, `minute`, `second`, `millisecond`, `microsecond`, and `nanosecond`, so it
is the way to get a quarter or a millisecond count. For the weekday, use
`polars get-weekday`.

```nu
$events | polars select at (polars col at | polars get-week | polars as week) (polars col at | polars get-weekday | polars as weekday) (polars col at | polars get-ordinal | polars as day_of_year) (polars col at | polars datepart quarter | polars as quarter) (polars col at | polars get-year | polars as year) | polars collect
# => ╭───┬────────────────────────────┬──────┬─────────┬─────────────┬─────────┬──────╮
# => │ # │             at             │ week │ weekday │ day_of_year │ quarter │ year │
# => ├───┼────────────────────────────┼──────┼─────────┼─────────────┼─────────┼──────┤
# => │ 0 │ 2025-03-08 23:45:10 +00:00 │   10 │       6 │          67 │       1 │ 2025 │
# => │ 1 │ 2025-03-09 01:30:00 +00:00 │   10 │       7 │          68 │       1 │ 2025 │
# => │ 2 │ 2025-12-29 08:05:00 +00:00 │    1 │       1 │         363 │       4 │ 2025 │
# => ╰───┴────────────────────────────┴──────┴─────────┴─────────────┴─────────┴──────╯
```

The last row shows a trap. `polars get-week` counts ISO weeks, and 29 December
2025 falls in week 1 of 2026, while `polars get-year` still says 2025. If you
label weeks, take the ISO year from `polars strftime "%G"` instead.

The `polars get-*` commands accept the same three kinds of input as
`polars as-date`:

- An expression works on `date` and `datetime` columns. Asking a `date` for a
  time part fails, as in `` `hour` operation not supported for dtype `date` ``.
  `polars datepart` doesn't take a dataframe.
- A dataframe has to have one `datetime` column. The result keeps the column's
  name. A `date` column fails with `Error casting to datetime type`, so use an
  expression for dates.
- A lazy dataframe has every column converted, and every column has to be a date
  or datetime.

Each command reads the parts in the column's own time zone, so convert the zone first if
you want local hours:

```nu
[[at]; [2025-03-08T23:45:10Z]] | polars into-df | polars select (polars col at | polars get-hour | polars as utc_hour) (polars col at | polars convert-time-zone Asia/Tokyo | polars get-hour | polars as tokyo_hour) | polars collect
# => ╭───┬──────────┬────────────╮
# => │ # │ utc_hour │ tokyo_hour │
# => ├───┼──────────┼────────────┤
# => │ 0 │       23 │          8 │
# => ╰───┴──────────┴────────────╯
```

## Formatting dates as strings

[`polars strftime`](/commands/docs/polars_strftime.md) turns dates into strings,
using the same chrono specifiers as the parsing commands:

```nu
$events | polars select (polars col at | polars strftime "%A %d %B %Y" | polars as day) (polars col at | polars strftime "%G-W%V" | polars as iso_week) | polars collect
# => ╭───┬─────────────────────────┬──────────╮
# => │ # │           day           │ iso_week │
# => ├───┼─────────────────────────┼──────────┤
# => │ 0 │ Saturday 08 March 2025  │ 2025-W10 │
# => │ 1 │ Sunday 09 March 2025    │ 2025-W10 │
# => │ 2 │ Monday 29 December 2025 │ 2026-W01 │
# => ╰───┴─────────────────────────┴──────────╯
```

As an expression, it works on `date` and `datetime` columns. A specifier for a
part the column doesn't have fails, so formatting a `date` with `%H:%M` gives
`cannot format Date with format '%H:%M'`. Given a dataframe, it needs a single
`datetime` column, and a `date` column fails with `Error casting to date`. Given
a lazy dataframe, it collects it first and returns an eager dataframe.

## Time zones

Two commands attach or change a time zone. Both take an expression and return
one, and both expect a `datetime` column. A `date` column fails with an error
such as `expected Datetime, got date`.

- [`polars replace-time-zone`](/commands/docs/polars_replace-time-zone.md) keeps
  the wall-clock time and labels it with a new zone. Use it to say where a naive
  column's times were recorded, or to fix a column that was labeled with the
  wrong zone.
- [`polars convert-time-zone`](/commands/docs/polars_convert-time-zone.md) keeps
  the instant and changes the zone it's shown in, so the wall-clock time changes.
  It treats a naive column as UTC.

```nu
[[at]; [2025-06-01T12:00:00Z]] | polars into-df | polars select at (polars col at | polars convert-time-zone Asia/Tokyo | polars as converted) (polars col at | polars replace-time-zone Asia/Tokyo | polars as replaced) | polars collect
# => ╭───┬────────────────────────────┬────────────────────────────┬────────────────────────────╮
# => │ # │             at             │         converted          │          replaced          │
# => ├───┼────────────────────────────┼────────────────────────────┼────────────────────────────┤
# => │ 0 │ 2025-06-01 12:00:00 +00:00 │ 2025-06-01 21:00:00 +09:00 │ 2025-06-01 12:00:00 +09:00 │
# => ╰───┴────────────────────────────┴────────────────────────────┴────────────────────────────╯
```

### Ambiguous and missing times

When clocks go back, an hour happens twice. When they go forward, an hour is
skipped. A wall-clock time in either hour can't be turned into an instant on its
own, and by default `polars replace-time-zone` fails with an error such as
`datetime '2025-11-02 01:30:00' is ambiguous in time zone 'America/New_York'`.

- `--ambiguous` (`-a`) handles the repeated hour: `earliest` picks the first
  occurrence, `latest` the second, `null` gives null, and `raise` is the default.
- `--nonexistent` (`-n`) handles the skipped hour: `null` gives null, and `raise`
  is the default.

```nu
let fall_back = [[at]; ["2025-11-02 00:30:00"] ["2025-11-02 01:30:00"] ["2025-11-02 02:30:00"]] | polars into-df | polars select (polars col at | polars as-datetime "%Y-%m-%d %H:%M:%S") | polars collect
$fall_back | polars select (polars col at | polars replace-time-zone America/New_York --ambiguous earliest | polars as earliest) (polars col at | polars replace-time-zone America/New_York --ambiguous latest | polars as latest) (polars col at | polars replace-time-zone America/New_York --ambiguous null | polars as dropped) | polars collect
# => ╭───┬────────────────────────────┬────────────────────────────┬────────────────────────────╮
# => │ # │          earliest          │           latest           │          dropped           │
# => ├───┼────────────────────────────┼────────────────────────────┼────────────────────────────┤
# => │ 0 │ 2025-11-02 00:30:00 -04:00 │ 2025-11-02 00:30:00 -04:00 │ 2025-11-02 00:30:00 -04:00 │
# => │ 1 │ 2025-11-02 01:30:00 -04:00 │ 2025-11-02 01:30:00 -05:00 │                            │
# => │ 2 │ 2025-11-02 02:30:00 -05:00 │ 2025-11-02 02:30:00 -05:00 │ 2025-11-02 02:30:00 -05:00 │
# => ╰───┴────────────────────────────┴────────────────────────────┴────────────────────────────╯
```

`polars as-datetime --time-zone` runs into the same problem while parsing. Its
`--ambiguous` flag takes `earliest` or `latest`. To get null for an ambiguous
time, or to handle a skipped one, parse to a naive column first and then use
`polars replace-time-zone`, as above.

### Comparing with a date

A Nushell datetime used in an expression, such as the right side of
`(polars col at) > 2025-03-09`, becomes a naive `datetime<ns>` holding the UTC
time. Comparing it with a naive column works. Comparing it with a column that has
a time zone fails with an error that starts with
`could not evaluate '>' comparison between series 'at' of dtype: Datetime('ns', 'UTC')`. Give
the literal a zone with [`polars lit`](/commands/docs/polars_lit.md) and
`polars replace-time-zone`:

```nu
[[at]; [2025-03-08T23:45:10Z] [2025-03-10T08:05:00Z]] | polars into-df | polars filter ((polars col at) > (polars lit 2025-03-09 | polars replace-time-zone UTC)) | polars collect
# => ╭───┬────────────────────────────╮
# => │ # │             at             │
# => ├───┼────────────────────────────┤
# => │ 0 │ 2025-03-10 08:05:00 +00:00 │
# => ╰───┴────────────────────────────╯
```

## Truncating to buckets

[`polars truncate`](/commands/docs/polars_truncate.md) rounds each date or
datetime down to the start of its bucket, which is how you count or sum things
per hour, day, or month. It takes an expression and returns one. The bucket size
is a Polars duration string, a number followed by `ns`, `us`, `ms`, `s`, `m` for
minutes, `h`, `d`, `w`, `mo`, `q`, or `y`. You can combine parts, as in `1h30m`.
It works on `date` columns too, and the result stays a `date`.

```nu
$events | polars select at (polars col at | polars truncate 1h | polars as hour) (polars col at | polars truncate 1w | polars as week) (polars col at | polars truncate 1mo | polars as month) | polars collect
# => ╭───┬────────────────────────────┬────────────────────────────┬────────────────────────────┬────────────────────────────╮
# => │ # │             at             │            hour            │            week            │           month            │
# => ├───┼────────────────────────────┼────────────────────────────┼────────────────────────────┼────────────────────────────┤
# => │ 0 │ 2025-03-08 23:45:10 +00:00 │ 2025-03-08 23:00:00 +00:00 │ 2025-03-03 00:00:00 +00:00 │ 2025-03-01 00:00:00 +00:00 │
# => │ 1 │ 2025-03-09 01:30:00 +00:00 │ 2025-03-09 01:00:00 +00:00 │ 2025-03-03 00:00:00 +00:00 │ 2025-03-01 00:00:00 +00:00 │
# => │ 2 │ 2025-12-29 08:05:00 +00:00 │ 2025-12-29 08:00:00 +00:00 │ 2025-12-29 00:00:00 +00:00 │ 2025-12-01 00:00:00 +00:00 │
# => ╰───┴────────────────────────────┴────────────────────────────┴────────────────────────────┴────────────────────────────╯
```

Weeks start on Monday, and months, quarters, and years follow the calendar.

`polars truncate` also takes a Nushell duration, such as `15min` or `1day`, but
Nushell durations are a fixed number of nanoseconds. Polars counts fixed-length
buckets from 1 January 1970, which was a Thursday, so `1wk` gives weeks that
start on Thursday, and there is no Nushell duration for a month. For weeks and
longer, use the strings. An unknown unit fails with an error that lists the valid
ones, such as `unit: 'x' not supported`.

Truncating a column and grouping by it counts events per bucket:

```nu
$events | polars group-by (polars col at | polars truncate 1mo | polars as month) | polars agg (polars len) | polars sort-by month | polars collect
# => ╭───┬────────────────────────────┬─────╮
# => │ # │           month            │ len │
# => ├───┼────────────────────────────┼─────┤
# => │ 0 │ 2025-03-01 00:00:00 +00:00 │   2 │
# => │ 1 │ 2025-12-01 00:00:00 +00:00 │   1 │
# => ╰───┴────────────────────────────┴─────╯
```

## Generating date ranges

[`polars date-range`](/commands/docs/polars_date-range.md) builds a sequence of
dates, and [`polars datetime-range`](/commands/docs/polars_datetime-range.md)
builds a sequence of datetimes. Both need all three of `--start`, `--end`, and
`--interval`. Leaving one out fails with
`Exactly three of 'start', 'end', 'interval', and 'num_samples' must be supplied.`,
and there is no flag for the number of samples.

`--start` and `--end` take a Nushell date or an expression. A quoted string such
as `"2025-01-01"` fails with `'start' must be Date or Datetime, got String`.
`--interval` takes a Polars duration string, as `polars truncate` does, such as
`1d` or `1mo`.

`--closed` (`-c`) says which ends belong to the range: `both`, `left`, `right`, or
`none`. The default is `both`, and any other value fails with
`Invalid closed window`. `polars date-range` drops the time of day from datetime
bounds, so a range from noon on one day to 8 AM two days later still includes
all three dates.

With `--eager`, the command returns a one-column dataframe named `literal`.
Without it, it returns an expression for `polars select` or `polars agg`.

```nu
polars date-range --start 2025-01-31 --end 2025-05-01 --interval 1mo --closed left --eager
# => ╭───┬────────────────────────────╮
# => │ # │          literal           │
# => ├───┼────────────────────────────┤
# => │ 0 │ 2025-01-31 00:00:00 +00:00 │
# => │ 1 │ 2025-02-28 00:00:00 +00:00 │
# => │ 2 │ 2025-03-31 00:00:00 +00:00 │
# => │ 3 │ 2025-04-30 00:00:00 +00:00 │
# => ╰───┴────────────────────────────╯
```

Month steps land on the last day of shorter months, as above.

`polars datetime-range` also takes `--time-unit` and `--time-zone`, as
`polars as-datetime` does. A Nushell datetime given to `--start` or `--end` is
read as its UTC wall-clock time, and `--time-zone` then places that wall-clock
time in the zone. Hours skipped by a daylight saving change are left out:

```nu
polars datetime-range --start 2025-03-09T00:00:00 --end 2025-03-09T04:00:00 --interval 1h --time-zone America/New_York --eager
# => ╭───┬────────────────────────────╮
# => │ # │          literal           │
# => ├───┼────────────────────────────┤
# => │ 0 │ 2025-03-09 00:00:00 -05:00 │
# => │ 1 │ 2025-03-09 01:00:00 -05:00 │
# => │ 2 │ 2025-03-09 03:00:00 -04:00 │
# => │ 3 │ 2025-03-09 04:00:00 -04:00 │
# => ╰───┴────────────────────────────╯
```

The `--start` and `--end` of `polars date-range` and `polars datetime-range` have
to be single values. To use two columns, such as a check-in and a check-out date,
use [`polars date-ranges`](/commands/docs/polars_date-ranges.md) or
[`polars datetime-ranges`](/commands/docs/polars_datetime-ranges.md). They take
the same flags and build one list of dates per row. Passing columns to the
singular commands fails with an error such as
`` non-scalar start passed to `date_range` ``.

```nu
let stays = [[guest check_in check_out]; [ana 2025-07-01 2025-07-03] [ben 2025-07-02 2025-07-04]] | polars into-df
$stays | polars select guest (polars date-ranges --start (polars col check_in) --end (polars col check_out) --interval 1d --closed left | polars as night) | polars collect
# => ╭───┬───────┬────────────────╮
# => │ # │ guest │     night      │
# => ├───┼───────┼────────────────┤
# => │ 0 │ ana   │ [list 2 items] │
# => │ 1 │ ben   │ [list 2 items] │
# => ╰───┴───────┴────────────────╯
```

To see the dates, give each one its own row with
[`polars explode`](/commands/docs/polars_explode.md):

```nu
$stays | polars select guest (polars date-ranges --start (polars col check_in) --end (polars col check_out) --interval 1d --closed left | polars as night) | polars explode night | polars collect
# => ╭───┬───────┬────────────────────────────╮
# => │ # │ guest │           night            │
# => ├───┼───────┼────────────────────────────┤
# => │ 0 │ ana   │ 2025-07-01 00:00:00 +00:00 │
# => │ 1 │ ana   │ 2025-07-02 00:00:00 +00:00 │
# => │ 2 │ ben   │ 2025-07-02 00:00:00 +00:00 │
# => │ 3 │ ben   │ 2025-07-03 00:00:00 +00:00 │
# => ╰───┴───────┴────────────────────────────╯
```

Inside a group-by, an aggregation such as `polars min` gives one value per group,
so the singular commands work there:

```nu
$events | polars group-by event | polars agg (polars date-range --start (polars col at | polars min) --end (polars col at | polars max) --interval 1mo | polars as months) | polars sort-by event | polars collect
# => ╭───┬────────┬─────────────────╮
# => │ # │ event  │     months      │
# => ├───┼────────┼─────────────────┤
# => │ 0 │ backup │ [list 1 item]   │
# => │ 1 │ deploy │ [list 10 items] │
# => ╰───┴────────┴─────────────────╯
```
