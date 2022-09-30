---
title: hide-env
version: 0.69.1
usage: |
  Hide environment variables in the current scope
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> hide-env ...name --ignore-errors```

## Parameters

 -  `...name`: environment variable names to hide
 -  `--ignore-errors`: do not throw an error if an environment variable was not found

## Examples

Hide an environment variable
```shell
> let-env HZ_ENV_ABC = 1; hide-env HZ_ENV_ABC; 'HZ_ENV_ABC' in (env).name
```
