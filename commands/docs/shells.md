---
title: shells
categories: |
  shells
version: 0.79.0
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
```nu
> enter ..; shells

```

Show currently active shell
```nu
> shells | where active == true

```
