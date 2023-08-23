---
title: input
categories: |
  platform
version: 0.84.0
platform: |
  Get input from the user.
usage: |
  Get input from the user.
---

# <code>{{ $frontmatter.title }}</code> for platform

<div class='command-title'>{{ $frontmatter.platform }}</div>

## Signature

```> input (prompt) --bytes-until --numchar --suppress-output```

## Parameters

 -  `prompt`: prompt to show the user
 -  `--bytes-until {string}`: read bytes (not text) until a stop byte
 -  `--numchar {int}`: number of characters to read; suppresses output
 -  `--suppress-output` `(-s)`: don't print keystroke values


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | string |

## Examples

Get input from the user, and assign to a variable
```shell
> let user_input = (input)

```

Get two characters from the user, and assign to a variable
```shell
> let user_input = (input --numchar 2)

```


## Subcommands:

| name                                             | type    | usage                           |
| ------------------------------------------------ | ------- | ------------------------------- |
| [`input list`](/commands/docs/input_list.md)     | Builtin | Interactive list selection.     |
| [`input listen`](/commands/docs/input_listen.md) | Builtin | Listen for user interface event |