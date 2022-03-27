---
title: dfr all-false
layout: command
version: 0.59.1
usage: |
  Returns true if all values are false
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> dfr all-false `

## Examples

Returns true if all values are false

```shell
> [false false false] | dfr to-df | dfr all-false
```

Checks the result from a comparison

```shell
> let s = ([5 6 2 10] | dfr to-df);
    let res = ($s > 9);
    $res | dfr all-false
```
