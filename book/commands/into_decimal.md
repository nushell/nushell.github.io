---
title: into decimal
categories: |
  default
version: 0.74.0
default: |
  Convert text into a decimal
usage: |
  Convert text into a decimal
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> into decimal ...rest```

## Parameters

 -  `...rest`: for a data structure input, convert data at the given cell paths

## Examples

Convert string to decimal in table
```shell
> [[num]; ['5.01']] | into decimal num
```

Convert string to decimal
```shell
> '1.345' | into decimal
```

Convert decimal to decimal
```shell
> '-5.9' | into decimal
```

Convert boolean to decimal
```shell
> true | into decimal
```
