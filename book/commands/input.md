---
title: input
layout: command
version: 0.63.0
usage: |
  Get input from the user.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> input (prompt) --bytes-until --suppress-output```

## Parameters

 -  `prompt`: prompt to show the user
 -  `--bytes-until {string}`: read bytes (not text) until a stop byte
 -  `--suppress-output`: don't print keystroke values

## Examples

Get input from the user, and assign to a variable
```shell
> let user-input = (input)
```
