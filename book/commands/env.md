---
title: env
version: 0.70.0
env: |
  Display current environment variables
usage: |
  Display current environment variables
---

# <code>{{ $frontmatter.title }}</code> for env

<div class='command-title'>{{ $frontmatter.env }}</div>

## Signature

```> env ```

## Examples

Display current path environment variable
```shell
> env | where name == PATH
```

Check whether the env variable `MY_ENV_ABC` exists
```shell
> env | any name == MY_ENV_ABC
```

Another way to check whether the env variable `PATH` exists
```shell
> 'PATH' in (env).name
```
