---
title: into bool
layout: command
version: 0.60.1
usage: |
  Convert value to boolean
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> into bool ...rest```

## Parameters

 -  `...rest`: column paths to convert to boolean (for table input)

## Examples

Convert value to boolean in table
```shell
> echo [[value]; ['false'] ['1'] [0] [1.0] [true]] | into bool value
```

Convert bool to boolean
```shell
> true | into bool
```

convert integer to boolean
```shell
> 1 | into bool
```

convert decimal string to boolean
```shell
> '0.0' | into bool
```

convert string to boolean
```shell
> 'true' | into bool
```
