---
title: n
categories: |
  shells
version: 0.92.0
shells: |
  Switch to the next shell.
usage: |
  Switch to the next shell.
---

# `n` for [shells](/commands/categories/shells.md)

<div class='command-title'>Switch to the next shell.</div>

## Signature

```> n ```

## Examples

Make two directories and enter new shells for them, use `n` to jump to the next shell
```nu
> mkdir foo bar; enter foo; enter ../bar; n

```

Run `n` several times and note the changes of current directory
```nu
> n

```
