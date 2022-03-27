---
title: p
layout: command
version: 0.60.0
usage: |
  Switch to the previous shell.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> p `

## Examples

Make two directories and enter new shells for them, use `p` to jump to the previous shell

```shell
> mkdir foo bar; enter foo; enter ../bar; p
```

Run `p` several times and note the changes of current directory

```shell
> p
```
