# Duration

|                       |                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **_Description:_**    | Represent a unit of a passage of time                                                                                              |
| **_Annotation:_**     | `duration`                                                                                                                         |
| **_Literal Syntax:_** | A numeric (integer or decimal) literal followed immediately by a duration unit (listed below). E.g., `10sec`, `987us`, `-34.65day` |
| **_Casts:_**          | [`into duration`](/commands/docs/into_duration.md)                                                                                 |
| **_See also:_**       | [Types of Data - Durations](/book/types_of_data.md#durations)                                                                      |

## Additional Language Notes

1. Durations are internally stored as a number of nanoseconds. When displayed, a duration is broken down into all of its units:

   ```nu
   3.14day
   # => 3day 3hr 21min 36sec
   -34.65day
   # => -4wk 6day 15hr 36min
   ```

1. This chart shows all duration units currently supported:

   | Duration           | Length      |
   | ------------------ | ----------- |
   | `ns`               | nanosecond  |
   | `us`, `µs` or `μs` | microsecond |
   | `ms`               | millisecond |
   | `sec`              | second      |
   | `min`              | minute      |
   | `hr`               | hour        |
   | `day`              | day         |
   | `wk`               | week        |

   The microsecond unit has three spellings: `us`, `µs` with U+00B5 MICRO SIGN, and `μs` with U+03BC GREEK SMALL LETTER MU. The two look alike but are different characters. Nushell displays microseconds with the micro sign, `µs`.

1. Rules for duration literals:

   - Units are case-sensitive. `1Sec` and `1HR` are not durations. At the start of a pipeline Nushell looks for a command with that name, and anywhere else the word is a string.
   - The number can have `_` separators, a leading `+`, an exponent, or a leading dot: `1_000ms`, `+5sec`, `1e3sec` and `.5sec` are all durations. A leading dot can't follow a sign, though. `-.5sec` is a string, so write `-0.5sec`.
   - A fraction of a nanosecond is dropped, so `1.5ns` is `1ns`.
   - A literal has one number and one unit. `1hr30min` is not a duration. Add the parts instead: `1hr + 30min`.
   - A duration is a signed 64-bit count of nanoseconds, which covers about 292 years in either direction. A literal outside that range is a parse error, and arithmetic that leaves it is a `nu::shell::operator_overflow` error:

     ```nu
     9223372036854775808ns
     # => Error: nu::parser::literal_too_large
     # =>
     # =>   × Invalid literal
     # =>    ╭─[repl_entry #1:1:1]
     # =>  1 │ 9223372036854775808ns
     # =>    · ──────────┬──────────
     # =>    ·           ╰── duration too large
     # =>    ╰────
     ```

1. Datetime values can be combined with durations in calculations:

   ```nu
   2024-08-12T11:49:27-04:00 + 1day | format date "%+"
   # => 2024-08-13T11:49:27-04:00
   2024-08-12T11:50:30-04:00 - 2019-05-10T09:59:12-07:00
   # => 274wk 2day 22hr 51min 18sec
   ```

   For example, `(date now) + 1day` is this time tomorrow.

1. Months, years, centuries and millenniums are not precise as to the exact
   number of nanoseconds and thus are not valid duration literals. Users are free to define
   their own constants for specific months or years.

## Converting to a duration

[`into duration`](/commands/docs/into_duration.md) accepts these input types:

| Input      | Result                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------- |
| `int`      | That many nanoseconds, or that many of the unit that `--unit` names                      |
| `float`    | The same as an int. A fraction of a nanosecond is dropped, so `1.5` gives `1ns`.         |
| `string`   | A number, one or more duration literals separated by spaces, or a clock time (see below) |
| `record`   | A duration built from fields named after units (see below)                               |
| `duration` | The value unchanged                                                                      |

`--unit` (`-u`) names the unit of a number: `ns`, `us`, `µs`, `ms`, `sec`, `min`, `hr`, `day` or `wk`. The number can be an int, a float, or a string that holds only a number. Months and years aren't units, and any other name is a `nu::shell::invalid_unit` error. With a duration or record as input, `--unit` is an `incompatible_parameters` error.

```nu
90 | into duration --unit sec
# => 1min 30sec
1.5 | into duration --unit hr
# => 1hr 30min
"90" | into duration
# => 90ns
```

A string that isn't a number is read in one of two ways:

- If it contains a colon, the whole string has to be a clock time, `h:mm:ss` with an optional fraction of up to nine digits after the seconds. The hours can have any number of digits, while the minutes and seconds take two each and must be below 60. A clock time can't be negative. `"100:00:00"` is `4day 4hr`.
- Otherwise every word, separated by whitespace, has to be a duration literal, and the words are added together. The rules for literals apply: units are case-sensitive, a fraction or an exponent is allowed (`"1.5hr"`), and a minus sign subtracts that part (`"1hr -30min"` is `30min`). A space between number and unit, or two parts written together as in `"1hr30min"`, is an error.

```nu
"1hr 30min" | into duration
# => 1hr 30min
"01:02:03.5" | into duration
# => 1hr 2min 3sec 500ms
"1hr30min" | into duration
# => Error: nu::shell::invalid_unit
# =>
# =>   × Invalid unit
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ "1hr30min" | into duration
# =>    · ────┬───
# =>    ·     ╰── encountered here
# =>    ╰────
# =>   help: Supported units are: ns, us, µs, ms, sec, min, hr, day, wk
```

An empty string, or one with only whitespace, fails with "empty duration string". A clock time that doesn't fit the pattern, such as `"1:30"`, fails with "invalid clock-style duration".

A record can have the fields `week`, `day`, `hour`, `minute`, `second`, `millisecond`, `microsecond` and `nanosecond`, each holding a non-negative int, plus a `sign` field that holds `"+"` or `"-"`. Missing fields count as 0, so `{} | into duration` is `0sec`. Any other field name, a float, or a negative number is an error. This is the record that [`into record`](/commands/docs/into_record.md) makes from a duration, so the two commands undo each other:

```nu
{hour: 1, minute: 30, sign: "-"} | into duration
# => -1hr 30min
(-1hr - 30min) | into record | into duration
# => -1hr 30min
```

To convert some fields of a record or columns of a table, name them as cell paths after the command. A table without cell paths is read as a table of such records, one duration per row. A list of strings isn't accepted, so convert each item with `each`:

```nu
[[task time]; [build "1:30:00"] [test "0:02:15"]] | into duration time
# => ╭───┬───────┬────────────╮
# => │ # │ task  │    time    │
# => ├───┼───────┼────────────┤
# => │ 0 │ build │  1hr 30min │
# => │ 1 │ test  │ 2min 15sec │
# => ╰───┴───────┴────────────╯
["1hr" "2min"] | each { into duration }
# => ╭───┬──────╮
# => │ 0 │  1hr │
# => │ 1 │ 2min │
# => ╰───┴──────╯
```

A result outside the duration range, about 292 years either way, fails with "duration too large".

## Formatting durations

[`format duration`](/commands/docs/format_duration.md) turns a duration into a string in a single unit, instead of the mix of units that Nushell displays:

```nu
90sec | format duration min
# => 1.50 min
1day | format duration min
# => 1440 min
```

The unit can be any duration unit, or `month` (30 days), `yr` (365 days) or `dec` (10 years of 365 days). Case doesn't matter, so `MIN` works too. `us` is shown as `µs`. Any other unit is an error:

```nu
1hr | format duration hours
# => Error: nu::shell::invalid_unit
# =>
# =>   × Invalid unit
# =>    ╭─[repl_entry #1:1:23]
# =>  1 │ 1hr | format duration hours
# =>    ·                       ──┬──
# =>    ·                         ╰── encountered here
# =>    ╰────
# =>   help: Supported units are: ns, us, µs, ms, sec, min, hr, day, wk, month, yr,
# =>         dec
```

A whole number in that unit is shown without decimals. Otherwise the number of decimal places comes from `$env.config.float_precision` (default `2`).

The input can be a duration, a list of durations, or a table with the columns to format named as cell paths after the unit. A record isn't accepted, and neither is a table without cell paths.

```nu
[[name time]; [build 95sec] [test 2min]] | format duration min time
# => ╭───┬───────┬──────────╮
# => │ # │ name  │   time   │
# => ├───┼───────┼──────────┤
# => │ 0 │ build │ 1.58 min │
# => │ 1 │ test  │ 2 min    │
# => ╰───┴───────┴──────────╯
```

The result is a string, so it no longer sorts or adds up as a duration. Keep the duration for calculations and format it last.

## Common commands that can be used with `duration`

- `sleep`
- `timeit`
- [`into duration`](#converting-to-a-duration), [`format duration`](#formatting-durations)
- `math` subcommands such as `math sum`, `math max` and `math stddev` (see [Working with Numbers](/book/working_with_numbers.md#what-each-command-accepts))
- `sys host` (the `uptime` column)

## Operators that can be used with `duration`

- `==`, `!=`, `<`, `<=`, `>`, `>=`
- `+`, `-`
- `*`, `/`, `//` and `mod` with a number, which return a duration
- `/`, `//` and `mod` with another duration, which return a `float`, an `int` and a duration respectively

  ```nu
  1hr * 2
  # => 2hr
  1wk / 1day
  # => 7.0
  1wk // 1day
  # => 7
  10sec mod 3sec
  # => 1sec
  ```

- `+` with a datetime, in either order, and `-` from a datetime. See [Datetime](datetime.md#operators-that-can-be-used-with-datetime).

A number can also go on the left of `*`, so `2 * 1hr` is `2hr` and `1.5 * 1hr` is `1hr 30min`. It can't go on the left of `/`: `2 / 1hr` is an error.

A duration and a plain number don't mix in `+`, `-`, `<`, `<=`, `>` or `>=`, because a bare number has no unit. `1hr + 1` and `1hr > 60` are parse errors. Write the unit: `1hr + 1sec`. `==` and `!=` don't fail. Values of different types are never equal, so `1hr == 60` is `false`.
