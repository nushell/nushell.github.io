---
title: ignore
categories: |
  core
version: 0.84.0
core: |
  Ignore the output of the previous command in the pipeline.
usage: |
  Ignore the output of the previous command in the pipeline.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> ignore ```


## Input/output types:

| input | output  |
| ----- | ------- |
| any   | nothing |

## Examples

Ignore the output of an echo command
```shell
> echo done | ignore

```
