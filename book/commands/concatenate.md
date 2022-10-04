---
title: concatenate
version: 0.69.1
dataframe: |
  Concatenates strings with other array
usage: |
  Concatenates strings with other array
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe }}</div>

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
