---
title: history
categories: |
  misc
version: 0.84.0
misc: |
  Get the command history.
usage: |
  Get the command history.
---

# <code>{{ $frontmatter.title }}</code> for misc

<div class='command-title'>{{ $frontmatter.misc }}</div>

## Signature

```> history --clear --long```

## Parameters

 -  `--clear` `(-c)`: Clears out the history entries
 -  `--long` `(-l)`: Show long listing of entries for sqlite history


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | table  |

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


## Subcommands:

| name                                                   | type    | usage                            |
| ------------------------------------------------------ | ------- | -------------------------------- |
| [`history session`](/commands/docs/history_session.md) | Builtin | Get the command history session. |
