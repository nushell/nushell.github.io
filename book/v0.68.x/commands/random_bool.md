---
title: random bool
version: 0.68.0
usage: |
  Generate a random boolean value
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
