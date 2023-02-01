---
title: concatenate
categories: |
  dataframe
version: 0.75.0
dataframe: |
  Concatenates strings with other array
usage: |
  Concatenates strings with other array
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> concatenate ```

## Examples

Concatenate string
```shell
> let other = ([za xs cd] | into df);
    [abc abc abc] | into df | concatenate $other
```
