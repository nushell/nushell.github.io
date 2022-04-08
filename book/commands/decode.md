---
title: decode
layout: command
version: 0.60.1
usage: |
  Decode bytes as a string.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> decode (encoding)```

## Parameters

 -  `encoding`: the text encoding to use

## Notes
```text
Multiple encodings are supported, here is an example of a few:
big5, euc-jp, euc-kr, gbk, iso-8859-1, utf-16, cp1252, latin5

For a more complete list of encodings please refer to the encoding_rs
documentation link at https://docs.rs/encoding_rs/0.8.28/encoding_rs/#statics
```
## Examples

Decode the output of an external command
```shell
> cat myfile.q | decode utf-8
```
