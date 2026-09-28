# Binary

|                       |                                                              |
| --------------------- | ------------------------------------------------------------ |
| **_Description:_**    | Represents binary data                                       |
| **_Annotation:_**     | `binary`                                                     |
| **_Literal Syntax:_** | `0x[ffffffff]` - hex-based binary representation             |
|                       | `0o[377 001]` - octal-based binary representation            |
|                       | `0b[10101010101]` - binary-based binary representation       |
| **_Casts:_**          | [`into binary`](/commands/docs/into_binary.md)               |
| **_See also:_**       | [Types of data - Binary](/book/types_of_data.md#binary-data) |

## Additional Language Notes

1. Incomplete bytes are left-padded with zeros. Spaces are ignored, so the padding applies to the literal as a whole:

   ```nu
   0x[1 23] | to nuon
   # => 0x[0123]
   ```

2. Spaces can be used to improve readability. For example, `0x[ffff ffff]`.

3. In an octal literal, each byte is written as three octal digits between `000` and `377`.

## Common commands that can be used with `binary`

- `into binary`
- `format bits` to show the bits of a binary value (or a number) as a string of `0`s and `1`s
- `bits` subcommands (see `help bits` for a list)
- `bytes` subcommands (see `help bytes` for a list)
- `encode`, `decode`
- `take`
- `chunks` to split binary into individual bytes or groups
