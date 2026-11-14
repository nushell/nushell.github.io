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
|                       | [Working with Binary Data](/book/working_with_binary.md)     |

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

## Converting with `into binary`

[`into binary`](/commands/docs/into_binary.md) turns these types into bytes:

| Input      | Bytes                                                                           |
| ---------- | ------------------------------------------------------------------------------- |
| `int`      | The number as 8 bytes, two's complement                                         |
| `float`    | The number as an 8-byte IEEE 754 double                                         |
| `bool`     | The int `1` or `0` as 8 bytes                                                   |
| `filesize` | The number of bytes as an 8-byte int                                            |
| `duration` | The number of nanoseconds as an 8-byte int                                      |
| `string`   | Its UTF-8 bytes                                                                 |
| `datetime` | The UTF-8 bytes of its text in `ctime` form, such as `Thu Jan  1 00:00:01 1970` |
| `binary`   | Unchanged                                                                       |

`--endian` (`-e`) sets the byte order of the numbers: `little`, `big`, or `native`, the default, which is the byte order of the machine running Nushell (little-endian on x86-64 and most ARM systems). Pass it whenever the bytes leave the machine or get compared with fixed values:

```nu
[258 -1 1.5 true 1sec 1kB] | each { into binary --endian big } | to nuon
# => [0x[0000000000000102], 0x[FFFFFFFFFFFFFFFF], 0x[3FF8000000000000], 0x[0000000000000001], 0x[000000003B9ACA00], 0x[00000000000003E8]]
[258 -1 1.5 true 1sec 1kB] | each { into binary --endian little } | to nuon
# => [0x[0201000000000000], 0x[FFFFFFFFFFFFFFFF], 0x[000000000000F83F], 0x[0100000000000000], 0x[00CA9A3B00000000], 0x[E803000000000000]]
```

A datetime is written as text, not as a number. The text uses the time in the value's own offset and leaves the offset out, so `2024-03-05T14:30:00+02:00` becomes `Tue Mar  5 14:30:00 2024`. To store a datetime as a number, convert it with `into int` first, which gives nanoseconds since 1970.

`--compact` (`-c`) removes the zero bytes at the high end of the result, which are the trailing zeros for little-endian and the leading zeros for big-endian. It removes only zero bytes, so a negative int keeps all 8 bytes. A result with no nonzero byte, such as `0` or `0x[]`, becomes the single byte `0x[00]`. `--compact` uses the byte order to pick a side for strings and binary input too, even though `--endian` doesn't change their bytes:

```nu
258 | into binary --compact --endian big | to nuon
# => 0x[0102]
258 | into binary --compact --endian little | to nuon
# => 0x[0201]
-1 | into binary --compact | to nuon
# => 0x[FFFFFFFFFFFFFFFF]
0x[00 61 00] | into binary --compact --endian big | to nuon
# => 0x[6100]
```

[`into int`](/commands/docs/into_int.md) reads the bytes back with the same `--endian`, so `258 | into binary --endian big | into int --endian big` is `258`. See [Converting to int](int.md#converting-to-int).

For a record or a table, name the fields or columns to convert after the command. The others keep their values. A record or table without them is an error, and so is a list; use [`each`](/commands/docs/each.md) for a list:

```nu
[[a b]; [1 2]] | into binary b | to nuon
# => [[a, b]; [1, 0x[0200000000000000]]]
```

The output of an external command, or a file read with `open --raw`, is a byte stream. `into binary` only marks the stream as binary, so the stream is never collected as a string. The flags don't apply to a stream. See [Working with Binary Data](/book/working_with_binary.md#files-and-external-commands).

## Operators

These operators work on binary values:

- `++` joins two binary values, and `++=` appends to a mutable variable. Joining binary with a string is an error.
- `==` and `!=` compare the bytes. A binary value is never equal to a string, so `0x[61] == "a"` is `false`.
- `in` and `not-in` check whether a binary value is in a list, as in `0x[ff] in [0x[ff] 0x[00]]`.

Other operators are errors with binary values, including `+`, the `bit-` operators, `has`, `starts-with`, and `=~`. Use the [`bytes` and `bits` commands](/book/working_with_binary.md#the-bytes-commands) instead. A cell path can't index into binary data, so `0x[01 02 03] | get 1` is an error. `bytes at 1..1` returns the byte as binary, and `skip 1 | first` returns it as an int.

[`sort`](/commands/docs/sort.md) orders binary values byte by byte, with a value that is a prefix of another first:

```nu
[0x[02] 0x[01 ff] 0x[01]] | sort | to nuon
# => [0x[01], 0x[01FF], 0x[02]]
```

`<`, `>`, `<=` and `>=` are a parse error when Nushell can see that both sides are binary, as with two literals or a parameter typed `binary`. When one side's type isn't known, as with an untyped custom command parameter, the comparison runs and uses the same order as `sort`:

```nu
0x[02] < 0x[03]
# => Error: nu::parser::operator_unsupported_type
# =>
# =>   × The '<' operator does not work on values of type 'binary'.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ 0x[02] < 0x[03]
# =>    · ───┬── ┬
# =>    ·    │   ╰── does not support 'binary'
# =>    ·    ╰── binary
# =>    ╰────
def less [a b] { $a < $b }
less 0x[02] 0x[03]
# => true
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
- `bits` subcommands for bitwise math (see [The `bits` commands](/book/working_with_binary.md#the-bits-commands))
- `bytes` subcommands to search, slice and edit bytes (see [The `bytes` commands](/book/working_with_binary.md#the-bytes-commands))
- `hash` subcommands for checksums (see [Hashing with `hash`](/book/working_with_binary.md#hashing-with-hash))
- `encode`, `decode`
- `take`
- `chunks` to split binary into individual bytes or groups
