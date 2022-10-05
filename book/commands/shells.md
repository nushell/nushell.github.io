---
title: shells
version: 0.69.1
shells: |
  Lists all open shells.
usage: |
  Lists all open shells.
---

# <code>{{ $frontmatter.title }}</code> for shells

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.shells }}</div>

## Signature

```> shells ```

## Examples

Enter a new shell at parent path '..' and show all opened shells
```shell
> enter ..; shells
```

Show currently active shell
```shell
> shells | where active == true
```
