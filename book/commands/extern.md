---
title: extern
version: 0.69.1
core: |
  Define a signature for an external command
usage: |
  Define a signature for an external command
---

# <code>{{ $frontmatter.title }}</code> for core

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.core }}</div>

## Signature

```> extern (def_name) (params)```

## Parameters

 -  `def_name`: definition name
 -  `params`: parameters

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
```
## Examples

Write a signature for an external command
```shell
> extern echo [text: string]
```
