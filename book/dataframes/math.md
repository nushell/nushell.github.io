# Math Expressions

The [Expression operators](../dataframes.md#expression-operators) section of the [Dataframes](../dataframes.md) chapter covers arithmetic with `+`, `-`, `*`, `/`, `//`, `mod`, and `**`. The [`polars math`](/commands/docs/polars_math.md) commands add math functions on top of those. Each one takes an expression, such as `polars col x`, or a [selector](./selectors.md), and returns a new expression, which you then use in `polars select`, `polars with-column`, or `polars agg`. They don't take a dataframe, so `$df | polars math abs` fails with `Command does not support polars_dataframe input`. For Nushell numbers and lists, use the built-in [`math`](/commands/docs/math.md) commands.

`polars math` on its own prints its help and the list of subcommands.

[[toc]]

The result of each function keeps the name of the column it came from, so give it a new name with `polars as` when you keep the original column next to it. Given a selector, the function applies to every column the selector matches, and each result keeps its own name. Null values stay null.

## Functions applied to each value

These commands return one value per row:

| Command                                                    | Result for each value                      |
| ---------------------------------------------------------- | ------------------------------------------ |
| [`polars math abs`](/commands/docs/polars_math_abs.md)     | the absolute value                         |
| [`polars math sign`](/commands/docs/polars_math_sign.md)   | `-1`, `0`, or `1`                          |
| [`polars math sqrt`](/commands/docs/polars_math_sqrt.md)   | the square root, or `NaN` for a negative   |
| [`polars math exp`](/commands/docs/polars_math_exp.md)     | e raised to the value                      |
| [`polars math log`](/commands/docs/polars_math_log.md)     | the logarithm, natural unless given a base |
| [`polars math log1p`](/commands/docs/polars_math_log1p.md) | the natural logarithm of 1 plus the value  |
| [`polars math sin`](/commands/docs/polars_math_sin.md)     | the sine of an angle in radians            |
| [`polars math cos`](/commands/docs/polars_math_cos.md)     | the cosine of an angle in radians          |

`polars math abs` and `polars math sign` keep the column's type, so an integer column gives integers. The others return floats, and an integer column gives `f64`:

```nu
let readings = [[x]; [-4] [0] [9]] | polars into-df
$readings | polars select [
    (polars col x)
    (polars col x | polars math abs | polars as abs)
    (polars col x | polars math sign | polars as sign)
    (polars col x | polars math sqrt | polars as sqrt)
] | polars collect
# => ╭───┬────┬─────┬──────┬──────╮
# => │ # │ x  │ abs │ sign │ sqrt │
# => ├───┼────┼─────┼──────┼──────┤
# => │ 0 │ -4 │   4 │   -1 │  NaN │
# => │ 1 │  0 │   0 │    0 │ 0.00 │
# => │ 2 │  9 │   9 │    1 │ 3.00 │
# => ╰───┴────┴─────┴──────┴──────╯
```

`polars math log` takes an optional base, which defaults to e. `log 10` gives the common logarithm and `log 2` the binary one. The logarithm of 0 is `-inf` and the logarithm of a negative number is `NaN`, and the same goes for `polars math log1p` at -1 and below:

```nu
[[x]; [-1] [0] [1] [10]] | polars into-df | polars select [
    (polars col x)
    (polars col x | polars math exp | polars as exp)
    (polars col x | polars math log | polars as ln)
    (polars col x | polars math log 10 | polars as log10)
    (polars col x | polars math log1p | polars as log1p)
] | polars collect
# => ╭───┬────┬──────────┬──────┬───────┬───────╮
# => │ # │ x  │   exp    │  ln  │ log10 │ log1p │
# => ├───┼────┼──────────┼──────┼───────┼───────┤
# => │ 0 │ -1 │     0.37 │  NaN │   NaN │  -inf │
# => │ 1 │  0 │     1.00 │ -inf │  -inf │  0.00 │
# => │ 2 │  1 │     2.72 │ 0.00 │  0.00 │  0.69 │
# => │ 3 │ 10 │ 22026.47 │ 2.30 │  1.00 │  2.40 │
# => ╰───┴────┴──────────┴──────┴───────┴───────╯
```

The base is a number. For a different base on each row, divide two natural logarithms:

```nu
[[x b]; [8 2] [81 3] [1000 10]] | polars into-df | polars select [
    (polars col x)
    (polars col b)
    ((polars col x | polars math log) / (polars col b | polars math log) | polars as log_b)
] | polars collect
# => ╭───┬──────┬────┬───────╮
# => │ # │  x   │ b  │ log_b │
# => ├───┼──────┼────┼───────┤
# => │ 0 │    8 │  2 │  3.00 │
# => │ 1 │   81 │  3 │  4.00 │
# => │ 2 │ 1000 │ 10 │  3.00 │
# => ╰───┴──────┴────┴───────╯
```

`polars math sin` and `polars math cos` work in radians. Multiply degrees by π/180 first. The results are floating point, so the sine of 180 degrees comes out near 1.2e-16 rather than exactly 0, which the table shows as `0.00`:

```nu
[[deg]; [0] [90] [180]] | polars into-df | polars select [
    (polars col deg)
    ((polars col deg) * 3.141592653589793 / 180 | polars math sin | polars as sin)
    ((polars col deg) * 3.141592653589793 / 180 | polars math cos | polars as cos)
] | polars collect
# => ╭───┬─────┬──────┬───────╮
# => │ # │ deg │ sin  │  cos  │
# => ├───┼─────┼──────┼───────┤
# => │ 0 │   0 │ 0.00 │  1.00 │
# => │ 1 │  90 │ 1.00 │  0.00 │
# => │ 2 │ 180 │ 0.00 │ -1.00 │
# => ╰───┴─────┴──────┴───────╯
```

## Dot product

[`polars math dot`](/commands/docs/polars_math_dot.md) multiplies a column by another expression row by row and adds up the products, so it returns a single value. Rows where either side is null are left out of the sum. In `polars agg`, it returns one value per group:

```nu
let lines = [[order qty price]; [1 2 1.5] [1 4 0.25] [2 1 10.0]] | polars into-df
$lines | polars select (polars col qty | polars math dot (polars col price) | polars as total) | polars collect
# => ╭───┬───────╮
# => │ # │ total │
# => ├───┼───────┤
# => │ 0 │ 14.00 │
# => ╰───┴───────╯
$lines | polars group-by order | polars agg (polars col qty | polars math dot (polars col price) | polars as total) | polars sort-by order | polars collect
# => ╭───┬───────┬───────╮
# => │ # │ order │ total │
# => ├───┼───────┼───────┤
# => │ 0 │     1 │  4.00 │
# => │ 1 │     2 │ 10.00 │
# => ╰───┴───────┴───────╯
```

The argument can also be a number, so `polars math dot 2` gives twice the column's sum. A string is a literal, not a column name, so `polars math dot price` fails when collected with `` `sum` operation not supported for dtype `str` ``. A selector as the argument fails with `Second expression to compute dot product with must be provided`.

## Bitwise aggregations

[`polars math bitwise-and`](/commands/docs/polars_math_bitwise-and.md), [`polars math bitwise-or`](/commands/docs/polars_math_bitwise-or.md), and [`polars math bitwise-xor`](/commands/docs/polars_math_bitwise-xor.md) combine all the values in a column into one value, the way `polars sum` does. They skip nulls, and in `polars agg` they combine each group separately. In binary, 14 is `1110`, 7 is `0111`, and 6 is `0110`:

```nu
let bits = [[x]; [14] [7] [6]] | polars into-df
$bits | polars select [
    (polars col x | polars math bitwise-and | polars as and)
    (polars col x | polars math bitwise-or | polars as or)
    (polars col x | polars math bitwise-xor | polars as xor)
] | polars collect
# => ╭───┬─────┬────┬─────╮
# => │ # │ and │ or │ xor │
# => ├───┼─────┼────┼─────┤
# => │ 0 │   6 │ 15 │  15 │
# => ╰───┴─────┴────┴─────╯
```

They work on integer and boolean columns. On a boolean column, `bitwise-and` is `true` when every value is true, and `bitwise-or` when any value is. A float column fails with an error such as `dtype f64 not supported in 'and' operation`.

## Counting bits

These commands count bits in each value and return a `u32` column:

| Command                                                                                      | Counts                                  |
| -------------------------------------------------------------------------------------------- | --------------------------------------- |
| [`polars math bitwise-count-ones`](/commands/docs/polars_math_bitwise-count-ones.md)         | bits set to 1                           |
| [`polars math bitwise-count-zeros`](/commands/docs/polars_math_bitwise-count-zeros.md)       | bits set to 0                           |
| [`polars math bitwise-leading-ones`](/commands/docs/polars_math_bitwise-leading-ones.md)     | 1 bits before the first 0, from the top |
| [`polars math bitwise-leading-zeros`](/commands/docs/polars_math_bitwise-leading-zeros.md)   | 0 bits before the first 1, from the top |
| [`polars math bitwise-trailing-ones`](/commands/docs/polars_math_bitwise-trailing-ones.md)   | 1 bits after the last 0, at the bottom  |
| [`polars math bitwise-trailing-zeros`](/commands/docs/polars_math_bitwise-trailing-zeros.md) | 0 bits after the last 1, at the bottom  |

`bitwise-count-zeros` and the leading counts depend on how wide the column's type is. For 0 and for negative numbers, the other counts can depend on it too. Nushell integers become `i64` columns, which have 64 bits, so 6 has 62 zero bits. Cast the column to a narrower type, such as `u8`, to count within 8 bits:

```nu
$bits | polars select [
    (polars col x)
    (polars col x | polars math bitwise-count-ones | polars as ones)
    (polars col x | polars math bitwise-count-zeros | polars as zeros)
    (polars col x | polars math bitwise-leading-zeros | polars as lead0)
    (polars col x | polars math bitwise-trailing-ones | polars as trail1)
] | polars collect
# => ╭───┬────┬──────┬───────┬───────┬────────╮
# => │ # │ x  │ ones │ zeros │ lead0 │ trail1 │
# => ├───┼────┼──────┼───────┼───────┼────────┤
# => │ 0 │ 14 │    3 │    61 │    60 │      0 │
# => │ 1 │  7 │    3 │    61 │    61 │      3 │
# => │ 2 │  6 │    2 │    62 │    61 │      0 │
# => ╰───┴────┴──────┴───────┴───────┴────────╯
$bits | polars cast u8 x | polars select [
    (polars col x)
    (polars col x | polars math bitwise-count-zeros | polars as zeros)
    (polars col x | polars math bitwise-leading-zeros | polars as lead0)
] | polars collect
# => ╭───┬────┬───────┬───────╮
# => │ # │ x  │ zeros │ lead0 │
# => ├───┼────┼───────┼───────┤
# => │ 0 │ 14 │     5 │     4 │
# => │ 1 │  7 │     5 │     5 │
# => │ 2 │  6 │     6 │     5 │
# => ╰───┴────┴───────┴───────╯
```

Signed integers are stored in two's complement, so `-1` in an `i64` column has 64 one bits and 64 leading ones. Boolean columns count as one bit, and float columns fail with an error such as `dtype f64 not supported in 'count_ones' operation`.
