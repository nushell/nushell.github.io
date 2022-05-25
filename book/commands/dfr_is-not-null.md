---
title: dfr is-not-null
layout: command
version: 0.63.0
usage: |
  Creates mask where value is not null or creates a is-not-null expression
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr is-not-null ```

## Examples

Create mask where values are not null
```shell
> let s = ([5 6 0 8] | dfr to-df);
    let res = ($s / $s);
    $res | dfr is-not-null
```

Creates a is not null expression from a column
```shell
> dfr col a | dfr is-not-null
```
