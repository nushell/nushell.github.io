---
title: collect
version: 0.68.0
usage: |
  Collect lazy dataframe into eager dataframe
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> collect ```

## Examples

drop duplicates
```shell
> [[a b]; [1 2] [3 4]] | into lazy | collect
```
