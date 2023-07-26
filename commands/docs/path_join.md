---
title: path join
categories: |
  default
version: 0.83.0
default: |
  Join a structured path or a list of path parts.
usage: |
  Join a structured path or a list of path parts.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> path join ...rest```

## Parameters

 -  `...rest`: Path to append to the input

## Notes
Optionally, append an additional path to the result. It is designed to accept
the output of 'path parse' and 'path split' subcommands.
## Examples

Append a filename to a path
```shell
> '/home/viking' | path join spam.txt
/home/viking/spam.txt
```

Append a filename to a path
```shell
> '/home/viking' | path join spams this_spam.txt
/home/viking/spams/this_spam.txt
```

Join a list of parts into a path
```shell
> [ '/' 'home' 'viking' 'spam.txt' ] | path join
/home/viking/spam.txt
```

Join a structured path into a path
```shell
> { parent: '/home/viking', stem: 'spam', extension: 'txt' } | path join
/home/viking/spam.txt
```

Join a table of structured paths into a list of paths
```shell
> [[ parent stem extension ]; [ '/home/viking' 'spam' 'txt' ]] | path join
╭───┬───────────────────────╮
│ 0 │ /home/viking/spam.txt │
╰───┴───────────────────────╯

```
