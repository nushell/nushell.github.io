---
title: p
categories: |
  shells
version: 0.95.0
shells: |
  Switch to the previous shell.
usage: |
  Switch to the previous shell.
---

# `p` for [shells](/commands/categories/shells.md)

<div class='command-title'>Switch to the previous shell.</div>

## Signature

```> p ```

## Examples

Make two directories and enter new shells for them, use `p` to jump to the previous shell
```nu
> mkdir foo bar; enter foo; enter ../bar; p

```

Run `p` several times and note the changes of current directory
```nu
> p

```
