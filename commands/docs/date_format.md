---
title: date format
categories: |
  date
version: 0.77.0
date: |
  Format a given date using a format string.
usage: |
  Format a given date using a format string.
---

# <code>{{ $frontmatter.title }}</code> for date

<div class='command-title'>{{ $frontmatter.date }}</div>

## Signature

```> date format (format string) --list```

## Parameters

 -  `format string`: the desired date format
 -  `--list` `(-l)`: lists strftime cheatsheet

## Examples

Format a given date-time as a string using the default format (RFC 2822).
```shell
> "2021-10-22 20:00:12 +01:00" | date format
Fri, 22 Oct 2021 20:00:12 +0100
```

Format the current date-time using a given format string.
```shell
> date now | date format "%Y-%m-%d %H:%M:%S"

```

Format the current date using a given format string.
```shell
> date now | date format "%Y-%m-%d %H:%M:%S"

```

Format a given date using a given format string.
```shell
> "2021-10-22 20:00:12 +01:00" | date format "%Y-%m-%d"
2021-10-22
```
