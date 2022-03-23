---
title: detect columns
layout: command
version: 0.60.0
usage: |
  splits contents across multiple columns via the separator.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> detect columns --skip --no-headers```

## Parameters

 -  `--skip {int}`: number of rows to skip before detecting
 -  `--no-headers`: don't detect headers

## Examples

Splits string across multiple columns
```shell
> echo 'a b c' | detect columns -n
```

Splits a multi-line string into columns with headers detected
```shell
> echo $'c1 c2 c3(char nl)a b c' | detect columns
```
