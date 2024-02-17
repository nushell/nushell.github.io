---
title: p
categories: |
  shells
version: 0.79.0
shells: |
  Switch to the previous shell.
usage: |
  Switch to the previous shell.
---

# <code>{{ $frontmatter.title }}</code> for shells

<div class='command-title'>{{ $frontmatter.shells }}</div>

## Signature

`> p `

## Examples

Make two directories and enter new shells for them, use `p` to jump to the previous shell

```nushell
> mkdir foo bar; enter foo; enter ../bar; p

```

Run `p` several times and note the changes of current directory

```nushell
> p

```
