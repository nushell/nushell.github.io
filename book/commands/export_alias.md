---
title: export alias
layout: command
version: 0.63.0
usage: |
  Define an alias and export it from a module
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> export alias (name) (initial_value)```

## Parameters

 -  `name`: name of the alias
 -  `initial_value`: equals sign followed by value

## Notes
```text
This command is a parser keyword. For details, check
https://www.nushell.sh/book/thinking_in_nushell.html#parsing-and-evaluation-are-different-stages
```
## Examples

export an alias of ll to ls -l, from a module
```shell
> export alias ll = ls -l
```
