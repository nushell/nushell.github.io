---
title: contains
categories: |
  dataframe
version: 0.70.0
dataframe: |
  Checks if a pattern is contained in a string
usage: |
  Checks if a pattern is contained in a string
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> contains (pattern)```

## Parameters

 -  `pattern`: Regex pattern to be searched

## Examples

Returns boolean indicating if pattern was found
```shell
> [abc acb acb] | into df | contains ab
```
