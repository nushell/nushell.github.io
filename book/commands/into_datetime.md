---
title: into datetime
categories: |
  conversions
version: 0.70.0
conversions: |
  Convert text into a datetime
usage: |
  Convert text into a datetime
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into datetime ...rest --timezone --offset --format --list```

## Parameters

 -  `...rest`: optionally convert text into datetime by column paths
 -  `--timezone {string}`: Specify timezone if the input is a Unix timestamp. Valid options: 'UTC' ('u') or 'LOCAL' ('l')
 -  `--offset {int}`: Specify timezone by offset from UTC if the input is a Unix timestamp, like '+8', '-4'
 -  `--format {string}`: Specify an expected format for parsing strings to datetimes. Use --list to see all possible options
 -  `--list`: Show all possible variables for use with the --format flag

## Examples

Convert to datetime
```shell
> '27.02.2021 1:55 pm +0000' | into datetime
```

Convert to datetime
```shell
> '2021-02-27T13:55:40+00:00' | into datetime
```

Convert to datetime using a custom format
```shell
> '20210227_135540+0000' | into datetime -f '%Y%m%d_%H%M%S%z'
```

Convert timestamp (no larger than 8e+12) to a UTC datetime
```shell
> 1614434140 | into datetime
```

Convert timestamp (no larger than 8e+12) to datetime using a specified timezone offset (between -12 and 12)
```shell
> 1614434140 | into datetime -o +9
```

Convert timestamps like the sqlite history t
```shell
> 1656165681720 | into datetime
```
