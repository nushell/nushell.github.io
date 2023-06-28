---
title: str screaming-snake-case
categories: |
  strings
version: 0.82.0
strings: |
  Convert a string to SCREAMING_SNAKE_CASE.
usage: |
  Convert a string to SCREAMING_SNAKE_CASE.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str screaming-snake-case ...rest```

## Parameters

 -  `...rest`: For a data structure input, convert strings at the given cell paths

## Examples

convert a string to SCREAMING_SNAKE_CASE
```shell
>  "NuShell" | str screaming-snake-case
NU_SHELL
```

convert a string to SCREAMING_SNAKE_CASE
```shell
>  "this_is_the_second_case" | str screaming-snake-case
THIS_IS_THE_SECOND_CASE
```

convert a string to SCREAMING_SNAKE_CASE
```shell
> "this-is-the-first-case" | str screaming-snake-case
THIS_IS_THE_FIRST_CASE
```

convert a column from a table to SCREAMING_SNAKE_CASE
```shell
> [[lang, gems]; [nu_test, 100]] | str screaming-snake-case lang
╭───┬─────────┬──────╮
│ # │  lang   │ gems │
├───┼─────────┼──────┤
│ 0 │ NU_TEST │  100 │
╰───┴─────────┴──────╯

```
