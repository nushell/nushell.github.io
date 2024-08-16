# Duration

|                       |                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **_Description:_**    | Represent a unit of a passage of time                                                                                              |
| **_Annotation:_**     | `duration`                                                                                                                         |
| **_Literal Syntax:_** | A numeric (integer or decimal) literal followed immediately by a duration unit (listed below). E.g., `10sec`, `987us`, `-34.65day` |
| **_Casts:_**          | [`into duration`](/commands/docs/into_duration.md)                                                                                 |
| **_See also:_**       | [Types of Data - Durations](/book/types_of_data.md#durations)                                                                      |

## Additional Language Notes

1. Durations are internally stored as a number of nanoseconds.

1. This chart shows all duration units currently supported:

   | Duration  | Length      |
   | --------- | ----------- |
   | `ns`      | nanosecond  |
   | `us`/`μs` | microsecond |
   | `ms`      | millisecond |
   | `sec`     | second      |
   | `min`     | minute      |
   | `hr`      | hour        |
   | `day`     | day         |
   | `wk`      | week        |

1. Datetime values can be combined with durations in calculations:

   ```nu
   > (date now) + 1day
   Tue, 13 Aug 2024 11:49:27 -0400 (in a day)
   > 2024-08-12T11:50:30-04:00 - 2019-05-10T09:59:12-07:00
   274wk 2day 22hr 51min 18sec
   ```

1. Months, years, centuries and millenniums are not precise as to the exact
   number of nanoseconds and thus are not valid duration literals. Users are free to define
   their own constants for specific months or years.

## Common commands that can be used with `duration`

- `sleep`
- `ps`
- `sys`

## Operators that can be used with `duration`

- `==`, `!=`, `<`, `<=`, `>`, `>=`
- `+`, `-`
