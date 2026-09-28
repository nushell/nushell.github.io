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

<!-- TBD: semantics for comparison, NaN/InF. Future hashing. -->
