---
title: into decimal
version: 0.67.0
usage: |
  Convert text into a decimal
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> into decimal ...rest```

## Parameters

 -  `...rest`: optionally convert text into decimal by column paths

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
