---
title: arg-unique
version: 0.69.1
dataframe: |
  Returns indexes for unique values
usage: |
  Returns indexes for unique values
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe }}</div>

## Signature

```> arg-unique ```

## Examples

Returns indexes for unique values
```shell
> [1 2 2 3 3] | into df | arg-unique
```
