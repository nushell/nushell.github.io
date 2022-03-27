---
title: date to-table
layout: command
version: 0.60.1
usage: |
  Print the date in a structured table.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> date to-table `

## Examples

Print the date in a structured table.

```shell
> date to-table
```

Print the date in a structured table.

```shell
> date now | date to-table
```

Print the date in a structured table.

```shell
>  '2020-04-12 22:10:57 +0200' | date to-table
```
