---
title: overlay use
categories: |
  core
version: 0.79.0
core: |
  Use definitions from a module as an overlay.
usage: |
  Use definitions from a module as an overlay.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> overlay use (name) (as) --prefix --reload```

## Parameters

 -  `name`: Module name to use overlay for
 -  `as`: as keyword followed by a new name
 -  `--prefix` `(-p)`: Prepend module name to the imported commands and aliases
 -  `--reload` `(-r)`: If the overlay already exists, reload its definitions and environment.

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Create an overlay from a module
```shell
> module spam { export def foo [] { "foo" } }
    overlay use spam
    foo

```

Create an overlay from a module and rename it
```shell
> module spam { export def foo [] { "foo" } }
    overlay use spam as spam_new
    foo

```

Create an overlay with a prefix
```shell
> 'export def foo { "foo" }'
    overlay use --prefix spam
    spam foo

```

Create an overlay from a file
```shell
> 'export-env { let-env FOO = "foo" }' | save spam.nu
    overlay use spam.nu
    $env.FOO

```
