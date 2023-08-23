---
title: random bool
categories: |
  random
version: 0.84.0
random: |
  Generate a random boolean value.
usage: |
  Generate a random boolean value.
---

# <code>{{ $frontmatter.title }}</code> for random

<div class='command-title'>{{ $frontmatter.random }}</div>

## Signature

```> random bool --bias```

## Parameters

 -  `--bias {number}`: Adjusts the probability of a "true" outcome


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | bool   |

## Examples

Generate a random boolean value
```shell
> random bool

```

Generate a random boolean value with a 75% chance of "true"
```shell
> random bool --bias 0.75

```
