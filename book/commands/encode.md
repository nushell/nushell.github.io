---
title: encode
categories: |
  strings
version: 0.74.0
strings: |
  Encode an UTF-8 string into other kind of representations.
usage: |
  Encode an UTF-8 string into other kind of representations.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> encode (encoding)```

## Parameters

 -  `encoding`: the text encoding to use

## Notes
Multiple encodings are supported, here is an example of a few:
big5, euc-jp, euc-kr, gbk, iso-8859-1, cp1252, latin5

Note that since the Encoding Standard doesn't specify encoders for utf-16le and utf-16be, these are not yet supported.

For a more complete list of encodings please refer to the encoding_rs
documentation link at https://docs.rs/encoding_rs/0.8.28/encoding_rs/#statics
## Examples

Encode an UTF-8 string into Shift-JIS
```shell
> "負けると知って戦うのが、遥かに美しいのだ" | encode shift-jis
```
