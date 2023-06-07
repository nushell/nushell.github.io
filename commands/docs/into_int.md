---
title: into int
categories: |
  conversions
version: 0.81.0
conversions: |
  Convert value to integer.
usage: |
  Convert value to integer.
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into int ...rest --radix --little-endian```

## Parameters

 -  `...rest`: for a data structure input, convert data at the given cell paths
 -  `--radix {number}`: radix of integer
 -  `--little-endian` `(-)`: use little-endian byte decoding

## Examples

Convert string to integer in table
```shell
> [[num]; ['-5'] [4] [1.5]] | into int num

```

Convert string to integer
```shell
> '2' | into int
2
```

Convert decimal to integer
```shell
> 5.9 | into int
5
```

Convert decimal string to integer
```shell
> '5.9' | into int
5
```

Convert file size to integer
```shell
> 4KB | into int
4000
```

Convert bool to integer
```shell
> [false, true] | into int
╭───┬───╮
│ 0 │ 0 │
│ 1 │ 1 │
╰───┴───╯

```

Convert date to integer (Unix nanosecond timestamp)
```shell
> 1983-04-13T12:09:14.123456789-05:00 | into int
419101754123456789
```

Convert to integer from binary
```shell
> '1101' | into int -r 2
13
```

Convert to integer from hex
```shell
> 'FF' |  into int -r 16
255
```

Convert octal string to integer
```shell
> '0o10132' | into int
4186
```

Convert 0 padded string to integer
```shell
> '0010132' | into int
10132
```

Convert 0 padded string to integer with radix
```shell
> '0010132' | into int -r 8
4186
```
