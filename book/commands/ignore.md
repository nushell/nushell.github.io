---
title: ignore
version: 0.69.1
core: |
  Ignore the output of the previous command in the pipeline
usage: |
  Ignore the output of the previous command in the pipeline
---

# <code>{{ $frontmatter.title }}</code> for core

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.core }}</div>

## Signature

```> ignore ```

## Examples

Ignore the output of an echo command
```shell
> echo done | ignore
```
