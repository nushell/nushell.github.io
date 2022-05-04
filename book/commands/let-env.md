---
title: let-env
layout: command
version: 0.62.0
usage: |
  Create an environment variable and give it a value.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> let-env (var_name) (initial_value)```

## Parameters

 -  `var_name`: variable name
 -  `initial_value`: equals sign followed by value

## Examples

Create an environment variable and display it
```shell
> let-env MY_ENV_VAR = 1; $env.MY_ENV_VAR
```
