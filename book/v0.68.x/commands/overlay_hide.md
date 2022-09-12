---
title: overlay hide
version: 0.68.0
usage: |
  Hide an active overlay
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> overlay hide (name) --keep-custom --keep-env```

## Parameters

 -  `name`: Overlay to hide
 -  `--keep-custom`: Keep all newly added symbols within the next activated overlay
 -  `--keep-env {list<string>}`: List of environment variables to keep from the hidden overlay

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
```
## Examples

Hide an overlay created from a module
```shell
> module spam { export def foo [] { "foo" } }
    overlay use spam
    overlay hide spam
```

Hide an overlay created from a file
```shell
> echo 'export alias f = "foo"' | save spam.nu
    overlay use spam.nu
    overlay hide spam
```

Hide the last activated overlay
```shell
> module spam { export env FOO { "foo" } }
    overlay use spam
    overlay hide
```

Keep the current working directory when removing an overlay
```shell
> overlay new spam
    cd some-dir
    overlay hide --keep-env [ PWD ] spam
```
