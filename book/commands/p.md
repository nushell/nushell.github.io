---
title: p
version: 0.69.1
shells: |
  Switch to the previous shell.
usage: |
  Switch to the previous shell.
---

# <code>{{ $frontmatter.title }}</code> for shells

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.shells }}</div>

## Signature

```> p ```

## Examples

Make two directories and enter new shells for them, use `p` to jump to the previous shell
```shell
> mkdir foo bar; enter foo; enter ../bar; p
```

Run `p` several times and note the changes of current directory
```shell
> p
```
