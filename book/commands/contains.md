---
title: contains
version: 0.69.1
dataframe: |
  Checks if a pattern is contained in a string
usage: |
  Checks if a pattern is contained in a string
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe }}</div>

## Signature

```> contains (pattern)```

## Parameters

 -  `pattern`: Regex pattern to be searched

## Examples

Returns boolean indicating if pattern was found
```shell
> [abc acb acb] | into df | contains ab
```
