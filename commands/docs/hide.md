---
title: hide
categories: |
  core
version: 0.78.0
core: |
  Hide definitions in the current scope.
usage: |
  Hide definitions in the current scope.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> hide (module) (members)```

## Parameters

 -  `module`: Module or module file
 -  `members`: Which members of the module to import

## Notes
Definitions are hidden by priority: First aliases, then custom commands.

This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Hide the alias just defined
```shell
> alias lll = ls -l; hide lll

```

Hide a custom command
```shell
> def say-hi [] { echo 'Hi!' }; hide say-hi

```
