---
title: source-env
version: 0.69.1
core: |
  Source the environment from a source file into the current environment.
usage: |
  Source the environment from a source file into the current environment.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> source-env (filename)```

## Parameters

 -  `filename`: the filepath to the script file to source the environment from

## Examples

Sources the environment from foo.nu in the current context
```shell
> source-env foo.nu
```
