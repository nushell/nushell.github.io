---
title: hide-env
categories: |
  core
version: 0.81.0
core: |
  Hide environment variables in the current scope.
usage: |
  Hide environment variables in the current scope.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> hide-env ...rest --ignore-errors```

## Parameters

 -  `...rest`: environment variable names to hide
 -  `--ignore-errors` `(-i)`: do not throw an error if an environment variable was not found

## Examples

Hide an environment variable
```shell
> let-env HZ_ENV_ABC = 1; hide-env HZ_ENV_ABC; 'HZ_ENV_ABC' in (env).name
false
```
