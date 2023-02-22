---
title: dfr concatenate
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Concatenates strings with other array
usage: |
  Concatenates strings with other array
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr concatenate ```

## Examples

Concatenate string
```shell
> let other = ([za xs cd] | dfr into-df);
    [abc abc abc] | dfr into-df | dfr concatenate $other
```
