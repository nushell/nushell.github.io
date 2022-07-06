---
title: overlay remove
version: 0.65.1
usage: |
  Remove an active overlay
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> overlay remove (name) --keep-custom```

## Parameters

 -  `name`: Overlay to remove
 -  `--keep-custom`: Keep newly added symbols within the next activated overlay

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nushell.html
```
## Examples

Remove an overlay created from a module
```shell
> module spam { export def foo [] { "foo" } }
    overlay add spam
    overlay remove spam
```

Remove an overlay created from a file
```shell
> echo 'export alias f = "foo"' | save spam.nu
    overlay add spam.nu
    overlay remove spam
```

Remove the last activated overlay
```shell
> module spam { export env FOO { "foo" } }
    overlay add spam
    overlay remove
```
