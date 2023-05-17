---
title: str pascal-case
categories: |
  strings
version: 0.80.0
strings: |
  Convert a string to PascalCase.
usage: |
  Convert a string to PascalCase.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str pascal-case ...rest```

## Parameters

 -  `...rest`: For a data structure input, convert strings at the given cell paths

## Examples

convert a string to PascalCase
```shell
> 'nu-shell' | str pascal-case
NuShell
```

convert a string to PascalCase
```shell
> 'this-is-the-first-case' | str pascal-case
ThisIsTheFirstCase
```

convert a string to PascalCase
```shell
> 'this_is_the_second_case' | str pascal-case
ThisIsTheSecondCase
```

convert a column from a table to PascalCase
```shell
> [[lang, gems]; [nu_test, 100]] | str pascal-case lang
╭───┬────────┬──────╮
│ # │  lang  │ gems │
├───┼────────┼──────┤
│ 0 │ NuTest │  100 │
╰───┴────────┴──────╯

```
