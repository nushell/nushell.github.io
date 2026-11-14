# Filesize

|                       |                                                                              |
| --------------------- | ---------------------------------------------------------------------------- |
| **_Description:_**    | Specialized numeric type to represent the size of files or a number of bytes |
| **_Annotation:_**     | `filesize`                                                                   |
| **_Literal Syntax:_** | A numeric value followed by a filesize unit (below). E.g., `5GB`, `1024B`    |
| **_Casts:_**          | [`into filesize`](/commands/docs/into_filesize.md)                           |
| **_See also:_**       | [Types of Data - File sizes](/book/types_of_data.md#file-sizes)              |

The `filesize` literal and display representations support both:

- Metric prefixes with a base of `1000`
- Binary-compatible kibibytes, mebibytes, etc. with a base of `1024`

The full list of `filesize` units is:

| Decimal (factor of 1000) | Binary (factor of 1024) |
| ------------------------ | ----------------------- |
| `B`: bytes               | `B`: bytes              |
| `kB`: kilobytes          | `KiB`: kibibytes        |
| `MB`: megabytes          | `MiB`: mebibytes        |
| `GB`: gigabytes          | `GiB`: gibibytes        |
| `TB`: terabytes          | `TiB`: tebibytes        |
| `PB`: petabytes          | `PiB`: pebibytes        |
| `EB`: exabytes           | `EiB`: exbibytes        |

::: tip
File size units in literals are case-insensitive. E.g., `1KiB`, `1kib`, and `1Kib` are all equivalent.
The unit argument of `format filesize`, however, must be written exactly as in the table above (e.g., `kB` or `KiB`).
:::

Other rules for `filesize` literals:

- A file size is stored as a whole number of bytes. A fraction of a byte is dropped, so `1.5B` is `1 B` and `0.1B` is `0 B`. Fractions of larger units work, and only the part below one byte is dropped: `1.5kB` is 1500 bytes.
- File sizes can be negative, as in `-1kB`, which displays as `-1.0 kB`.
- The number can have `_` separators, a leading `+`, or a leading dot: `1_000kB`, `+2kB` and `.5kB` are all file sizes. As with durations, a leading dot can't follow a sign, so `-.5kB` is a string. Write `-0.5kB` instead.
- The size has to fit in a signed 64-bit count of bytes, a little over 9.2 EB. `8EiB` and anything larger is a parse error:

  ```nu
  8EiB
  # => Error: nu::parser::literal_too_large
  # =>
  # =>   × Invalid literal
  # =>    ╭─[repl_entry #1:1:1]
  # =>  1 │ 8EiB
  # =>    · ──┬─
  # =>    ·   ╰── filesize too large
  # =>    ╰────
  ```

## Displaying file sizes

By default, file sizes are displayed with metric units:

```nu
1500B
# => 1.5 kB
1MB | format filesize kB
# => 1000 kB
```

Three settings in `$env.config.filesize` control the display:

- `unit` picks the unit. `"metric"`, the default, and `"binary"` choose a unit to fit each value, from the metric (`kB`, `MB`, ...) or binary (`KiB`, `MiB`, ...) column of the table above. A unit name shows every size in that unit: `"B"`, `"kB"`, `"MB"`, `"GB"`, `"TB"`, `"PB"`, `"EB"`, `"KiB"`, `"MiB"`, `"GiB"`, `"TiB"`, `"PiB"` or `"EiB"`. Unlike in literals, the case must match exactly. `"KB"` and `"kb"` are rejected with "Invalid value for $env.config.filesize.unit", even though `config nu --doc` lists `"KB"`.
- `show_unit` (default `true`) can be set to `false` to leave off the unit. With a fixed unit, every value has the same one anyway.
- `precision` (default `1`) is the number of decimal places. `null` shows all of them.

```nu
$env.config.filesize.unit = 'binary'
1500B
# => 1.4 KiB
$env.config.filesize.unit = 'MB'
1500B
# => 0.0 MB
```

### `format filesize`

[`format filesize`](/commands/docs/format_filesize.md) turns a file size into a string in the unit you name, whatever `$env.config.filesize.unit` says. A whole number in that unit is shown without decimals. Otherwise the number of decimal places comes from `$env.config.float_precision` (default `2`), not from `filesize.precision`:

```nu
1500B | format filesize kB
# => 1.50 kB
1MiB | format filesize KiB
# => 1024 KiB
```

An unknown unit, or one with the wrong case, is an error:

```nu
1500B | format filesize kb
# => Error: nu::shell::invalid_unit
# =>
# =>   × Invalid unit
# =>    ╭─[repl_entry #1:1:25]
# =>  1 │ 1500B | format filesize kb
# =>    ·                         ─┬
# =>    ·                          ╰── encountered here
# =>    ╰────
# =>   help: Supported units are: B, kB, MB, GB, TB, PB, EB, KiB, MiB, GiB, TiB,
# =>         PiB, EiB
```

For a record or table, name the columns to format as cell paths after the unit. Without them a record or table is rejected, and a plain list isn't accepted at all, so use `each` for a list:

```nu
[[name size]; [a 1500B] [b 2MB]] | format filesize KiB size
# => ╭───┬──────┬─────────────╮
# => │ # │ name │    size     │
# => ├───┼──────┼─────────────┤
# => │ 0 │ a    │ 1.46 KiB    │
# => │ 1 │ b    │ 1953.12 KiB │
# => ╰───┴──────┴─────────────╯
```

## Common commands that can work with `filesizes`

- `ls`
- `du`
- `ps`
- `sys mem`, `sys disks`, `sys net`
- `into filesize`, `format filesize`

Note: The `where` command and other filters can use filesize in comparison expressions.

## Common operators that can be used with `filesize`

- `==`, `!=`
- `+`, `-`
- `<`, `<=`, `>`, `>=`
- `*`, `/`, `//` and `mod` with a number, which return a filesize
- `/` with another filesize, which returns a `float` (use `//` for an `int`)
- `mod` with another filesize, which returns a filesize

  ```nu
  10MB / 2
  # => 5.0 MB
  1GiB / 1B
  # => 1073741824.0
  10kB // 3kB
  # => 3
  10kB mod 3kB
  # => 1.0 kB
  ```

A number can also go on the left of `*`, so `2 * 1kB` is `2.0 kB`. It can't go on the left of `/`: `2 / 1kB` is an error. Two file sizes can't be multiplied.

A file size and a plain number don't mix in `+`, `-`, `<`, `<=`, `>` or `>=`. `1kB > 1` and `1kB + 1` are parse errors, since a bare number has no unit. Compare with a file size instead (`1kB > 1B`). `==` and `!=` don't fail, but a file size never equals a number, so `1kB == 1000` is `false`.
