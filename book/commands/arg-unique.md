---
title: arg-unique
categories: |
  dataframe
version: 0.73.1
dataframe: |
  Returns indexes for unique values
usage: |
  Returns indexes for unique values
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> arg-unique ```

## Examples

Returns indexes for unique values
```shell
> [1 2 2 3 3] | into df | arg-unique
```
