---
title: inspect
categories: |
  debug
version: 0.84.0
debug: |
  Inspect pipeline results while running a pipeline.
usage: |
  Inspect pipeline results while running a pipeline.
---

# <code>{{ $frontmatter.title }}</code> for debug

<div class='command-title'>{{ $frontmatter.debug }}</div>

## Signature

```> inspect ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Inspect pipeline results
```shell
> ls | inspect | get name | inspect

```
