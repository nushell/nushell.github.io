---
title: detect columns
version: 0.67.1
usage: |
  Attempt to automatically split text into multiple columns
---

# <code>{{ $frontmatter.title }}</code>

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
