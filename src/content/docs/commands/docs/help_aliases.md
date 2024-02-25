---
title: help aliases
categories: |
  core
version: 0.90.0
core: |
  Show help on nushell aliases.
usage: |
  Show help on nushell aliases.
feature: default
---

<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

`> help aliases {flags} ...rest`

## Flags

- `--find, -f {string}`: string to find in alias names and usage

## Parameters

- `...rest`: The name of alias to get help on.

## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | table  |

## Examples

show all aliases

```nu
> help aliases

```

show help for single alias

```nu
> help aliases my-alias

```

search for string in alias names and usages

```nu
> help aliases --find my-alias

```