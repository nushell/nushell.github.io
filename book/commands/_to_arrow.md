---
title: to arrow
version: 0.69.1
usage: |
  Saves dataframe to arrow file
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> to arrow (file)```

## Parameters

 -  `file`: file path to save dataframe

## Examples

Saves dataframe to arrow file
```shell
> [[a b]; [1 2] [3 4]] | into df | to arrow test.arrow
```
