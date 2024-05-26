# Binary

What it is: A literal syntax for expressing binary data in your Nushell scripts.

Annotation: `binary`

Nushell offers a way of creating binary literals in your data. These are in one of three ways:

- `0x[ffffffff]` - hex-based binary representation
- `0o[1234567]` - octal-based binary representation
- `0b[10101010101]` - binary-based binary representation

The data inside of the `[]` represents a single data value of bits.

You can use spaces to make the literals more readable. For example, `0x[ffff ffff]`.

## Casts

The command `into binary` can convert other data types into a binary datatype.
See `help into binary` for a complete list of compatible input data types.
