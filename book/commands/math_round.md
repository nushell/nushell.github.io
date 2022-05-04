---
title: math round
layout: command
version: 0.62.0
usage: |
  Applies the round function to a list of numbers
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> math round --precision```

## Parameters

 -  `--precision {number}`: digits of precision

## Examples

Apply the round function to a list of numbers
```shell
> [1.5 2.3 -3.1] | math round
```

Apply the round function with precision specified
```shell
> [1.555 2.333 -3.111] | math round -p 2
```
