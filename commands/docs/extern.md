---
title: extern
categories: |
  core
version: 0.84.0
core: |
  Define a signature for an external command.
usage: |
  Define a signature for an external command.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> extern (def_name) (params)```

## Parameters

 -  `def_name`: definition name
 -  `params`: parameters


## Input/output types:

| input   | output  |
| ------- | ------- |
| nothing | nothing |

## Examples

Write a signature for an external command
```shell
> extern echo [text: string]

```

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html