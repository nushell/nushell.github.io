---
title: dfr is-not-null
layout: command
version: 0.59.1
usage: |
  Creates mask where value is not null
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> dfr is-not-null `

## Examples

Create mask where values are not null

```shell
> let s = ([5 6 0 8] | dfr to-df);
    let res = ($s / $s);
    $res | dfr is-not-null
```
