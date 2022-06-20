---
title: is-not-null
version: 0.64.0
usage: |
  Creates mask where value is not null
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> is-not-null ```

## Examples

Create mask where values are not null
```shell
> let s = ([5 6 0 8] | to-df);
    let res = ($s / $s);
    $res | is-not-null
```
