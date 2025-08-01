---
title: overlay hide
categories: |
  core
version: 0.106.0
core: |
  Hide an active overlay.
usage: |
  Hide an active overlay.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `overlay hide` for [core](/commands/categories/core.md)

<div class='command-title'>Hide an active overlay.</div>

## Signature

```> overlay hide {flags} (name)```

## Flags

 -  `--keep-custom, -k`: Keep all newly added commands and aliases in the next activated overlay.
 -  `--keep-env, -e {list<string>}`: List of environment variables to keep in the next activated overlay

## Parameters

 -  `name`: Overlay to hide.


## Input/output types:

| input   | output  |
| ------- | ------- |
| nothing | nothing |
## Examples

Keep a custom command after hiding the overlay
```nu
> module spam { export def foo [] { "foo" } }
    overlay use spam
    def bar [] { "bar" }
    overlay hide spam --keep-custom
    bar


```

Hide an overlay created from a file
```nu
> 'export alias f = "foo"' | save spam.nu
    overlay use spam.nu
    overlay hide spam

```

Hide the last activated overlay
```nu
> module spam { export-env { $env.FOO = "foo" } }
    overlay use spam
    overlay hide

```

Keep the current working directory when removing an overlay
```nu
> overlay new spam
    cd some-dir
    overlay hide --keep-env [ PWD ] spam

```

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html