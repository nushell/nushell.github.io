---
title: old-alias
categories: |
  core
version: 0.79.0
core: |
  Alias a command (with optional flags) to a new name.
usage: |
  Alias a command (with optional flags) to a new name.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> old-alias (name) (initial_value)```

## Parameters

 -  `name`: name of the alias
 -  `initial_value`: equals sign followed by value

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Alias ll to ls -l
```shell
> old-alias ll = ls -l

```

Make an alias that makes a list of all custom commands
```shell
> old-alias customs = ($nu.scope.commands | where is_custom | get command)

```
