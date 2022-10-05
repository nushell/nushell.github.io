---
title: df-not
version: 0.69.1
dataframe: |
  Inverts boolean mask
usage: |
  Inverts boolean mask
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> df-not ```

## Examples

Inverts boolean mask
```shell
> [true false true] | into df | df-not
```
