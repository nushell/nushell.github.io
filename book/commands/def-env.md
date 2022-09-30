---
title: def-env
version: 0.69.1
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
  https://www.nushell.sh/book/thinking_in_nu.html

=== EXTRA NOTE ===
All blocks are scoped, including variable definition and environment variable changes.

Because of this, the following doesn't work:

def-env cd_with_fallback [arg = ""] {
    let fall_back_path = "/tmp"
    if $arg != "" {
        cd $arg
    } else {
        cd $fall_back_path
    }
}

Instead, you have to use cd in the top level scope:

def-env cd_with_fallback [arg = ""] {
    let fall_back_path = "/tmp"
    let path = if $arg != "" {
        $arg
    } else {
        $fall_back_path
    }
    cd $path
}
```
## Examples

Set environment variable by call a custom command
```shell
> def-env foo [] { let-env BAR = "BAZ" }; foo; $env.BAR
```
