---
title: config reset
version: 0.69.1
env: |
  Reset nushell environment configurations to default, and saves old config files in the config location as oldconfig.nu and oldenv.nu
usage: |
  Reset nushell environment configurations to default, and saves old config files in the config location as oldconfig.nu and oldenv.nu
---

# <code>{{ $frontmatter.title }}</code> for env

<div class='command-title'>{{ $frontmatter.env }}</div>

## Signature

```> config reset --nu --env --without-backup```

## Parameters

 -  `--nu`: reset only nu config, config.nu
 -  `--env`: reset only env config, env.nu
 -  `--without-backup`: do not make a backup

## Examples

reset nushell configuration files
```shell
> config reset
```
