# Working with Binary Data

Images, archives, checksums and some program output are raw bytes rather than text. Nushell holds bytes in the `binary` type. The [`bytes`](/commands/docs/bytes.md) commands search and edit bytes, the [`bits`](/commands/docs/bits.md) commands do bitwise math, and the [`hash`](/commands/docs/hash.md) commands compute checksums. The literal syntax, the bytes that [`into binary`](/commands/docs/into_binary.md) produces for each type, and the operators that accept binary values are in the [Language Guide entry for binary](/lang-guide/chapters/types/basic_types/binary.md).

## Getting binary data

A binary literal lists the bytes in hex, octal or binary digits, such as `0x[89 50 4e 47]`. See [binary literals](/lang-guide/chapters/types/basic_types/binary.md#additional-language-notes) for the details.

### Files and external commands

[`open`](/commands/docs/open.md) reads a file whose extension matches no `from` command as raw bytes, and `open --raw` does the same for any file. See [Opening in raw mode](./loading_data.md#opening-in-raw-mode). The output of an external command arrives the same way. Either way, the pipeline carries a byte stream, not yet a value. When Nushell collects the stream, it becomes a string if the bytes are valid UTF-8, and a binary value if they aren't. In the examples below, `notes.txt` holds the six bytes `hello` and a newline, and `logo.png` is a PNG image:

```nu
[(open --raw notes.txt | collect | describe) (open --raw logo.png | collect | describe)] | to nuon
# => [string, binary]
```

So a text file collects as a string, and the commands below that accept only binary reject it. Put `into binary` in front of them. It marks the stream as binary whatever the bytes are:

```nu
open --raw notes.txt | bytes length
# => Error: nu::shell::only_supports_this_input_type
# =>
# =>   × Input type not supported.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ open --raw notes.txt | bytes length
# =>    · ──┬─                   ──────┬─────
# =>    ·   │                          ╰── only binary input data is supported
# =>    ·   ╰── input type: string
# =>    ╰────
open --raw notes.txt | into binary | bytes length
# => 6
^printf hi | into binary | to nuon
# => 0x[6869]
```

[`complete`](/commands/docs/complete.md) follows the same rule for an external command's output. Its `stdout` field is a string when the output is valid UTF-8 and binary when it isn't, as described in [Using the `complete` command](./stdout_stderr_exit_codes.md#using-the-complete-command).

### Converting other values

`into binary` also converts values. A string becomes its UTF-8 bytes. Ints, floats, bools, durations and file sizes become 8-byte numbers, and the [byte layout](/lang-guide/chapters/types/basic_types/binary.md#converting-with-into-binary) depends on `--endian` and `--compact`. To get the bytes of a string in another character encoding, use [`encode`](/commands/docs/encode.md). Binary data written out as text, in hex or base64, comes back with [`decode hex`](/commands/docs/decode_hex.md) or [`decode base64`](/commands/docs/decode_base64.md):

```nu
"é" | into binary | to nuon
# => 0x[C3A9]
"é" | encode windows-1252 | to nuon
# => 0x[E9]
"4869" | decode hex | to nuon
# => 0x[4869]
```

[`bytes build`](/commands/docs/bytes_build.md) assembles a value from byte numbers and other binary values. See [Building and joining](#building-and-joining).

## How binary values look

A binary value on its own prints as a hex view. The first line gives the length. Each line after it has the offset of its first byte, up to sixteen bytes in hex, and the same bytes as characters:

```nu
0x[48 69 00 0a ff]
# => Length: 5 (0x5) bytes | null_char printable whitespace ascii_other non_ascii
# => 00000000:   48 69 00 0a  ff                                      Hi0_×
```

In the character column, a printable ASCII byte is itself, `0` is a null byte, `_` is ASCII whitespace other than a space, `•` is any other ASCII control byte, and `×` is a byte above `0x7f`. With colors on, the words after the length form a legend, each drawn in the color used for that class of byte. The `binary_*` keys in [`color_config`](./coloring_and_theming.md#color-configuration) set those colors. [`explore`](./explore.md#viewing-binary-data) shows binary data in a hex view you can scroll through.

Inside a table or a record, a binary value shows as a list of byte numbers, such as `[1, 2]` for `0x[01 02]`. The examples on this page end with [`to nuon`](/commands/docs/to_nuon.md), which writes binary as a `0x[...]` literal.

## List commands on binary data

Several commands that work on lists also work on binary data, one byte at a time. [`first`](/commands/docs/first.md), [`last`](/commands/docs/last.md), [`skip`](/commands/docs/skip.md) and [`take`](/commands/docs/take.md) return binary, [`chunks`](/commands/docs/chunks.md) returns a list of binary pieces, [`length`](/commands/docs/length.md) counts bytes, and the `++` operator joins two binary values. `first` and `last` without a count return the byte as an int:

```nu
0x[01 02 03 04 05] | skip 1 | first 2 | to nuon
# => 0x[0203]
0x[01 02 03] | first
# => 1
```

See [Counts and binary data](/lang-guide/chapters/filters/selecting_data.md#counts-and-binary-data) for more.

## The `bytes` commands

Apart from `bytes build` and [`bytes collect`](/commands/docs/bytes_collect.md), the `bytes` commands take a binary value as input. All of those except [`bytes split`](/commands/docs/bytes_split.md) also take a record or a table. Name the columns after the command's own arguments, and only those columns change. Without column names, a record or table is an error, and so is a named column that holds something other than binary:

```nu
[[name data]; [x 0x[0102]] [y 0x[03]]] | bytes length data
# => ╭───┬──────┬──────╮
# => │ # │ name │ data │
# => ├───┼──────┼──────┤
# => │ 0 │ x    │    2 │
# => │ 1 │ y    │    1 │
# => ╰───┴──────┴──────╯
```

[`bytes add`](/commands/docs/bytes_add.md), [`bytes at`](/commands/docs/bytes_at.md) and [`bytes length`](/commands/docs/bytes_length.md) also take a list of binary values and work on each one, so an empty list gives an empty list. With nothing piped in, every `bytes` command except `bytes build` fails with a "Pipeline empty" error, and `null` input is rejected. Patterns and the data to insert must be binary. A string argument is an error ("expected binary"), so write `("abc" | into binary)` for a text pattern. `bytes split` is the one exception and takes a string separator as well.

### Streams

`bytes at`, [`bytes starts-with`](/commands/docs/bytes_starts-with.md), [`bytes ends-with`](/commands/docs/bytes_ends-with.md) and `bytes split` read a byte stream as it arrives, so they take a text file or an external command's output without `into binary`. `bytes starts-with` stops after as many bytes as the pattern has, which makes it a cheap way to check a file's signature, even for a large file:

```nu
open --raw logo.png | bytes starts-with 0x[89 50 4e 47]
# => true
```

`bytes ends-with` reads the whole stream but keeps only the last bytes in memory. The other `bytes` commands that take input collect the stream into one value first, which is why text needs `into binary` before them.

### Building and joining

`bytes build` takes no input. Its arguments are binary values and ints from 0 to 255, each int being one byte. Spread a list with `...`. With no arguments the result is `0x[]`. A string or other type is an error, and so is an int outside that range. A negative number such as `-1` is read as a flag:

```nu
bytes build 0x[01] 2 ...[3 4] | to nuon
# => 0x[01020304]
bytes build 256
# => Error: nu::shell::incorrect_value
# =>
# =>   × Incorrect value.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ bytes build 256
# =>    · ─────┬───── ─┬─
# =>    ·      │       ╰── 256 is out of range for byte
# =>    ·      ╰── encountered here
# =>    ╰────
```

`bytes collect` joins a list of binary values into one, with an optional binary separator between them. The result is a byte stream, and an empty list gives `0x[]`. Every item must be binary:

```nu
[0x[01] 0x[02 03]] | bytes collect 0x[00] | to nuon
# => 0x[01000203]
1..3 | each { into binary --compact } | bytes collect | to nuon
# => 0x[010203]
```

### Length and slices

`bytes length` returns the number of bytes, and it can run in a `const` expression. For a single value it gives the same answer as `length`, but it also works on each item of a list and on named columns.

`bytes at` takes an int range. Indexes start at 0, `a..b` includes byte `b`, and `a..<b` stops before it. A negative index counts from the end, and a negative start needs parentheses: `(-2)..`. A range that runs past the end stops at the last byte, and a range that starts past the end, or ends before it starts, gives `0x[]`. A float range is an error:

```nu
let data = 0x[10 20 30 40 50]
[($data | bytes at 1..3) ($data | bytes at 1..<3) ($data | bytes at (-2)..) ($data | bytes at 3..10) ($data | bytes at 7..9)] | to nuon
# => [0x[203040], 0x[2030], 0x[4050], 0x[4050], 0x[]]
```

On a byte stream, `bytes at` reads only up to the end of the range. A stream's length isn't known in advance, so a negative index fails there. Collect the stream first:

```nu
^printf hello | bytes at (-2)..
# => Error: nu::shell::relative_range_on_infinite_stream
# =>
# =>   × Relative range values cannot be used with streams that don't have a known
# =>   │ length
# =>    ╭─[repl_entry #1:1:25]
# =>  1 │ ^printf hello | bytes at (-2)..
# =>    ·                         ───┬───
# =>    ·                            ╰── Relative range values cannot be used with streams that don't have a known length
# =>    ╰────
^printf hello | collect | into binary | bytes at (-2).. | to nuon
# => 0x[6C6F]
```

`bytes at` and [`bytes remove`](/commands/docs/bytes_remove.md) clear the `content_type` in the [metadata](./metadata.md), because a slice of a PNG file isn't a PNG file.

### Searching

[`bytes index-of`](/commands/docs/bytes_index-of.md) returns the index where the first match starts, or `-1` when there is none. `--end` (`-e`) returns the start of the last match instead. `--all` (`-a`) returns a list of every match, and an empty list when there is none, so the result type depends on the flag. Matches found by `--all` don't overlap, because the search continues after each match. It runs from the start, or from the end with `--end`, which also lists the indexes from last to first. When matches could overlap, the two directions can find different ones:

```nu
0x[01 02 03 02] | bytes index-of --end 0x[02]
# => 3
0x[aa aa aa] | bytes index-of --all 0x[aa aa] | to nuon
# => [0]
0x[aa aa aa] | bytes index-of --all --end 0x[aa aa] | to nuon
# => [1]
```

`bytes starts-with` and `bytes ends-with` return a bool. An empty pattern matches anything, and a pattern longer than the input never matches. They take a single value, a record, a table, or a stream, but not a list. An empty pattern is an error for `bytes index-of`, `bytes remove` and [`bytes replace`](/commands/docs/bytes_replace.md).

### Editing

`bytes add` puts its data at the start by default. `--end` (`-e`) puts it at the end. `--index` (`-i`) inserts it before the byte at that index, and with `--end` the index counts back from the end. An index past the length puts the data at the end, or at the start when combined with `--end`. A negative index is an error:

```nu
0x[01 02 03] | bytes add 0x[ff] | to nuon
# => 0x[FF010203]
0x[01 02 03] | bytes add 0x[ff] --index 1 | to nuon
# => 0x[01FF0203]
0x[01 02 03] | bytes add 0x[ff] --end --index 1 | to nuon
# => 0x[0102FF03]
```

`bytes remove` removes the first match, and `--end` removes the last one instead. `--all` removes every match, scanning from the start, and adding `--end` to `--all` changes nothing. `bytes replace` replaces the first match, or every match with `--all`. The replacement can have any length, including `0x[]`. When the pattern isn't there, both commands return the input unchanged, without an error.

```nu
0x[10 aa 20 aa] | bytes remove --end 0x[aa] | to nuon
# => 0x[10AA20]
0x[10 aa 20 aa] | bytes replace --all 0x[aa] 0x[] | to nuon
# => 0x[1020]
```

[`bytes reverse`](/commands/docs/bytes_reverse.md) reverses the order of the bytes, so `0x[01 02 03]` becomes `0x[030201]`.

### Splitting

`bytes split` takes binary input or a byte stream and returns a list of binary values. A string value is rejected; use [`split row`](/commands/docs/split_row.md) for text. The separator can be binary or a string, which stands for its UTF-8 bytes. A separator at the start or end of the input gives an empty piece there, empty input gives one empty piece, and an empty separator is an error:

```nu
0x[66 6f 6f 2c 62 61 72 2c] | bytes split "," | to nuon
# => [0x[666F6F], 0x[626172], 0x[]]
```

## The `bits` commands

The `bits` commands do bitwise math on an int, a binary value, or a list of either. The [`bit-and`, `bit-or`, `bit-xor`, `bit-shl` and `bit-shr` operators](./operators.md) do some of the same for ints. The commands add binary input, negation, rotation, and word sizes other than 64 bits. They also handle overflow differently: `1 bit-shl 63` is `-9223372036854775808`, while `1 | bits shl 63` is an error, as described under [Shifts](#shifts).

Text from a file or an external command needs `into binary` before it reaches a `bits` command, as described under [Streams](#streams). An empty list gives an empty list, while no input at all is a "Pipeline empty" error and `null` is rejected.

### And, or, and xor

[`bits and`](/commands/docs/bits_and.md), [`bits or`](/commands/docs/bits_or.md) and [`bits xor`](/commands/docs/bits_xor.md) combine the input with their argument. Both must be ints, or both binary:

```nu
[(0b1100 | bits and 0b1010) (0b1100 | bits or 0b1010) (0b1100 | bits xor 0b1010)] | to nuon
# => [8, 14, 6]
5 | bits and 0x[01]
# => Error: nu::shell::only_supports_this_input_type
# =>
# =>   × Input type not supported.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ 5 | bits and 0x[01]
# =>    · ┬            ───┬──
# =>    · │               ╰── only input, and argument, to be both int or both binary input data is supported
# =>    · ╰── input type: int and binary
# =>    ╰────
```

Ints are combined as 64-bit two's-complement numbers, so `-8 | bits and 0xff` is `248`. Binary values are combined byte by byte, and the result is as long as the longer one. The shorter one is padded with zero bytes, and `--endian` (`-e`) picks the side. `big` pads on the left, which lines up the last bytes, and `little` pads on the right, which lines up the first bytes. Any other value is an error. The default, `native`, is the byte order of the machine running Nushell. Values of the same length, and ints, don't depend on it, but pass `--endian` when the lengths differ:

```nu
0x[aa bb cc] | bits xor 0x[ff] --endian big | to nuon
# => 0x[AABB33]
0x[aa bb cc] | bits xor 0x[ff] --endian little | to nuon
# => 0x[55BBCC]
```

### Word size and sign

[`bits not`](/commands/docs/bits_not.md), [`bits shl`](/commands/docs/bits_shl.md), [`bits shr`](/commands/docs/bits_shr.md), [`bits rol`](/commands/docs/bits_rol.md) and [`bits ror`](/commands/docs/bits_ror.md) treat an int as a word of 1, 2, 4 or 8 bytes. `--number-bytes` (`-n`) sets the size, and any other size is an error. Without it, `bits shl` and `bits shr` use 8 bytes, while `bits not`, `bits rol` and `bits ror` use the smallest size that holds the number. A number too big for the word loses its high bits first: `300 | bits not -n 1` works on `44`, the low byte of `300` (`0x12c`).

An int is treated as unsigned unless it is negative or you pass `--signed` (`-s`). An unsigned result is a number from 0 up to the largest value the word holds. A signed result reads the word's top bit as the sign, and the automatic size is then the smallest signed size that holds the number:

```nu
3 | bits ror 1
# => 129
3 | bits ror 1 --number-bytes 2
# => 32769
3 | bits ror 1 --signed
# => -127
```

`--number-bytes` and `--signed` have no effect on binary input. A binary value is one number as long as the value itself, with its first byte the most significant.

### Not

`bits not` flips every bit. For an unsigned int and a word of 1, 2 or 4 bytes, the result stays inside the word. For a negative int, or with `--signed`, the result is the 64-bit flip, which is the negated number minus one, and `--number-bytes` is ignored. For binary data, every byte is flipped:

```nu
[0 5 256] | bits not | to nuon
# => [255, 250, 65279]
[0 5 256] | bits not --number-bytes 2 | to nuon
# => [65535, 65530, 65279]
[0 5 -6] | bits not --signed | to nuon
# => [-1, -6, 5]
0x[0f f0] | bits not | to nuon
# => 0x[F00F]
```

### Shifts

`bits shl` moves bits toward the high end and `bits shr` toward the low end. The positions they leave are filled with zeros, except that `bits shr` on a signed number copies the sign bit into them. For an int, the shift amount must be less than the word's bit count, so 0 to 63 by default. A larger or negative amount is an error.

Bits that move past the top of a 1, 2 or 4-byte word are dropped. In an unsigned 8-byte word, a result with the top bit set doesn't fit in Nushell's signed int, so it's an error ("result out of range for int"). With `--signed`, or for a negative number, the shift drops bits without an error, and the sign can flip:

```nu
200 | bits shl 1
# => 400
200 | bits shl 1 --number-bytes 1
# => 144
1 | bits shl 63
# => Error: nu::shell::error
# =>
# =>   × result out of range for int
# =>    ╭─[repl_entry #1:1:5]
# =>  1 │ 1 | bits shl 63
# =>    ·     ────┬───
# =>    ·         ╰── shifting left by 63 is out of range for the value 1
# =>    ╰────
# =>   help: Ensure the result fits in a 64-bit signed integer.
1 | bits shl 63 --signed
# => -9223372036854775808
240 | bits shr 2
# => 60
240 | bits shr 2 --number-bytes 1 --signed
# => -4
```

A binary value shifts as one number and keeps its length. The shift amount can be anything up to its length in bits, and shifting by the full length gives all zero bytes:

```nu
0x[ab cd] | bits shl 4 | to nuon
# => 0x[BCD0]
0x[ab cd] | bits shr 4 | to nuon
# => 0x[0ABC]
```

### Rotations

`bits rol` and `bits ror` rotate left and right, so the bits that leave one end come back at the other. The amount can be up to the word's bit count, or a binary value's length in bits. Rotating by exactly that much gives back the input, and a larger or negative amount is an error. In an unsigned 8-byte word, a result with the top bit set is an error ("result out of range for specified number"), as it is for shifts. With `--signed` it wraps to a negative number:

```nu
0b0000_0011 | bits rol 7
# => 129
1 | bits ror 1 --number-bytes 8
# => Error: nu::shell::error
# =>
# =>   × result out of range for specified number
# =>    ╭─[repl_entry #1:1:5]
# =>  1 │ 1 | bits ror 1 --number-bytes 8
# =>    ·     ────┬───
# =>    ·         ╰── rotating right by 1 is out of range for the value 1
# =>    ╰────
0x[12 34] | bits rol 4 | to nuon
# => 0x[2341]
```

## Hashing with `hash`

[`hash md5`](/commands/docs/hash_md5.md), [`hash sha256`](/commands/docs/hash_sha256.md) and [`hash sha512`](/commands/docs/hash_sha512.md) compute a digest of a string or binary value. The digest is 16 bytes for MD5, 32 for SHA-256 and 64 for SHA-512, so the hex text is 32, 64 or 128 characters long. The commands hash bytes. A string is hashed as its UTF-8 bytes, so a string and a file holding the same text get the same digest:

```nu
"abc" | hash md5
# => 900150983cd24fb0d6963f7d28e17f72
"abc" | into binary | hash md5
# => 900150983cd24fb0d6963f7d28e17f72
"é" | hash md5
# => 66ddcd97cfdeabb2f6fb8a999b4bc76f
"é" | encode windows-1252 | hash md5
# => 3406877694691ddd1dfb0aca54681407
```

Every byte counts, including a trailing newline, and most external commands end their output with one. Piped straight into `hash`, the newline is hashed. Assigned with `let`, the output loses its final newline, as [Working with external commands](./pipelines.md#working-with-external-commands) explains:

```nu
^echo abc | hash md5
# => 0bee89b07a248e27c83fc3d5951213c1
let out = ^echo abc; $out | hash md5
# => 900150983cd24fb0d6963f7d28e17f72
```

To hash a file, open it with `--raw`. Without it, `open` parses a file such as `data.json` into a record, and `hash` rejects a record. `hash` reads the whole stream into memory before hashing it.

The result is a lowercase hex string. `--binary` (`-b`) returns the digest as binary instead, which [`encode base64`](/commands/docs/encode_base64.md) or [`encode hex`](/commands/docs/encode_hex.md) can turn into other text forms:

```nu
"abc" | hash sha256 --binary | encode base64
# => ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0=
```

A list of strings or a list of binary values gives a list of digests, and a list that mixes the two is rejected. An empty list gives an empty list, no input at all is a "Pipeline empty" error, and `null` is rejected. For a record or table, name the columns to hash after the command. Ints and other types are rejected, so convert them with `into string` or `into binary` first:

```nu
{name: abc, size: 1} | hash md5 name | to nuon
# => {name: "900150983cd24fb0d6963f7d28e17f72", size: 1}
```
