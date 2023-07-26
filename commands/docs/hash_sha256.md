---
title: hash sha256
categories: |
  hash
version: 0.83.0
hash: |
  Hash a value using the sha256 hash algorithm
usage: |
  Hash a value using the sha256 hash algorithm
---

# <code>{{ $frontmatter.title }}</code> for hash

<div class='command-title'>{{ $frontmatter.hash }}</div>

## Signature

```> hash sha256 ...rest --binary```

## Parameters

 -  `...rest`: optionally sha256 hash data by cell path
 -  `--binary` `(-b)`: Output binary instead of hexadecimal representation

## Examples

Return the sha256 hash of a string, hex-encoded
```shell
> 'abcdefghijklmnopqrstuvwxyz' | hash sha256
71c480df93d6ae2f1efad1447c66c9525e316218cf51fc8d9ed832f2daf18b73
```

Return the sha256 hash of a string, as binary
```shell
> 'abcdefghijklmnopqrstuvwxyz' | hash sha256 --binary
Length: 32 (0x20) bytes | printable whitespace ascii_other non_ascii
00000000:   71 c4 80 df  93 d6 ae 2f  1e fa d1 44  7c 66 c9 52   q××××××/•××D|f×R
00000010:   5e 31 62 18  cf 51 fc 8d  9e d8 32 f2  da f1 8b 73   ^1b•×Q××××2××××s

```

Return the sha256 hash of a file's contents
```shell
> open ./nu_0_24_1_windows.zip | hash sha256

```
