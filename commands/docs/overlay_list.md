---
title: overlay list
categories: |
  core
version: 0.84.0
core: |
  List all active overlays.
usage: |
  List all active overlays.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> overlay list ```


## Input/output types:

| input   | output       |
| ------- | ------------ |
| nothing | list\<string\> |

## Examples

Get the last activated overlay
```shell
> module spam { export def foo [] { "foo" } }
    overlay use spam
    overlay list | last
spam
```

## Notes
The overlays are listed in the order they were activated.