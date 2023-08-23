---
title: register
categories: |
  core
version: 0.84.0
core: |
  Register a plugin.
usage: |
  Register a plugin.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> register (plugin) (signature) --shell```

## Parameters

 -  `plugin`: path of executable for plugin
 -  `signature`: Block with signature description as json object
 -  `--shell {path}`: path of shell used to run plugin (cmd, sh, python, etc)


## Input/output types:

| input   | output  |
| ------- | ------- |
| nothing | nothing |

## Examples

Register `nu_plugin_query` plugin from ~/.cargo/bin/ dir
```shell
> register ~/.cargo/bin/nu_plugin_query

```

Register `nu_plugin_query` plugin from `nu -c` (writes/updates $nu.plugin-path)
```shell
> let plugin = ((which nu).path.0 | path dirname | path join 'nu_plugin_query'); nu -c $'register ($plugin); version'

```

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html