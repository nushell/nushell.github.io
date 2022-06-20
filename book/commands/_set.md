---
title: set
version: 0.64.0
usage: |
  Sets value where given mask is true
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> set (value) --mask```

## Parameters

 -  `value`: value to be inserted in series
 -  `--mask {any}`: mask indicating insertions

## Examples

Shifts the values by a given period
```shell
> let s = ([1 2 2 3 3] | to-df | shift 2);
    let mask = ($s | is-null);
    $s | set 0 --mask $mask
```
