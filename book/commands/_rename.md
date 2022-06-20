---
title: rename
version: 0.64.0
usage: |
  Rename a dataframe column
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> rename (columns) (new names)```

## Parameters

 -  `columns`: Column(s) to be renamed. A string or list of strings
 -  `new names`: New names for the selected column(s). A string or list of strings

## Examples

Renames a series
```shell
> [5 6 7 8] | to-df | rename '0' new_name
```

Renames a dataframe column
```shell
> [[a b]; [1 2] [3 4]] | to-df | rename a a_new
```

Renames two dataframe columns
```shell
> [[a b]; [1 2] [3 4]] | to-df | rename [a b] [a_new b_new]
```
