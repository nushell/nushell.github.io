---
title: into decimal
categories: |
  conversions
version: 0.82.0
conversions: |
  Convert text into a decimal.
usage: |
  Convert text into a decimal.
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into decimal ...rest```

## Parameters

 -  `...rest`: for a data structure input, convert data at the given cell paths

## Examples

Convert string to decimal in table
```shell
> [[num]; ['5.01']] | into decimal num
╭───┬────────╮
│ # │  num   │
├───┼────────┤
│ 0 │ 5.0100 │
╰───┴────────╯

```

Convert string to decimal
```shell
> '1.345' | into decimal
1.345
```

Convert decimal to decimal
```shell
> '-5.9' | into decimal
-5.9
```

Convert boolean to decimal
```shell
> true | into decimal
1
```
