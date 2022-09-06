---
title: overlay use
version: 0.67.1
usage: |
  Use definitions from a module as an overlay
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> overlay use (name) (as) --prefix```

## Parameters

 -  `name`: Module name to use overlay for
 -  `as`: as keyword followed by a new name
 -  `--prefix`: Prepend module name to the imported commands and aliases

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
```
## Examples

Create an overlay from a module
```shell
> module spam { export def foo [] { "foo" } }
    overlay use spam
    foo
```

Create an overlay with a prefix
```shell
> echo 'export def foo { "foo" }'
    overlay use --prefix spam
    spam foo
```

Create an overlay from a file
```shell
> echo 'export env FOO { "foo" }' | save spam.nu
    overlay use spam.nu
    $env.FOO
```
