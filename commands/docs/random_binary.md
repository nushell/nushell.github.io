---
title: random binary
categories: |
  random
version: 0.106.0
random: |
  Generate random bytes.
usage: |
  Generate random bytes.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `random binary` for [random](/commands/categories/random.md)

<div class='command-title'>Generate random bytes.</div>

## Signature

```> random binary {flags} (length)```

## Parameters

 -  `length`: Length of the output binary.


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | binary |
## Examples

Generate 16 random bytes
```nu
> random binary 16

```

Generate 1 random kilobyte
```nu
> random binary 1kb

```
