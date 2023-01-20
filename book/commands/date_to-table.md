---
title: date to-table
categories: |
  date
version: 0.74.0
date: |
  Convert the date into a structured table.
usage: |
  Convert the date into a structured table.
---

# <code>{{ $frontmatter.title }}</code> for date

<div class='command-title'>{{ $frontmatter.date }}</div>

## Signature

```> date to-table ```

## Examples

Convert the current date into a table.
```shell
> date to-table
```

Convert the date into a table.
```shell
> date now | date to-table
```

Convert a given date into a table.
```shell
> '2020-04-12 22:10:57 +0200' | date to-table
```
