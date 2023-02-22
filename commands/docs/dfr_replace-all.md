---
title: dfr replace-all
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Replace all (sub)strings by a regex pattern
usage: |
  Replace all (sub)strings by a regex pattern
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr replace-all ```

## Examples

Replaces string
```shell
> [abac abac abac] | dfr into-df | dfr replace-all -p a -r A
```
