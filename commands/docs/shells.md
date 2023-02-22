---
title: shells
categories: |
  shells
version: 0.76.0
shells: |
  Lists all open shells.
usage: |
  Lists all open shells.
---

# <code>{{ $frontmatter.title }}</code> for shells

<div class='command-title'>{{ $frontmatter.shells }}</div>

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
