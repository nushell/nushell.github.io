---
title: into lazy
version: 0.69.1
lazyframe: |
  Converts a dataframe into a lazy dataframe
usage: |
  Converts a dataframe into a lazy dataframe
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> into lazy ```

## Examples

Takes a dictionary and creates a lazy dataframe
```shell
> [[a b];[1 2] [3 4]] | into lazy
```
