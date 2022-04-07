---
title: env
layout: command
version: 0.60.1
usage: |
  Display current environment variables
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> env ```

## Examples

Display current path environment variable
```shell
> env | where name == PATH
```

Check whether the env variable `MY_ENV_ABC` exists
```shell
> env | any? name == MY_ENV_ABC
```

Another way to check whether the env variable `PATH` exists
```shell
> 'PATH' in (env).name
```
