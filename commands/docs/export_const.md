---
title: export const
categories: |
  core
version: 0.84.0
core: |
  Use parse-time constant from a module and export them from this module.
usage: |
  Use parse-time constant from a module and export them from this module.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> export const (const_name) (initial_value)```

## Parameters

 -  `const_name`: constant name
 -  `initial_value`: equals sign followed by constant value


## Input/output types:

| input   | output  |
| ------- | ------- |
| nothing | nothing |

## Examples

Re-export a command from another module
```shell
> module spam { export const foo = 3; }
    module eggs { export use spam foo }
    use eggs foo
    foo

3
```

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html