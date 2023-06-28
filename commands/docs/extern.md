---
title: extern
categories: |
  core
version: 0.82.1
core: |
  Define a signature for an external command.
usage: |
  Define a signature for an external command.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> extern (def_name) (params) (body)```

## Parameters

 -  `def_name`: definition name
 -  `params`: parameters
 -  `body`: wrapper function block

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Write a signature for an external command
```shell
> extern echo [text: string]

```
