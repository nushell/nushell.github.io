---
title: seq char
categories: |
  generators
version: 0.78.0
generators: |
  Print a sequence of ASCII characters.
usage: |
  Print a sequence of ASCII characters.
---

# <code>{{ $frontmatter.title }}</code> for generators

<div class='command-title'>{{ $frontmatter.generators }}</div>

## Signature

```> seq char (start) (end)```

## Parameters

 -  `start`: start of character sequence (inclusive)
 -  `end`: end of character sequence (inclusive)

## Examples

sequence a to e
```shell
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
```shell
> seq char a e | str join '|'

```
