---
title: path join
categories: |
  default
version: 0.76.1
default: |
  Join a structured path or a list of path parts.
usage: |
  Join a structured path or a list of path parts.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> path join ...rest --columns```

## Parameters

 -  `...rest`: Path to append to the input
 -  `--columns {table}`: For a record or table input, join strings at the given columns

## Notes
Optionally, append an additional path to the result. It is designed to accept
the output of 'path parse' and 'path split' subcommands.
## Examples

Append a filename to a path
```shell
> '/home/viking' | path join spam.txt
```

Append a filename to a path
```shell
> '/home/viking' | path join spams this_spam.txt
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
