---
title: to toml
layout: command
version: 0.60.1
usage: |
  Convert table into .toml text
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> to toml `

## Examples

Outputs an TOML string representing the contents of this table

```shell
> [[foo bar]; ["1" "2"]] | to toml
```
