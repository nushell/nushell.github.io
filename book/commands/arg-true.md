---
title: arg-true
version: 0.69.1
dataframe: |
  Returns indexes where values are true
usage: |
  Returns indexes where values are true
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe }}</div>

## Signature

```> arg-true ```

## Examples

Returns indexes where values are true
```shell
> [false true false] | into df | arg-true
```
