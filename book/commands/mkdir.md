---
title: mkdir
version: 0.69.1
filesystem: |
  Make directories, creates intermediary directories as required.
usage: |
  Make directories, creates intermediary directories as required.
---

# <code>{{ $frontmatter.title }}</code> for filesystem

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.filesystem }}</div>

## Signature

```> mkdir ...rest --show-created-paths```

## Parameters

 -  `...rest`: the name(s) of the path(s) to create
 -  `--show-created-paths`: show the path(s) created.

## Examples

Make a directory named foo
```shell
> mkdir foo
```

Make multiple directories and show the paths created
```shell
> mkdir -s foo/bar foo2
```
