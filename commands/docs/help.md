---
title: help
categories: |
  core
version: 0.82.0
core: |
  Display help information about different parts of Nushell.
usage: |
  Display help information about different parts of Nushell.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> help ...rest --find```

## Parameters

 -  `...rest`: the name of command, alias or module to get help on
 -  `--find {string}`: string to find in command names, usage, and search terms

## Notes
`help word` searches for "word" in commands, aliases and modules, in that order.
## Examples

show help for single command, alias, or module
```shell
> help match

```

show help for single sub-command, alias, or module
```shell
> help str lpad

```

search for string in command names, usage and search terms
```shell
> help --find char

```
