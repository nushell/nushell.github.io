---
title: date list-timezone
layout: command
version: 0.60.1
usage: |
  List supported time zones.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> date list-timezone `

## Examples

Show timezone(s) that contains 'Shanghai'

```shell
> date list-timezone | where timezone =~ Shanghai
```
