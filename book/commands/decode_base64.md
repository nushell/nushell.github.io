---
title: decode base64
categories: |
  hash
version: 0.73.1
hash: |
  Base64 decode a value
usage: |
  Base64 decode a value
---

# <code>{{ $frontmatter.title }}</code> for hash

<div class='command-title'>{{ $frontmatter.hash }}</div>

## Signature

```> decode base64 ...rest --character-set --binary```

## Parameters

 -  `...rest`: For a data structure input, decode data at the given cell paths
 -  `--character-set {string}`: specify the character rules for encoding the input.
	Valid values are 'standard', 'standard-no-padding', 'url-safe', 'url-safe-no-padding','binhex', 'bcrypt', 'crypt'
 -  `--binary`: Output a binary value instead of decoding payload as UTF-8

## Notes
```text
Will attempt to decode binary payload as an UTF-8 string by default. Use the `--binary(-b)` argument to force binary output.
```
## Examples

Base64 decode a value and output as UTF-8 string
```shell
> 'U29tZSBEYXRh' | decode base64
```

Base64 decode a value and output as binary
```shell
> 'U29tZSBEYXRh' | decode base64 --binary
```
