---
title: let-env
categories: |
  env
version: 0.81.0
env: |
  Create an environment variable and give it a value.
usage: |
  Create an environment variable and give it a value.
---

# <code>{{ $frontmatter.title }}</code> for env

<div class='command-title'>{{ $frontmatter.env }}</div>

## Signature

```> let-env (var_name) (initial_value)```

## Parameters

 -  `var_name`: variable name
 -  `initial_value`: equals sign followed by value

## Examples

Create an environment variable and display it
```shell
> let-env MY_ENV_VAR = 1; $env.MY_ENV_VAR
1
```
