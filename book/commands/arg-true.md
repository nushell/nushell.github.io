---
title: arg-true
categories: |
  dataframe
version: 0.75.0
dataframe: |
  Returns indexes where values are true
usage: |
  Returns indexes where values are true
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> arg-true ```

## Examples

Returns indexes where values are true
```shell
> [false true false] | into df | arg-true
```
