---
title: register
version: 0.68.0
usage: |
  Register a plugin
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> register (plugin) (signature) --encoding --shell```

## Parameters

 -  `plugin`: path of executable for plugin
 -  `signature`: Block with signature description as json object
 -  `--encoding {string}`: Encoding used to communicate with plugin. Options: [json, msgpack]
 -  `--shell {path}`: path of shell used to run plugin (cmd, sh, python, etc)

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
```
## Examples

Register `nu_plugin_query` plugin from ~/.cargo/bin/ dir
```shell
> register -e json ~/.cargo/bin/nu_plugin_query
```

Register `nu_plugin_query` plugin from `nu -c`(plugin will be available in that nu session only)
```shell
> let plugin = ((which nu).path.0 | path dirname | path join 'nu_plugin_query'); nu -c $'register -e json ($plugin); version'
```
