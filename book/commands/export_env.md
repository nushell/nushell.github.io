---
title: export env
layout: command
version: 0.59.1
usage: |
  Export a block from a module that will be evaluated as an environment variable when imported.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> export env (name) (block)```

## Parameters

 -  `name`: name of the environment variable
 -  `block`: body of the environment variable definition

## Examples

Import and evaluate environment variable from a module
```shell
> module foo { export env FOO_ENV { "BAZ" } }; use foo FOO_ENV; $env.FOO_ENV
```
