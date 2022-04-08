---
title: path basename
layout: command
version: 0.60.1
usage: |
  Get the final component of a path
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> path basename --columns --replace```

## Parameters

 -  `--columns {table}`: Optionally operate by column path
 -  `--replace {string}`: Return original path with basename replaced by this string

## Examples

Get basename of a path
```shell
> 'C:\Users\joe\test.txt' | path basename
```

Get basename of a path in a column
```shell
> ls .. | path basename -c [ name ]
```

Get basename of a path in a column
```shell
> [[name];[C:\Users\Joe]] | path basename -c [ name ]
```

Replace basename of a path
```shell
> 'C:\Users\joe\test.txt' | path basename -r 'spam.png'
```
