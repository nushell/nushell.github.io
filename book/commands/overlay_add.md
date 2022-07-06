---
title: overlay add
version: 0.65.1
usage: |
  Add definitions from a module as an overlay
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> overlay add (name)```

## Parameters

 -  `name`: Module name to create overlay for

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nushell.html
```
## Examples

Create an overlay from a module
```shell
> module spam { export def foo [] { "foo" } }
    overlay add spam
```

Create an overlay from a file
```shell
> echo 'export env FOO { "foo" }' | save spam.nu
    overlay add spam.nu
```
