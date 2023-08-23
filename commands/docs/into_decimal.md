---
title: into decimal
categories: |
  conversions
version: 0.84.0
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


## Input/output types:

| input     | output       |
| --------- | ------------ |
| bool      | number       |
| int       | number       |
| list\<any\> | list\<number\> |
| number    | number       |
| record    | record       |
| string    | number       |
| table     | table        |
## Examples

Convert string to decimal in table
```shell
> [[num]; ['5.01']] | into decimal num
╭───┬──────╮
│ # │ num  │
├───┼──────┤
│ 0 │ 5.01 │
╰───┴──────╯

```

Convert string to decimal
```shell
> '1.345' | into decimal
1.345
```

Coerce list of ints and floats to float
```shell
> [4 -5.9] | into decimal
╭───┬───────╮
│ 0 │  4.00 │
│ 1 │ -5.90 │
╰───┴───────╯

```

Convert boolean to decimal
```shell
> true | into decimal
1
```
