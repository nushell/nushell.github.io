---
title: all-true
version: 0.67.0
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
> [true true true] | into df | all-true
```

Checks the result from a comparison
```shell
> let s = ([5 6 2 8] | into df);
    let res = ($s > 9);
    $res | all-true
```
