---
title: to yaml
layout: command
version: 0.60.0
usage: |
  Convert table into .yaml/.yml text
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> to yaml `

## Examples

Outputs an YAML string representing the contents of this table

```shell
> [[foo bar]; ["1" "2"]] | to yaml
```
