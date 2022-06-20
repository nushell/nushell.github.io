---
title: fetch
version: 0.64.0
usage: |
  collects the lazyframe to the selected rows
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> fetch (rows)```

## Parameters

 -  `rows`: number of rows to be fetched from lazyframe

## Examples

Fetch a rows from the dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | to-df | fetch 2
```
