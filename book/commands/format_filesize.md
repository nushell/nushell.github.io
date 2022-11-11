---
title: format filesize
categories: |
  strings
version: 0.71.0
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
 -  `...rest`: optinally find and replace text by column paths

## Examples

Convert the size row to KB
```shell
> ls | format filesize KB size
```

Convert the apparent row to B
```shell
> du | format filesize B apparent
```

Convert the size data to MB
```shell
> 4Gb | format filesize MB
```
