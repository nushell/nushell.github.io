---
title: du
version: 0.69.1
core: |
  Find disk usage sizes of specified items.
usage: |
  Find disk usage sizes of specified items.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> du (path) --all --deref --exclude --max-depth --min-size```

## Parameters

 -  `path`: starting directory
 -  `--all`: Output file sizes as well as directory sizes
 -  `--deref`: Dereference symlinks to their targets for size
 -  `--exclude {glob}`: Exclude these file names
 -  `--max-depth {int}`: Directory recursion limit
 -  `--min-size {int}`: Exclude files below this size

## Examples

Disk usage of the current directory
```shell
> du
```
