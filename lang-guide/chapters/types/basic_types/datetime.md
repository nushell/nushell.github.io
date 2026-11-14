# Datetime

<!-- prettier-ignore -->
|     |     |
| --- | --- |
| **_Description:_**    | Represents a specific point in time using international standard date time descriptors 
| **_Annotation:_**     | `datetime`                                                                                 
| **_Literal syntax:_** | RFC 3339                                                                               
|                       | Date-only: `2022-02-02`                                                                
|                       | Date and time (GMT): `2022-02-02T14:30:00`                                             
|                       | Date and time including timezone offset: `2022-02-02T14:30:00+05:00`                   
|                       | Date and time in UTC with a `Z` suffix: `2022-02-02T14:30:00Z`
| **_Casts:_**          | [`into datetime`](/commands/docs/into_datetime.md)                                     
| **_See also:_**       | [Types of Data - Dates](/book/types_of_data.md#dates)

## Additional language notes

- Dates and times are held together in the `datetime` type. Date values used by the system are timezone-aware. A datetime literal without a timezone offset uses UTC, while `date now` returns the current time in the local timezone.

  ```nu
  2022-02-02T14:30:00 | format date "%+"
  # => 2022-02-02T14:30:00+00:00
  2022-02-02T14:30:00+05:00 | format date "%+"
  # => 2022-02-02T14:30:00+05:00
  ```

- A date-only literal is midnight UTC: `2022-02-02 | format date "%+"` is `2022-02-02T00:00:00+00:00`.
- The `T` between the date and the time and the `Z` for UTC can both be lowercase.
- Seconds can have a fraction. Nushell keeps nanosecond precision, the first nine digits, and drops any digits after those:

  ```nu
  [2022-02-02T14:30:00Z 2022-02-02t14:30:00z 2022-02-02T14:30:00.123456789Z] | to nuon
  # => [2022-02-02T14:30:00+00:00, 2022-02-02T14:30:00+00:00, 2022-02-02T14:30:00.123456789+00:00]
  ```

- The seconds are required, and the `T` can't be a space. `2022-02-02T14:30` is not a datetime, and `2022-02-02 14:30:00` is two words, a date followed by a word Nushell can't place.
- A word written like a date that names a day that doesn't exist, such as `2023-02-29` or `2023-13-01`, is a parse error:

  ```nu
  2023-02-29
  # => Error: nu::parser::error
  # =>
  # =>   × Invalid literal
  # =>    ╭─[repl_entry #1:1:1]
  # =>  1 │ 2023-02-29
  # =>    · ─────┬────
  # =>    ·      ╰── not a valid date in datetime
  # =>    ╰────
  ```

  Any other text after the date makes the word a bare string, so a file name such as `2024-01-15.log` can be passed without quotes: `echo 2024-01-15.log | describe` is `string`. The same goes for a word that isn't a datetime for the reasons above, such as `2022-02-02T14:30`. Like any bare word, it is taken as a command name if it starts a pipeline.

## Operators that can be used with `datetime`

- `+` with a duration on either side gives a datetime.
- `-` with a duration on the right gives a datetime. A duration minus a datetime is an error.
- `-` with another datetime gives the duration between them.
- `==`, `!=`, `<`, `<=`, `>` and `>=` compare the instants that two datetimes name, whatever their offsets. `<`, `<=`, `>` and `>=` accept only another datetime: a string or a duration on the other side is a parse error. Convert a string with [`into datetime`](/commands/docs/into_datetime.md) first. `==` against a value of another type is `false`, not an error.
- `older-than` and `newer-than` take a datetime on the left. With a duration on the right, they count back from now: `$date older-than 2wk` is true when `$date` is more than two weeks in the past. With a datetime on the right, they are the same as `<` and `>`. Both are strict, so a date exactly at the cut-off is neither older nor newer.

```nu
2024-01-01 + 1day | format date "%F"
# => 2024-01-02
1day + 2024-01-01 | format date "%F"
# => 2024-01-02
2024-01-02 - 2024-01-01
# => 1day
2024-01-01T00:00:00+01:00 == 2023-12-31T23:00:00Z
# => true
2024-01-02 older-than 1day
# => true
```

Comparing a datetime with a duration using `<` or `>` is an error whose help points to these operators:

```nu
2024-01-02 > 1day
# => Error: nu::parser::operator_incompatible_types
# =>
# =>   × Types 'datetime' and 'duration' are not compatible for the '>' operator.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ 2024-01-02 > 1day
# =>    · ─────┬──── ┬ ──┬─
# =>    ·      │     │   ╰── duration
# =>    ·      │     ╰── does not operate between 'datetime' and 'duration'
# =>    ·      ╰── datetime
# =>    ╰────
# =>   help: to check that a datetime is after now minus a duration, use `newer-
# =>         than`: `$date newer-than 2wk`
```

## Formatting dates

[`format date`](/commands/docs/format_date.md) turns a datetime into a string. Without a format string it writes the RFC 2822 form:

```nu
2024-01-15T10:30:00Z | format date
# => Mon, 15 Jan 2024 10:30:00 +0000
2024-01-15T10:30:00Z | format date "%Y/%m/%d %H:%M"
# => 2024/01/15 10:30
```

The format string uses strftime-style specifiers: `%Y`, `%m` and `%d` for the date, `%H:%M:%S` for the time, `%.3f` for milliseconds, `%s` for Unix seconds, `%+` for RFC 3339, and many more. `format date --list` prints a table of every specifier with an example and a description. A format string that isn't valid, such as a lone `%`, fails with "invalid format".

The input can also be a string, which is parsed the same way [`into datetime`](/commands/docs/into_datetime.md) parses it, or a list of datetimes and strings:

```nu
["2024-01-15" 2024-02-01] | format date "%F"
# => ╭───┬────────────╮
# => │ 0 │ 2024-01-15 │
# => │ 1 │ 2024-02-01 │
# => ╰───┴────────────╯
```

A string that isn't a date fails with `nu::shell::datetime_parse_error`. A record or table is rejected, so format a column with `update`, as in `$table | update modified { format date "%F" }`.

Month and day names, and the locale-dependent specifiers `%c`, `%x`, `%X` and `%r`, follow a locale. Nushell takes it from `$env.LC_ALL`, then `$env.LC_TIME`, then `$env.LANG`, and then from the operating system, falling back to US English:

```nu
$env.LC_TIME = "de_DE"
2024-01-15T10:30:00Z | format date "%A, %d.%m.%Y"
# => Montag, 15.01.2024
```

## Common commands that can be used with `datetime`

Many of Nushell's builtin commands are datetime aware and output or use `datetime` values
for fields and expressions. For example:

- `date` and its subcommands
- `format date`
- `into datetime`
- `ls` (the `modified` column)
- `ps --long` (the `start_time` column)
- `sys host` (the `boot_time` column)
