---
title: dtypes
version: 0.69.1
dataframe: |
  Show dataframe data types
usage: |
  Show dataframe data types
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dtypes ```

## Examples

Dataframe dtypes
```shell
> [[a b]; [1 2] [3 4]] | into df | dtypes
```
