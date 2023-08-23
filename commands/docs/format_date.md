---
title: format date
categories: |
  date
version: 0.84.0
date: |
  Format a given date using a format string.
usage: |
  Format a given date using a format string.
---

# <code>{{ $frontmatter.title }}</code> for date

<div class='command-title'>{{ $frontmatter.date }}</div>

## Signature

```> format date (format string) --list```

## Parameters

 -  `format string`: the desired format date
 -  `--list` `(-l)`: lists strftime cheatsheet


## Input/output types:

| input    | output |
| -------- | ------ |
| datetime | string |
| string   | string |
## Examples

Format a given date-time using the default format (RFC 2822).
```shell
> '2021-10-22 20:00:12 +01:00' | into datetime | format date
Fri, 22 Oct 2021 20:00:12 +0100
```

Format a given date-time as a string using the default format (RFC 2822).
```shell
> "2021-10-22 20:00:12 +01:00" | format date
Fri, 22 Oct 2021 20:00:12 +0100
```

Format the current date-time using a given format string.
```shell
> date now | format date "%Y-%m-%d %H:%M:%S"

```

Format the current date using a given format string.
```shell
> date now | format date "%Y-%m-%d %H:%M:%S"

```

Format a given date using a given format string.
```shell
> "2021-10-22 20:00:12 +01:00" | format date "%Y-%m-%d"
2021-10-22
```
