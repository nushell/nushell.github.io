---
title: date to-timezone
categories: |
  date
version: 0.70.0
date: |
  Convert a date to a given time zone.
usage: |
  Convert a date to a given time zone.
---

# <code>{{ $frontmatter.title }}</code> for date

<div class='command-title'>{{ $frontmatter.date }}</div>

## Signature

```> date to-timezone (time zone)```

## Parameters

 -  `time zone`: time zone description

## Notes
```text
Use 'date list-timezone' to list all supported time zones.
```
## Examples

Get the current date in UTC+05:00
```shell
> date now | date to-timezone +0500
```

Get the current local date
```shell
> date now | date to-timezone local
```

Get the current date in Hawaii
```shell
> date now | date to-timezone US/Hawaii
```

Get the current date in Hawaii
```shell
> "2020-10-10 10:00:00 +02:00" | date to-timezone "+0500"
```
