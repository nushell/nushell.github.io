---
title: history
layout: command
version: 0.59.1
usage: |
  Get the command history
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> history --clear```

## Parameters

 -  `--clear`: Clears out the history entries

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
