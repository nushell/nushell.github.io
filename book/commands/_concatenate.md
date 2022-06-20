---
title: concatenate
version: 0.64.0
usage: |
  Concatenates strings with other array
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> concatenate (other)```

## Parameters

 -  `other`: Other array with string to be concatenated

## Examples

Concatenate string
```shell
> let other = ([za xs cd] | to-df);
    [abc abc abc] | to-df | concatenate $other
```
