---
title: keybindings
categories: |
  platform
version: 0.84.0
platform: |
  Keybindings related commands.
usage: |
  Keybindings related commands.
---

# <code>{{ $frontmatter.title }}</code> for platform

<div class='command-title'>{{ $frontmatter.platform }}</div>

## Signature

```> keybindings ```


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | string |

## Notes
You must use one of the following subcommands. Using this command as-is will only produce this help message.

## Subcommands:

| name                                                           | type    | usage                                                          |
| -------------------------------------------------------------- | ------- | -------------------------------------------------------------- |
| [`keybindings default`](/commands/docs/keybindings_default.md) | Builtin | List default keybindings.                                      |
| [`keybindings list`](/commands/docs/keybindings_list.md)       | Builtin | List available options that can be used to create keybindings. |
| [`keybindings listen`](/commands/docs/keybindings_listen.md)   | Builtin | Get input from the user.                                       |