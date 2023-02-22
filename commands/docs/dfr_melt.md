---
title: dfr melt
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Unpivot a DataFrame from wide to long format
usage: |
  Unpivot a DataFrame from wide to long format
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr melt ```

## Examples

melt dataframe
```shell
> [[a b c d]; [x 1 4 a] [y 2 5 b] [z 3 6 c]] | dfr into-df | dfr melt -c [b c] -v [a d]
```
