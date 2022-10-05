---
title: random bool
version: 0.69.1
random: |
  Generate a random boolean value
usage: |
  Generate a random boolean value
---

# <code>{{ $frontmatter.title }}</code> for random

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.random }}</div>

## Signature

```> random bool --bias```

## Parameters

 -  `--bias {number}`: Adjusts the probability of a "true" outcome

## Examples

Generate a random boolean value
```shell
> random bool
```

Generate a random boolean value with a 75% chance of "true"
```shell
> random bool --bias 0.75
```
