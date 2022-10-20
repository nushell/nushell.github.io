---
title: export alias
version: 0.70.0
core: |
  Define an alias and export it from a module
usage: |
  Define an alias and export it from a module
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> export alias (name) (initial_value)```

## Parameters

 -  `name`: name of the alias
 -  `initial_value`: equals sign followed by value

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
```
## Examples

export an alias of ll to ls -l, from a module
```shell
> export alias ll = ls -l
```
