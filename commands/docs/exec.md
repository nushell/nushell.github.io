---
title: exec
categories: |
  system
version: 0.79.0
system: |
  Execute a command, replacing the current process.
usage: |
  Execute a command, replacing the current process.
---

# <code>{{ $frontmatter.title }}</code> for system

<div class='command-title'>{{ $frontmatter.system }}</div>

## Signature

```> exec (command)```

## Parameters

 -  `command`: the command to execute

## Notes
Currently supported only on Unix-based systems.
## Examples

Execute external 'ps aux' tool
```shell
> exec ps aux

```

Execute 'nautilus'
```shell
> exec nautilus

```
