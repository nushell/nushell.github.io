---
title: history
categories: |
  misc
version: 0.76.0
misc: |
  Get the command history
usage: |
  Get the command history
---

# <code>{{ $frontmatter.title }}</code> for misc

<div class='command-title'>{{ $frontmatter.misc }}</div>

## Signature

```> history --clear --long```

## Parameters

 -  `--clear`: Clears out the history entries
 -  `--long`: Show long listing of entries for sqlite history

## Examples

Get current history length
```shell
> history | length
```

Show last 5 commands you have ran
```shell
> history | last 5
```

Search all the commands from history that contains 'cargo'
```shell
> history | wrap cmd | where cmd =~ cargo
```
