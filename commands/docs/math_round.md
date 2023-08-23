---
title: math round
categories: |
  math
version: 0.84.0
math: |
  Returns the input number rounded to the specified precision.
usage: |
  Returns the input number rounded to the specified precision.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math round --precision```

## Parameters

 -  `--precision {number}`: digits of precision


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| list\<number\> | list\<number\> |
| number       | number       |
## Examples

Apply the round function to a list of numbers
```shell
> [1.5 2.3 -3.1] | math round
╭───┬────╮
│ 0 │  2 │
│ 1 │  2 │
│ 2 │ -3 │
╰───┴────╯

```

Apply the round function with precision specified
```shell
> [1.555 2.333 -3.111] | math round -p 2
╭───┬───────╮
│ 0 │  1.56 │
│ 1 │  2.33 │
│ 2 │ -3.11 │
╰───┴───────╯

```

Apply negative precision to a list of numbers
```shell
> [123, 123.3, -123.4] | math round -p -1
╭───┬──────╮
│ 0 │  120 │
│ 1 │  120 │
│ 2 │ -120 │
╰───┴──────╯

```
