---
title: from tsv
layout: command
version: 0.63.0
usage: |
  Parse text as .tsv and create table.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> from tsv --noheaders --no-infer --trim```

## Parameters

 -  `--noheaders`: don't treat the first row as column names
 -  `--no-infer`: no field type inferencing
 -  `--trim {string}`: drop leading and trailing whitespaces around headers names and/or field values

## Examples

Create a tsv file with header columns and open it
```shell
> echo $'c1(char tab)c2(char tab)c3(char nl)1(char tab)2(char tab)3' | save tsv-data | open tsv-data | from tsv
```

Create a tsv file without header columns and open it
```shell
> echo $'a1(char tab)b1(char tab)c1(char nl)a2(char tab)b2(char tab)c2' | save tsv-data | open tsv-data | from tsv -n
```

Create a tsv file without header columns and open it, removing all unnecessary whitespaces
```shell
> echo $'a1(char tab)b1(char tab)c1(char nl)a2(char tab)b2(char tab)c2' | save tsv-data | open tsv-data | from tsv --trim all
```

Create a tsv file without header columns and open it, removing all unnecessary whitespaces in the header names
```shell
> echo $'a1(char tab)b1(char tab)c1(char nl)a2(char tab)b2(char tab)c2' | save tsv-data | open tsv-data | from tsv --trim headers
```

Create a tsv file without header columns and open it, removing all unnecessary whitespaces in the field values
```shell
> echo $'a1(char tab)b1(char tab)c1(char nl)a2(char tab)b2(char tab)c2' | save tsv-data | open tsv-data | from tsv --trim fields
```
