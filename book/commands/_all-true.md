---
title: all-true
version: 0.64.0
usage: |
  Returns true if all values are true
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> all-true ```

## Examples

Returns true if all values are true
```shell
> [true true true] | to-df | all-true
```

Checks the result from a comparison
```shell
> let s = ([5 6 2 8] | to-df);
    let res = ($s > 9);
    $res | all-true
```
