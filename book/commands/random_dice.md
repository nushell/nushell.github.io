---
title: random dice
layout: command
version: 0.62.0
usage: |
  Generate a random dice roll
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> random dice --dice --sides```

## Parameters

 -  `--dice {int}`: The amount of dice being rolled
 -  `--sides {int}`: The amount of sides a die has

## Examples

Roll 1 dice with 6 sides each
```shell
> random dice
```

Roll 10 dice with 12 sides each
```shell
> random dice -d 10 -s 12
```
