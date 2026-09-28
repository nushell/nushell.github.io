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

By default, file sizes are displayed with metric units (see `$env.config.filesize.unit`):

```nu
1500B
# => 1.5 kB
1MB | format filesize kB
# => 1000 kB
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

  ```nu
  10MB / 2
  # => 5.0 MB
  1GiB / 1B
  # => 1073741824.0
  ```
