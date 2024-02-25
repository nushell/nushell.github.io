---
title: seq char
categories: |
  generators
version: 0.90.0
generators: |
  Print a sequence of ASCII characters.
usage: |
  Print a sequence of ASCII characters.
feature: default
---

<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# <code>{{ $frontmatter.title }}</code> for generators

<div class='command-title'>{{ $frontmatter.generators }}</div>

## Signature

`> seq char {flags} (start) (end)`

## Parameters

- `start`: Start of character sequence (inclusive).
- `end`: End of character sequence (inclusive).

## Input/output types:

| input   | output         |
| ------- | -------------- |
| nothing | list\<string\> |

## Examples

sequence a to e

```nu
> seq char a e
╭───┬───╮
│ 0 │ a │
│ 1 │ b │
│ 2 │ c │
│ 3 │ d │
│ 4 │ e │
╰───┴───╯

```

sequence a to e, and put the characters in a pipe-separated string

```nu
> seq char a e | str join '|'

```