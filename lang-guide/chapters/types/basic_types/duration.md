# Duration

What it is: A value representing a unit of passage of time.

Annotation: `duration`

Durations are internally stored as a number of nanoseconds.

## Literals

to form a Duration literal you need to combine a numeric value with a a unit of time.
The numeric literal part must be a signed integer or floating point number literal.
The unit part must be one of a specific set of strings listed below.

```
<number><unit>

# E.g.

10sec
987us
-34.65day

```

This chart shows all duration units currently supported:

| Duration | Length          |
| -------- | --------------- |
| `1ns`    | one nanosecond  |
| `1us`    | one microsecond |
| `1ms`    | one millisecond |
| `1sec`   | one second      |
| `1min`   | one minute      |
| `1hr`    | one hour        |
| `1day`   | one day         |
| `1wk`    | one week        |

You can make fractional durations:

```nu
> 3.14day
3day 3hr 21min
```

And you can do calculations with durations:

```nu
> 30day / 1sec  # How many seconds in 30 days?
# => 2592000
```

Note: Months, years, centuries and milliniums are not precise as to the exact
number of nanoseconds thus are not valid duration literals.You are free to make
your own constants for specific months or years.

## Casts

The command `into duration` will convert various other data types into a duration. and is quite flexible. For a complete list of possible inputs, see `help into duration`

## Commands that use duration

- `sleep`
- `where`
  - In the comparison expression
- `ps`
- `sys`

## Operators that use duration

- `==`, `!=`, `<`, `<=`, `>`, `>=`
- `+`, `-`
