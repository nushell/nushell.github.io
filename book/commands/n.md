---
title: n
layout: command
version: 0.63.0
usage: |
  Switch to the next shell.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> n ```

## Examples

Make two directories and enter new shells for them, use `n` to jump to the next shell
```shell
> mkdir foo bar; enter foo; enter ../bar; n
```

Run `n` several times and note the changes of current directory
```shell
> n
```
