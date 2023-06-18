---
title: input
categories: |
  platform
version: 0.81.0
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

## Examples

Get input from the user, and assign to a variable
```shell
> let user_input = (input)

```

Get two characters from the user, and assign to a variable
```shell
> let user_input = (input --numchar 2)

```
