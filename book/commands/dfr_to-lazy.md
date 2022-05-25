---
title: dfr to-lazy
layout: command
version: 0.63.0
usage: |
  Converts a dataframe into a lazy dataframe
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr to-lazy ```

## Examples

Takes a dictionary and creates a lazy dataframe
```shell
> [[a b];[1 2] [3 4]] | dfr to-df | dfl to-lazy
```
