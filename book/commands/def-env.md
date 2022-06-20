---
title: def-env
version: 0.64.0
usage: |
  Define a custom command, which participates in the caller environment
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> def-env (def_name) (params) (block)```

## Parameters

 -  `def_name`: definition name
 -  `params`: parameters
 -  `block`: body of the definition

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nushell.html
```
## Examples

Set environment variable by call a custom command
```shell
> def-env foo [] { let-env BAR = "BAZ" }; foo; $env.BAR
```
