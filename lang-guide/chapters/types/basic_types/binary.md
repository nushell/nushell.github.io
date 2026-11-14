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

1. Incomplete bytes are left-padded with zeros. Spaces, commas and line breaks are ignored, so the padding applies to the literal as a whole, not to each group. `0x[1,2]` is the single byte `0x12`, not the two bytes `01` and `02`:

   ```nu
   0x[1 23] | to nuon
   # => 0x[0123]
   0x[1,2] | to nuon
   # => 0x[12]
   ```

2. Spaces, commas and line breaks can be used to improve readability, as in `0x[ffff ffff]`. A `#` comment can end a line inside the brackets:

   ```nu
   0x[
     de ad  # first half
     be ef
   ] | to nuon
   # => 0x[DEADBEEF]
   ```

3. In an octal literal, each byte is written as three octal digits between `000` and `377`. As with hex, the digits are read as one run and padded on the left, so `0o[1]` is the byte `0x01` and `0o[12 3]` is the byte `0o123`.

4. `0x[]` is an empty binary value, with a length of `0`.

5. The prefixes `0x`, `0o` and `0b` are lowercase only. Hex digits can be either case. `0X[ff]` is not a binary literal. At the start of a pipeline it is taken as a command name, and elsewhere it is a string.

6. A digit that doesn't belong to the base, or an octal byte above `377`, is a parse error. The help text names the digits the base accepts:

   ```nu
   0o[400]
   # => Error: nu::parser::invalid_binary_string
   # =>
   # =>   × Invalid binary string.
   # =>    ╭─[repl_entry #1:1:1]
   # =>  1 │ 0o[400]
   # =>    · ───┬───
   # =>    ·    ╰── invalid binary string
   # =>    ╰────
   # =>   help: octal strings must have a length that is a multiple of three and
   # =>         contain values between 0o000 and 0o377.
   ```

## Showing the bits with `format bits`

[`format bits`](/commands/docs/format_bits.md) returns a string of `0`s and `1`s, with a space between bytes. It accepts more than binary values:

- A binary value or a string shows its bytes in order. A string shows its UTF-8 bytes, so `"é" | format bits` is `11000011 10101001`.
- An int, file size, duration or bool is shown as a signed number in the fewest bytes that hold it: 1, 2, 4 or 8. A file size counts bytes and a duration counts nanoseconds, and `true` is `1`.

```nu
42 | format bits
# => 00101010
128 | format bits
# => 00000000 10000000
-1 | format bits
# => 11111111
1kB | format bits
# => 00000011 11101000
```

Numbers are shown in big-endian order by default. `--endian` (`-e`) takes `big`, `little` or `native`, the byte order of the machine running Nushell. It has no effect on binary values or strings:

```nu
258 | format bits --endian little
# => 00000010 00000001
```

For a table or record, name the columns to convert as cell paths after the command. A record or table without them, a list, and a float are all rejected:

```nu
[[a b]; [1 256]] | format bits a b | to nuon
# => [[a, b]; ["00000001", "00000001 00000000"]]
```

## Common commands that can be used with `binary`

- `into binary`
- `format bits` to show the bits of a binary value (or a number) as a string of `0`s and `1`s
- `bits` subcommands (see `help bits` for a list)
- `bytes` subcommands (see `help bytes` for a list)
- `encode`, `decode`
- `take`
- `chunks` to split binary into individual bytes or groups
