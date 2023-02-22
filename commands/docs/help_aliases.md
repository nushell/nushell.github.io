---
title: help aliases
categories: |
  core
version: 0.76.0
core: |
  Show help on nushell aliases.
usage: |
  Show help on nushell aliases.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> help aliases ...rest --find```

## Parameters

 -  `...rest`: the name of alias to get help on
 -  `--find {string}`: string to find in alias names and usage

## Examples

show all aliases
```shell
> help aliases
```

show help for single alias
```shell
> help aliases my-alias
```

search for string in alias names and usages
```shell
> help aliases --find my-alias
```
