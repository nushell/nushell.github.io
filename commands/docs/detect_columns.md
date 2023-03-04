---
title: detect columns
categories: |
  strings
version: 0.76.1
strings: |
  Attempt to automatically split text into multiple columns.
usage: |
  Attempt to automatically split text into multiple columns.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> detect columns --skip --no-headers```

## Parameters

 -  `--skip {int}`: number of rows to skip before detecting
 -  `--no-headers` `(-n)`: don't detect headers

## Examples

Splits string across multiple columns
```shell
> 'a b c' | detect columns -n
```

Splits a multi-line string into columns with headers detected
```shell
> $'c1 c2 c3(char nl)a b c' | detect columns
```
