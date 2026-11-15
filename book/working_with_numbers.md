# Working with Numbers

The arithmetic [operators](operators.md) cover most everyday math. This page covers the commands that go further: the [`math`](/commands/docs/math.md) commands, which summarize lists and tables or apply a function to each number, and the [`random`](/commands/docs/random.md) commands, which generate random numbers, strings, bytes and UUIDs. The rules of each number type, such as literals, overflow, division and rounding, are on the [Integer](/lang-guide/chapters/types/basic_types/int.md), [Float](/lang-guide/chapters/types/basic_types/float.md), [Duration](/lang-guide/chapters/types/basic_types/duration.md) and [Filesize](/lang-guide/chapters/types/basic_types/filesize.md) pages of the Language Guide.

## The `math` commands

`math` on its own only prints a list of its subcommands. They come in two groups:

- Aggregates reduce a list, a range, or each column of a table to one value. These are `math sum`, `math avg`, `math max`, `math min`, `math median`, `math mode`, `math product`, `math stddev` and `math variance`.
- Element-wise functions transform each number and keep the shape of the input. These are `math abs`, `math sqrt`, `math cbrt`, `math exp`, `math ln`, `math log`, the trigonometric and hyperbolic functions, and the rounding commands `math round`, `math floor` and `math ceil`.

