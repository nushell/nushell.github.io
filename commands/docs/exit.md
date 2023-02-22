---
title: exit
categories: |
  shells
version: 0.76.0
shells: |
  Exit a Nu shell or exit Nu entirely.
usage: |
  Exit a Nu shell or exit Nu entirely.
---

# <code>{{ $frontmatter.title }}</code> for shells

<div class='command-title'>{{ $frontmatter.shells }}</div>

## Signature

```> exit (exit_code) --now```

## Parameters

 -  `exit_code`: Exit code to return immediately with
 -  `--now`: Exit out of all shells immediately (exiting Nu)

## Examples

Exit the current shell
```shell
> exit
```

Exit all shells (exiting Nu)
```shell
> exit --now
```
