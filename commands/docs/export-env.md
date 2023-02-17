---
title: export-env
categories: |
  env
version: 0.75.0
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

Set an environment variable
```shell
> export-env { let-env SPAM = 'eggs' }
```

Set an environment variable and examine its value
```shell
> export-env { let-env SPAM = 'eggs' }; $env.SPAM
```
