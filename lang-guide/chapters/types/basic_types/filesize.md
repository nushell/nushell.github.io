# Filesize

What it is: Specialized numeric type to represent the size of files or a number of bytes.

Annotation: `filesize`

The literals and display representations support both metric prefixes with a base of `1000` and the binary compatible kibibytes, mebibytes, etc. with a base of `1024`

```nu
1 kb
0.2 gb
20 mib
```

The full list of filesize units are:

- `b`: bytes
- `kb`: kilobytes (aka 1000 bytes)
- `mb`: megabytes
- `gb`: gigabytes
- `tb`: terabytes
- `pb`: petabytes
- `eb`: exabytes
- `kib`: kibibytes (aka 1024 bytes)
- `mib`: mebibytes
- `gib`: gibibytes
- `tib`: tebibytes
- `pib`: pebibytes
- `eib`: exbibytes

As with durations, you can make fractional file sizes, and do calculations:

```nu
> 1Gb / 1b
1000000000
> 1Gib / 1b
1073741824
> (1Gib / 1b) == 2 ** 30
true
```

## Casts

The command `into filesize` will convert a variety of other data types
into a filesize value. For the complete list of inputs see: `help into filesize`.

## Commands that use filesize

- `ls`
- `du`
- `sys`

Note: The where command and other filters can use filesize in comparison expressions.

## Operators that use filesize

- `==`, `!=`
- `+`, `-`
- `<`, `<=`, `>`, `>=`
