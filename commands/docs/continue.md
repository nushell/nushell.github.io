---
title: continue
categories: |
  core
version: 0.84.0
core: |
  Continue a loop from the next iteration.
usage: |
  Continue a loop from the next iteration.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> continue ```


## Input/output types:

| input   | output  |
| ------- | ------- |
| nothing | nothing |

## Examples

Continue a loop from the next iteration
```shell
> for i in 1..10 { if $i == 5 { continue }; print $i }

```
