# `std/dt`

The `std/dt` module measures the time between two dates in calendar units: years, months and days, down to nanoseconds. Subtracting one `datetime` from another gives a [duration](../types_of_data.md#durations), and a duration stops at weeks, because months and years don't have a fixed length:

```nu
2024-03-01T12:00:00Z - 2023-01-31T08:30:00Z
# => 56wk 3day 3hr 30min
```

Import the commands without a prefix:

```nu
use std/dt *
```

After `use std/dt` without the glob, they are `dt datetime-diff` and `dt pretty-print-duration`.

## `datetime-diff`

`datetime-diff` takes the later datetime first and the earlier one second, as arguments rather than pipeline input. It returns a record with one field for each unit from `year` to `nanosecond`:

```nu
datetime-diff 2024-03-01T12:00:00Z 2023-01-31T08:30:00Z
# => ╭─────────────┬────╮
# => │ year        │ 1  │
# => │ month       │ 1  │
# => │ day         │ 1  │
# => │ hour        │ 3  │
# => │ minute      │ 30 │
# => │ second      │ 0  │
# => │ millisecond │ 0  │
# => │ microsecond │ 0  │
# => │ nanosecond  │ 0  │
# => ╰─────────────┴────╯
```

It counts whole months first and then the days that are left. When a month is too short for the starting day, the day moves to the end of that month, so January 31 plus one month is February 28 or 29. Here, 2023-01-31 plus 13 months is 2024-02-29, and March 1 is one day later.

Both datetimes are converted to UTC before the comparison, so their time zones don't matter. `datetime-diff 2024-01-01T00:00:00+01:00 2023-12-31T23:00:00Z` is all zeros, because both are the same moment.

If the first datetime is earlier than the second, `datetime-diff` fails:

```nu
datetime-diff 2023-01-31T08:30:00Z 2024-03-01T12:00:00Z
# => Error: nu::shell::error
# =>
# =>   × Incompatible arguments
# =>    ╭─[repl_entry #1:1:15]
# =>  1 │ datetime-diff 2023-01-31T08:30:00Z 2024-03-01T12:00:00Z
# =>    ·               ────────────────────┬────────────────────
# =>    ·                                   ╰── First datetime must be >= second, but was actually -56wk 3day 3hr 30min less than it.
# =>    ╰────
```

## `pretty-print-duration`

`pretty-print-duration` turns a record from `datetime-diff` into text. It also takes the record as an argument, not as pipeline input:

```nu
pretty-print-duration (datetime-diff 2024-03-01T12:00:00Z 2023-01-31T08:30:00Z) | to nuon
# => "1yr 1month 1day 3hrs 30mins "
```

It leaves out the units that are zero and uses the singular for a value of `1`. The units are `yr`/`yrs`, `month`/`months`, `day`/`days`, `hr`/`hrs`, `min`/`mins` and `sec`/`secs`, then `ms`, `µs` and `ns`. Every unit is followed by a space, so the text ends with one. When all fields are zero, the result is an empty string.

The welcome [`banner`](/commands/docs/banner.md) uses these two commands for its "It's been this long since Nushell's first commit" line.
