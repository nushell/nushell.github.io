---
title: into bool
categories: |
  conversions
version: 0.80.0
conversions: |
  Convert value to boolean.
usage: |
  Convert value to boolean.
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into bool ...rest```

## Parameters

 -  `...rest`: for a data structure input, convert data at the given cell paths

## Examples

Convert value to boolean in table
```shell
> [[value]; ['false'] ['1'] [0] [1.0] [true]] | into bool value
╭───┬───────╮
│ # │ value │
├───┼───────┤
│ 0 │ false │
│ 1 │ true  │
│ 2 │ false │
│ 3 │ true  │
│ 4 │ true  │
╰───┴───────╯

```

Convert bool to boolean
```shell
> true | into bool
true
```

convert integer to boolean
```shell
> 1 | into bool
true
```

convert decimal to boolean
```shell
> 0.3 | into bool
true
```

convert decimal string to boolean
```shell
> '0.0' | into bool
false
```

convert string to boolean
```shell
> 'true' | into bool
true
```
