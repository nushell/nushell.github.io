---
title: config reset
version: 0.67.1
usage: |
  Reset nushell environment configurations to default, and saves old config files in the config location as oldconfig.nu and oldenv.nu
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
