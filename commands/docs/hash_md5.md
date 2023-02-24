---
title: hash md5
categories: |
  default
version: 0.76.0
default: |
  Hash a value using the md5 hash algorithm
usage: |
  Hash a value using the md5 hash algorithm
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> hash md5 ...rest --binary```

## Parameters

 -  `...rest`: optionally md5 hash data by cell path
 -  `--binary` `(-b)`: Output binary instead of hexadecimal representation

## Examples

Return the md5 hash of a string, hex-encoded
```shell
> 'abcdefghijklmnopqrstuvwxyz' | hash md5
```

Return the md5 hash of a string, as binary
```shell
> 'abcdefghijklmnopqrstuvwxyz' | hash md5 --binary
```

Return the md5 hash of a file's contents
```shell
> open ./nu_0_24_1_windows.zip | hash md5
```
