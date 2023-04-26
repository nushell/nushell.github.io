---
title: dfr into-lazy
categories: |
  lazyframe
version: 0.79.0
lazyframe: |
  Converts a dataframe into a lazy dataframe.
usage: |
  Converts a dataframe into a lazy dataframe.
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr into-lazy ```

## Examples

Takes a dictionary and creates a lazy dataframe
```shell
> [[a b];[1 2] [3 4]] | dfr into-lazy

```
