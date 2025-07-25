---
title: date now
categories: |
  date
version: 0.106.0
date: |
  Get the current date.
usage: |
  Get the current date.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `date now` for [date](/commands/categories/date.md)

<div class='command-title'>Get the current date.</div>

## Signature

```> date now {flags} ```


## Input/output types:

| input   | output   |
| ------- | -------- |
| nothing | datetime |
## Examples

Get the current date and format it in a given format string.
```nu
> date now | format date "%Y-%m-%d %H:%M:%S"

```

Get the current date and format it according to the RFC 3339 standard.
```nu
> date now | format date "%+"

```

Get the time duration since 2019-04-30.
```nu
> (date now) - 2019-05-01

```

Get the time duration since a more specific time.
```nu
> (date now) - 2019-05-01T04:12:05.20+08:00

```

Get current time and format it in the debug format (RFC 2822 with timezone)
```nu
> date now | debug

```
