---
title: export extern
version: 0.68.0
usage: |
  Define an extern and export it from a module
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> export extern (def_name) (params)```

## Parameters

 -  `def_name`: definition name
 -  `params`: parameters

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
```
## Examples

Export the signature for an external command
```shell
> export extern echo [text: string]
```
