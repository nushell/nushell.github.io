---
title: columns
version: 0.67.0
usage: |
  Show dataframe columns
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> columns ```

## Examples

Dataframe columns
```shell
> [[a b]; [1 2] [3 4]] | into df | columns
```
