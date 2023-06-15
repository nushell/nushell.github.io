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

```> p (N)```

## Parameters

 -  `N`: the number of shells to jump backward

## Examples

Make two directories and enter new shells for them, use `p` to jump to the previous shell
```shell
> mkdir foo bar; enter foo; enter ../bar; p

```

Run `p` several times and note the changes of current directory
```shell
> p

```

Jump 2 shells backward
```shell
> p 2

```
