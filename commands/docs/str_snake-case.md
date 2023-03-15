---
title: str snake-case
categories: |
  strings
version: 0.77.0
strings: |
  Convert a string to snake_case.
usage: |
  Convert a string to snake_case.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str snake-case ...rest```

## Parameters

 -  `...rest`: For a data structure input, convert strings at the given cell paths

## Examples

convert a string to snake_case
```shell
>  "NuShell" | str snake-case
nu_shell
```

convert a string to snake_case
```shell
>  "this_is_the_second_case" | str snake-case
this_is_the_second_case
```

convert a string to snake_case
```shell
> "this-is-the-first-case" | str snake-case
this_is_the_first_case
```

convert a column from a table to snake_case
```shell
> [[lang, gems]; [nuTest, 100]] | str snake-case lang
╭───┬─────────┬──────╮
│ # │  lang   │ gems │
├───┼─────────┼──────┤
│ 0 │ nu_test │  100 │
╰───┴─────────┴──────╯

```
