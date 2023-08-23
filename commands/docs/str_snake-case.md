---
title: str snake-case
categories: |
  strings
version: 0.84.0
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


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| list\<string\> | list\<string\> |
| record       | record       |
| string       | string       |
| table        | table        |
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


**Tips:** Command `str snake-case` was not included in the official binaries by default, you have to build it with `--features=extra` flag