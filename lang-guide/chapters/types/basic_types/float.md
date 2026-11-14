# Float

|                       |                                                                                  |
| --------------------- | -------------------------------------------------------------------------------- |
| **_Description:_**    | Numbers with some fractional component                                           |
| **_Annotation:_**     | `float`                                                                          |
| **_Literal syntax:_** | A decimal numeric value including a decimal place. E.g., `1.5`, `2.0`, `-15.333` |
| **_Casts:_**          | [`into float`](/commands/docs/into_float.md)                                     |
| **_See also:_**       | [Types of Data - Floats](/book/types_of_data.md#floats-decimals)                  |

## Additional language notes

- Floats are internally represented as IEEE-754 floats with 64 bit precision.
- Scientific notation is supported in literals, e.g. `1e3` or `1.5e-3`. The `e` can also be uppercase: `1E-2` is `0.01`. An exponent too large for a float doesn't cause an error. The literal becomes `inf`, so `1e400` is `inf`.
- The digits before or after the decimal point can be left out: `.5` is `0.5`, `5.` is `5.0` and `-.5` is `-0.5`. Underscores separate digits anywhere in a float literal, as in `1_000.000_1`.
- A float is always displayed with a decimal point, even when it has no fractional part. The `/` operator always returns a float, even when both operands are integers (use `//` for integer division).
- Floats and integers can be compared with each other.

  ```nu
  10 / 2
  # => 5.0
  1e3
  # => 1000.0
  0.1 + 0.2
  # => 0.30000000000000004
  2.0 == 2
  # => true
  ```

- An int combined with a float by `+`, `-`, `*`, `/`, `//`, `mod` or `**` gives a float, even when the result is a whole number:

  ```nu
  [(1 + 1.5) (2 * 2.0) (7 // 2.0) (7 mod 2.0) (2 ** 2.0)] | to nuon
  # => [2.5, 4.0, 3.0, 1.0, 4.0]
  ```

- `into int` truncates the fractional part. Use `math round`, `math floor` or `math ceil` to round instead (see [Rounding](#rounding)).

## Rounding

[`math floor`](/commands/docs/math_floor.md) rounds down, [`math ceil`](/commands/docs/math_ceil.md) rounds up, and [`math round`](/commands/docs/math_round.md) rounds to the nearest whole number. A value exactly halfway rounds away from zero. All three return an `int`:

```nu
[-1.5 1.5 2.5] | each {|x| {x: $x, floor: ($x | math floor), ceil: ($x | math ceil), round: ($x | math round)} }
# => ╭───┬───────┬───────┬──────┬───────╮
# => │ # │   x   │ floor │ ceil │ round │
# => ├───┼───────┼───────┼──────┼───────┤
# => │ 0 │ -1.50 │    -2 │   -1 │    -2 │
# => │ 1 │  1.50 │     1 │    2 │     2 │
# => │ 2 │  2.50 │     2 │    3 │     3 │
# => ╰───┴───────┴───────┴──────┴───────╯
```

`math round --precision` (`-p`) keeps that many decimal places and returns a `float`. A negative precision rounds to tens, hundreds and so on:

```nu
[1.555 2.333] | math round --precision 2 | to nuon
# => [1.56, 2.33]
1234.5 | math round --precision -2
# => 1200.0
```

The rounding works on the stored binary value, so a decimal that a float can't hold exactly may round the other way: `1.005 | math round -p 2` is `1.0`.

The three commands accept other input too:

- An int comes back unchanged.
- A list or range of numbers gives a list, as in `1.5..3.5 | math ceil`, which is `[2, 3, 4]`.
- A file size or duration also comes back unchanged, since it is already a whole number of bytes or nanoseconds. `math round --precision` rejects them.
- A record has every field rounded, and each field must be a number, file size or duration. To round only some fields, name them as cell paths after the command: `{a: 1.26, b: 2.5} | math round -p 1 a` is `{a: 1.3, b: 2.5}`.

A table is not accepted. Round a column with `update` instead:

```nu
[[item price]; [a 1.25] [b 2.5]] | update price { math round } | to nuon
# => [[item, price]; [a, 1], [b, 3]]
```

## Infinity and NaN

The words `inf` and `NaN` are float literals for infinity and "not a number". Write `-inf` for negative infinity. `nan` is accepted as another spelling of `NaN`, and Nushell prints it as `NaN`. No other spelling is a float. `Nan`, `Inf` and `infinity` are bare-word strings:

```nu
[inf -inf nan NaN Nan Inf infinity] | to nuon
# => [inf, -inf, NaN, NaN, "Nan", "Inf", "infinity"]
```

[`into float`](/commands/docs/into_float.md) is more lenient with text. `'infinity' | into float` returns `inf`.

These values also come out of float arithmetic. A literal too large for a float becomes `inf` (`1e400` is `inf`), and so does a result too large for a float (`1e308 * 10` is `inf`). `inf - inf` is `NaN`. Division by zero is an error, even for floats, so `1.0 / 0` and `0.0 / 0.0` fail with `nu::shell::division_by_zero` instead of returning `inf` or `NaN`.

Comparisons follow IEEE-754. `inf == inf` is `true`, and `NaN` is not equal to anything, itself included:

```nu
NaN == NaN
# => false
NaN in [NaN]
# => false
```

Other places where they behave differently from ordinary floats:

- [`sort`](/commands/docs/sort.md) puts `NaN` after every other number: `[3 NaN 1 inf -inf] | sort` is `[-inf, 1, 3, inf, NaN]`.
- [`to nuon`](/commands/docs/to_nuon.md) writes `inf`, `-inf` and `NaN`, which `from nuon` reads back as floats. JSON has no such values, so [`to json`](/commands/docs/to_json.md) writes each of them as `null`.
- Converting to an int doesn't fail. `inf | into int` is the largest int, `9223372036854775807`, and `NaN | into int` is `0`. `math floor` and `math ceil` do the same, while `math round` rejects them with "cannot round non-finite number".
- A range can't start at `inf`, `-inf` or `NaN`. See [Range](range.md#range-errors).
