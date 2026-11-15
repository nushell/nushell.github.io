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
- Underscores can be used as digit separators in literals, e.g. `1_000_000`. Nushell drops every `_` wherever it appears, so `_1`, `1_` and `1__0` are the ints `1`, `1` and `10`. The same goes for hex, octal and binary literals: `0x10_00` is `4096`.
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

- An int combined with a float gives a float. See [Float](float.md#additional-language-notes).

## Integer literals

A decimal literal has to fit in a signed 64-bit int, from `-9223372036854775808` to `9223372036854775807`. A larger one is a parse error. Add `.0` to make it a float instead:

```nu
9223372036854775808
# => Error: nu::parser::error
# =>
# =>   × Invalid literal
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ 9223372036854775808
# =>    · ─────────┬─────────
# =>    ·          ╰── number too large (add `.0` for a float) in int
# =>    ╰────
```

Hex (`0x`), octal (`0o`) and binary (`0b`) literals can have a sign before the prefix, so `-0x10` is `-16` and `-0b101` is `-5`. The prefixes are lowercase only.

Nushell reads a hex, octal or binary literal as the 64 bits of the int, not as a signed number. Every 64-bit pattern can be written this way, and the upper half of the unsigned range comes out negative. A decimal literal with the same value would be rejected:

```nu
[0x7fffffffffffffff 0x8000000000000000 0xffffffffffffffff] | to nuon
# => [9223372036854775807, -9223372036854775808, -1]
```

More than 64 bits, as in `0x10000000000000000`, is a parse error ("number too large for 64 bits").

A digit that doesn't belong to the base is reported where Nushell expects a value. `echo 0xZZ` fails with "invalid digits for radix 16", and `echo 0o9` with "invalid digits for radix 8". At the start of a pipeline, though, the same word is read as the name of an external command, so `0xZZ` on its own fails with "Command `0xZZ` not found". An uppercase prefix never makes a number: `echo 0X10` prints the string `0X10`, and `0X10` alone looks for a command with that name.

## Arithmetic errors

Integer arithmetic doesn't wrap around. A result outside the 64-bit range is a `nu::shell::operator_overflow` error. That covers `+`, `-`, `*` and `**`, and also `-9223372036854775808 // -1`, the one division that overflows:

```nu
9223372036854775807 + 1
# => Error: nu::shell::operator_overflow
# =>
# =>   × Operator overflow.
# =>    ╭─[repl_entry #1:1:21]
# =>  1 │ 9223372036854775807 + 1
# =>    ·                     ┬
# =>    ·                     ╰── add operation overflowed
# =>    ╰────
# =>   help: Consider using floating point values for increased range by promoting
# =>         operand with 'into float'. Note: float has reduced precision!
```

An int raised to a negative power, such as `2 ** -1`, is a `nu::shell::incorrect_value` error, since the result isn't an int. Use a float base: `2.0 ** -1` is `0.5`.

Division by zero is an error for `/`, `//` and `mod`. That holds for floats too, and for file sizes and durations divided by zero:

```nu
1.5 mod 0.0
# => Error: nu::shell::division_by_zero
# =>
# =>   × Division by zero.
# =>    ╭─[repl_entry #1:1:5]
# =>  1 │ 1.5 mod 0.0
# =>    ·     ─┬─
# =>    ·      ╰── division by zero
# =>    ╰────
```

Float arithmetic doesn't overflow with an error. A float result too large to represent becomes `inf`, so `1e308 * 10` is `inf`. See [Infinity and NaN](float.md#infinity-and-nan).

`bit-shl` and `bit-shr` take a shift amount from 0 to 63. Any other amount, negative ones included, is an `operator_overflow` error whose help says "Limit operand to 0 <= rhs < 64". A shift inside that range drops the bits that move out without an error, so `1 bit-shl 63` is `-9223372036854775808`.

## Converting to int

[`into int`](/commands/docs/into_int.md) accepts these input types:

| Input      | Result                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `float`    | The value truncated toward zero, so `-1.9` gives `-1`. Use `math round`, `math floor` or `math ceil` to round instead.         |
| `bool`     | `1` for `true`, `0` for `false`                                                                                                |
| `filesize` | The number of bytes                                                                                                            |
| `duration` | The number of nanoseconds                                                                                                      |
| `datetime` | Nanoseconds since 1970-01-01T00:00:00Z. A date before 1677-09-21 or after 2262-04-11 is an error, because the count won't fit. |
| `string`   | The number the text holds (see below)                                                                                          |
| `binary`   | The bytes read as one number (see below)                                                                                       |

A string can hold a decimal number, or a hex, octal or binary number with a `0x`, `0o` or `0b` prefix. Leading and trailing whitespace is ignored, and so is the thousands separator of the system locale, so `"1,000"` is `1000` with an English locale. A decimal fraction or an exponent is truncated as a float would be: `"1.9"` gives `1`, and `"1e3"` gives `1000`. Unlike a literal, the text can't use `_` separators. Text that isn't a number is an error:

```nu
"1_000" | into int
# => Error: nu::shell::cant_convert
# =>
# =>   × Can't convert to int.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ "1_000" | into int
# =>    · ───┬───
# =>    ·    ╰── can't convert string to int
# =>    ╰────
# =>   help: string "1_000" does not represent a valid integer
```

`--radix` (`-r`) reads the string in another base, from 2 to 36. Letters stand for the digits above 9, in either case:

```nu
"ff" | into int --radix 16
# => 255
"zz" | into int --radix 36
# => 1295
```

With a radix other than 10, the string may have a sign and surrounding whitespace, but otherwise only digits of that base. The locale's thousands separator and a fraction aren't accepted, so `"1,000" | into int --radix 16` and `"ff.8" | into int --radix 16` are errors. A `0x`, `0o` or `0b` prefix takes precedence over `--radix`.

An int given `--radix` is written out in decimal, and those digits are read in the new base. A float is truncated to an int first. A digit that the base doesn't have, such as the `9` in `19 | into int --radix 8`, is an error:

```nu
"0x10" | into int --radix 2
# => 16
10 | into int --radix 16
# => 16
10.7 | into int --radix 16
# => 16
```

A binary value of up to 8 bytes becomes one int. `--endian` (`-e`) sets the byte order to `little`, `big`, or `native`, the default, which is the byte order of the machine running Nushell (little-endian on x86-64 and on most ARM systems). Without `--signed`, the bytes form an unsigned number. With `--signed`, the highest bit is the sign bit:

```nu
0x[01 02] | into int --endian big
# => 258
0x[01 02] | into int --endian little
# => 513
0x[ff] | into int
# => 255
0x[ff] | into int --signed
# => -1
```

An empty binary value gives `0`. More than 8 bytes is an error ("binary input is too large to convert to int"), and so are 8 unsigned bytes above the largest int, such as `0x[ff ff ff ff ff ff ff ff]` without `--signed`.

For a table or record, list the columns to convert as cell paths after the command. The other columns keep their values:

```nu
[[a b]; ["1" "2"]] | into int a | to nuon
# => [[a, b]; [1, "2"]]
```

## Common commands that can be used with `int`

- `into int`, [`into float`](float.md#converting-to-float)
- `math` subcommands, described in [Working with Numbers](/book/working_with_numbers.md#the-math-commands)
- `random int`, described in [Working with Numbers](/book/working_with_numbers.md#random-int-and-random-float)
- `bits` subcommands, described in [Working with Binary Data](/book/working_with_binary.md#the-bits-commands)
- `format bits` to show the binary representation, e.g. `42 | format bits` returns `00101010`
- `format number`, described under [To string](/book/working_with_strings.md#to-string)
