---
title: to nuon
layout: command
version: 0.60.0
usage: |
  Converts table data into Nuon (Nushell Object Notation) text.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> to nuon `

## Examples

Outputs a nuon string representing the contents of this table

```shell
> [1 2 3] | to nuon
```
