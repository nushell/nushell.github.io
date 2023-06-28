---
title: keybindings list
categories: |
  platform
version: 0.82.0
platform: |
  List available options that can be used to create keybindings.
usage: |
  List available options that can be used to create keybindings.
---

# <code>{{ $frontmatter.title }}</code> for platform

<div class='command-title'>{{ $frontmatter.platform }}</div>

## Signature

```> keybindings list --modifiers --keycodes --modes --events --edits```

## Parameters

 -  `--modifiers` `(-m)`: list of modifiers
 -  `--keycodes` `(-k)`: list of keycodes
 -  `--modes` `(-o)`: list of edit modes
 -  `--events` `(-e)`: list of reedline event
 -  `--edits` `(-d)`: list of edit commands

## Examples

Get list of key modifiers
```shell
> keybindings list -m

```

Get list of reedline events and edit commands
```shell
> keybindings list -e -d

```

Get list with all the available options
```shell
> keybindings list

```
