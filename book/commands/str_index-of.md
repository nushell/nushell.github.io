---
title: str index-of
categories: |
  strings
version: 0.71.0
strings: |
  Returns start index of first occurrence of string in input, or -1 if no match
usage: |
  Returns start index of first occurrence of string in input, or -1 if no match
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str index-of (string) ...rest --range --end```

## Parameters

 -  `string`: the string to find index of
 -  `...rest`: optionally returns index of string in input by column paths
 -  `--range {any}`: optional start and/or end index
 -  `--end`: search from the end of the input

## Examples

Returns index of string in input
```shell
>  'my_library.rb' | str index-of '.rb'
```

Returns index of string in input with start index
```shell
>  '.rb.rb' | str index-of '.rb' -r '1,'
```

Returns index of string in input with end index
```shell
>  '123456' | str index-of '6' -r ',4'
```

Returns index of string in input with start and end index
```shell
>  '123456' | str index-of '3' -r '1,4'
```

Alternatively you can use this form
```shell
>  '123456' | str index-of '3' -r [1 4]
```

Returns index of string in input
```shell
>  '/this/is/some/path/file.txt' | str index-of '/' -e
```
