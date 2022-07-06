---
title: concatenate
version: 0.65.1
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
> let other = ([za xs cd] | into df);
    [abc abc abc] | into df | concatenate $other
```
