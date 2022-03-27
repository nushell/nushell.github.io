---
title: mkdir
layout: command
version: 0.60.0
usage: |
  Make directories, creates intermediary directories as required.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> mkdir ...rest --show-created-paths`

## Parameters

- `...rest`: the name(s) of the path(s) to create
- `--show-created-paths`: show the path(s) created.

## Examples

Make a directory named foo

```shell
> mkdir foo
```

Make multiple directories and show the paths created

```shell
> mkdir -s foo/bar foo2
```
