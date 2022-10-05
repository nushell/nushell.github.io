---
title: into filesize
version: 0.69.1
conversions: |
  Convert value to filesize
usage: |
  Convert value to filesize
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into filesize ...rest```

## Parameters

 -  `...rest`: column paths to convert to filesize (for table input)

## Examples

Convert string to filesize in table
```shell
> [[bytes]; ['5'] [3.2] [4] [2kb]] | into filesize bytes
```

Convert string to filesize
```shell
> '2' | into filesize
```

Convert decimal to filesize
```shell
> 8.3 | into filesize
```

Convert int to filesize
```shell
> 5 | into filesize
```

Convert file size to filesize
```shell
> 4KB | into filesize
```
