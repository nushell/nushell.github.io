---
title: n
version: 0.69.1
shells: |
  Switch to the next shell.
usage: |
  Switch to the next shell.
---

# <code>{{ $frontmatter.title }}</code> for shells

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.shells }}</div>

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
