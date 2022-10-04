---
title: export-env
version: 0.69.1
env: |
  Run a block and preserve its environment in a current scope.
usage: |
  Run a block and preserve its environment in a current scope.
---

# <code>{{ $frontmatter.title }}</code> for env

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.env }}</div>

## Signature

```> export-env (block)```

## Parameters

 -  `block`: the block to run to set the environment

## Examples

Set an environment
```shell
> export-env { let-env SPAM = 'eggs' }; $env.SPAM
```
