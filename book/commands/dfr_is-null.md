---
title: dfr is-null
layout: command
version: 0.63.0
usage: |
  Creates mask where value is null or creates a is-null expression
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr is-null ```

## Examples

Create mask where values are null
```shell
> let s = ([5 6 0 8] | dfr to-df);
    let res = ($s / $s);
    $res | dfr is-null
```

Creates a is not null expression from a column
```shell
> dfr col a | dfr is-null
```
