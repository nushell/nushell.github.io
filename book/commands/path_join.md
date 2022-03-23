---
title: path join
layout: command
version: 0.60.0
usage: |
  Join a structured path or a list of path parts.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> path join (append) --columns```

## Parameters

 -  `append`: Path to append to the input
 -  `--columns {table}`: Optionally operate by column path

## Examples

Append a filename to a path
```shell
> '/home/viking' | path join spam.txt
```

Append a filename to a path inside a column
```shell
> ls | path join spam.txt -c [ name ]
```

Join a list of parts into a path
```shell
> [ '/' 'home' 'viking' 'spam.txt' ] | path join
```

Join a structured path into a path
```shell
> [[ parent stem extension ]; [ '/home/viking' 'spam' 'txt' ]] | path join
```
