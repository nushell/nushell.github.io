# Integer

|                     |                                                                                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description:**    | Numbers without a fractional component (positive, negative, and 0)                                                                                        |
| **Annotation:**     | `int`                                                                                                                                                     |
| **Literal syntax:** | A decimal, hex, octal, or binary numeric value without a decimal place. E.g., `-100`, `0`, `50`, `+50`, `0xff` (hex), `0o234` (octal), `0b10101` (binary) |
| **Casts**:          | [`into int`](/commands/docs/into_int.md)                                                                                                                  |
| **See also:**       | [Types of Data - Integers](/book/types_of_data.md#integers)                                                                                               |

## Additional Language Notes

- Integers are internally represented as signed 64-bit numbers with two's-complement arithmetic. An operation that overflows this range raises an `operator_overflow` error rather than wrapping around.
- Underscores can be used as digit separators in literals, e.g. `1_000_000`.
- The `/` operator always returns a `float`. Use `//` for floor division, which returns an `int`. `mod` uses the same floor semantics, so the result has the sign of the divisor:

  ```nu
  7 / 2
  # => 3.5
  7 // 2
  # => 3
  -7 // 2
  # => -4
  -7 mod 3
  # => 2
  ```

## Common commands that can be used with `int`

- `into int`, `into float`
- `math` subcommands (see `help math` for a list)
- `bits` subcommands (see `help bits` for a list)
- `format bits` to show the binary representation, e.g. `42 | format bits` returns `00101010`
- `format number`
