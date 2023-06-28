---
title: def
categories: |
  core
version: 0.82.1
core: |
  Define a custom command.
usage: |
  Define a custom command.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> def (def_name) (params) (body)```

## Parameters

 -  `def_name`: definition name
 -  `params`: parameters
 -  `body`: body of the definition

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Define a command and run it
```shell
> def say-hi [] { echo 'hi' }; say-hi
hi
```

Define a command and run it with parameter(s)
```shell
> def say-sth [sth: string] { echo $sth }; say-sth hi
hi
```
