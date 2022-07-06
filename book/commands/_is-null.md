---
title: is-null
version: 0.65.1
usage: |
  Creates mask where value is null
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> is-null ```

## Examples

Create mask where values are null
```shell
> let s = ([5 6 0 8] | into df);
    let res = ($s / $s);
    $res | is-null
```
