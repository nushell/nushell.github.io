---
title: exec
version: 0.69.1
system: |
  Execute a command, replacing the current process.
usage: |
  Execute a command, replacing the current process.
---

# <code>{{ $frontmatter.title }}</code> for system

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.system }}</div>

## Signature

```> exec (command) ...rest```

## Parameters

 -  `command`: the command to execute
 -  `...rest`: any additional arguments for the command

## Notes
```text
Currently supported only on Unix-based systems.
```
## Examples

Execute external 'ps aux' tool
```shell
> exec ps aux
```

Execute 'nautilus'
```shell
> exec nautilus
```
