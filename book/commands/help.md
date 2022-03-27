---
title: help
layout: command
version: 0.60.0
usage: |
  Display help information about commands.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> help ...rest --find`

## Parameters

- `...rest`: the name of command to get help on
- `--find {string}`: string to find in command usage

## Examples

show all commands and sub-commands

```shell
> help commands
```

generate documentation

```shell
> help generate_docs
```

show help for single command

```shell
> help match
```

show help for single sub-command

```shell
> help str lpad
```

search for string in command usage

```shell
> help --find char
```
