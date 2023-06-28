---
title: export module
categories: |
  core
version: 0.82.0
core: |
  Export a custom module from a module.
usage: |
  Export a custom module from a module.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> export module (module) (block)```

## Parameters

 -  `module`: module name or module path
 -  `block`: body of the module if 'module' parameter is not a path

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Define a custom command in a submodule of a module and call it
```shell
> module spam {
        export module eggs {
            export def foo [] { "foo" }
        }
    }
    use spam eggs
    eggs foo
foo
```
