---
title: exec
version: 0.67.1
usage: |
  Execute a command, replacing the current process.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
