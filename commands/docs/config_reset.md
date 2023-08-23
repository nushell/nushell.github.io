---
title: config reset
categories: |
  env
version: 0.84.0
env: |
  Reset nushell environment configurations to default, and saves old config files in the config location as oldconfig.nu and oldenv.nu.
usage: |
  Reset nushell environment configurations to default, and saves old config files in the config location as oldconfig.nu and oldenv.nu.
---

# <code>{{ $frontmatter.title }}</code> for env

<div class='command-title'>{{ $frontmatter.env }}</div>

## Signature

```> config reset --nu --env --without-backup```

## Parameters

 -  `--nu` `(-n)`: reset only nu config, config.nu
 -  `--env` `(-e)`: reset only env config, env.nu
 -  `--without-backup` `(-w)`: do not make a backup


## Input/output types:

| input   | output  |
| ------- | ------- |
| nothing | nothing |

## Examples

reset nushell configuration files
```shell
> config reset

```
