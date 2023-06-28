---
title: into filesize
categories: |
  conversions
version: 0.82.0
conversions: |
  Convert value to filesize.
usage: |
  Convert value to filesize.
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into filesize ...rest```

## Parameters

 -  `...rest`: for a data structure input, convert data at the given cell paths

## Examples

Convert string to filesize in table
```shell
> [[bytes]; ['5'] [3.2] [4] [2kb]] | into filesize bytes

```

Convert string to filesize
```shell
> '2' | into filesize
2 B
```

Convert decimal to filesize
```shell
> 8.3 | into filesize
8 B
```

Convert int to filesize
```shell
> 5 | into filesize
5 B
```

Convert file size to filesize
```shell
> 4KB | into filesize
3.9 KiB
```
