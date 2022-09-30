---
title: export-env
version: 0.69.1
usage: |
  Run a block and preserve its environment in a current scope.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> export-env (block)```

## Parameters

 -  `block`: the block to run to set the environment

## Examples

Set an environment
```shell
> export-env { let-env SPAM = 'eggs' }; $env.SPAM
```
