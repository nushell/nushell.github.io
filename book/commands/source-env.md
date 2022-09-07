---
title: source-env
version: 0.68.0
usage: |
  Source the environment from a source file into the current environment.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> source-env (filename)```

## Parameters

 -  `filename`: the filepath to the script file to source the environment from

## Examples

Sources the environment from foo.nu in the current context
```shell
> source-env foo.nu
```
