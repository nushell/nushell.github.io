---
title: mkdir
categories: |
  filesystem
version: 0.82.0
filesystem: |
  Make directories, creates intermediary directories as required.
usage: |
  Make directories, creates intermediary directories as required.
---

# <code>{{ $frontmatter.title }}</code> for filesystem

<div class='command-title'>{{ $frontmatter.filesystem }}</div>

## Signature

```> mkdir ...rest --verbose```

## Parameters

 -  `...rest`: the name(s) of the path(s) to create
 -  `--verbose` `(-v)`: print created path(s).

## Examples

Make a directory named foo
```shell
> mkdir foo

```

Make multiple directories and show the paths created
```shell
> mkdir -v foo/bar foo2

```
