---
title: help externs
categories: |
  core
version: 0.77.0
core: |
  Show help on nushell externs.
usage: |
  Show help on nushell externs.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> help externs ...rest --find```

## Parameters

 -  `...rest`: the name of extern to get help on
 -  `--find {string}`: string to find in extern names and usage

## Examples

show all externs
```shell
> help externs

```

show help for single extern
```shell
> help externs smth

```

search for string in extern names and usages
```shell
> help externs --find smth

```
