---
title: into int
categories: |
  conversions
version: 0.75.0
conversions: |
  Convert value to integer
usage: |
  Convert value to integer
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into int ...rest --radix --little-endian```

## Parameters

 -  `...rest`: for a data structure input, convert data at the given cell paths
 -  `--radix {number}`: radix of integer
 -  `--little-endian`: use little-endian byte decoding

## Examples

Convert string to integer in table
```shell
> [[num]; ['-5'] [4] [1.5]] | into int num
```

Convert string to integer
```shell
> '2' | into int
```

Convert decimal to integer
```shell
> 5.9 | into int
```

Convert decimal string to integer
```shell
> '5.9' | into int
```

Convert file size to integer
```shell
> 4KB | into int
```

Convert bool to integer
```shell
> [false, true] | into int
```

Convert date to integer (Unix timestamp)
```shell
> 2022-02-02 | into int
```

Convert to integer from binary
```shell
> '1101' | into int -r 2
```

Convert to integer from hex
```shell
> 'FF' |  into int -r 16
```

Convert octal string to integer
```shell
> '0o10132' | into int
```

Convert 0 padded string to integer
```shell
> '0010132' | into int
```

Convert 0 padded string to integer with radix
```shell
> '0010132' | into int -r 8
```
