---
title: into record
categories: |
  conversions
version: 0.76.0
conversions: |
  Convert value to record
usage: |
  Convert value to record
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into record ```

## Examples

Convert from one row table to record
```shell
> [[value]; [false]] | into record
```

Convert from list to record
```shell
> [1 2 3] | into record
```

Convert from range to record
```shell
> 0..2 | into record
```

convert duration to record
```shell
> -500day | into record
```

convert record to record
```shell
> {a: 1, b: 2} | into record
```

convert date to record
```shell
> 2020-04-12T22:10:57+02:00 | into record
```
