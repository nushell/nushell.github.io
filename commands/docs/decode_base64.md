---
title: decode base64
categories: |
  hash
version: 0.84.0
hash: |
  Base64 decode a value.
usage: |
  Base64 decode a value.
---

# <code>{{ $frontmatter.title }}</code> for hash

<div class='command-title'>{{ $frontmatter.hash }}</div>

## Signature

```> decode base64 ...rest --character-set --binary```

## Parameters

 -  `...rest`: For a data structure input, decode data at the given cell paths
 -  `--character-set {string}`: specify the character rules for encoding the input.
	Valid values are 'standard', 'standard-no-padding', 'url-safe', 'url-safe-no-padding','binhex', 'bcrypt', 'crypt', 'mutf7'
 -  `--binary` `(-b)`: Output a binary value instead of decoding payload as UTF-8


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| list\<string\> | list\<string\> |
| record       | record       |
| string       | string       |
| table        | table        |
## Examples

Base64 decode a value and output as UTF-8 string
```shell
> 'U29tZSBEYXRh' | decode base64
Some Data
```

Base64 decode a value and output as binary
```shell
> 'U29tZSBEYXRh' | decode base64 --binary
Length: 9 (0x9) bytes | printable whitespace ascii_other non_ascii
00000000:   53 6f 6d 65  20 44 61 74  61                         Some Data

```

## Notes
Will attempt to decode binary payload as an UTF-8 string by default. Use the `--binary(-b)` argument to force binary output.