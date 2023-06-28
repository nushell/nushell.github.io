---
title: into datetime
categories: |
  conversions
version: 0.82.0
conversions: |
  Convert text or timestamp into a datetime.
usage: |
  Convert text or timestamp into a datetime.
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into datetime ...rest --timezone --offset --format --list```

## Parameters

 -  `...rest`: for a data structure input, convert data at the given cell paths
 -  `--timezone {string}`: Specify timezone if the input is a Unix timestamp. Valid options: 'UTC' ('u') or 'LOCAL' ('l')
 -  `--offset {int}`: Specify timezone by offset from UTC if the input is a Unix timestamp, like '+8', '-4'
 -  `--format {string}`: Specify expected format of string input to parse to datetime. Use --list to see options
 -  `--list` `(-l)`: Show all possible variables for use in --format flag

## Examples

Convert any standard timestamp string to datetime
```shell
> '27.02.2021 1:55 pm +0000' | into datetime
Sat, 27 Feb 2021 13:55:00 +0000 (2 years ago)
```

Convert any standard timestamp string to datetime
```shell
> '2021-02-27T13:55:40.2246+00:00' | into datetime
Sat, 27 Feb 2021 13:55:40 +0000 (2 years ago)
```

Convert non-standard timestamp string to datetime using a custom format
```shell
> '20210227_135540+0000' | into datetime -f '%Y%m%d_%H%M%S%z'
Sat, 27 Feb 2021 13:55:40 +0000 (2 years ago)
```

Convert nanosecond-precision unix timestamp to a datetime with offset from UTC
```shell
> 1614434140123456789 | into datetime --offset -5
Sat, 27 Feb 2021 13:55:40 +0000 (2 years ago)
```

Convert standard (seconds) unix timestamp to a UTC datetime
```shell
> 1614434140 * 1_000_000_000 | into datetime
Sat, 27 Feb 2021 13:55:40 +0000 (2 years ago)
```
