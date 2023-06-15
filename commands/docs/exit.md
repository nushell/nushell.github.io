---
title: exit
categories: |
  core
version: 0.81.0
core: |
  Exit Nu.
usage: |
  Exit Nu.
---

# <code>{{ $frontmatter.title }}</code> for shells

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> exit (exit_code)```

## Parameters

 -  `exit_code`: Exit code to return immediately with

## Examples

Exit Nu
```shell
> exit

```

## Notes

This command used to leave a shell. This function has been taken over by [dexit](dexit.md).
