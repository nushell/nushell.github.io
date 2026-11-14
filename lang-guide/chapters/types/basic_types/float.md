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
- Scientific notation is supported in literals, e.g. `1e3` or `1.5e-3`.
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

- `into int` truncates the fractional part. Use `math round`, `math floor` or `math ceil` to round instead.

## Infinity and NaN

The words `inf` and `NaN` are float literals for infinity and "not a number". Write `-inf` for negative infinity. `nan` is accepted as another spelling of `NaN`, and Nushell prints it as `NaN`. No other spelling is a float. `Nan`, `Inf` and `infinity` are bare-word strings:

```nu
[inf -inf nan NaN Nan Inf infinity] | to nuon
# => [inf, -inf, NaN, NaN, "Nan", "Inf", "infinity"]
```

[`into float`](/commands/docs/into_float.md) is more lenient with text. `'infinity' | into float` returns `inf`.

These values also come out of float arithmetic. A literal too large for a float becomes `inf` (`1e400` is `inf`), and `inf - inf` is `NaN`. Division by zero is an error, even for floats, so `1.0 / 0` and `0.0 / 0.0` fail with `nu::shell::division_by_zero` instead of returning `inf` or `NaN`.

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