[`math sum`](/commands/docs/math_sum.md) and [`math avg`](/commands/docs/math_avg.md) are described in [Summarizing and comparing lists](/lang-guide/chapters/filters/summarizing_lists.md#math-sum-and-math-avg), and the rounding commands under [Rounding](/lang-guide/chapters/types/basic_types/float.md#rounding). This page covers the rest.

Every `math` command takes its input from the pipeline. Words after the command name are column names (cell paths), except for the base that `math log` takes. `math exp`, `math ln`, and the trigonometric and hyperbolic functions take no arguments at all, so `math ln 0` is an "Extra positional argument" error. `math sqrt -1` fails with "unknown flag", because Nushell reads the `-1` there as a flag. `math sqrt 16` reads `16` as a row number, and like any `math` command without input, it fails:

```nu
math sqrt 16
# => Error: nu::shell::pipeline_mismatch
# =>
# =>   × Pipeline empty.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ math sqrt 16
# =>    · ────┬────
# =>    ·     ╰── no input value was piped in
# =>    ╰────
16 | math sqrt
# => 4.0
```

All `math` commands except `math exp`, `math ln`, and the trigonometric and hyperbolic functions can run while Nushell parses your code, so you can use them in a `const` definition. The others fail there with "Not a const command".

```nu
const LIMIT = ([3 8 1] | math max)
$LIMIT
# => 8
```

### What each command accepts

| Command                                             | Result for ints and floats             | Durations and file sizes      | Range | Records, tables and column names | Empty list |
| --------------------------------------------------- | -------------------------------------- | ----------------------------- | ----- | -------------------------------- | ---------- |
| `math max`, `math min`                              | the item itself                        | the item itself               | yes   | yes                              | error      |
| `math median`                                       | the middle item, or the average of two | same type                     | yes   | yes                              | error      |
| `math mode`                                         | a list of items                        | a list of items               | no    | yes                              | `[]`       |
| `math product`                                      | int, or float if any item is a float   | not accepted                  | yes   | yes                              | error      |
| `math stddev`                                       | float                                  | same type                     | yes   | yes                              | error      |
| `math variance`                                     | float                                  | float, in squared bytes or ns | yes   | yes                              | error      |
| `math abs`                                          | same type                              | same type                     | yes   | records only                     | `[]`       |
| `math sqrt`, `math cbrt`, `math log`                | float                                  | not accepted                  | yes   | records only                     | `[]`       |
| `math exp`, `math ln`, trigonometric and hyperbolic | float                                  | not accepted                  | no    | no                               | `[]`       |

A range has to have an end. `1.. | math max` and `1.. | math sqrt` fail with "Range must be bounded".

### Lists, tables and records

The aggregates handle tables and records the same way [`math sum`](/lang-guide/chapters/filters/summarizing_lists.md#math-sum-and-math-avg) does:

- A table gives a record with one result per column.
- A record gives one result per field. A field that holds a list is reduced to one value, and any other field is treated as a one-item list.
- A single number on its own is a type error, except for `math avg`.

Column names after the command limit the work to those columns. For a table, the result has only the named columns. For a record, the named fields are reduced and the other fields are left as they are. A column that doesn't exist is a `column_not_found` error.

```nu
let files = [[name size]; [a.txt 1kB] [c.txt 3kB] [b.txt 2kB]]
$files | math max
# => ╭──────┬────────╮
# => │ name │ c.txt  │
# => │ size │ 3.0 kB │
# => ╰──────┴────────╯
$files | math median size
# => ╭──────┬────────╮
# => │ size │ 2.0 kB │
# => ╰──────┴────────╯
{north: [3 9 4], south: [7 2]} | math max north | to nuon
# => {north: 9, south: [7, 2]}
```

The element-wise functions turn a list into a list of results, and an empty list into an empty list. `math abs`, `math sqrt`, `math cbrt` and `math log` do the same with a range, and they also take a record. They transform each field, and every number in a field that holds a list. Column names limit them to those fields:

```nu
{a: -1, b: [-2 -3]} | math abs | to nuon
# => {a: 1, b: [2, 3]}
{a: -1, b: [-2 -3]} | math abs a | to nuon
# => {a: 1, b: [-2, -3]}
```

Tables aren't part of their signatures. Apply the function to a column with [`update`](/commands/docs/update.md):

```nu
[[item change]; [a -3] [b 2]] | update change { math abs }
# => ╭───┬──────┬────────╮
# => │ # │ item │ change │
# => ├───┼──────┼────────┤
# => │ 0 │ a    │      3 │
# => │ 1 │ b    │      2 │
# => ╰───┴──────┴────────╯
```

When one number in a list is out of range for an element-wise function, the whole command fails, and the error points at that number:

```nu
[4 -1 9] | math sqrt
# => Error: nu::shell::unsupported_input
# =>
# =>   × Unsupported input
# =>    ╭─[repl_entry #1:1:4]
# =>  1 │ [4 -1 9] | math sqrt
# =>    ·    ─┬      ────┬────
# =>    ·     │          ╰── Can't square root a negative number
# =>    ·     ╰── value originates from here
# =>    ╰────
```

### `math max` and `math min`

[`math max`](/commands/docs/math_max.md) and [`math min`](/commands/docs/math_min.md) return the largest or smallest item as it is, so the type doesn't change: `[1 2.5] | math max` is `2.5`, and the maximum of a list of durations is a duration. They compare values the way [`sort`](/commands/docs/sort.md) does. That makes them work on strings and dates too, and on tables with text columns, which `math sum` rejects:

```nu
[banana apple cherry] | math max
# => cherry
[2024-03-01 2023-12-25 2024-01-15] | math min | format date "%F"
# => 2023-12-25
```

Some comparisons are less obvious:

- Items of different types are ordered by type, as in `sort`. A string, a duration or `null` counts as larger than any number, so `[1 a] | math max` is `a` and `[1 null 3] | math max` is `null`.
- An int and a float that are equal keep the first one: `[1 1.0] | math max` is the int `1`.
- `NaN` doesn't compare with anything. It wins when it is the first item and is skipped otherwise, so `[NaN 1 3] | math max` is `NaN` and `[1 NaN 3] | math max` is `3`.

An empty list is an error:

```nu
[] | math max
# => Error: nu::shell::unsupported_input
# =>
# =>   × Unsupported input
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ [] | math max
# =>    · ─┬   ────┬───
# =>    ·  │       ╰── Empty input
# =>    ·  ╰── value originates from here
# =>    ╰────
```

### `math median`

[`math median`](/commands/docs/math_median.md) sorts the items and returns the middle one. With an even number of items, it returns the average of the two middle ones, which is a float for ints and keeps the type for durations and file sizes:

```nu
[3 8 9] | math median
# => 8
[3 8 9 12] | math median
# => 8.5
[1sec 2min 30sec] | math median
# => 30sec
```

The items have to be numbers, durations or file sizes, and a list can't mix numbers with either unit. `NaN` items are left out, so a list of only `NaN` is an "Empty input" error, like an empty list.

### `math mode`

[`math mode`](/commands/docs/math_mode.md) returns a sorted list of the most frequent values. Every value that ties for most frequent is in the list, so a list with no repeats comes back whole, sorted. An empty list gives an empty list rather than an error:

```nu
[1 2 2 3 3] | math mode | to nuon
# => [2, 3]
[3 1 2] | math mode | to nuon
# => [1, 2, 3]
```

An int and a float count as different values even when they are equal, so `[1 1.0 1] | math mode` is `[1]`. `NaN` items are ignored. A range isn't accepted.

### `math product`

[`math product`](/commands/docs/math_product.md) multiplies the items. The result is an int when every item is an int, and a float otherwise. Durations and file sizes aren't accepted. An int result that doesn't fit in 64 bits is an error, as it is for `*`:

```nu
1..5 | math product
# => 120
[9223372036854775807 2] | math product
# => Error: nu::shell::operator_overflow
# =>
# =>   × Operator overflow.
# =>    ╭─[repl_entry #1:1:27]
# =>  1 │ [9223372036854775807 2] | math product
# =>    ·                           ──────┬─────
# =>    ·                                 ╰── multiply operation overflowed
# =>    ╰────
# =>   help: Consider using floating point values for increased range by promoting
# =>         operand with 'into float'. Note: float has reduced precision!
```

### `math stddev` and `math variance`

[`math stddev`](/commands/docs/math_stddev.md) and [`math variance`](/commands/docs/math_variance.md) compute the population standard deviation and variance, which divide by the number of items. With `--sample` (`-s`) they divide by one less than that, which is the usual choice when the list is a sample of a larger set. The sample versions need at least two items:

```nu
[2 4 4 4 5 5 7 9] | math stddev
# => 2.0
[2 4 4 4 5 5 7 9] | math stddev --sample
# => 2.138089935299395
[5] | math stddev --sample
# => Error: nu::shell::unsupported_input
# =>
# =>   × Unsupported input
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ [5] | math stddev --sample
# =>    · ─┬─   ─────┬─────
# =>    ·  │         ╰── Sample variance requires at least 2 values
# =>    ·  ╰── value originates from here
# =>    ╰────
```

For numbers, both return a float. For durations and file sizes, `math stddev` returns the same type, rounded to a whole nanosecond or byte. `math variance` can't do that, because Nushell has no type for squared bytes or squared nanoseconds. It returns a float that counts those base units:

```nu
[2kB 4kB] | math stddev
# => 1.0 kB
[2kB 4kB] | math variance
# => 1000000.0
```

A list that mixes numbers, durations and file sizes is an error.

### `math abs`

[`math abs`](/commands/docs/math_abs.md) returns the absolute value and keeps the type, so ints stay ints and durations stay durations:

```nu
[-1.5 -2 3] | math abs | to nuon
# => [1.5, 2, 3]
[-1sec 2sec] | math abs
# => ╭───┬──────╮
# => │ 0 │ 1sec │
# => │ 1 │ 2sec │
# => ╰───┴──────╯
```

The smallest int, `-9223372036854775808`, has no positive counterpart in 64 bits, so its absolute value is an `operator_overflow` error. The same holds for the smallest duration and file size.

### Roots, powers and logarithms

[`math sqrt`](/commands/docs/math_sqrt.md), [`math cbrt`](/commands/docs/math_cbrt.md), [`math exp`](/commands/docs/math_exp.md), [`math ln`](/commands/docs/math_ln.md) and [`math log`](/commands/docs/math_log.md) return floats, even for int input. For other powers, use the `**` operator, as in `2 ** 10`.

- `math sqrt` fails on a negative number, while `math cbrt` takes one: `-27 | math cbrt` is `-3.0`.
- `math exp` raises e to the power of the input. A result too large for a float is `inf`, so `710 | math exp` is `inf`.
- `math ln` is the natural logarithm, and `math log` takes the base as its argument. Both need input greater than 0. The base has to be a positive finite number other than 1.

```nu
[1 10 100] | math log 10 | to nuon
# => [0.0, 1.0, 2.0]
0 | math ln
# => Error: nu::shell::unsupported_input
# =>
# =>   × Unsupported input
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ 0 | math ln
# =>    · ┬   ───┬───
# =>    · │      ╰── 'ln' undefined for values outside the open interval (0, Inf).
# =>    · ╰── value originates from here
# =>    ╰────
10 | math log 1
# => Error: nu::shell::unsupported_input
# =>
# =>   × Unsupported input
# =>    ╭─[repl_entry #1:1:6]
# =>  1 │ 10 | math log 1
# =>    ·      ────┬─── ┬
# =>    ·          │    ╰── value originates from here
# =>    ·          ╰── Base has to be a finite number greater than 0 and not equal to 1
# =>    ╰────
```

The constant e is `$math.E` after `use std/math`. See [`std/math`](./standard_library/math.md) for it and the other constants.

### Trigonometric and hyperbolic functions

| Commands                                                                                                                                                                             | Input                  | Notes                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- | ------------------------------------------------------------- |
| [`math sin`](/commands/docs/math_sin.md), [`math cos`](/commands/docs/math_cos.md), [`math tan`](/commands/docs/math_tan.md)                                                         | any number, in radians | `--degrees` (`-d`) reads the input as degrees                 |
| [`math arcsin`](/commands/docs/math_arcsin.md), [`math arccos`](/commands/docs/math_arccos.md)                                                                                       | -1 to 1                | `--degrees` (`-d`) returns degrees                            |
| [`math arctan`](/commands/docs/math_arctan.md)                                                                                                                                       | any number             | `--degrees` (`-d`) returns degrees                            |
| [`math sinh`](/commands/docs/math_sinh.md), [`math cosh`](/commands/docs/math_cosh.md), [`math tanh`](/commands/docs/math_tanh.md), [`math arcsinh`](/commands/docs/math_arcsinh.md) | any number             | `math cosh` and `math sinh` overflow to `inf` for large input |
| [`math arccosh`](/commands/docs/math_arccosh.md)                                                                                                                                     | 1 or more              |                                                               |
| [`math arctanh`](/commands/docs/math_arctanh.md)                                                                                                                                     | -1 to 1                | `1` and `-1` give `inf` and `-inf`                            |

These commands take a number or a list of numbers, and nothing else: no ranges, records or column names. Input outside the range in the table is an error.

```nu
[0 30 90] | math sin --degrees | to nuon
# => [0.0, 0.49999999999999994, 1.0]
1 | math arctan --degrees
# => 45.0
2 | math arcsin
# => Error: nu::shell::unsupported_input
# =>
# =>   × Unsupported input
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ 2 | math arcsin
# =>    · ┬   ─────┬─────
# =>    · │        ╰── 'arcsin' undefined for values outside the closed interval [-1, 1].
# =>    · ╰── value originates from here
# =>    ╰────
```

A float can't hold π exactly, so a result that should be 0 comes out as a tiny number instead. In the same way, `90 | math tan --degrees` is `16331239353195370.0` rather than an error or `inf`. Round results with `math round --precision` before comparing them:

```nu
use std/math
$math.PI | math sin
# => 0.00000000000000012246467991473532
```

## Random values

Each [`random`](/commands/docs/random.md) subcommand returns one new value. None of them reads pipeline input, so call one inside [`each`](/commands/docs/each.md) to get many values. The generator is seeded by the operating system, and no command or flag sets the seed, so results can't be repeated from one run to the next. `random` on its own only prints its subcommands.

Three other commands also produce random results:

- [`shuffle`](/commands/docs/shuffle.md) returns the items of a list in random order.
- `random dice` from the [`std/random`](./standard_library/random.md) module rolls dice.
- `random choice` from the [`std-rfc/random`](./standard_library/std_rfc.md#std-rfc-random) module picks random items from a list.

Imported with `use std/random` and `use std-rfc/random`, without a `*`, both module commands keep their `random` prefix and sit next to the built-in ones.

### `random int` and `random float`

[`random int`](/commands/docs/random_int.md) and [`random float`](/commands/docs/random_float.md) take an optional range. A range written with `..` can return either end, and one written with `..<` leaves out the end:

```nu
1..1000 | each { random int 1..3 } | uniq | sort | to nuon
# => [1, 2, 3]
1..1000 | each { random int 1..<3 } | uniq | sort | to nuon
# => [1, 2]
```

- Without a range, `random int` returns an int from 0 to the largest int, and `random float` a float from 0 up to, but not including, 1.
- A range with no end goes up to the largest int or float, and a range with no start, such as `..10`, starts at 0.
- A range that counts down, such as `5..1`, is an `invalid_range` error.
- `random int` rejects a float range such as `1.0..2.0` with the error "float range". `random float` accepts an int range.

Put a range that starts with a negative number in parentheses. Otherwise Nushell reads it as a flag:

```nu
random int -5..5
# => Error: nu::parser::unknown_flag
# =>
# =>   × The `random int` command doesn't have flag `-5`.
# =>    ╭─[repl_entry #1:1:13]
# =>  1 │ random int -5..5
# =>    ·             ┬
# =>    ·             ╰── unknown flag
# =>    ╰────
# =>   help: Use `--help` to see available flags
random int (-5..5) | describe
# => int
```

### `random bool`

[`random bool`](/commands/docs/random_bool.md) returns `true` or `false` with equal odds. `--bias` (`-b`) sets the probability of `true`, from 0 to 1, so `--bias 0` always returns `false` and `--bias 1` always `true`. Any other value is an error:

```nu
random bool --bias 1.5
# => Error: nu::shell::invalid_probability
# =>
# =>   × Invalid Probability.
# =>    ╭─[repl_entry #1:1:13]
# =>  1 │ random bool --bias 1.5
# =>    ·             ─────┬────
# =>    ·                  ╰── invalid probability: must be between 0 and 1
# =>    ╰────
```

### `random chars` and `random binary`

[`random chars`](/commands/docs/random_chars.md) returns a string of ASCII letters and digits, 25 characters unless `--length` (`-l`) says otherwise. [`random binary`](/commands/docs/random_binary.md) returns random bytes and takes their number as its argument. Both lengths can be an int or a file size, so `1kB` means 1000 and `1KiB` means 1024:

```nu
random chars | str length
# => 25
random chars --length 1KiB | str length
# => 1024
random binary 16 | length
# => 16
```

Both commands produce a stream, so `random binary 1GB | save noise.bin` writes the bytes in chunks instead of holding a gigabyte in memory. A length of 0 gives an empty string or binary value, and a negative length is an `invalid_value` error.

### `random pass`

[`random pass`](/commands/docs/random_pass.md) generates a password from uppercase letters, lowercase letters, digits and these symbols: ``!@#$%^&*()_+-=[]{}|;':",.<>/?`~``.

- `--chars` (`-c`) sets the length, up to 128. The default is 12. A length of 0 or more than 128 is an error. The password always holds at least one character of each kind it uses, so it is never shorter than the number of kinds.
- `--no-uppercase` (`-u`), `--no-lowercase` (`-l`), `--no-numbers` (`-n`) and `--no-symbols` (`-s`) each leave out one kind of character. Leaving out all four is an error.

```nu
random pass | str length
# => 12
random pass -c 0
# => Error: nu::shell::error
# =>
# =>   × Password generation failed
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ random pass -c 0
# =>    · ─────┬─────
# =>    ·      ╰── Password length must be greater than 0
# =>    ╰────
```

### `random uuid`

[`random uuid`](/commands/docs/random_uuid.md) returns a UUID as a string. `--version` (`-v`) chooses how it is made:

| Version     | Made from                                                                                                                | Required flags                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| 4 (default) | random bits                                                                                                              | none                                           |
| 7           | the current time in milliseconds, then random bits, so sorting puts them in the order they were made, to the millisecond | none                                           |
| 1           | the current time and a MAC address                                                                                       | `--mac` (`-m`), written as `XX:XX:XX:XX:XX:XX` |
| 3 and 5     | a hash (MD5 for 3, SHA-1 for 5) of a namespace and a name                                                                | `--namespace` (`-n`) and `--name` (`-s`)       |

Versions 3 and 5 aren't random. The same namespace and name always give the same UUID, which makes them useful as stable IDs. The namespace is `dns`, `url`, `oid` or `x500`, in any case, or a UUID of your own:

```nu
random uuid -v 5 -n dns -s nushell.sh
# => 5f919cf0-bcef-592a-bfac-35635e121876
```

A missing required flag is a `missing_parameter` error. A flag that the version doesn't use, such as `--name` with version 4, is an `incompatible_parameters` error. Versions 2 and 6 aren't supported.
