---
title: export-env
categories: |
  env
version: 0.70.0
env: |
  Run a block and preserve its environment in a current scope.
usage: |
  Run a block and preserve its environment in a current scope.
---

# <code>{{ $frontmatter.title }}</code> for env

<div class='command-title'>{{ $frontmatter.env }}</div>

## Signature

```> export-env (block)```

## Parameters

 -  `block`: the block to run to set the environment

## Examples

Set an environment
```shell
> export-env { let-env SPAM = 'eggs' }; $env.SPAM
```
