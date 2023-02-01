---
title: format filesize
categories: |
  strings
version: 0.75.0
strings: |
  Converts a column of filesizes to some specified format
usage: |
  Converts a column of filesizes to some specified format
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> format filesize (format value) ...rest```

## Parameters

 -  `format value`: the format into which convert the file sizes
 -  `...rest`: For a data structure input, format filesizes at the given cell paths

## Examples

Convert the size column to KB
```shell
> ls | format filesize KB size
```

Convert the apparent column to B
```shell
> du | format filesize B apparent
```

Convert the size data to MB
```shell
> 4Gb | format filesize MB
```
