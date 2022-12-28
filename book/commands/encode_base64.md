---
title: encode base64
categories: |
  hash
version: 0.73.1
hash: |
  Encode a string or binary value using Base64
usage: |
  Encode a string or binary value using Base64
---

# <code>{{ $frontmatter.title }}</code> for hash

<div class='command-title'>{{ $frontmatter.hash }}</div>

## Signature

```> encode base64 ...rest --character-set```

## Parameters

 -  `...rest`: For a data structure input, encode data at the given cell paths
 -  `--character-set {string}`: specify the character rules for encoding the input.
	Valid values are 'standard', 'standard-no-padding', 'url-safe', 'url-safe-no-padding','binhex', 'bcrypt', 'crypt'

## Examples

Encode binary data
```shell
> 0x[09 F9 11 02 9D 74 E3 5B D8 41 56 C5 63 56 88 C0] | encode base64
```

Encode a string with default settings
```shell
> 'Some Data' | encode base64
```

Encode a string with the binhex character set
```shell
> 'Some Data' | encode base64 --character-set binhex
```
