---
title: shells
version: 0.66.1
usage: |
  Lists all open shells.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
