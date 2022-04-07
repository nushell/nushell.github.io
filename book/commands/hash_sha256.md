---
title: hash sha256
layout: command
version: 0.60.1
usage: |
  hash a value using the sha256 hash algorithm
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> hash sha256 ...rest```

## Parameters

 -  `...rest`: optionally sha256 hash data by cell path

## Examples

sha256 encode a string
```shell
> echo 'abcdefghijklmnopqrstuvwxyz' | hash sha256
```

sha256 encode a file
```shell
> open ./nu_0_24_1_windows.zip | hash sha256
```
