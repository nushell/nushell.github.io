---
title: shells
categories: |
  shells
version: 0.94.0
shells: |
  Lists all open shells.
usage: |
  Lists all open shells.
---

# `shells` for [shells](/commands/categories/shells.md)

<div class='command-title'>Lists all open shells.</div>

## Signature

```> shells ```

## Examples

Enter a new shell at parent path '..' and show all opened shells
```nu
> enter ..; shells

```

Show currently active shell
```nu
> shells | where active == true

```
