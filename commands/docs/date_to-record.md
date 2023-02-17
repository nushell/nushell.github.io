---
title: date to-record
categories: |
  date
version: 0.75.0
date: |
  Convert the date into a record.
usage: |
  Convert the date into a record.
---

# <code>{{ $frontmatter.title }}</code> for date

<div class='command-title'>{{ $frontmatter.date }}</div>

## Signature

```> date to-record ```

## Examples

Convert the current date into a record.
```shell
> date to-record
```

Convert the current date into a record.
```shell
> date now | date to-record
```

Convert a date string into a record.
```shell
> '2020-04-12 22:10:57 +0200' | date to-record
```
