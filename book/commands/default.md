---
title: default
categories: |
  filters
version: 0.73.1
filters: |
  Sets a default row's column if missing.
usage: |
  Sets a default row's column if missing.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> default (default value) (column name)```

## Parameters

 -  `default value`: the value to use as a default
 -  `column name`: the name of the column

## Examples

Give a default 'target' column to all file entries
```shell
> ls -la | default 'nothing' target
```

Get the env value of `MY_ENV` with a default value 'abc' if not present
```shell
> $env | get -i MY_ENV | default 'abc'
```

Replace the `null` value in a list
```shell
> [1, 2, null, 4] | default 3
```
