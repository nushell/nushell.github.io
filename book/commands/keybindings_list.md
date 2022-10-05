---
title: keybindings list
version: 0.69.1
platform: |
  List available options that can be used to create keybindings
usage: |
  List available options that can be used to create keybindings
---

# <code>{{ $frontmatter.title }}</code> for platform

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.platform }}</div>

## Signature

```> keybindings list --modifiers --keycodes --modes --events --edits```

## Parameters

 -  `--modifiers`: list of modifiers
 -  `--keycodes`: list of keycodes
 -  `--modes`: list of edit modes
 -  `--events`: list of reedline event
 -  `--edits`: list of edit commands

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
