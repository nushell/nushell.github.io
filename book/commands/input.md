---
title: input
categories: |
  platform
version: 0.74.0
platform: |
  Get input from the user.
usage: |
  Get input from the user.
---

# <code>{{ $frontmatter.title }}</code> for platform

<div class='command-title'>{{ $frontmatter.platform }}</div>

## Signature

```> input (prompt) --bytes-until --suppress-output```

## Parameters

 -  `prompt`: prompt to show the user
 -  `--bytes-until {string}`: read bytes (not text) until a stop byte
 -  `--suppress-output`: don't print keystroke values

## Examples

Get input from the user, and assign to a variable
```shell
> let user_input = (input)
```
