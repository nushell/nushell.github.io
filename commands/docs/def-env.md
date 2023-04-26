---
title: def-env
categories: |
  core
version: 0.79.0
core: |
  Define a custom command, which participates in the caller environment.
usage: |
  Define a custom command, which participates in the caller environment.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> def-env (def_name) (params) (block)```

## Parameters

 -  `def_name`: definition name
 -  `params`: parameters
 -  `block`: body of the definition

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html

```
## Examples

Set environment variable by call a custom command
```shell
> def-env foo [] { let-env BAR = "BAZ" }; foo; $env.BAR
BAZ
```
