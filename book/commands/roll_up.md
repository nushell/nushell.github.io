---
title: roll up
layout: command
version: 0.60.0
usage: |
  Roll table rows up
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> roll up --by`

## Parameters

- `--by {int}`: Number of rows to roll

## Examples

Rolls rows up

```shell
> [[a b]; [1 2] [3 4] [5 6]] | roll up
```
