---
title: from nuon
layout: command
version: 0.60.0
usage: |
  Convert from nuon to structured data
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> from nuon `

## Examples

Converts nuon formatted string to table

```shell
> '{ a:1 }' | from nuon
```

Converts nuon formatted string to table

```shell
> '{ a:1, b: [1, 2] }' | from nuon
```
