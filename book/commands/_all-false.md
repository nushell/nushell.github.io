---
title: all-false
version: 0.66.1
usage: |
  Returns true if all values are false
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> all-false ```

## Examples

Returns true if all values are false
```shell
> [false false false] | into df | all-false
```

Checks the result from a comparison
```shell
> let s = ([5 6 2 10] | into df);
    let res = ($s > 9);
    $res | all-false
```
