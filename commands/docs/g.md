---
title: g
categories: |
  shells
version: 0.95.0
shells: |
  Switch to a given shell, or list all shells if no given shell number.
usage: |
  Switch to a given shell, or list all shells if no given shell number.
---

# `g` for [shells](/commands/categories/shells.md)

<div class='command-title'>Switch to a given shell, or list all shells if no given shell number.</div>

## Signature

```> g (shell_number)```

## Parameters

 -  `shell_number`: shell number to change to

## Examples

Lists all open shells
```nu
> g

```

Make two directories and enter new shells for them, use `g` to jump to the specific shell
```nu
> mkdir foo bar; enter foo; enter ../bar; g 1

```

Use `shells` to show all the opened shells and run `g 2` to jump to the third one
```nu
> shells; g 2

```

Make two directories and enter new shells for them, use `g -` to jump to the last used shell
```nu
> mkdir foo bar; enter foo; enter ../bar; g -

```
