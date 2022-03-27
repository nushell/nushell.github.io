---
title: hide
layout: command
version: 0.60.0
usage: |
  Hide symbols in the current scope
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> hide (pattern)`

## Parameters

- `pattern`: import pattern

## Examples

Hide the alias just defined

```shell
> alias lll = ls -l; hide lll
```

Hide a custom command

```shell
> def say-hi [] { echo 'Hi!' }; hide say-hi
```

Hide an environment variable

```shell
> let-env HZ_ENV_ABC = 1; hide HZ_ENV_ABC; 'HZ_ENV_ABC' in (env).name
```
