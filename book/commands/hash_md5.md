---
title: hash md5
layout: command
version: 0.60.0
usage: |
  hash a value using the md5 hash algorithm
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> hash md5 ...rest`

## Parameters

- `...rest`: optionally md5 hash data by cell path

## Examples

md5 encode a string

```shell
> echo 'abcdefghijklmnopqrstuvwxyz' | hash md5
```

md5 encode a file

```shell
> open ./nu_0_24_1_windows.zip | hash md5
```
