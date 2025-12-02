# Binary

|                       |                                                              |
| --------------------- | ------------------------------------------------------------ |
| **_Description:_**    | Represents binary data                                       |
| **_Annotation:_**     | `binary`                                                     |
| **_Literal Syntax:_** | `0x[ffffffff]` - hex-based binary representation             |
|                       | `0o[1234567]` - octal-based binary representation            |
|                       | `0b[10101010101]` - binary-based binary representation       |
| **_Casts:_**          | [`into binary`](/commands/docs/into_binary.md)               |
| **_See also:_**       | [Types of data - Binary](/book/types_of_data.md#binary-data) |

## Additional Language Notes

1. Incomplete bytes are left-padded with zeros.

2. Spaces can be used to improve readability. For example, `0x[ffff ffff]`.

## Common commands that can be used with `binary`

- `into binary`
- `bits` subcommands (see `help bits` for a list)
- `bytes` subcommands (see `help bytes` for a list)
- `encode`
- `take`
- `chunks` to split binary into individual bytes or groups
