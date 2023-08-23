---
title: bits xor
categories: |
  bits
version: 0.84.0
bits: |
  Performs bitwise xor for integers.
usage: |
  Performs bitwise xor for integers.
---

# <code>{{ $frontmatter.title }}</code> for bits

<div class='command-title'>{{ $frontmatter.bits }}</div>

## Signature

```> bits xor (target)```

## Parameters

 -  `target`: target integer to perform bit xor


## Input/output types:

| input     | output    |
| --------- | --------- |
| int       | int       |
| list\<int\> | list\<int\> |
## Examples

Apply bits xor to two numbers
```shell
> 2 | bits xor 2
0
```

Apply logical xor to a list of numbers
```shell
> [8 3 2] | bits xor 2
╭───┬────╮
│ 0 │ 10 │
│ 1 │  1 │
│ 2 │  0 │
╰───┴────╯

```


**Tips:** Command `bits xor` was not included in the official binaries by default, you have to build it with `--features=extra` flag