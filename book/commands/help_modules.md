---
title: help modules
categories: |
  core
version: 0.75.0
core: |
  Show help on nushell modules.
usage: |
  Show help on nushell modules.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> help modules ...rest --find```

## Parameters

 -  `...rest`: the name of module to get help on
 -  `--find {string}`: string to find in module names and usage

## Notes
When requesting help for a single module, its commands and aliases will be highlighted if they
are also available in the current scope. Commands/aliases that were imported under a different name
(such as with a prefix after `use some-module`) will be highlighted in parentheses.
## Examples

show all modules
```shell
> help modules
```

show help for single module
```shell
> help modules my-module
```

search for string in module names and usages
```shell
> help modules --find my-module
```
