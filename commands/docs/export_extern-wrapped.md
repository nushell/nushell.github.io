---
title: export extern-wrapped
categories: |
  core
version: 0.84.0
core: |
  Define an extern with a custom code block and export it from a module.
usage: |
  Define an extern with a custom code block and export it from a module.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> export extern-wrapped (def_name) (params) (body)```

## Parameters

 -  `def_name`: definition name
 -  `params`: parameters
 -  `body`: wrapper code block


## Input/output types:

| input   | output  |
| ------- | ------- |
| nothing | nothing |

## Examples

Export the signature for an external command
```shell
> export extern-wrapped my-echo [...rest] { echo $rest }

```

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html