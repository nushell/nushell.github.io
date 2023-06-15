---
title: enter
categories: |
  shells
version: 0.79.0
shells: |
  Enters a new shell at the given path.
usage: |
  Enters a new shell at the given path.
---

# <code>{{ $frontmatter.title }}</code> for shells

<div class='command-title'>{{ $frontmatter.shells }}</div>

## Signature

```> enter (path)...```

## Parameters

 -  `path`: the path to enter as a new shell
 -  `...rest`: other paths to add as new shells after this one, but not enter

## Examples

Enter a new shell at path '../dir-foo'
```shell
> enter ../dir-foo

```

## Notes

To leave this shell again, use [dexit](dexit.md).
