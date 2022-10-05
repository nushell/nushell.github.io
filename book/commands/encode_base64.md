---
title: encode base64
version: 0.69.1
hash: |
  Base64 encode a value
usage: |
  Base64 encode a value
---

# <code>{{ $frontmatter.title }}</code> for hash

<div class='command-title'>{{ $frontmatter.hash }}</div>

## Signature

```> encode base64 ...rest --character-set```

## Parameters

 -  `...rest`: optionally base64 encode data by column paths
 -  `--character-set {string}`: specify the character rules for encoding the input.
	Valid values are 'standard', 'standard-no-padding', 'url-safe', 'url-safe-no-padding','binhex', 'bcrypt', 'crypt'

## Examples

Base64 encode a string with default settings
```shell
> echo 'Some Data' | encode base64
```

Base64 encode a string with the binhex character set
```shell
> echo 'Some Data' | encode base64 --character-set binhex
```
