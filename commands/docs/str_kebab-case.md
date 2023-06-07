---
title: str kebab-case
categories: |
  strings
version: 0.81.0
strings: |
  Convert a string to kebab-case.
usage: |
  Convert a string to kebab-case.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str kebab-case ...rest```

## Parameters

 -  `...rest`: For a data structure input, convert strings at the given cell paths

## Examples

convert a string to kebab-case
```shell
> 'NuShell' | str kebab-case
nu-shell
```

convert a string to kebab-case
```shell
> 'thisIsTheFirstCase' | str kebab-case
this-is-the-first-case
```

convert a string to kebab-case
```shell
> 'THIS_IS_THE_SECOND_CASE' | str kebab-case
this-is-the-second-case
```

convert a column from a table to kebab-case
```shell
> [[lang, gems]; [nuTest, 100]] | str kebab-case lang
╭───┬─────────┬──────╮
│ # │  lang   │ gems │
├───┼─────────┼──────┤
│ 0 │ nu-test │  100 │
╰───┴─────────┴──────╯

```
