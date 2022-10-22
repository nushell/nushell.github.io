---
title: date to-record
categories: |
  date
version: 0.70.0
date: |
  Convert the date into a structured table.
usage: |
  Convert the date into a structured table.
---

# <code>{{ $frontmatter.title }}</code> for date

<div class='command-title'>{{ $frontmatter.date }}</div>

## Signature

```> date to-record ```

## Examples

Convert the current date into a structured table.
```shell
> date to-table
```

Convert the current date into a structured table.
```shell
> date now | date to-record
```

Convert a given date into a structured table.
```shell
>  '2020-04-12 22:10:57 +0200' | date to-record
```
