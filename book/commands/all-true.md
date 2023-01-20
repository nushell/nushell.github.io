---
title: all-true
categories: |
  dataframe
version: 0.74.0
dataframe: |
  Returns true if all values are true
usage: |
  Returns true if all values are true
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

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
