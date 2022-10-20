---
title: format filesize
version: 0.70.0
strings: |
  Converts a column of filesizes to some specified format
usage: |
  Converts a column of filesizes to some specified format
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> format filesize (field) (format value)```

## Parameters

 -  `field`: the name of the column to update
 -  `format value`: the format into which convert the filesizes

## Examples

Convert the size row to KB
```shell
> ls | format filesize size KB
```

Convert the apparent row to B
```shell
> du | format filesize apparent B
```
