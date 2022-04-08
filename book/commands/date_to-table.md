---
title: date to-table
layout: command
version: 0.60.1
usage: |
  Convert the date into a structured table.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> date to-table ```

## Examples

Convert the date into a structured table.
```shell
> date to-table
```

Convert the date into a structured table.
```shell
> date now | date to-table
```

Convert a given date into a structured table.
```shell
>  '2020-04-12 22:10:57 +0200' | date to-table
```
